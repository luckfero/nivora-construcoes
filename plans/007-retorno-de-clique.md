# 007 — Deixar o retorno de clique instantâneo

- **Status**: TODO
- **Commit**: 3de88bc
- **Severity**: LOW
- **Category**: Física
- **Estimated scope**: 2 arquivos, 3 declarações
- **Depende de**: 001 (usa `--ease-out`, `--dur-press`, `--dur-base`, `--dur-fast`)

## Problem

O botão principal afunda ao ser apertado, o que está certo, mas leva 250ms
com curva `ease` para isso — e `ease` começa devagar. Retorno de clique é a
única animação que o visitante percebe como *atraso*: ele já apertou, e a
interface ainda está pensando em responder. Além disso, o afundamento de
`scale(0.985)` está abaixo da faixa perceptível; a referência é 0,95 a 0,98.

```css
/* app/base.css:137 — atual */
  transition: background 0.3s ease, color 0.3s ease, transform 0.25s ease;

/* app/base.css:166 — atual */
.action-link:active { transform: scale(0.985); }
```

O mesmo padrão está no ícone do FAQ, que gira ao abrir a pergunta com `ease`
em 300ms — uma abertura que deveria estalar:

```css
/* app/forms.css:175 — atual */
.faq-list summary i { font-style: normal; font-size: 24px; transition: transform 0.3s ease; }
```

## Target

```css
/* target — app/base.css:137 */
  transition: background var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out),
    transform var(--dur-press) var(--ease-out);

/* target — app/base.css:166 */
.action-link:active { transform: scale(0.97); }

/* target — app/forms.css:175 */
.faq-list summary i { font-style: normal; font-size: 24px; transition: transform var(--dur-base) var(--ease-out); }
```

`--dur-press` são 160ms, `--dur-base` 250ms, `--dur-fast` 200ms.

## Repo conventions to follow

- Tokens do plano 001, no `:root` de `app/base.css`.
- Declarações com três propriedades ficam quebradas com indentação de dois
  espaços. Exemplar: a própria `app/base.css:137` depois da mudança.
- `app/forms.css:175` é regra de uma linha e continua de uma linha.

## Steps

1. `app/base.css:137`: substituir a declaração pela do alvo.
2. `app/base.css:166`: trocar `scale(0.985)` por `scale(0.97)`.
3. `app/forms.css:175`: trocar `0.3s ease` por `var(--dur-base) var(--ease-out)`.

## Boundaries

- NÃO acrescentar `:active` a outros elementos. Se um botão hoje não afunda,
  isso é decisão de design e está fora deste plano.
- NÃO tocar em `app/forms.css:176` (`details[open] summary i`), que só declara
  o ângulo final.
- NÃO adicionar dependência.
- Se um trecho não bater com o código encontrado, PARAR e relatar.

## Verification

- **Mecânica**: `npm run lint` e `npm run test` passando.
- **Conferência de sensação**: `npm run dev` e:
  - apertar e segurar o botão principal da home. O afundamento tem que ser
    perceptível e imediato, e o botão tem que voltar assim que soltar;
  - conferir que a mudança de cor de fundo continua suave, não estalada —
    ela ficou em 200ms de propósito, mais lenta que o afundamento;
  - na página de contato, abrir e fechar três perguntas do FAQ seguidas. O
    `+` tem que girar com o painel, não depois dele;
  - em 375px, tocar no botão principal com o dedo e conferir que o
    afundamento aparece também no toque.
- **Done when**: o afundamento é visível a olho nu e some ao soltar, e
  `grep -n "0.985\|0.25s ease\|0.3s ease" app/base.css app/forms.css` não acha
  mais essas três ocorrências.
