# Planos de movimento — Nívora

Auditoria de animação feita em 2026-08-16 sobre o commit `3de88bc`, com a
régua de `improve-animations`. **Os dez foram executados no mesmo dia** — o
registro do que foi medido, e do que não deu para medir, está no fim deste
arquivo. Cada plano é autossuficiente e continua servindo de referência para
os outros três sites, que têm os mesmos defeitos.

Antes da lista, o que a auditoria **não** encontrou, porque também é
resultado: nenhum elemento do site é acionado com frequência alta o bastante
para que a animação devesse ser removida, o movimento é restrito de propósito
(só quatro elementos carregam `data-reveal`), e a transição entre páginas está
implementada corretamente à mão, com o `prefers-reduced-motion` já respeitado
no JavaScript.

O padrão dos achados é um só: **a Nívora acerta o que animar e erra o quanto.**

## Planos

| # | Título | Severidade | Categoria | Status |
| --- | --- | --- | --- | --- |
| [001](001-tokens-de-movimento.md) | Tokens de movimento e troca das curvas digitadas à mão | MÉDIA | Coesão e tokens | **FEITO** |
| [002](002-curva-das-entradas.md) | Curva das entradas (revelação e menu mobile) | **ALTA** | Easing | **FEITO** |
| [003](003-gate-de-hover-para-toque.md) | Isolar movimento de hover de aparelhos de toque | **ALTA** | Acessibilidade | **FEITO** |
| [004](004-propriedades-de-layout-animadas.md) | Parar de animar propriedades de layout | MÉDIA | Desempenho | **FEITO** |
| [005](005-coerencia-do-hover-dos-cards.md) | Uma velocidade só por interação | MÉDIA | Coesão | **FEITO** |
| [006](006-reduced-motion-que-reduz.md) | `prefers-reduced-motion` que reduz em vez de cegar | MÉDIA | Acessibilidade | **FEITO** |
| [007](007-retorno-de-clique.md) | Retorno de clique instantâneo | BAIXA | Física | **FEITO** |
| [008](008-filtro-no-hover-dos-retratos.md) | Encurtar o hover dos retratos e medir o filtro | BAIXA | Desempenho | **FEITO** — medido em 17/08, 2ª etapa descartada |
| [009](009-comparador-sem-re-render.md) | Tirar o re-render do arrasto do comparador | BAIXA | Desempenho | **FEITO** |
| [010](010-escalonar-a-entrada-dos-grupos.md) | Escalonar a entrada dos grupos | BAIXA | Coesão | **FEITO** |
| [011](011-revelacao-em-css-scroll-driven.md) | Revelação por rolagem em CSS, sem JavaScript | — | Oportunidade | **DESCARTADO** |

## Ordem recomendada

```
001  →  002  →  003  →  004  →  005  →  006  →  007  →  008  →  009  →  010
```

**001 é obrigatório e vem primeiro.** Ele cria os tokens que todos os outros
consomem; qualquer plano rodado antes dele vai escrever `var(--ease-out)`
apontando para nada, e a transição some sem erro nenhum aparecer.

**003 antes de 004.** Os dois mexem em `app/editorial.css` e `app/header.css`,
em regras diferentes que não colidem, mas o 003 manda parar se encontrar o
arquivo já na forma pós-004. Rodando nesta ordem, isso não acontece.

Os demais são independentes entre si depois do 001. O 009 é o único que não
toca em CSS.

## Dependências e conflitos

| Plano | Depende de | Observação |
| --- | --- | --- |
| 002 a 008, 010 | 001 | Usam os tokens |
| 010 | 002 | O escalonamento é `transition-delay`, e a transição precisa estar na curva certa antes |

O 011 saiu da conta: foi descartado por decisão em 2026-08-16.

## Por que o 011 foi descartado

Ele era o de maior alcance: apagaria `components/Reveal.tsx` inteiro e faria a
revelação parar de depender de JavaScript. Em troca, animação ligada à rolagem
é **esfregada**, não disparada — rolando de volta para cima, os blocos se
desfazem. Não existe, hoje, jeito de fazer animação de rolagem tocar uma vez
só em CSS puro.

Decisão: **fica no JavaScript.** O risco que a troca resolvia já está contido
por três proteções no `Reveal.tsx`, enquanto o custo apareceria para todo
visitante que rolasse de volta para reler um trecho. O defeito real da
revelação era a curva, e isso o plano 002 resolve em três linhas.

O documento fica no repositório com o registro completo do porquê, para a
próxima vez que o assunto voltar. O que muda o cálculo é uma coisa só: CSS
ganhar como fazer animação de rolagem tocar uma vez.

## Como executar

Cada plano traz comandos mecânicos (`npm run lint`, `npm run test`) e uma
conferência de sensação com passos observáveis. **A conferência de sensação
não é opcional**: movimento pode estar mecanicamente correto e ainda estar
errado, e três dos planos aqui (004, 008, 009) só se provam com o painel
Performance do DevTools e a CPU em 4x de lentidão — o aparelho do visitante
não é esta máquina.

## Execução — 2026-08-16

Os dez foram aplicados de uma vez, sobre o commit `3de88bc`.

**Verificado por medição:**

- `npm run lint` limpo; `npm run test` com build de produção e **18 testes
  passando**.
- Tokens resolvendo no navegador: `--ease-out` = `cubic-bezier(0.23, 1, 0.32, 1)`,
  e a escala de 160/200/250/300/600ms.
- Nenhuma `cubic-bezier` digitada à mão sobrou fora do `:root`.
- Revelação com as duas metades em `0.6s` e a **mesma** curva, que era o achado
  de severidade alta.
- Sublinhado da navegação em `transform 0.25s` com origem à esquerda, sem
  `right` na transição.
- Card de obra: imagem e distintivo ambos em `0.3s`, antes 800ms contra 350ms.
- Botão: cor em 200ms, afundamento em 160ms, `scale(0.97)`.
- Escalonamento medido nos dois grupos: `0s, 0.06s, 0.12s, 0.18s`.
- **Gate de toque: em 375px com emulação de toque, 6 regras de hover e
  0 ativas.** No desktop, as 6 valem.
- **Movimento reduzido: nenhum `transition-duration: 0.01ms` restante**, e a
  lista de `transition-property` limitada a cor e opacidade está aplicada.
- Comparador: `--position` acompanha o controle (54% → 20% → 85%) e o
  `clip-path` segue junto, sem re-render do React.

**Não verificado, e o motivo:**

- **A revelação em movimento não pôde ser vista.** O painel de navegador
  embutido não estava compondo quadros, e sem pintura o `IntersectionObserver`
  não entrega evento nenhum: a rede de segurança de 1 segundo do
  `components/Reveal.tsx` revela tudo de uma vez. É o modo de falha que aquele
  arquivo documenta, ele funcionou como devia, e é artefato do ambiente de
  medição, não do site. Precisa de navegador visível de verdade.
- **As medições com CPU em 4x de lentidão** (planos 004, 008 e 009) não foram
  feitas: o painel Performance com desaceleração de CPU não é acessível pelas
  ferramentas do navegador embutido. Por isso o plano 008 ficou na primeira
  etapa, e a segunda continua condicionada a essa medição.

## Medições fechadas — 2026-08-17

O que estava pendente por falta de instrumento foi medido com Playwright
controlando um Chromium de verdade, com `Emulation.setCPUThrottlingRate` em
4x e `Performance.getMetrics` contando `LayoutCount`. O painel de navegador
embutido não servia porque não compunha quadros; um navegador de verdade
serve.

**Plano 004 — provado.** Passando o mouse pela navegação principal três
vezes: **0 layouts**, com CPU normal e com CPU 4x mais lenta. Era exatamente
a prova que o plano pedia, e ela fecha a conversão de `right` para
`transform: scaleX()`.

**Plano 008 — segunda etapa descartada, com número.** O mesmo hover em quatro
retratos, com o filtro animado e com ele removido, deu **96 quadros e 50ms de
maior intervalo nos dois casos**, e 0 layouts nos dois. O filtro não custa
nada mensurável aqui. A regra de decisão escrita no plano manda parar na
primeira etapa, e é o que fica.

**Plano 009 — funciona, e a medição anterior era inválida.** Com o
comparador rolado até a tela, o arrasto de mouse move de 54% para 71% e cinco
setas do teclado movem para 66%. A medição que dava "não moveu" tinha o
comparador em y=3188 numa janela de 800px: os cliques caíam na seção de cima.

**Revelação por rolagem — provada.** Num navegador que compõe quadros: 0 de 8
elementos visíveis no carregamento, 8 de 8 depois de rolar a página inteira, e
saltando direto para o fim nada invisível fica dentro da tela. O que eu tinha
visto antes (tudo revelado de uma vez) era a rede de segurança de 1 segundo do
`Reveal.tsx` agindo corretamente num ambiente sem pintura.

### Um experimento que foi revertido

O cabo do comparador usa `left: var(--position)`, e a regra geral manda animar
só `transform` e `opacity`. Converti para um elemento da largura do contentor
deslocado por `translateX`. **A geometria ficou idêntica** — a linha caía em
54% e 24% exatos, o losango centrado, sem transbordo — **e o custo não mudou:
48 layouts no mesmo arrasto, com o CSS antigo e com o novo, no mesmo
ambiente.** Os 48 acompanham o número de eventos de ponteiro, não a
propriedade animada.

Revertido, com o porquê no comentário do `editorial.css`. Mudança sem
benefício que se possa mostrar não fica, e a lição de método é que **a
medição diferencial tem que rodar no mesmo ambiente**: minha primeira
comparação pôs produção contra localhost e não queria dizer nada.
