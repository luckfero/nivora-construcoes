"use client";

import Link from "next/link";
import { useState } from "react";
import { content, hrefFor, Locale, Project, projects } from "@/lib/content";
import { uiCopy } from "@/lib/ui-copy";
import Picture, { SIZES } from "./Picture";
import { Arrow, BeforeAfter, Closing, PageIntro, SectionTitle } from "./ui";

/** Projetos: o diretório e a página de cada obra. */

export function ProjectTile({ project, locale, index }: { project: Project; locale: Locale; index: number }) {
  const shared = content.shared[locale];
  return (
    <article className={`project-tile project-tile--${(index % 4) + 1}`} data-reveal>
      <Link href={hrefFor(locale, "project", project.slug)}>
        <div className="project-tile__image">
          <Picture src={project.image} alt={`${project.name} — ${shared.projectTypes[project.slug]}`} sizes={SIZES.card} />
          <span><Arrow /></span>
        </div>
        <div className="project-tile__meta">
          <span>0{index + 1}</span>
          <div><h2>{project.name}</h2><p>{shared.projectTypes[project.slug]}</p></div>
          <p>{project.city}<br />{project.year} · {project.area}</p>
        </div>
      </Link>
    </article>
  );
}

export function ProjectArchive({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState("all");
  const page = content.projectsPage[locale];
  const shared = content.shared[locale];
  const filtered = filter === "all" ? projects : projects.filter((project) => project.category === filter);
  return (
    <section className="project-archive shell-section">
      <div className="project-filters" aria-label={page.filter}>
        {Object.entries(shared.categories).map(([key, label]) => (
          <button
            key={key}
            className={filter === key ? "is-active" : ""}
            onClick={() => setFilter(key)}
            type="button"
          >
            <span>{label}</span>
            <small>{key === "all" ? projects.length : projects.filter((item) => item.category === key).length}</small>
          </button>
        ))}
      </div>
      <div className="project-archive__grid" aria-live="polite">
        {filtered.map((project, index) => <ProjectTile key={project.slug} project={project} locale={locale} index={index} />)}
      </div>
    </section>
  );
}

export function ProjectsPage({ locale }: { locale: Locale }) {
  const page = content.projectsPage[locale];
  return (
    <>
      <PageIntro code="N/04" eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <ProjectArchive locale={locale} />
      <Closing locale={locale} text={content.home[locale].closing} />
    </>
  );
}

export function ProjectPage({ locale, project }: { locale: Locale; project: Project }) {
  const shared = content.shared[locale];
  const labels = content.projectLabels[locale];
  const copy = content.projectCopy[locale][project.slug];
  const ui = uiCopy[locale];
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(currentIndex + 1) % projects.length];
  const place = locale === "en" ? "Place" : locale === "es" ? "Lugar" : "Local";
  const year = locale === "en" ? "Year" : locale === "es" ? "Año" : "Ano";
  const area = locale === "en" ? "Area" : locale === "es" ? "Superficie" : "Área";
  return (
    <>
      <section className="case-hero">
        <div className="case-hero__title">
          <p className="technical-label">{shared.projectTypes[project.slug]}</p>
          <h1>{project.name}</h1>
          <p>{copy.summary}</p>
        </div>
        <div className="case-hero__image">
          <Picture src={project.image} alt={`${project.name} — ${shared.projectTypes[project.slug]}`} sizes={SIZES.feature} priority />
          <span className="coordinate">{project.city} / SP</span>
        </div>
        <dl aria-label={ui.details}>
          <div><dt>{place}</dt><dd>{project.city}</dd></div>
          <div><dt>{year}</dt><dd>{project.year}</dd></div>
          <div><dt>{area}</dt><dd>{project.area}</dd></div>
          <div><dt>ID</dt><dd>N/{String(currentIndex + 1).padStart(2, "0")}</dd></div>
        </dl>
      </section>
      <section className="case-narrative shell-section">
        <div className="case-narrative__lead">
          <span>{labels.overview}</span>
          <p>{copy.summary}</p>
          <small>{labels.conceptual}</small>
        </div>
        <div className="case-narrative__decisions">
          <article><span>01</span><h2>{labels.challenge}</h2><p>{copy.challenge}</p></article>
          <article><span>02</span><h2>{labels.solution}</h2><p>{copy.solution}</p></article>
        </div>
      </section>
      <section className="case-gallery" aria-label={`${ui.gallery}: ${project.name}`}>
        {project.gallery.map((image, index) => (
          <figure key={image}>
            <Picture src={image} alt={`${project.name} — ${ui.projectImage} ${index + 1}`} sizes={SIZES.half} priority={index === 0} />
            <figcaption>{project.name} / {String(index + 1).padStart(2, "0")}</figcaption>
          </figure>
        ))}
      </section>
      <section className="materials-board shell-section">
        <SectionTitle index="03" eyebrow={`Nívora / ${project.area}`} title={labels.materials} />
        <ol>
          {copy.materials.map((material, index) => (
            <li key={material}><span>0{index + 1}</span><strong>{material}</strong></li>
          ))}
        </ol>
      </section>
      {project.comparison && project.before && (
        <section className="case-comparison">
          <div>
            <p className="technical-label">{labels.comparison}</p>
            <h2>{project.name}</h2>
            <p>{labels.drag}</p>
          </div>
          <BeforeAfter before={project.before} after={project.image} name={project.name} locale={locale} />
        </section>
      )}
      <section className="next-case">
        <p className="technical-label">{labels.next}</p>
        <Link href={hrefFor(locale, "project", next.slug)}>
          <span>{next.name}</span>
          <Arrow />
        </Link>
      </section>
    </>
  );
}

