# 011 — Revelação por rolagem em CSS, sem JavaScript

- **Status**: **DESCARTADO em 2026-08-16.** Decisão do Lucca: fica no
  JavaScript. O motivo está registrado no fim deste arquivo. **Não executar.**
  O documento fica no repositório porque a análise vale para a próxima vez que
  o assunto voltar, aqui ou em outro cliente.
- **Commit**: 3de88bc
- **Severity**: HIGH (alcance), MEDIUM (risco)
- **Category**: Oportunidade / regra 9.20 do protocolo do estúdio
- **Estimated scope**: 3 arquivos alterados, 1 arquivo apagado, 1 teste reescrito
- **Depende de**: 001, e substitui o que o 002 fizer em `app/footer.css`

## A decisão que trava este plano

**Animação ligada à rolagem é esfregada, não disparada.** `animation-timeline:
view()` amarra o progresso da animação à posição do elemento na janela, nos
dois sentidos: rolando para cima, o elemento **desaparece de volta**. O código
atual revela uma vez e para de observar (`observer.unobserve` em
`components/Reveal.tsx:57`).

Isso contraria uma regra da própria referência de animação: revelação por
rolagem dispara uma vez, porque re-animar a cada passagem é uma interface
brigando com quem lê. **Hoje não existe, em CSS puro, jeito de fazer uma
animação de rolagem tocar só uma vez.**

Então são duas saídas, e a escolha é do Lucca:

- **A — aceitar a esfregação.** Faixa curta e adiantada (`entry 5%` a
  `entry 35%`), de modo que o bloco termina de aparecer quando ainda está na
  borda de baixo da tela. Rolando de volta, ele só desaparece se o leitor
  voltar até quase tirá-lo da tela. Ganha-se: o `Reveal.tsx` inteiro é
  apagado, a revelação para de depender de hidratação, e o modo de falha que
  aquele arquivo documenta em vinte linhas de comentário deixa de existir.
- **B — ficar no JavaScript.** O `Reveal.tsx` já é defensivo e já resolve o
  caso de página em branco com três proteções. Nesse caso este plano é
  descartado e o plano 002 basta.

**O resto deste documento assume a saída A.** Se a escolha for B, marcar o
status como DESCARTADO e não executar.

## Problem

A revelação hoje depende de JavaScript em três camadas: o componente precisa
hidratar, o `IntersectionObserver` precisa existir, e ele precisa responder.
As três podem falhar, e a terceira falhou de verdade em teste — está escrito
em `components/Reveal.tsx:17-23`, junto com a rede de segurança de 1 segundo
que foi preciso criar para ela.

```tsx
/* components/Reveal.tsx:47-49 — atual */
    const raiz = document.documentElement;
    raiz.classList.add(CLASSE_TRAVA);
```

```css
/* app/footer.css:58-64 — atual */
/* Reveal */
.motion-ready [data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.75s ease, transform 0.75s cubic-bezier(.22, 1, .36, 1);
}
.motion-ready [data-reveal].is-visible { opacity: 1; transform: none; }
```

Toda essa engenharia existe para um efeito decorativo. Em CSS ligado à
rolagem, o estado escondido só passa a existir dentro do `@supports`: onde o
navegador não entende a regra, o conteúdo simplesmente aparece, e não há como
ficar em branco.

## Target

```css
/* target — app/footer.css:58-64, substituindo o bloco inteiro */
/* Revelacao por rolagem, sem JavaScript.
   `animation-timeline: view()` amarra o progresso ao quanto o elemento
   entrou na janela. O estado escondido mora *dentro* do @supports de
   proposito: onde a regra nao for entendida, nada esconde nada e o
   conteudo aparece estatico, que e o comportamento certo. Era isso que o
   antigo components/Reveal.tsx precisava de tres protecoes para garantir.
   A faixa termina em `entry 35%`: o bloco fica inteiro antes de chegar ao
   meio da tela, entao rolar de volta so o desfaz na borda de baixo. */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    [data-reveal] {
      animation: revelar linear both;
      animation-timeline: view();
      animation-range: entry 5% entry 35%;
    }
  }
}

@keyframes revelar {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: none; }
}
```

A curva é `linear` de propósito: quem dá o ritmo é a rolagem do visitante, não
um relógio. Curva sobre rolagem esfregada dá sensação de arrasto preso.

```css
/* target — app/responsive.css:378, substituindo a linha */
  /* Sem @supports aqui: com movimento reduzido a revelacao nao existe em
     navegador nenhum. */
  [data-reveal] { opacity: 1; transform: none; animation: none; }
```

```tsx
/* target — components/Site.tsx: remover a importacao da linha 6 e o
   elemento <Reveal ... /> da linha 47, e ajustar o comentario de :35-36 que
   fala da classe motion-ready */
```

```js
/* target — tests/rendered-html.test.mjs:199-212, substituindo o teste */
test("a revelação por rolagem não depende de JavaScript", async () => {
  const pedir = await carregarWorker("rev");

  for (const rota of ["/", "/pt", "/es", "/en", "/pt/projetos", "/pt/projetos/casa-patio-alto"]) {
    const html = await (await pedir(rota)).text();

    /* A revelação passou a ser CSS ligado à rolagem, dentro de um @supports.
       Não existe mais classe de trava, e é isso que este teste protege: se
       `motion-ready` reaparecer, alguém trouxe de volta a versão que
       escondia o conteúdo antes de o JavaScript rodar. */
    assert.doesNotMatch(html, /class="[^"]*\bmotion-ready\b/, rota);
    assert.doesNotMatch(html, /is-visible/, rota);
  }
});
```

## Repo conventions to follow

- Tokens do plano 001. Note que a duração não é usada aqui: em animação
  ligada à rolagem quem define o tempo é a faixa (`animation-range`), não
  `animation-duration`.
- A regra da revelação continua em `app/footer.css`, sob `/* Reveal */`.
- Comentários em português, sem acento nos arquivos CSS, com acento nos
  `.tsx` e `.mjs`. Exemplar de comentário que registra decisão e modo de
  falha: `components/Reveal.tsx:5-24` — o arquivo que este plano apaga. Vale
  reler antes de apagar e levar o essencial para o comentário do CSS.

## Steps

1. **Antes de tudo**: conferir no caniuse.com o suporte atual de
   `animation-timeline: view()` e anotar no relatório qual a cobertura no dia
   da execução. O `@supports` protege quem não tem, mas o número decide se o
   efeito chega à maioria ou à minoria.
2. `app/footer.css:58-64`: substituir o bloco pelo alvo, incluindo o
   `@keyframes revelar`.
3. `app/responsive.css:378`: substituir a linha pela do alvo.
4. `components/Site.tsx`: remover `import Reveal from "./Reveal";` (linha 6) e
   o `<Reveal chave={...} />` (linha 47). Reescrever o comentário de :35-36,
   que descreve a mecânica antiga, para registrar que a revelação virou CSS.
5. Apagar `components/Reveal.tsx`.
6. `tests/rendered-html.test.mjs:199-212`: substituir o teste pelo do alvo.
7. `grep -rn "motion-ready\|is-visible" app/ components/ tests/` deve voltar
   vazio.

## Boundaries

- NÃO apagar o atributo `data-reveal` de nenhum componente. Ele continua sendo
  o gancho, e é o que o plano 010 usa para escalonar.
- NÃO remover o teste inteiro. Ele muda de premissa, não de propósito.
- NÃO aplicar `animation-timeline` fora do `@supports`. É o `@supports` que
  garante que ninguém veja página em branco.
- NÃO adicionar dependência nem biblioteca de animação.
- Se o plano 010 já tiver rodado, os `transition-delay` dele param de ter
  efeito, porque a revelação deixa de ser `transition`. PARAR e relatar: o
  escalonamento precisa ser reescrito como `animation-range` deslocado por
  item, e isso não está especificado aqui.
- Se um trecho não bater com o código encontrado, PARAR e relatar.

## Verification

- **Mecânica**: `npm run lint` e `npm run test` passando, com o teste novo.
- **Prova principal, e é ela que justifica o plano**: `npm run dev`, abrir o
  DevTools, `Settings > Debugger > Disable JavaScript`, recarregar a home.
  **Todo o conteúdo tem que estar visível e legível.** Com o código antigo,
  este teste dependia das três proteções do `Reveal.tsx` funcionarem; agora
  não há nada para falhar.
- **Conferência de sensação**: reativar o JavaScript e:
  - rolar devagar pela home. Os blocos aparecem conforme sobem, e chegam
    inteiros antes de alcançar o meio da tela;
  - **rolar de volta para cima devagar** e observar. Este é o custo da saída
    A: os blocos vão se desfazer na borda de baixo. Julgar se incomoda. Se
    incomodar, o plano volta para a decisão, não para um ajuste de valor;
  - rolar rápido de cima a baixo e confirmar que nada fica preso invisível;
  - em 375px, repetir a rolagem lenta;
  - ligar `prefers-reduced-motion` no painel Rendering e confirmar que tudo
    aparece de uma vez;
  - abrir num navegador sem suporte a `animation-timeline`, se houver um à
    mão, e confirmar que o conteúdo aparece estático. Se não houver, comentar
    a linha `animation-timeline: view();` para simular e conferir.
- **Done when**: a página está inteira legível com JavaScript desligado,
  `components/Reveal.tsx` não existe mais, o `grep` de `motion-ready` volta
  vazio, e o relatório traz o número de cobertura do caniuse e o julgamento
  sobre a esfregação ao rolar de volta.

---

## Decisão tomada — 2026-08-16

**Fica no JavaScript. Este plano não será executado.**

O que pesou: o problema que a troca resolve — página em branco se o JavaScript
falhar — **já está resolvido**. O `components/Reveal.tsx` tem três proteções, e
a terceira nasceu de uma falha observada em teste, não de hipótese. Já o custo
da troca apareceria para todo visitante que rolasse de volta para reler um
trecho, o que num site de quatro seções é rotina.

Trocar um caso extremo já contido por um comportamento visível todo dia é mau
negócio. E vai contra a régua do próprio `animate`: revelação por rolagem
dispara uma vez, porque re-animar a cada passagem é a interface brigando com
quem lê.

O defeito real da revelação da Nívora não era o mecanismo, era a curva — e
isso o plano 002 resolve sozinho, em três linhas.

**Se o assunto voltar**, o que muda o cálculo é uma única coisa: CSS ganhar
como fazer animação de rolagem tocar uma vez só. Enquanto isso não existir, a
resposta continua sendo esta.
