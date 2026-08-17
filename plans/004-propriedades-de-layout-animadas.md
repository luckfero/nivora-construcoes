# 004 — Parar de animar propriedades de layout

- **Status**: TODO
- **Commit**: 3de88bc
- **Severity**: MEDIUM
- **Category**: Desempenho
- **Estimated scope**: 2 arquivos, 3 regras
- **Depende de**: 001 (usa `--ease-out` e a escala de duração)

## Problem

Só `transform` e `opacity` podem ser animados sem custo: elas pulam o cálculo
de layout e a pintura, e rodam na GPU. `right`, `padding`, `width`, `height`,
`top` e `left` disparam os três estágios a cada quadro.

Três regras animam propriedade de layout, e a primeira roda toda vez que o
ponteiro cruza a navegação principal:

```css
/* app/header.css:78-90 — atual */
.desktop-nav a::after {
  content: "";
  position: absolute;
  left: 17px;
  right: 100%;
  bottom: 0;
  height: 3px;
  background: var(--copper);
  transition: right 0.35s ease;
}
.desktop-nav a:hover::after,
.desktop-nav a:focus-visible::after,
.desktop-nav a.is-active::after { right: 17px; }
```

```css
/* app/editorial.css:363-372 — atual (trecho) */
  padding: 18px 24px;
  ...
  transition: background 0.3s ease, color 0.3s ease, padding 0.3s ease;
}
.service-layers__list button:hover,
.service-layers__list button:focus-visible,
.service-layers__list button.is-active { padding-left: 33px; background: var(--paper); color: var(--ink); }
```

```css
/* app/editorial.css:281-290 — atual (trecho) */
  padding: 16px 5px;
  transition: color 0.3s ease, padding 0.3s ease, background 0.3s ease;
}
.project-directory li.is-active a { padding-inline: 15px; background: var(--graphite); color: var(--paper); }
```

As duas primeiras rodam no hover, dezenas de vezes por visita. A terceira roda
numa troca de estado ocasional, e por isso é a mais barata das três — mas
`padding-inline` muda a largura disponível do grid, então ali **não existe
equivalente em `transform`**: a correção é outra, e está no alvo.

## Target

**Sublinhado da navegação** — a barra passa a existir na largura final e ser
revelada por escala horizontal a partir da esquerda. Muda de 350ms para 250ms,
que é o orçamento de hover. O gate de toque entra junto, porque esta regra
está sendo reescrita de qualquer forma:

```css
/* target — app/header.css:78-90 */
.desktop-nav a::after {
  content: "";
  position: absolute;
  left: 17px;
  right: 17px;
  bottom: 0;
  height: 3px;
  background: var(--copper);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur-base) var(--ease-out);
}
/* Toque dispara :hover e o deixa preso: movimento de mouse so aqui. */
@media (hover: hover) and (pointer: fine) {
  .desktop-nav a:hover::after { transform: scaleX(1); }
}
.desktop-nav a:focus-visible::after,
.desktop-nav a.is-active::after { transform: scaleX(1); }
```

**Lista de serviços** — o recuo de 9px sai do `padding` do botão e vira
deslocamento dos filhos. O fundo do botão fica parado, que é o que já
acontece hoje; só o conteúdo anda:

```css
/* target — app/editorial.css:363-372 */
  padding: 18px 24px;
  ...
  transition: background var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}
.service-layers__list button > * {
  transition: transform var(--dur-base) var(--ease-out);
}
/* Toque dispara :hover e o deixa preso: movimento de mouse so aqui. */
@media (hover: hover) and (pointer: fine) {
  .service-layers__list button:hover { background: var(--paper); color: var(--ink); }
  .service-layers__list button:hover > * { transform: translateX(9px); }
}
.service-layers__list button:focus-visible,
.service-layers__list button.is-active { background: var(--paper); color: var(--ink); }
.service-layers__list button:focus-visible > *,
.service-layers__list button.is-active > * { transform: translateX(9px); }
```

**Diretório de obras** — aqui `padding` sai da lista de transições e passa a
trocar de uma vez. Fundo e cor continuam animando, e é isso que o olho segue;
o recuo acompanhar ou não é imperceptível quando as cores estão mudando:

```css
/* target — app/editorial.css:288 */
  transition: color var(--dur-fast) var(--ease-out),
    background var(--dur-fast) var(--ease-out);
```

## Repo conventions to follow

- Tokens do plano 001, no `:root` de `app/base.css`.
- Comentários em português explicando o porquê. Exemplar: `app/header.css:99-101`.
- O arquivo mantém a regra base e as regras de estado adjacentes, na ordem
  base → hover → focus → ativo. Preservar essa ordem.

## Steps

1. `app/header.css:78-90`: substituir o bloco inteiro pelo alvo. Atenção ao
   `right`, que passa de `100%` para `17px` na regra base — é essa mudança que
   faz a barra existir na largura final para poder ser escalada.
2. `app/editorial.css:368`: tirar `padding` da lista de transições e trocar
   curva e duração pelos tokens.
3. `app/editorial.css:370-372`: substituir a regra de três seletores pelo
   conjunto do alvo, criando a regra `> *` com sua própria transição.
4. `app/editorial.css:288`: tirar `padding` da lista de transições e trocar
   curva e duração pelos tokens. **Não** mexer na linha 290 — o
   `padding-inline: 15px` continua sendo aplicado, só deixa de ser animado.

## Boundaries

- NÃO transformar o botão inteiro da lista de serviços. Só os filhos diretos.
  Mover o botão arrastaria o fundo junto e abriria uma falha à esquerda.
- NÃO remover `padding-inline: 15px` da linha 290 nem `padding-left: 33px` do
  estado ativo — o recuo continua existindo, só muda como chega lá.
- NÃO tocar em `app/pages.css` nem em `app/base.css`. São dos planos 003 e 005.
- NÃO adicionar dependência.
- Se um trecho não bater com o código encontrado, PARAR e relatar.

## Verification

- **Mecânica**: `npm run lint` e `npm run test` passando.
- **Busca**: `grep -n "transition:.*padding\|transition:.*right\|transition:.*left\|transition:.*width\|transition:.*height" app/*.css` deve retornar zero linha.
- **Conferência de sensação**: `npm run dev` e:
  - passar o mouse pelos quatro itens da navegação e confirmar que a barra
    cresce da esquerda para a direita, não de fora para dentro. Se ela crescer
    do lado errado, `transform-origin` ficou faltando;
  - conferir que o item da página atual (`is-active`) continua com a barra
    inteira ao carregar, **sem animar na entrada**;
  - na home, passar pelos itens da lista de serviços: o texto desliza 9px, o
    retângulo de fundo não se move nem muda de tamanho;
  - abrir o painel Performance do DevTools, gravar enquanto passa o mouse pela
    navegação três vezes, e confirmar que não aparece `Layout` na linha do
    tempo — só `Composite`. **Esta é a prova do plano**;
  - navegar por Tab pela navegação e pela lista de serviços e confirmar que
    os dois efeitos ainda aparecem no foco.
- **Done when**: a gravação do Performance não mostra `Layout` durante o hover
  da navegação, e os efeitos continuam iguais aos olhos no mouse e no teclado.
