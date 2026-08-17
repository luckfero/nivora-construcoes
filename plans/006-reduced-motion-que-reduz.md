# 006 — Fazer `prefers-reduced-motion` reduzir em vez de cegar

- **Status**: TODO
- **Commit**: 3de88bc
- **Severity**: MEDIUM
- **Category**: Acessibilidade
- **Estimated scope**: 1 arquivo, 1 bloco
- **Depende de**: 001 (usa a escala de duração)

## Problem

```css
/* app/responsive.css:368-379 — atual */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
  .motion-ready [data-reveal] { opacity: 1; transform: none; }
}
```

`transition-duration: 0.01ms !important` em `*` desliga **tudo**, inclusive o
que não é movimento: a mudança de cor do botão principal ao passar o mouse, o
escurecimento do item ativo no diretório de obras, o retorno visual do clique.

Quem liga "reduzir movimento" no sistema está pedindo para as coisas pararem
de **se mexer**, não para a interface parar de responder. Cor e opacidade não
causam desconforto vestibular; deslocamento e escala causam. Do jeito atual, o
visitante que pediu menos movimento recebe uma interface que não confirma
nada do que ele faz, e ainda assim continua recebendo o movimento — só que
instantâneo, porque o `transform` do hover continua sendo aplicado, apenas
sem transição.

## Target

Três camadas, nesta ordem: animações de keyframe saem inteiras (elas são
puramente decorativas aqui), transições ficam limitadas a cor e opacidade, e
os três deslocamentos de hover são anulados de forma explícita, para que não
sobre nem o pulo instantâneo.

```css
/* target — app/responsive.css:368-379, substituindo o bloco inteiro */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }

  /* Animacao de keyframe aqui e sempre decorativa (heroi, troca de imagem,
     transicao de pagina): sai inteira. */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }

  /* Menos movimento nao e menos resposta. A transicao continua existindo
     para cor e opacidade, que e o que confirma ao visitante que a interface
     ouviu ele; o que sai da lista e o deslocamento. */
  *,
  *::before,
  *::after {
    transition-property: opacity, color, background-color, border-color, fill, stroke !important;
  }

  /* Sem transicao, um transform de hover viraria pulo instantaneo, que e
     pior que o movimento suave. Estes tres sao anulados de vez. */
  .motion-ready [data-reveal] { opacity: 1; transform: none; }
  .project-tile a:hover img,
  .project-tile a:focus-visible img,
  .team-dossiers__grid article:hover .team-dossiers__monogram img {
    transform: none;
  }
  .project-tile a:hover .project-tile__image > span,
  .project-tile a:focus-visible .project-tile__image > span {
    transform: translateY(80px);
  }
}
```

O distintivo do card volta para `translateY(80px)`, que é a posição escondida:
em movimento reduzido ele simplesmente não aparece, em vez de saltar.

## Repo conventions to follow

- O bloco mora no fim de `app/responsive.css`, logo antes da seção de
  transição entre páginas, e continua lá.
- Existe um segundo bloco `prefers-reduced-motion` em `app/responsive.css:404`
  cuidando da transição entre páginas. Ele está **correto** e não deve ser
  tocado.
- Comentários em português explicando o porquê, sem acento dentro deste
  arquivo. Exemplar: `app/responsive.css:381-387`.

## Steps

1. `app/responsive.css:368-379`: substituir o bloco inteiro pelo alvo.
2. Conferir que o segundo bloco, em `:404`, continua intacto.

## Boundaries

- NÃO tocar no bloco de `prefers-reduced-motion` da transição entre páginas.
- NÃO tocar em `components/ViewTransitions.tsx:55`, que já checa
  `prefers-reduced-motion` no JavaScript e está certo.
- NÃO remover `.motion-ready [data-reveal] { opacity: 1; transform: none; }`.
  É o que garante que quem pediu menos movimento veja o conteúdo revelado de
  imediato.
- NÃO adicionar dependência.
- Se o bloco não bater com o código encontrado, PARAR e relatar.

## Verification

- **Mecânica**: `npm run lint` e `npm run test` passando.
- **Conferência de sensação**: `npm run dev`, DevTools, painel Rendering,
  ligar `prefers-reduced-motion: reduce`, e então:
  - recarregar a home. Todo o conteúdo tem que aparecer de uma vez, sem
    revelação por rolagem e sem o herói deslizando;
  - passar o mouse pelo botão principal. **A cor tem que mudar suavemente** —
    é este o ponto do plano. Se ela trocar de estalo, a lista de
    `transition-property` não foi aplicada;
  - na página de obras, passar o mouse por um card. A imagem **não** pode
    ampliar, nem suave nem instantaneamente, e o distintivo não pode aparecer;
  - navegar entre duas páginas e confirmar que a troca é imediata, sem
    deslizamento lateral;
  - desligar a opção e conferir que tudo voltou ao normal.
- **Done when**: com movimento reduzido, nenhum elemento se desloca, e o botão
  principal ainda muda de cor de forma suave ao receber o mouse.
