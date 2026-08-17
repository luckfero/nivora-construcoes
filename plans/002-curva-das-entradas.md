# 002 — Corrigir a curva das entradas (revelação e menu mobile)

- **Status**: TODO
- **Commit**: 3de88bc
- **Severity**: HIGH
- **Category**: Easing e duração
- **Estimated scope**: 2 arquivos, 3 linhas
- **Depende de**: 001 (usa `--ease-out` e `--dur-reveal`)

## Problem

A revelação por rolagem é a animação mais repetida do site: ela roda em todo
título de seção, em todo card de obra e em todos os blocos da página da
empresa. Ela usa **duas curvas diferentes nas duas metades da mesma
animação**:

```css
/* app/footer.css:59-64 — atual */
.motion-ready [data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.75s ease, transform 0.75s cubic-bezier(.22, 1, .36, 1);
}
.motion-ready [data-reveal].is-visible { opacity: 1; transform: none; }
```

A opacidade usa `ease`, que começa devagar; o deslocamento usa uma curva forte
de saída, que começa rápido. O elemento termina de subir bem antes de terminar
de aparecer, e o resultado é um borrão de meio segundo em que o texto está
parado e ainda translúcido. `ease-out` a 200ms **parece** mais rápido que
`ease-in` a 200ms exatamente por isso: o que começa devagar atrasa o instante
em que o visitante está olhando.

O mesmo erro está no menu do celular, que é uma entrada e usa `ease`:

```css
/* app/responsive.css:51-56 — atual */
    opacity: 0;
    visibility: hidden;
    transform: translateY(-15px);
    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
  }
  .mobile-nav.is-open { opacity: 1; visibility: visible; transform: none; }
```

## Target

As duas metades na mesma curva forte de saída, e a duração da revelação caindo
de 750ms para 600ms.

```css
/* target — app/footer.css:59-64 */
.motion-ready [data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--dur-reveal) var(--ease-out),
    transform var(--dur-reveal) var(--ease-out);
}
.motion-ready [data-reveal].is-visible { opacity: 1; transform: none; }
```

```css
/* target — app/responsive.css:51-56 */
    opacity: 0;
    visibility: hidden;
    transform: translateY(-15px);
    transition: opacity var(--dur-slow) var(--ease-out),
      transform var(--dur-slow) var(--ease-out), visibility var(--dur-slow);
  }
  .mobile-nav.is-open { opacity: 1; visibility: visible; transform: none; }
```

`--dur-slow` são 300ms, o mesmo valor de hoje: o menu já estava no orçamento
certo, só estava na curva errada.

## Repo conventions to follow

- Os tokens vêm do plano 001, declarados no `:root` de `app/base.css`.
- A regra da revelação mora em `app/footer.css:58`, sob o comentário
  `/* Reveal */`. Ela está nesse arquivo por herança e não deve ser movida
  neste plano.
- Quando uma transição lista duas ou mais propriedades e passa de 100
  colunas, o arquivo quebra a linha com indentação de dois espaços.

## Steps

1. `app/footer.css:62`: substituir a declaração `transition` pela do alvo,
   com as duas propriedades em `var(--dur-reveal) var(--ease-out)`.
2. `app/responsive.css:54`: substituir a declaração `transition` pela do
   alvo. Manter `visibility` na transição — ela é o que impede o menu fechado
   de continuar recebendo foco de teclado.
3. Não mexer em mais nada nesses dois arquivos.

## Boundaries

- NÃO remover a propriedade `visibility` da transição do menu.
- NÃO alterar o `translateY(24px)` nem o `translateY(-15px)` — a distância
  está certa, o problema é a curva.
- NÃO tocar no `components/Reveal.tsx`. A troca da revelação para CSS
  scroll-driven é o plano 011.
- NÃO adicionar dependência.
- Se o trecho não bater com o código encontrado, PARAR e relatar.

## Verification

- **Mecânica**: `npm run lint` e `npm run test` passando.
- **Conferência de sensação**: `npm run dev` e, na home:
  - rolar devagar até um título de seção entrar. As letras devem terminar de
    aparecer no mesmo instante em que terminam de subir, não depois;
  - no DevTools, aba Animations, pôr a reprodução em 10% e confirmar que
    opacidade e deslocamento chegam ao fim juntos. **Este é o ponto do
    plano** — se um dos dois chegar antes, a troca não foi aplicada nas duas
    propriedades;
  - em 375px de largura, abrir e fechar o menu três vezes seguidas. Ele deve
    começar a aparecer imediatamente ao toque, e fechar sem deixar rastro;
  - com o menu fechado, apertar Tab repetidamente e confirmar que o foco não
    entra nos links escondidos.
- **Done when**: as duas metades da revelação terminam juntas em câmera lenta,
  e `grep -n "ease," app/footer.css app/responsive.css` não acha mais `ease`
  solto nessas duas regras.
