# 010 — Escalonar a entrada dos grupos

- **Status**: TODO
- **Commit**: 3de88bc
- **Severity**: LOW
- **Category**: Coesão (oportunidade)
- **Estimated scope**: 1 arquivo, 1 bloco
- **Depende de**: 002 (a revelação precisa estar na curva certa antes)

## Problem

A revelação por rolagem é aplicada item a item. Nas duas listas da página da
empresa, os irmãos estão lado a lado e cruzam a dobra **no mesmo instante**,
então três ou quatro blocos aparecem juntos, num pisca só:

```tsx
/* components/page-company.tsx:32-39 — atual */
        <div className="company-story__chapters">
          {company.story.map((paragraph, index) => (
            <article key={paragraph} data-reveal>
```

```tsx
/* components/page-company.tsx:63-71 — atual */
        <div className="principles-axis__list">
          {company.principles.map(([title, text], index) => (
            <article key={title} data-reveal>
```

Trinta a oitenta milissegundos entre irmãos transformam "quatro coisas
piscando" em "uma coisa chegando". É a diferença entre parecer que a página
carregou e parecer que a página foi composta.

## Target

Atraso progressivo por posição, em CSS puro, sem tocar no JSX. Sessenta
milissegundos entre irmãos, teto no quarto item — passar disso faz o último
parecer atrasado em vez de escalonado.

```css
/* target — app/footer.css, logo abaixo da regra da revelação em :64 */
/* Escalonamento. Irmaos de uma lista cruzam a dobra no mesmo instante e
   apareceriam juntos; 60ms entre eles transformam quatro coisas piscando em
   uma coisa chegando. O teto no quarto item e proposital: mais que isso o
   ultimo parece atrasado, nao escalonado. */
.company-story__chapters > [data-reveal]:nth-child(2),
.principles-axis__list > [data-reveal]:nth-child(2) { transition-delay: 60ms; }
.company-story__chapters > [data-reveal]:nth-child(3),
.principles-axis__list > [data-reveal]:nth-child(3) { transition-delay: 120ms; }
.company-story__chapters > [data-reveal]:nth-child(n + 4),
.principles-axis__list > [data-reveal]:nth-child(n + 4) { transition-delay: 180ms; }
```

## Repo conventions to follow

- A regra da revelação mora em `app/footer.css:58`, sob o comentário
  `/* Reveal */`. O escalonamento entra logo abaixo dela, no mesmo bloco.
- Comentários em português explicando o porquê, sem acento nesse arquivo.
- Seletores irmãos ficam empilhados um por linha, como em
  `app/base.css:159-165`.

## Boundaries

- NÃO escalonar os cards de obra (`.project-tile`, em
  `components/page-projects.tsx:15`). Eles já entram em tempos diferentes por
  causa do `margin-top` escalonado do grid (`app/pages.css:213-216`); somar um
  atraso ali empilharia dois escalonamentos e o quarto card ficaria visivelmente
  para trás.
- NÃO escalonar os títulos de seção (`components/ui.tsx:88`). Eles aparecem
  sozinhos, não em grupo.
- NÃO tocar em nenhum arquivo `.tsx`. Este plano é só CSS.
- NÃO usar `animation-delay` — a revelação é feita com `transition`, e o
  atraso precisa ser da mesma família.
- NÃO adicionar dependência.
- Se o trecho não bater com o código encontrado, PARAR e relatar.

## Verification

- **Mecânica**: `npm run lint` e `npm run test` passando.
- **Conferência de sensação**: `npm run dev`, ir para a página da empresa e:
  - rolar devagar até a lista de capítulos entrar. Os blocos têm que chegar em
    cascata da esquerda para a direita (ou de cima para baixo, conforme a
    largura), não todos juntos;
  - **rolar rápido pela mesma seção.** O escalonamento é decoração e não pode
    atrapalhar quem passa direto: se em rolagem rápida o último bloco ainda
    estiver invisível quando já saiu da tela, o atraso está alto demais;
  - em 375px de largura, onde a lista vira uma coluna só, repetir a rolagem
    lenta e confirmar que ainda parece cascata e não fila lenta;
  - ligar `prefers-reduced-motion` no painel Rendering e confirmar que os
    blocos aparecem todos de uma vez, sem atraso nenhum.
- **Done when**: em rolagem lenta os blocos chegam em cascata, em rolagem
  rápida ninguém espera nada, e com movimento reduzido o escalonamento some
  junto com a revelação.
