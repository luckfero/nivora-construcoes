# 009 — Tirar o re-render do React do arrasto do comparador

- **Status**: TODO
- **Commit**: 3de88bc
- **Severity**: LOW
- **Category**: Desempenho
- **Estimated scope**: 1 arquivo, ~10 linhas

## Problem

O comparador antes/depois guarda a posição do cabo em estado do React. O
`onChange` de um `input[type=range]` dispara a cada movimento do ponteiro
durante o arrasto, então **cada quadro do arrasto re-renderiza o componente
inteiro**, incluindo as duas `<Picture>`.

```tsx
/* components/ui.tsx:145-162 — atual */
  const [position, setPosition] = useState(54);
  const labels = content.projectLabels[locale];
  return (
    <div className="comparison" style={{ "--position": `${position}%` } as React.CSSProperties}>
      <Picture className="comparison__after" src={after} alt={`${name} — ${labels.after.toLowerCase()}`} sizes={SIZES.half} />
      <Picture className="comparison__before" src={before} alt={`${name} — ${labels.before.toLowerCase()}`} sizes={SIZES.half} />
      <span className="comparison__label comparison__label--before">{labels.before}</span>
      <span className="comparison__label comparison__label--after">{labels.after}</span>
      <span className="comparison__handle" aria-hidden="true"><i /></span>
      <input
        type="range"
        min="8"
        max="92"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label={`${labels.drag}: ${name}`}
      />
    </div>
  );
```

**Sendo honesto sobre o tamanho disto:** são seis elementos e o React é rápido;
é bem possível que ninguém sinta nada num aparelho moderno. Este plano existe
porque arrasto é a única interação do site em que o visitante move o dedo e
espera a tela acompanhar quadro a quadro, e é a única onde essa conta se paga.
A medição na verificação é que decide se valeu — e "não mudou nada" é um
resultado aceitável de se relatar.

O `input[type=range]` **fica**. Ele é o que torna o comparador operável por
teclado, e trocar por manipulador de ponteiro próprio perderia isso.

## Target

A posição sai do estado do React e passa a ser escrita direto na variável CSS
do contêiner, por referência. O componente não re-renderiza mais durante o
arrasto.

```tsx
/* target — components/ui.tsx:145-163 */
  const container = useRef<HTMLDivElement>(null);
  const labels = content.projectLabels[locale];
  return (
    <div className="comparison" ref={container} style={{ "--position": "54%" } as React.CSSProperties}>
      <Picture className="comparison__after" src={after} alt={`${name} — ${labels.after.toLowerCase()}`} sizes={SIZES.half} />
      <Picture className="comparison__before" src={before} alt={`${name} — ${labels.before.toLowerCase()}`} sizes={SIZES.half} />
      <span className="comparison__label comparison__label--before">{labels.before}</span>
      <span className="comparison__label comparison__label--after">{labels.after}</span>
      <span className="comparison__handle" aria-hidden="true"><i /></span>
      <input
        type="range"
        min="8"
        max="92"
        defaultValue={54}
        onChange={(event) => container.current?.style.setProperty("--position", `${event.target.value}%`)}
        aria-label={`${labels.drag}: ${name}`}
      />
    </div>
  );
```

E a importação, porque `useState` não é usado em nenhum outro ponto do
arquivo (confirmado: a única ocorrência é a linha 145):

```tsx
/* target — components/ui.tsx:4 */
import { useRef } from "react";
```

## Repo conventions to follow

- O arquivo já usa `as React.CSSProperties` para passar variável CSS por
  `style`. Manter esse padrão.
- Comentário em português explicando o porquê, acima do `onChange`. Exemplar
  a imitar: `components/Reveal.tsx:5-24`, que explica a decisão e o modo de
  falha que ela evita. Aqui basta uma ou duas linhas, do tipo
  `/* A posição não vive em estado: o range dispara a cada movimento do
  ponteiro, e re-renderizar as duas fotos por quadro não se paga. */`
- O valor inicial 54 aparece em dois lugares no alvo (`--position` e
  `defaultValue`). Isso é proposital e deve ser comentado, senão o próximo
  leitor vai "consertar" um dos dois.

## Steps

1. `components/ui.tsx:4`: trocar `import { useState } from "react";` por
   `import { useRef } from "react";`.
2. `components/ui.tsx:145`: trocar a linha do `useState` pela do `useRef`.
3. `components/ui.tsx:148`: acrescentar `ref={container}` e fixar
   `"--position": "54%"`.
4. `components/ui.tsx:158-159`: trocar `value` por `defaultValue={54}` e o
   `onChange` pelo do alvo.
5. Acrescentar o comentário de duas linhas.

## Boundaries

- NÃO remover o `input[type=range]` nem trocá-lo por manipuladores de
  ponteiro. Ele é o acesso por teclado.
- NÃO mexer no CSS do comparador (`app/editorial.css:460-517`). O `left:
  var(--position)` do cabo continua como está: trocar por `transform` exigiria
  saber a largura do contêiner, que o CSS sozinho não tem.
- NÃO tocar em nenhum outro componente exportado por `components/ui.tsx`.
- NÃO adicionar dependência.
- Se o trecho não bater com o código encontrado, PARAR e relatar.

## Verification

- **Mecânica**: `npm run lint` (vai acusar se `useState` ficou importado sem
  uso) e `npm run test` passando.
- **Funcional**: `npm run dev`, abrir uma obra que tenha comparação
  (`page-projects.tsx:125` só renderiza a seção quando o projeto tem
  `comparison` e `before`), e:
  - arrastar o cabo de ponta a ponta e confirmar que a foto revela
    acompanhando, sem travar nem pular;
  - dar Tab até o controle e usar as setas do teclado. **Tem que continuar
    funcionando** — se as setas não moverem nada, o `defaultValue` foi
    aplicado errado;
  - trocar de idioma e voltar, conferindo que o comparador ainda responde.
- **Medição**: DevTools, painel Performance, `CPU: 4x slowdown`, gravar um
  arrasto lento de ponta a ponta antes e depois da mudança. Comparar a taxa de
  quadros das duas gravações e **anotar os dois números no relatório**.
- **Done when**: o arrasto funciona no ponteiro e no teclado, `npm run lint`
  passa, e o relatório traz os dois números medidos — inclusive se forem
  iguais.
