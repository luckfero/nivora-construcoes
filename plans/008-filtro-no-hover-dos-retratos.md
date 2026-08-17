# 008 — Encurtar o hover dos retratos da equipe e medir o custo do filtro

- **Status**: TODO
- **Commit**: 3de88bc
- **Severity**: LOW
- **Category**: Desempenho
- **Estimated scope**: 1 arquivo, 1 declaração
- **Depende de**: 001 (usa `--ease-out` e `--dur-slow`)

## Problem

```css
/* app/pages.css:128-134 — atual */
  filter: saturate(0.88) contrast(1.03);
  transform: scale(1.015);
  transition: transform 500ms ease, filter 500ms ease;
}
.team-dossiers__grid article:hover .team-dossiers__monogram img {
  filter: saturate(1) contrast(1.02);
  transform: scale(1.045);
}
```

Dois problemas, e o segundo é menor do que parece:

1. **500ms com `ease` num hover.** Passa do orçamento de 300ms e usa uma curva
   que começa devagar. O retrato ainda está ganhando cor depois que o ponteiro
   já saiu.
2. **`filter` animado.** Diferente de `transform` e `opacity`, `filter`
   repinta a camada a cada quadro. Numa grade de retratos grandes isso custa,
   mas o custo depende do tamanho real das imagens e do aparelho — não dá para
   decidir por leitura de código. Este plano **encurta primeiro e mede
   depois**, com a ação da medição já definida.

## Target

Primeira etapa, que é certa em qualquer cenário:

```css
/* target — app/pages.css:130 */
  transition: transform var(--dur-slow) var(--ease-out),
    filter var(--dur-slow) var(--ease-out);
```

Segunda etapa, **só se a medição descrita na verificação acusar queda de
quadros**:

```css
/* target condicional — app/pages.css:130 e :133 */
  transition: transform var(--dur-slow) var(--ease-out);
}
.team-dossiers__grid article:hover .team-dossiers__monogram img {
  transform: scale(1.045);
}
```

Ou seja: tira `filter` da transição e tira a mudança de saturação do hover. O
retrato continua com o filtro de repouso (`saturate(0.88) contrast(1.03)`), que
é a decisão visual, e só a escala responde ao mouse.

## Repo conventions to follow

- Tokens do plano 001, no `:root` de `app/base.css`.
- Declarações de duas propriedades ficam quebradas com indentação de dois
  espaços. Exemplar: `app/base.css:137`.

## Steps

1. `app/pages.css:130`: substituir a declaração pela do alvo da primeira
   etapa.
2. Rodar a medição descrita na verificação.
3. **Só se a medição acusar queda de quadros**: aplicar o alvo condicional,
   removendo `filter` da transição e a linha `filter: saturate(1)
   contrast(1.02);` da regra de hover.
4. Registrar no relatório final qual das duas etapas foi aplicada e qual foi o
   número medido. Não deixar isso implícito.

## Boundaries

- NÃO remover `filter: saturate(0.88) contrast(1.03)` da regra base em
  nenhuma hipótese. É a aparência de repouso do retrato, decisão de design.
- NÃO envelopar esta regra em `@media (hover: hover)` aqui — isso é o plano
  003. Se o 003 já tiver rodado, a regra de hover estará dentro de uma
  consulta de mídia; editar dentro dela e seguir.
- NÃO adicionar dependência.
- Se um trecho não bater com o código encontrado, PARAR e relatar.

## Verification

- **Mecânica**: `npm run lint` e `npm run test` passando.
- **Medição (é ela que decide a segunda etapa)**: `npm run dev`, ir para a
  página da empresa, abrir o DevTools:
  - painel Performance, engrenagem, `CPU: 4x slowdown`. **Sem isto a medição
    não vale nada** — esta máquina não é o aparelho do visitante;
  - gravar enquanto passa o mouse por quatro retratos seguidos, sem pressa;
  - olhar a linha de quadros. Se aparecer barra vermelha de quadro perdido ou
    a taxa cair abaixo de 50fps durante o hover, **aplicar a segunda etapa**.
    Se ficar estável, parar na primeira.
- **Conferência de sensação**: passar o mouse por um retrato e tirar rápido.
  Ele tem que ter voltado ao repouso antes de o ponteiro chegar no retrato
  seguinte.
- **Done when**: a primeira etapa está aplicada, a medição com 4x de
  lentidão foi feita, e o relatório diz o número obtido e se a segunda etapa
  entrou ou não.
