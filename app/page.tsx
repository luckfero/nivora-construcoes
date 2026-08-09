import type { Metadata } from "next";
import Site from "@/components/Site";

/**
 * A raiz serve a mesma home que `/pt` — o mesmo componente, os mesmos
 * bytes, dois endereços. Sem canonical, os dois disputam entre si: o
 * buscador escolhe um por conta própria e divide entre eles o crédito de
 * qualquer link recebido.
 *
 * O canonical aponta para `/pt`, e não para `/`, porque num site em três
 * línguas a versão com o idioma no endereço é a que tem par nas outras
 * duas. `/` é a porta de entrada; `/pt` é o endereço da página.
 *
 * Um redirecionamento 308 de `/` para `/pt` também resolveria, e de forma
 * mais limpa. Fica como opção — o canonical não muda o comportamento de
 * quem visita, e um 308 fica em cache no navegador por muito tempo.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/pt" },
};

export default function Home() {
  return <Site locale="pt" page="home" />;
}
