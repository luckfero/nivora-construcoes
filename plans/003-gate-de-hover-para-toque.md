# 003 — Isolar o movimento de hover de aparelhos de toque

- **Status**: TODO
- **Commit**: 3de88bc
- **Severity**: HIGH
- **Category**: Acessibilidade
- **Estimated scope**: 3 arquivos, 4 regras
- **Depende de**: 001 (usa `--ease-out` e a escala de duração)

## Problem

O projeto inteiro não tem uma única consulta `@media (hover: hover)`.
Confirmado por busca: `grep -rn "(hover: hover)" app/ components/` não retorna
nada.

Num aparelho de toque, `:hover` dispara no toque e **fica preso** até o
visitante tocar em outro lugar. Quem toca num card de obra no celular fica com
a imagem ampliada e o distintivo levantado depois de já ter voltado da página
da obra. Isso não é decoração parada: é um estado que o visitante não pediu e
não sabe desfazer.

Quatro regras movem coisas no hover:

```css
/* app/base.css:159-165 — atual */
.action-link:hover .arrow,
.inline-link:hover .arrow,
.header-cta:hover .arrow,
.project-directory a:hover .arrow,
.project-directory a:focus-visible .arrow,
.next-case a:hover .arrow,
.form-next:hover .arrow { transform: translateX(5px); }
```

```css
/* app/editorial.css:278 — atual */
.project-observatory__media:hover .project-observatory__open { transform: rotate(-12deg); background: var(--copper); color: white; }
```

```css
/* app/pages.css:132-135 — atual */
.team-dossiers__grid article:hover .team-dossiers__monogram img {
  filter: saturate(1) contrast(1.02);
  transform: scale(1.045);
}
```

```css
/* app/pages.css:234-237 — atual */
.project-tile a:hover img,
.project-tile a:focus-visible img { transform: scale(1.035); }
.project-tile a:hover .project-tile__image > span,
.project-tile a:focus-visible .project-tile__image > span { transform: translateY(0); }
```

**O detalhe que faz este plano dar errado se for feito no automático:** três
dessas regras misturam `:hover` com `:focus-visible` no mesmo seletor.
`:focus-visible` é o teclado, e movimento de teclado **não pode** ser
desligado — é o que mostra ao visitante onde ele está na página. Envelopar o
seletor inteiro na consulta de mídia apagaria o retorno visual de quem navega
por Tab em qualquer aparelho sem mouse.

Cada regra misturada precisa ser **partida em duas**: a parte `:hover` entra
na consulta, a parte `:focus-visible` fica fora.

## Target

```css
/* target — app/base.css:159-166, substituindo a regra atual */
.project-directory a:focus-visible .arrow { transform: translateX(5px); }
@media (hover: hover) and (pointer: fine) {
  .action-link:hover .arrow,
  .inline-link:hover .arrow,
  .header-cta:hover .arrow,
  .project-directory a:hover .arrow,
  .next-case a:hover .arrow,
  .form-next:hover .arrow { transform: translateX(5px); }
}
```

```css
/* target — app/editorial.css:278 */
@media (hover: hover) and (pointer: fine) {
  .project-observatory__media:hover .project-observatory__open { transform: rotate(-12deg); background: var(--copper); color: white; }
}
```

```css
/* target — app/pages.css:132-135 */
@media (hover: hover) and (pointer: fine) {
  .team-dossiers__grid article:hover .team-dossiers__monogram img {
    filter: saturate(1) contrast(1.02);
    transform: scale(1.045);
  }
}
```

```css
/* target — app/pages.css:234-237 */
.project-tile a:focus-visible img { transform: scale(1.035); }
.project-tile a:focus-visible .project-tile__image > span { transform: translateY(0); }
@media (hover: hover) and (pointer: fine) {
  .project-tile a:hover img { transform: scale(1.035); }
  .project-tile a:hover .project-tile__image > span { transform: translateY(0); }
}
```

## Repo conventions to follow

- O projeto já separa comportamento por consulta de mídia em
  `app/responsive.css`, mas **estas regras ficam onde estão**: cada uma mora
  ao lado do componente que ela descreve, e mover quebraria a ordem de
  cascata com as regras de `is-active`.
- Comentários em português explicando o porquê. Exemplar a imitar:
  `app/base.css:99-101`, que registra o motivo de um valor de espaçamento.
  Vale um comentário curto de uma linha em cada consulta nova, do tipo
  `/* Toque dispara :hover e o deixa preso: movimento de mouse so aqui. */`
- Regras de uma linha só continuam de uma linha só; regras de várias
  propriedades ficam quebradas, como já estão.

## Steps

1. `app/base.css:159-165`: extrair `.project-directory a:focus-visible .arrow`
   para uma regra própria **antes** da consulta, e envelopar os seis seletores
   `:hover` restantes na consulta de mídia.
2. `app/editorial.css:278`: envelopar a regra inteira na consulta. Não tem
   `:focus-visible`, então não precisa partir.
3. `app/pages.css:132-135`: envelopar a regra inteira na consulta. Não tem
   `:focus-visible`.
4. `app/pages.css:234-237`: partir as duas regras. As duas metades
   `:focus-visible` viram regras próprias antes da consulta; as duas metades
   `:hover` entram nela.
5. Acrescentar o comentário de uma linha em cada consulta nova.

## Boundaries

- NÃO envelopar nenhuma regra `:focus-visible`. Se um seletor tem as duas
  coisas, partir — nunca escolher uma.
- NÃO envelopar hovers que só mudam cor (`app/base.css:148-158`,
  `app/footer.css:56`, `app/forms.css:71`). Eles não movem nada e não estão
  no escopo deste plano.
- NÃO tocar em `.is-active` em lugar nenhum: é estado de JavaScript e vale em
  qualquer aparelho.
- NÃO mudar durações, curvas ou distâncias. Este plano só muda **onde** as
  regras valem.
- NÃO adicionar dependência.
- Se um trecho não bater com o código encontrado, PARAR e relatar. Em
  particular, se o plano 004 já tiver rodado, `app/editorial.css` e
  `app/header.css` terão outra forma — nesse caso, PARAR: aquele plano já
  cuida do gate das regras que ele reescreve.

## Verification

- **Mecânica**: `npm run lint` e `npm run test` passando.
- **Busca**: `grep -rn "(hover: hover)" app/` deve achar quatro consultas.
- **Conferência de sensação**: `npm run dev` e, no DevTools:
  - com o navegador em modo de emulação de aparelho móvel (que desliga
    `hover: hover`), tocar num card de obra na página de obras e voltar. A
    imagem **não** pode ficar ampliada nem o distintivo levantado;
  - no desktop com mouse, passar por cima do mesmo card e confirmar que o
    efeito continua exatamente como antes;
  - no desktop, sem tocar no mouse, apertar Tab até chegar no card. A imagem
    deve ampliar e o distintivo deve subir — **é aqui que se vê se a regra foi
    partida certo**. Se nada acontecer no Tab, o `:focus-visible` foi
    envelopado por engano;
  - repetir o teste de Tab no botão principal da home, conferindo a seta.
- **Done when**: no emulador de toque nenhum efeito de hover fica preso, e no
  teclado todos os quatro efeitos continuam aparecendo.
