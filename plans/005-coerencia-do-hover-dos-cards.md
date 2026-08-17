# 005 — Dar uma velocidade só a cada interação

- **Status**: TODO
- **Commit**: 3de88bc
- **Severity**: MEDIUM
- **Category**: Coesão
- **Estimated scope**: 2 arquivos, 3 declarações
- **Depende de**: 001 (usa `--ease-out` e a escala de duração)

## Problem

O hover de um card de obra move duas coisas ao mesmo tempo, e cada uma tem
velocidade própria: a imagem leva 800ms para ampliar, o distintivo leva 350ms
para subir. São 2,3 vezes de diferença dentro do **mesmo gesto**. Na prática o
distintivo já chegou e parou enquanto a imagem ainda está crescendo, e a
imagem continua se mexendo bem depois de o ponteiro ter ido embora.

```css
/* app/pages.css:220 — atual */
.project-tile__image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(.22, 1, .36, 1); }

/* app/pages.css:231-232 — atual */
  transform: translateY(80px);
  transition: transform 0.35s ease;
```

Oitocentos milissegundos também está muito acima do orçamento: interface fica
abaixo de 300ms, e um efeito de hover de 300ms parece mais atento que um de
800ms.

O mesmo desencontro está no distintivo da seção de observatório, onde a
rotação leva 350ms e as cores 300ms:

```css
/* app/editorial.css:276 — atual */
  transition: transform 0.35s ease, background 0.3s ease, color 0.3s ease;
```

## Target

Uma interação, uma velocidade. Os dois movimentos do card de obra passam a
300ms com a curva forte de saída; as três propriedades do distintivo do
observatório passam a 250ms.

```css
/* target — app/pages.css:220 */
.project-tile__image img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--dur-slow) var(--ease-out); }
```

```css
/* target — app/pages.css:231-232 */
  transform: translateY(80px);
  transition: transform var(--dur-slow) var(--ease-out);
```

```css
/* target — app/editorial.css:276 */
  transition: transform var(--dur-base) var(--ease-out),
    background var(--dur-base) var(--ease-out),
    color var(--dur-base) var(--ease-out);
```

## Repo conventions to follow

- Tokens do plano 001, no `:root` de `app/base.css`.
- `app/pages.css:220` é uma regra de uma linha só e continua de uma linha só.
  Declarações com três propriedades ficam quebradas com indentação de dois
  espaços, como já ocorre em `app/base.css:137`.

## Steps

1. `app/pages.css:220`: trocar `0.8s cubic-bezier(.22, 1, .36, 1)` por
   `var(--dur-slow) var(--ease-out)`.
2. `app/pages.css:232`: trocar `0.35s ease` por
   `var(--dur-slow) var(--ease-out)`.
3. `app/editorial.css:276`: substituir a declaração inteira pela do alvo.

## Boundaries

- NÃO tocar nas regras `:hover` e `:focus-visible` de `app/pages.css:234-237`
  nem de `app/editorial.css:278` — elas são do plano 003, que muda **onde**
  valem, enquanto este muda **quanto duram**. Os dois planos não se cruzam:
  este mexe só nas declarações `transition` das regras base.
- NÃO alterar `translateY(80px)`, `scale(1.035)` nem `rotate(-12deg)`. As
  distâncias estão certas.
- NÃO adicionar dependência.
- Se um trecho não bater com o código encontrado, PARAR e relatar.

## Verification

- **Mecânica**: `npm run lint` e `npm run test` passando.
- **Conferência de sensação**: `npm run dev`, ir para a página de obras e:
  - passar o mouse por um card e **tirar rápido**. A imagem tem que ter
    voltado ao tamanho antes de o ponteiro chegar no card seguinte. Era isso
    que os 800ms impediam;
  - no DevTools, aba Animations, pôr a reprodução em 10% e confirmar que a
    imagem e o distintivo começam e terminam juntos. Se o distintivo chegar
    primeiro, uma das duas trocas não foi aplicada;
  - na home, passar pelo distintivo do observatório e confirmar que a rotação
    e a mudança de cor acontecem como um movimento só, não como dois.
- **Done when**: em câmera lenta, as duas metades do hover do card de obra
  terminam no mesmo quadro, e `grep -n "0.8s\|0.35s" app/pages.css` não acha
  mais nada.
