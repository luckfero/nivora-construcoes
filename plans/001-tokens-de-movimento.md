# 001 — Criar tokens de movimento e trocar as curvas digitadas à mão

- **Status**: TODO
- **Commit**: 3de88bc
- **Severity**: MEDIUM
- **Category**: Coesão e tokens
- **Estimated scope**: 4 arquivos, ~15 linhas

## Problem

O projeto não tem nenhum token de movimento. A mesma curva está digitada à mão
em cinco arquivos, e ela não é a curva de referência: o projeto usa
`cubic-bezier(.22, 1, .36, 1)`, e a curva forte de saída é
`cubic-bezier(0.23, 1, 0.32, 1)`.

```css
/* app/base.css:114 — atual */
  transition: transform 0.35s cubic-bezier(.22, 1, .36, 1);

/* app/editorial.css:151 — atual */
  animation: hero-reveal 1.15s cubic-bezier(.22, 1, .36, 1) both;

/* app/editorial.css:238 — atual */
  animation: image-swap 0.65s cubic-bezier(.22, 1, .36, 1) both;

/* app/responsive.css:389 e :393 — atual */
::view-transition-old(root) {
  animation: pagina-sai 200ms cubic-bezier(.65, 0, .35, 1) both;
}

::view-transition-new(root) {
  animation: pagina-entra 460ms cubic-bezier(.22, 1, .36, 1) both;
}
```

Sem token, cada correção futura de movimento precisa achar e editar cinco
lugares, e a chance de eles divergirem de novo é alta. Este plano é a base dos
planos 002 a 011: todos consomem os tokens criados aqui.

## Target

Tokens declarados no `:root` que já existe em `app/base.css`, e as cinco
curvas trocadas por eles. **Este plano não altera nenhuma duração** — só
introduz os tokens e substitui as curvas. As durações são tratadas nos planos
seguintes.

```css
/* target — app/base.css, dentro do :root existente, depois de --sans */
  /* Movimento. As curvas nativas do CSS sao fracas demais para movimento
     deliberado, e a mesma cubic-bezier estava digitada a mao em cinco
     arquivos. Duracao de interface fica abaixo de 300ms; a revelacao por
     rolagem e superficie de marketing e pode passar. */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --dur-press: 160ms;
  --dur-fast: 200ms;
  --dur-base: 250ms;
  --dur-slow: 300ms;
  --dur-reveal: 600ms;
```

```css
/* target — app/base.css:114 */
  transition: transform 0.35s var(--ease-out);

/* target — app/editorial.css:151 */
  animation: hero-reveal 1.15s var(--ease-out) both;

/* target — app/editorial.css:238 */
  animation: image-swap 0.65s var(--ease-out) both;

/* target — app/responsive.css:389 e :393 */
::view-transition-old(root) {
  animation: pagina-sai 200ms var(--ease-out) both;
}

::view-transition-new(root) {
  animation: pagina-entra 460ms var(--ease-out) both;
}
```

A troca em `::view-transition-old` é a única que muda o formato da curva
(de simétrica para saída forte). É deliberada: entrada e saída pedem
`ease-out`, que começa rápido. Está na conferência de sensação abaixo.

## Repo conventions to follow

- Os tokens moram no único `:root`, em `app/base.css:9`, que já é o primeiro
  arquivo importado. Acrescentar no fim do bloco, depois de `--sans`.
- **Comentários em português explicando o porquê**, não o quê. Exemplar a
  imitar: `app/base.css:20-25`, o comentário do `--copper-on-dark`, que
  registra os números de contraste que motivaram a variável.
- Os comentários existentes no `:root` são escritos **sem acento** (o arquivo
  mistura os dois estilos; dentro do `:root` é sem). Seguir o do bloco.
- Nomes de token em inglês (`--copper-on-dark`, `--line-light`, `--pad`).

## Steps

1. `app/base.css`: acrescentar o bloco de sete tokens no fim do `:root`,
   depois da linha `--sans: ...;`, com o comentário acima.
2. `app/base.css:114`: trocar `cubic-bezier(.22, 1, .36, 1)` por
   `var(--ease-out)`. Manter `0.35s`.
3. `app/editorial.css:151`: trocar a curva por `var(--ease-out)`. Manter
   `1.15s`.
4. `app/editorial.css:238`: trocar a curva por `var(--ease-out)`. Manter
   `0.65s`.
5. `app/responsive.css:389`: trocar `cubic-bezier(.65, 0, .35, 1)` por
   `var(--ease-out)`. Manter `200ms`.
6. `app/responsive.css:393`: trocar a curva por `var(--ease-out)`. Manter
   `460ms`.

## Boundaries

- NÃO alterar nenhuma duração neste plano.
- NÃO tocar em `app/footer.css`, `app/pages.css`, `app/header.css`,
  `app/forms.css` — eles são dos planos 002 a 010.
- NÃO mexer em marcação, componentes ou JavaScript.
- NÃO adicionar dependência.
- Se algum trecho não bater com o código encontrado, PARAR e relatar em vez de
  improvisar.

## Verification

- **Mecânica**: `npm run lint` sem erro. `npm run test` (roda o build e o
  teste de HTML) passando.
- **Busca**: `grep -rn "cubic-bezier" app/` deve retornar **zero** linha fora
  da declaração dos tokens em `base.css`.
- **Conferência de sensação**: `npm run dev`, abrir a porta que o Vite
  imprimir e:
  - navegar entre duas páginas do menu e confirmar que a transição continua
    parecendo natural, agora com a saída começando rápido em vez de devagar.
    Se a saída ficar abrupta demais, registrar isso no relatório em vez de
    reverter por conta própria;
  - conferir que a seta do botão principal ainda desliza no hover;
  - o herói da home ainda revela da direita para a esquerda.
- **Done when**: build e teste passam, `grep` não acha mais nenhuma
  `cubic-bezier` fora do `:root`, e nada de temporização mudou.
