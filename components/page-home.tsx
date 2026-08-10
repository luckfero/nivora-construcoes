"use client";

import Link from "next/link";
import { useState } from "react";
import { content, hrefFor, Locale, projects } from "@/lib/content";
import { uiCopy } from "@/lib/ui-copy";
import Picture, { SIZES } from "./Picture";
import { AreaDiagram, Arrow, BeforeAfter, ButtonLink, Closing, InlineLink, SectionTitle } from "./ui";
import { ServiceLayers } from "./page-services";

/** Home: as seções que só existem nela, e a composição final. */

export function HomeHero({ locale }: { locale: Locale }) {
  const home = content.home[locale];
  const shared = content.shared[locale];
  const ui = uiCopy[locale];
  return (
    <section className="home-hero">
      <div className="home-hero__grid">
        <div className="home-hero__copy">
          <p className="technical-label">{home.eyebrow}</p>
          <h1>
            <span>{home.titleA}</span>
            <em>{home.titleB}</em>
          </h1>
          <p className="home-hero__lead">{home.lead}</p>
          <div className="home-hero__actions">
            <ButtonLink href={hrefFor(locale, "contact")}>{shared.cta}</ButtonLink>
            <InlineLink href={hrefFor(locale, "projects")}>{shared.nav.projects}</InlineLink>
          </div>
        </div>
        <div className="home-hero__visual">
          <div className="home-hero__image">
            <Picture src="/images/casa-patio-alto.webp" alt={ui.projectImage} sizes={SIZES.hero} priority />
          </div>
          <span className="coordinate coordinate--top">23°16&apos;S / 47°17&apos;W</span>
          <span className="coordinate coordinate--side">N/01 · 2025</span>
          <div className="home-hero__caption">
            <span>01</span>
            <div>
              <strong>Casa Pátio Alto</strong>
              <small>Itu · 540 m²</small>
            </div>
          </div>
        </div>
      </div>
      <div className="home-hero__specs" aria-label={ui.stats}>
        <p>{home.heroMeta}</p>
        {home.stats.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProjectObservatory({ locale }: { locale: Locale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const home = content.home[locale];
  const shared = content.shared[locale];
  const ui = uiCopy[locale];
  const active = projects[activeIndex];
  return (
    <section className="project-observatory shell-section">
      <SectionTitle
        index="02"
        eyebrow={home.portfolioEyebrow}
        title={home.portfolioTitle}
        text={home.portfolioText}
      />
      <div className="project-observatory__body">
        <Link
          className="project-observatory__media"
          href={hrefFor(locale, "project", active.slug)}
          aria-label={`${ui.openProject}: ${active.name}`}
        >
          <Picture key={active.image} src={active.image} alt={`${active.name} — ${shared.projectTypes[active.slug]}`} sizes={SIZES.feature} />
          <div className="project-observatory__stamp">
            <span>{ui.featured}</span>
            <strong>{active.name}</strong>
            <small>{active.city} · {active.year} · {active.area}</small>
          </div>
          <span className="project-observatory__open"><Arrow /></span>
        </Link>
        <ol className="project-directory" aria-label={ui.directory}>
          {projects.map((project, index) => (
            <li key={project.slug} className={index === activeIndex ? "is-active" : ""}>
              <Link
                href={hrefFor(locale, "project", project.slug)}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
              >
                <span>0{index + 1}</span>
                <div>
                  <strong>{project.name}</strong>
                  <small>{shared.projectTypes[project.slug]}</small>
                </div>
                <p>{project.city} · {project.year}</p>
                <Arrow />
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <div className="section-outro">
        <InlineLink href={hrefFor(locale, "projects")}>{shared.allProjects}</InlineLink>
      </div>
    </section>
  );
}

export function ProcessBlueprint({ locale }: { locale: Locale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const home = content.home[locale];
  const steps = content.process[locale];
  const active = steps[activeIndex];
  return (
    <section className="process-blueprint shell-section">
      <SectionTitle index="04" eyebrow={home.processEyebrow} title={home.processTitle} text={home.processText} />
      <div className="process-blueprint__layout">
        <div className="process-blueprint__stage" aria-live="polite">
          <span>{active[0]}</span>
          <h3>{active[1]}</h3>
          <p>{active[2]}</p>
          <div aria-hidden="true"><i /><i /><i /></div>
        </div>
        <ol className="process-blueprint__rail">
          {steps.map(([number, title], index) => (
            <li key={number}>
              <button
                type="button"
                className={index === activeIndex ? "is-active" : ""}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              >
                <span>{number}</span>
                <strong>{title}</strong>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function TransformationLab({ locale }: { locale: Locale }) {
  const home = content.home[locale];
  const shared = content.shared[locale];
  return (
    <section className="transformation-lab">
      <div className="transformation-lab__copy">
        <span className="technical-index">05 / 07</span>
        <p className="technical-label">{home.transformationEyebrow}</p>
        <h2>{home.transformationTitle}</h2>
        <p>{home.transformationText}</p>
        <InlineLink href={hrefFor(locale, "project", "residencia-horizonte")}>{shared.viewProject}</InlineLink>
      </div>
      <BeforeAfter
        before="/images/residencia-horizonte-before.webp"
        after="/images/residencia-horizonte-after.webp"
        name="Residência Horizonte"
        locale={locale}
      />
    </section>
  );
}

export function AreaSection({ locale }: { locale: Locale }) {
  const home = content.home[locale];
  const shared = content.shared[locale];
  return (
    <section className="area-section shell-section">
      <div className="area-section__copy">
        <SectionTitle index="06" eyebrow={home.areaEyebrow} title={home.areaTitle} text={home.areaText} />
        <ButtonLink href={hrefFor(locale, "contact")}>{shared.cta}</ButtonLink>
      </div>
      <AreaDiagram locale={locale} />
    </section>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <HomeHero locale={locale} />
      <ProjectObservatory locale={locale} />
      <ServiceLayers locale={locale} />
      <ProcessBlueprint locale={locale} />
      <TransformationLab locale={locale} />
      <AreaSection locale={locale} />
      <Closing locale={locale} text={content.home[locale].closing} />
    </>
  );
}
