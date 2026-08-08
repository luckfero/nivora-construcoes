import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nívora Construções — Precisão para construir",
    template: "%s — Nívora Construções",
  },
  description: "Construção, reforma e reabilitação com gestão integral, decisões visíveis e acompanhamento próximo em São Paulo.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  /* Projeto conceitual: empresa, equipe, obras, áreas, anos e indicadores
     são fictícios, e as cidades citadas (São Paulo, Itu, Campinas) são
     reais. Deixar isso indexável coloca uma construtora que não existe nos
     resultados de quem procura construtora nessas cidades — alguém pode
     tentar contratar. O Brasa do Vale já usa `noindex` pelo mesmo motivo;
     esta era a exceção.
     O aviso de projeto conceitual continua visível no rodapé e nas páginas
     de projeto, nas três línguas. */
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Nívora Construções",
    title: "Nívora Construções — Precisão para construir",
    description: "Construção, reforma e reabilitação com gestão integral em São Paulo.",
    images: [{ url: "/images/casa-patio-alto.webp", width: 1823, height: 863, alt: "Casa Pátio Alto" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
