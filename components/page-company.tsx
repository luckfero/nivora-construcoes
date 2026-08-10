"use client";

import { content, Locale } from "@/lib/content";
import { uiCopy } from "@/lib/ui-copy";
import Picture, { SIZES } from "./Picture";
import { Closing, PageIntro, SectionTitle } from "./ui";

const teamImages = [
  "/images/team-marina-valenca.webp",
  "/images/team-caio-mendonca.webp",
  "/images/team-helena-duarte.webp",
] as const;

/** A empresa: história, princípios e equipe. */

export function CompanyPage({ locale }: { locale: Locale }) {
  const company = content.company[locale];
  const shared = content.shared[locale];
  const close = locale === "pt"
    ? "Construir bem é tornar cada escolha compreensível."
    : locale === "es"
      ? "Construir bien es hacer comprensible cada decisión."
      : "Building well means making every decision understandable.";
  return (
    <>
      <PageIntro code="N/02" eyebrow={company.eyebrow} title={company.title} intro={company.intro} />
      <section className="company-story shell-section">
        <div className="company-story__heading">
          <span>2011 — 2026</span>
          <h2>{company.storyTitle}</h2>
        </div>
        <div className="company-story__chapters">
          {company.story.map((paragraph, index) => (
            <article key={paragraph} data-reveal>
              <span>0{index + 1}</span>
              <p>{paragraph}</p>
            </article>
          ))}
        </div>
      </section>
      {/* `tabIndex` e `role` não são enfeite: a faixa tem `overflow-x: auto`
          e uma lista de 1050px, então em tela estreita parte do conteúdo só
          existe rolando de lado. Sem foco, quem navega por teclado não
          alcança o que está fora — é a regra `scrollable-region-focusable`
          da WCAG, e foi o único achado estrutural da varredura. */}
      <section
        className="timeline-band"
        tabIndex={0}
        role="region"
        aria-label={content.company[locale].timelineLabel}
      >
        <ol>
          {company.timeline.map(([year, label]) => (
            <li key={year}>
              <strong>{year}</strong>
              <span>{label}</span>
            </li>
          ))}
        </ol>
      </section>
      <section className="principles-axis shell-section">
        <SectionTitle index="03" eyebrow="Nívora / 04" title={company.principlesTitle} />
        <div className="principles-axis__list">
          {company.principles.map(([title, text], index) => (
            <article key={title} data-reveal>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="team-dossiers">
        <div className="team-dossiers__intro">
          <p className="technical-label">{uiCopy[locale].team}</p>
          <h2>{company.teamTitle}</h2>
          <p>{shared.conceptual}</p>
        </div>
        <div className="team-dossiers__grid">
          {company.team.map(([name, role], index) => (
            <article key={name}>
              <div className="team-dossiers__monogram">
                <span>0{index + 1}</span>
                <Picture
                  src={teamImages[index]}
                  alt={`${uiCopy[locale].portrait} ${name}`}
                  sizes={SIZES.portrait}
                />
              </div>
              <h3>{name}</h3>
              <p>{role}</p>
            </article>
          ))}
        </div>
      </section>
      <Closing locale={locale} text={close} />
    </>
  );
}
