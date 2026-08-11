import assert from "node:assert/strict";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker;
}

async function render(pathname) {
  const worker = await loadWorker();

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

const routeExpectations = [
  ["/", "Precisão para construir"],
  ["/pt/empresa", "Escala próxima. Gestão rigorosa."],
  ["/pt/servicos", "Da primeira leitura à última verificação."],
  ["/pt/projetos", "Espaços construídos a partir do que importa."],
  ["/pt/projetos/vila-1936", "Vila 1936"],
  ["/pt/contato", "Planejar minha obra"],
  ["/es/proyectos", "Espacios construidos a partir de lo que importa."],
  ["/en/projects", "Spaces built around what matters."],
  ["/en/contact", "Plan my project"],
];

for (const [pathname, marker] of routeExpectations) {
  test(`renders ${pathname}`, async () => {
    const response = await render(pathname);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.match(html, new RegExp(marker, "i"));
    assert.doesNotMatch(html, /internal server error/i);
  });
}

test("o título da aba traz o nome da empresa, não o slogan", async () => {
  /* A aba tem espaço para poucos caracteres. Enquanto a home devolvia o
     slogan como título, o `template` compunha "Precisão para construir |
     Nívora Construções" e o nome da empresa saía do campo visível.

     São dois caminhos diferentes e é fácil corrigir só um: `/` é servido por
     `app/page.tsx`, que usa o `title.default` do layout; `/pt`, `/es` e `/en`
     passam pelo `generateMetadata` da rota de idioma. Aconteceu de arrumar o
     primeiro e o segundo continuar errado, e é por isso que este teste cobre
     os quatro. */
  const recortarTitulo = (html) => {
    const head = html.slice(0, html.indexOf("</head>"));
    const achados = [...head.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].map((m) => m[1]);
    assert.equal(achados.length, 1, `esperava uma <title> na head, achei ${achados.length}`);
    return achados[0];
  };

  for (const rota of ["/", "/pt", "/es", "/en"]) {
    const html = await (await render(rota)).text();
    assert.equal(recortarTitulo(html), "Nívora Construções", `título errado em ${rota}`);
  }

  /* As internas continuam compondo: é onde o template serve, porque diz
     onde se está sem perder de quem é o site. */
  const interna = await (await render("/pt/empresa")).text();
  assert.equal(recortarTitulo(interna), "Empresa | Nívora Construções");
});

const localizedRoutes = {
  pt: ["", "empresa", "servicos", "projetos", "contato", "privacidade"],
  es: ["", "empresa", "servicios", "proyectos", "contacto", "privacidad"],
  en: ["", "company", "services", "projects", "contact", "privacy"],
};
const projectSlugs = [
  "casa-patio-alto",
  "residencia-horizonte",
  "casa-aurora",
  "arco-escritorios",
  "vila-1936",
  "atelie-nexo",
];
const projectSegments = { pt: "projetos", es: "proyectos", en: "projects" };

test("renders the complete localized route matrix", async () => {
  for (const [locale, routes] of Object.entries(localizedRoutes)) {
    for (const route of routes) {
      const response = await render(`/${locale}${route ? `/${route}` : ""}`);
      assert.equal(response.status, 200, `Expected /${locale}/${route} to render`);
    }
    for (const slug of projectSlugs) {
      const response = await render(`/${locale}/${projectSegments[locale]}/${slug}`);
      assert.equal(response.status, 200, `Expected ${locale} project ${slug} to render`);
    }
  }
});

test("returns 404 for an unknown localized route", async () => {
  const response = await render("/pt/rota-inexistente");
  assert.equal(response.status, 404);
});

const CABECALHOS_ESPERADOS = {
  "cross-origin-opener-policy": "same-origin",
  "permissions-policy": "camera=(), geolocation=(), microphone=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=86400",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

async function carregarWorker(marca) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${marca}`);
  const { default: worker } = await import(workerUrl.href);
  return (rota) =>
    worker.fetch(
      new Request(`http://localhost${rota}`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
}

test("toda resposta traz os cabeçalhos de segurança", async () => {
  const pedir = await carregarWorker("cab");
  /* Página normal nas três línguas, 404 e recurso que não é HTML. */
  for (const rota of ["/pt", "/es", "/en", "/pt/rota-inexistente", "/robots.txt"]) {
    const response = await pedir(rota);
    for (const [nome, valor] of Object.entries(CABECALHOS_ESPERADOS)) {
      assert.equal(response.headers.get(nome), valor, `${nome} em ${rota}`);
    }
  }
});

test("o robots.txt é o nosso, não o padrão da Cloudflare", async () => {
  const pedir = await carregarWorker("rob");
  const response = await pedir("/robots.txt");
  const txt = await response.text();

  assert.equal(response.status, 200);
  assert.match(txt, /User-Agent: \*/i);
  /* Varredura liberada de propósito: o buscador precisa baixar a página
     para ler o `noindex`. Um `Disallow: /` teria o efeito oposto. */
  assert.match(txt, /Allow: \//i);
  assert.doesNotMatch(txt, /Disallow: \//i);
  assert.doesNotMatch(txt, /content-signal|EUROPEAN UNION DIRECTIVE/i);
});

test("as três línguas pedem para não indexar", async () => {
  const pedir = await carregarWorker("rbt");
  for (const rota of ["/pt", "/es", "/en"]) {
    const head = (await (await pedir(rota)).text()).split("</head>")[0];
    const robots = [...head.matchAll(/<meta name="robots" content="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(robots, ["noindex, nofollow"], rota);
  }
});

test("cada rota declara um canonical absoluto e único", async () => {
  const pedir = await carregarWorker("can");
  /* Domínio próprio desde 2026-08-10. O endereço `workers.dev` continua
     respondendo, mas o canonical precisa apontar para um só lugar, e é este. */
  const SITE = "https://nivora.varandaestudioweb.com";

  const esperado = {
    /* A raiz serve a mesma home que /pt. O canonical aponta para /pt
       porque é a versão que tem par nas outras duas línguas. */
    "/": `${SITE}/pt`,
    "/pt": `${SITE}/pt`,
    "/es": `${SITE}/es`,
    "/en": `${SITE}/en`,
    "/pt/projetos": `${SITE}/pt/projetos`,
    "/es/proyectos": `${SITE}/es/proyectos`,
    "/en/projects": `${SITE}/en/projects`,
    "/pt/projetos/casa-patio-alto": `${SITE}/pt/projetos/casa-patio-alto`,
  };

  for (const [rota, url] of Object.entries(esperado)) {
    const head = (await (await pedir(rota)).text()).split("</head>")[0];
    const encontrados = [...head.matchAll(/rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
    /* Duas tags de canonical fazem o buscador ignorar as duas. */
    assert.equal(encontrados.length, 1, `${rota} tem ${encontrados.length} canonical`);
    assert.equal(encontrados[0], url, rota);
  }
});

test("o HTML servido não esconde nada: a trava do reveal só entra pelo JS", async () => {
  const pedir = await carregarWorker("rev");

  for (const rota of ["/", "/pt", "/es", "/en", "/pt/projetos", "/pt/projetos/casa-patio-alto"]) {
    const html = await (await pedir(rota)).text();

    /* `motion-ready` é o que faz o CSS zerar a opacidade dos `[data-reveal]`.
       Se viesse já no HTML, quem abrisse o site com o JavaScript bloqueado —
       ou antes de ele carregar — veria a página em branco. Antes desta
       rodada a classe era adicionada sem sequer checar se o
       `IntersectionObserver` existia. */
    assert.doesNotMatch(html, /class="[^"]*\bmotion-ready\b/, rota);
  }
});

test("HTTP puro não entrega página: redireciona para HTTPS", async () => {
  const wUrl = new URL("../dist/server/index.js", import.meta.url);
  wUrl.searchParams.set("test", `${process.pid}-${Date.now()}-tls`);
  const { default: w } = await import(wUrl.href);

  const pedir = (endereco, cabecalhos = {}) =>
    w.fetch(
      new Request(endereco, { headers: { accept: "text/html", ...cabecalhos } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );

  /* Visitante em texto aberto: 301 para o mesmo caminho em HTTPS. */
  const aberto = await pedir("http://nivora.test/pt?x=1");
  assert.equal(aberto.status, 301);
  assert.equal(aberto.headers.get("location"), "https://nivora.test/pt?x=1");

  /* A borda da Cloudflare entrega o esquema original no CF-Visitor. Ele
     manda mais que o endereço: numa borda que já terminou o TLS, a URL
     chega como https mesmo quando o visitante veio de http. */
  const viaBorda = await pedir("https://nivora.test/", { "CF-Visitor": '{"scheme":"http"}' });
  assert.equal(viaBorda.status, 301, "CF-Visitor http deve redirecionar mesmo com URL https");

  /* E o contrário: quem já está em HTTPS **não** pode ser redirecionado,
     senão o destino vira http de novo e o site entra em laço infinito. */
  const seguro = await pedir("https://nivora.test/", { "CF-Visitor": '{"scheme":"https"}' });
  assert.notEqual(seguro.status, 301, "requisição já segura não pode redirecionar");

  /* localhost fica de fora: é onde rodam o dev e estes testes. */
  const local = await pedir("http://localhost/pt");
  assert.notEqual(local.status, 301, "localhost não pode redirecionar");
});
