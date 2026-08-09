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
