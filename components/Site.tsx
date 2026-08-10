"use client";

import { useEffect, useMemo } from "react";
import { content, Locale, PageKey, projects } from "@/lib/content";
import { Footer, Header } from "./Shell";
import Reveal from "./Reveal";
import ViewTransitions from "./ViewTransitions";
import { CompanyPage } from "./page-company";
import { ContactPage } from "./page-contact";
import { HomePage } from "./page-home";
import { PrivacyPage } from "./page-privacy";
import { ProjectPage, ProjectsPage } from "./page-projects";
import { ServicesPage } from "./page-services";

/**
 * Escolhe a página e monta a casca em volta.
 *
 * Este arquivo tinha 1.200 linhas com 29 componentes — da marca ao
 * formulário de contato. Cada página passou a viver no próprio módulo;
 * o que sobra aqui é o roteamento.
 */

export default function Site({
  locale,
  page,
  projectSlug,
}: {
  locale: Locale;
  page: PageKey;
  projectSlug?: string;
}) {
  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en";
    localStorage.setItem("nivora-locale", locale);
    /* A revelação por rolagem saiu daqui para components/Reveal.tsx. A
       classe `motion-ready` era adicionada logo acima, incondicionalmente:
       num navegador sem `IntersectionObserver` ela escondia a página e nada
       revelava de volta. Agora a trava só entra depois da checagem. */
  }, [locale]);

  const project = useMemo(() => projects.find((item) => item.slug === projectSlug), [projectSlug]);
  return (
    <>
      <ViewTransitions />
      {/* A chave muda a cada navegação: os elementos são outros e precisam
          ser observados de novo. */}
      <Reveal chave={`${locale}/${page}/${projectSlug ?? ""}`} />
      <a className="skip-link" href="#main">{content.shared[locale].skip}</a>
      <Header locale={locale} page={page} projectSlug={projectSlug} />
      <main id="main">
        {page === "home" && <HomePage locale={locale} />}
        {page === "company" && <CompanyPage locale={locale} />}
        {page === "services" && <ServicesPage locale={locale} />}
        {page === "projects" && <ProjectsPage locale={locale} />}
        {page === "project" && project && <ProjectPage locale={locale} project={project} />}
        {page === "contact" && <ContactPage locale={locale} />}
        {page === "privacy" && <PrivacyPage locale={locale} />}
      </main>
      <Footer locale={locale} />
    </>
  );
}
