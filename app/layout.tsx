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
  robots: { index: true, follow: true },
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
