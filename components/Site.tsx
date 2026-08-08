"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { content, hrefFor, Locale, PageKey, Project, projects } from "@/lib/content";
import Picture, { SIZES } from "./Picture";
import ViewTransitions from "./ViewTransitions";

const uiCopy = {
  pt: {
    home: "início",
    nav: "Navegação principal",
    mobileNav: "Navegação móvel",
    footer: "Rodapé",
    stats: "Indicadores conceituais",
    featured: "Projeto em foco",
    directory: "Diretório de projetos",
    projectImage: "Imagem do projeto",
    gallery: "Galeria do projeto",
    team: "Equipe",
    portrait: "Retrato de",
    openProject: "Abrir projeto",
    details: "Ficha da obra",
    areaExample: "Ex.: 280 m²",
    startExample: "Ex.: março de 2027",
  },
  es: {
    home: "inicio",
    nav: "Navegación principal",
    mobileNav: "Navegación móvil",
    footer: "Pie de página",
    stats: "Indicadores conceptuales",
    featured: "Proyecto destacado",
    directory: "Directorio de proyectos",
    projectImage: "Imagen del proyecto",
    gallery: "Galería del proyecto",
    team: "Equipo",
    portrait: "Retrato de",
    openProject: "Abrir proyecto",
    details: "Ficha de obra",
    areaExample: "Ej.: 280 m²",
    startExample: "Ej.: marzo de 2027",
  },
  en: {
    home: "home",
    nav: "Primary navigation",
    mobileNav: "Mobile navigation",
    footer: "Footer",
    stats: "Conceptual indicators",
    featured: "Featured project",
    directory: "Project directory",
    projectImage: "Project image",
    gallery: "Project gallery",
    team: "Team",
    portrait: "Portrait of",
    openProject: "Open project",
    details: "Project details",
    areaExample: "E.g. 280 m²",
    startExample: "E.g. March 2027",
  },
} as const;

const teamImages = [
  "/images/team-marina-valenca.webp",
  "/images/team-caio-mendonca.webp",
  "/images/team-helena-duarte.webp",
] as const;

function Logo({ markOnly = false }: { markOnly?: boolean }) {
  return (
    <span className={`brand ${markOnly ? "brand--mark-only" : ""}`}>
      <svg className="brand__mark" viewBox="0 0 52 52" aria-hidden="true">
        <path d="M7 43V9l19 20V9l19 34V9" />
        <path d="M7 43h38" />
        <path d="M26 29 45 9" />
      </svg>
      {!markOnly && (
        <span className="brand__type">
          <strong>Nívora</strong>
          <small>Construções</small>
        </span>
      )}
    </span>
  );
}

function Arrow({ direction = "right" }: { direction?: "right" | "down" | "left" }) {
  return (
    <svg className={`arrow arrow--${direction}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

function ButtonLink({
  href,
  children,
  inverted = false,
}: {
  href: string;
  children: React.ReactNode;
  inverted?: boolean;
}) {
  return (
    <Link className={`action-link ${inverted ? "action-link--inverted" : ""}`} href={href}>
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}

function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="inline-link" href={href}>
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}

function Header({
  locale,
  page,
  projectSlug,
}: {
  locale: Locale;
  page: PageKey;
  projectSlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const shared = content.shared[locale];
  const ui = uiCopy[locale];
  const items: Array<["projects" | "services" | "company" | "contact", string]> = [
    ["projects", shared.nav.projects],
    ["services", shared.nav.services],
    ["company", shared.nav.company],
    ["contact", shared.nav.contact],
  ];

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-grid">
        <Link className="header-brand" href={hrefFor(locale, "home")} aria-label={`Nívora Construções — ${ui.home}`}>
          <Logo />
        </Link>
        <nav className="desktop-nav" aria-label={ui.nav}>
          {items.map(([key, label], index) => (
            <Link key={key} className={page === key ? "is-active" : ""} href={hrefFor(locale, key)}>
              <small>0{index + 1}</small>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="header-tools">
          <div className="language-switch" aria-label={shared.language}>
            {(["pt", "es", "en"] as Locale[]).map((item) => (
              <Link
                key={item}
                className={item === locale ? "is-active" : ""}
                href={hrefFor(item, page, projectSlug)}
                hrefLang={item}
                lang={item}
                aria-current={item === locale ? "page" : undefined}
              >
                {item.toUpperCase()}
              </Link>
            ))}
          </div>
          <Link className="header-cta" href={hrefFor(locale, "contact")}>
            {shared.cta}
            <Arrow />
          </Link>
          <button
            className={`menu-toggle ${open ? "is-open" : ""}`}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? shared.close : shared.menu}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <div id="mobile-navigation" className={`mobile-nav ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label={ui.mobileNav}>
          {items.map(([key, label], index) => (
            <Link
              key={key}
              href={hrefFor(locale, key)}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              <small>0{index + 1}</small>
              <span>{label}</span>
              <Arrow />
            </Link>
          ))}
        </nav>
        <div className="mobile-nav__footer">
          <p>{shared.footerLine}</p>
          <div className="language-switch" aria-label={shared.language}>
            {(["pt", "es", "en"] as Locale[]).map((item) => (
              <Link
                key={item}
                className={item === locale ? "is-active" : ""}
                href={hrefFor(item, page, projectSlug)}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                {item.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer({ locale }: { locale: Locale }) {
  const shared = content.shared[locale];
  const ui = uiCopy[locale];
  return (
    <footer className="site-footer">
      <div className="footer-statement">
        <Logo />
        <p>{shared.footerLine}</p>
        <ButtonLink href={hrefFor(locale, "contact")} inverted>
          {shared.cta}
        </ButtonLink>
      </div>
      <div className="footer-grid">
        <nav aria-label={ui.footer}>
          <Link href={hrefFor(locale, "projects")}>{shared.nav.projects}</Link>
          <Link href={hrefFor(locale, "services")}>{shared.nav.services}</Link>
          <Link href={hrefFor(locale, "company")}>{shared.nav.company}</Link>
          <Link href={hrefFor(locale, "contact")}>{shared.nav.contact}</Link>
        </nav>
        <p className="concept-note">{shared.conceptual}</p>
        <div>
          <p>© 2026 Nívora Construções</p>
          <Link href={hrefFor(locale, "privacy")}>{shared.privacy}</Link>
        </div>
      </div>
    </footer>
  );
}

function SectionTitle({
  index,
  eyebrow,
  title,
  text,
  light = false,
}: {
  index: string;
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
}) {
  return (
    <div className={`section-title ${light ? "section-title--light" : ""}`} data-reveal>
      <div className="section-title__rail">
        <span>{index}</span>
        <p>{eyebrow}</p>
      </div>
      <div className="section-title__copy">
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
    </div>
  );
}

function HomeHero({ locale }: { locale: Locale }) {
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
        <small>* {shared.conceptual}</small>
      </div>
    </section>
  );
}

function ProjectObservatory({ locale }: { locale: Locale }) {
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

function ServiceLayers({ locale, full = false }: { locale: Locale; full?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const home = content.home[locale];
  const services = content.services[locale];
  const shared = content.shared[locale];
  const list = full ? services.list : services.list.slice(0, 5);
  const active = list[activeIndex] ?? list[0];
  return (
    <section className={`service-layers ${full ? "service-layers--full" : ""}`}>
      {!full && (
        <SectionTitle
          index="03"
          eyebrow={home.managementEyebrow}
          title={home.managementTitle}
          text={home.managementText}
          light
        />
      )}
      <div className="service-layers__board">
        <div className="service-layers__active" aria-live="polite">
          <span>{active[0]}</span>
          <h2>{active[1]}</h2>
          <p>{active[2]}</p>
          <div className="service-layers__drawing" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <ol className="service-layers__list">
          {list.map(([number, title], index) => (
            <li key={number}>
              <button
                className={activeIndex === index ? "is-active" : ""}
                type="button"
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span>{number}</span>
                <strong>{title}</strong>
                <i aria-hidden="true">+</i>
              </button>
            </li>
          ))}
        </ol>
      </div>
      {!full && (
        <div className="service-layers__link">
          <ButtonLink href={hrefFor(locale, "services")} inverted>{shared.nav.services}</ButtonLink>
        </div>
      )}
    </section>
  );
}

function ProcessBlueprint({ locale }: { locale: Locale }) {
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

function BeforeAfter({
  before,
  after,
  name,
  locale,
}: {
  before: string;
  after: string;
  name: string;
  locale: Locale;
}) {
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
}

function TransformationLab({ locale }: { locale: Locale }) {
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

function AreaDiagram({ locale }: { locale: Locale }) {
  const diagramCopy = {
    pt: {
      title: "Cartografia operacional",
      status: "Cobertura técnica · SP",
      primary: "Núcleo metropolitano",
      primaryDetail: "Atendimento prioritário",
      regional: "Eixos regionais",
      regionalDetail: "Campinas, Sorocaba, Jundiaí e São Roque",
      conditional: "Litoral",
      conditionalDetail: "Atendimento após análise logística",
      schematic: "Diagrama esquemático · sem escala",
    },
    es: {
      title: "Cartografía operativa",
      status: "Cobertura técnica · SP",
      primary: "Núcleo metropolitano",
      primaryDetail: "Atención prioritaria",
      regional: "Ejes regionales",
      regionalDetail: "Campinas, Sorocaba, Jundiaí y São Roque",
      conditional: "Litoral",
      conditionalDetail: "Atención tras análisis logístico",
      schematic: "Diagrama esquemático · sin escala",
    },
    en: {
      title: "Operational mapping",
      status: "Technical coverage · SP",
      primary: "Metropolitan core",
      primaryDetail: "Priority service area",
      regional: "Regional corridors",
      regionalDetail: "Campinas, Sorocaba, Jundiaí and São Roque",
      conditional: "Coast",
      conditionalDetail: "Subject to a logistics review",
      schematic: "Schematic diagram · not to scale",
    },
  }[locale];

  const cities = [
    { name: "Campinas", x: 457, y: 182, type: "regional" },
    { name: "Jundiaí", x: 479, y: 226, type: "regional" },
    { name: "Sorocaba", x: 368, y: 281, type: "regional" },
    { name: "São Roque", x: 426, y: 294, type: "regional" },
    { name: "São Paulo", x: 510, y: 290, type: "primary" },
    { name: locale === "en" ? "Coast" : "Litoral", x: 574, y: 350, type: "conditional" },
  ];

  return (
    <figure className="area-diagram" aria-label={content.home[locale].areaText}>
      <div className="area-diagram__header">
        <div>
          <span>NÍVORA / SP–01</span>
          <strong>{diagramCopy.title}</strong>
        </div>
        <small>{diagramCopy.status}</small>
      </div>
      <div className="area-diagram__canvas">
        <svg viewBox="0 0 720 470" aria-hidden="true">
          <defs>
            <pattern id={`map-grid-${locale}`} width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0H0V24" />
            </pattern>
            <linearGradient id={`map-fill-${locale}`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity=".03" />
              <stop offset="1" stopColor="currentColor" stopOpacity=".12" />
            </linearGradient>
          </defs>
          <rect className="area-diagram__grid" x="1" y="1" width="718" height="468" fill={`url(#map-grid-${locale})`} />
          <path
            className="area-diagram__shape"
            fill={`url(#map-fill-${locale})`}
            d="M65 188 93 132 156 99 230 79 301 89 362 76 425 97 481 82 545 104 590 137 641 157 668 197 650 235 629 268 592 288 574 326 539 361 497 384 461 416 410 431 362 418 318 392 275 387 239 356 194 341 160 312 111 294 83 253 64 218Z"
          />
          <path className="area-diagram__coast" d="M410 431c41-10 72-28 94-51 29-15 50-34 70-54 8-15 11-27 18-38" />
          <ellipse className="area-diagram__coverage area-diagram__coverage--outer" cx="510" cy="290" rx="92" ry="72" />
          <ellipse className="area-diagram__coverage area-diagram__coverage--inner" cx="510" cy="290" rx="47" ry="38" />
          <g className="area-diagram__routes">
            <path d="M510 290C487 255 470 220 457 182" />
            <path d="M510 290C501 270 489 247 479 226" />
            <path d="M510 290C466 286 417 282 368 281" />
            <path d="M510 290C480 291 452 292 426 294" />
            <path d="M510 290C534 309 553 328 574 350" />
          </g>
          <g className="area-diagram__reference">
            <path d="M77 360H267" />
            <path d="M77 360v-7M125 360v-7M173 360v-7M221 360v-7M267 360v-7" />
            <text x="77" y="379">OESTE</text>
            <text x="229" y="379">LESTE</text>
          </g>
          {cities.map(({ name, x, y, type }) => (
            <g className={`area-diagram__node area-diagram__node--${type}`} key={name}>
              {type === "primary" && <circle className="area-diagram__pulse" cx={x} cy={y} r="18" />}
              <circle cx={x} cy={y} r={type === "primary" ? 7 : 4.5} />
              <path d={`M${x + 8} ${y - 8}h18`} />
              <text x={x + 30} y={y - 5}>{name}</text>
            </g>
          ))}
          <g className="area-diagram__compass" transform="translate(646 62)">
            <path d="M0 42 13 0l13 42-13-8Z" />
            <text x="9" y="-9">N</text>
          </g>
        </svg>
        <span className="coordinate">SP / BR · 23°33&apos;S · 46°38&apos;O</span>
      </div>
      <figcaption className="area-diagram__legend">
        <div>
          <i className="area-diagram__key area-diagram__key--primary" />
          <p><strong>{diagramCopy.primary}</strong><span>{diagramCopy.primaryDetail}</span></p>
        </div>
        <div>
          <i className="area-diagram__key area-diagram__key--regional" />
          <p><strong>{diagramCopy.regional}</strong><span>{diagramCopy.regionalDetail}</span></p>
        </div>
        <div>
          <i className="area-diagram__key area-diagram__key--conditional" />
          <p><strong>{diagramCopy.conditional}</strong><span>{diagramCopy.conditionalDetail}</span></p>
        </div>
        <small>{diagramCopy.schematic}</small>
      </figcaption>
    </figure>
  );
}

function AreaSection({ locale }: { locale: Locale }) {
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

function Closing({ locale, text }: { locale: Locale; text: string }) {
  return (
    <section className="closing-section">
      <span className="technical-index">07 / 07</span>
      <p className="technical-label">Nívora · {locale.toUpperCase()}</p>
      <h2>{text}</h2>
      <ButtonLink href={hrefFor(locale, "contact")} inverted>{content.shared[locale].cta}</ButtonLink>
    </section>
  );
}

function HomePage({ locale }: { locale: Locale }) {
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

function PageIntro({
  code,
  eyebrow,
  title,
  intro,
}: {
  code: string;
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="page-intro">
      <div className="page-intro__code" aria-hidden="true">{code}</div>
      <p className="technical-label">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-intro__text">{intro}</p>
      <div className="page-intro__axis" aria-hidden="true"><i /><i /><i /></div>
    </section>
  );
}

function CompanyPage({ locale }: { locale: Locale }) {
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
      <section className="timeline-band">
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

function ServicesPage({ locale }: { locale: Locale }) {
  const services = content.services[locale];
  return (
    <>
      <PageIntro code="N/03" eyebrow={services.eyebrow} title={services.title} intro={services.intro} />
      <ServiceLayers locale={locale} full />
      <section className="service-method shell-section">
        <div className="service-method__drawing" aria-hidden="true"><i /><i /><i /><i /></div>
        <div>
          <SectionTitle index="09" eyebrow="Nívora / Management" title={services.detailTitle} />
          <ul>
            {services.detail.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
          </ul>
        </div>
      </section>
      <Closing locale={locale} text={content.home[locale].closing} />
    </>
  );
}

function ProjectTile({ project, locale, index }: { project: Project; locale: Locale; index: number }) {
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

function ProjectArchive({ locale }: { locale: Locale }) {
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

function ProjectsPage({ locale }: { locale: Locale }) {
  const page = content.projectsPage[locale];
  return (
    <>
      <PageIntro code="N/04" eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <ProjectArchive locale={locale} />
      <Closing locale={locale} text={content.home[locale].closing} />
    </>
  );
}

function ProjectPage({ locale, project }: { locale: Locale; project: Project }) {
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

type FormData = {
  type: string;
  city: string;
  property: string;
  area: string;
  stage: string;
  start: string;
  budget: string;
  details: string;
  name: string;
  email: string;
  phone: string;
  consent: boolean;
};

const initialForm: FormData = {
  type: "",
  city: "",
  property: "",
  area: "",
  stage: "",
  start: "",
  budget: "",
  details: "",
  name: "",
  email: "",
  phone: "",
  consent: false,
};

function ProjectForm({ locale }: { locale: Locale }) {
  const copy = content.contact[locale];
  const ui = uiCopy[locale];
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialForm);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const update = (key: keyof FormData, value: string | boolean) => setData((current) => ({ ...current, [key]: value }));
  const valid = () => {
    if (step === 0) return Boolean(data.type);
    if (step === 1) return Boolean(data.city && data.property && data.area);
    if (step === 2) return Boolean(data.stage && data.start && data.details);
    return Boolean(data.name && /^\S+@\S+\.\S+$/.test(data.email) && data.consent);
  };
  const advance = () => {
    if (!valid()) {
      setError(copy.required);
      return;
    }
    setError("");
    if (step < 3) setStep(step + 1);
    else setComplete(true);
    requestAnimationFrame(() => headingRef.current?.focus());
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    advance();
  };

  if (complete) {
    return (
      <div className="form-success" role="status">
        <span aria-hidden="true">04 / 04</span>
        <h2 tabIndex={-1} ref={headingRef}>{copy.successTitle}</h2>
        <p>{copy.successText}</p>
        <button type="button" onClick={() => { setData(initialForm); setStep(0); setComplete(false); }}>
          {copy.restart}<Arrow />
        </button>
      </div>
    );
  }

  return (
    <form className="project-form" onSubmit={submit} noValidate>
      <div className="form-progress">
        <p>{String(step + 1).padStart(2, "0")} / 04</p>
        <ol>
          {copy.steps.map((label, index) => (
            <li key={label} className={index <= step ? "is-active" : ""}>
              <span>{index + 1}</span>{label}
            </li>
          ))}
        </ol>
      </div>
      <div className="form-panel">
        {step === 0 && (
          <fieldset>
            <legend>{copy.typeQ}</legend>
            <div className="choice-grid">
              {copy.types.map((item) => (
                <label key={item}>
                  <input type="radio" name="type" value={item} checked={data.type === item} onChange={() => update("type", item)} />
                  <span>{item}<i>↗</i></span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {step === 1 && (
          <fieldset>
            <legend>{copy.propertyQ}</legend>
            <div className="field-grid">
              <label>{copy.city}<input value={data.city} onChange={(event) => update("city", event.target.value)} required /></label>
              <label>{copy.property}<select value={data.property} onChange={(event) => update("property", event.target.value)} required><option value="">—</option>{copy.propertyOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
              <label>{copy.area}<input value={data.area} onChange={(event) => update("area", event.target.value)} placeholder={ui.areaExample} required /></label>
            </div>
          </fieldset>
        )}
        {step === 2 && (
          <fieldset>
            <legend>{copy.stageQ}</legend>
            <div className="field-grid">
              <label>{copy.stage}<select value={data.stage} onChange={(event) => update("stage", event.target.value)} required><option value="">—</option>{copy.stages.map((option) => <option key={option}>{option}</option>)}</select></label>
              <label>{copy.start}<input value={data.start} onChange={(event) => update("start", event.target.value)} placeholder={ui.startExample} required /></label>
              <label>{copy.budget}<select value={data.budget} onChange={(event) => update("budget", event.target.value)}><option value="">—</option>{copy.budgetOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
              <label className="field-wide">{copy.details}<textarea value={data.details} onChange={(event) => update("details", event.target.value)} placeholder={copy.detailsHint} required /></label>
            </div>
          </fieldset>
        )}
        {step === 3 && (
          <fieldset>
            <legend>{copy.review}</legend>
            <div className="form-review">
              <dl>
                <div><dt>{copy.steps[0]}</dt><dd>{data.type}</dd></div>
                <div><dt>{copy.city}</dt><dd>{data.city}</dd></div>
                <div><dt>{copy.property}</dt><dd>{data.property} · {data.area}</dd></div>
                <div><dt>{copy.stage}</dt><dd>{data.stage} · {data.start}</dd></div>
              </dl>
              <button type="button" onClick={() => setStep(0)}>{copy.edit}</button>
            </div>
            <div className="field-grid">
              <label>{copy.name}<input value={data.name} onChange={(event) => update("name", event.target.value)} required /></label>
              <label>{copy.email}<input type="email" value={data.email} onChange={(event) => update("email", event.target.value)} required /></label>
              <label>{copy.phone}<input type="tel" value={data.phone} onChange={(event) => update("phone", event.target.value)} /></label>
              <label className="consent field-wide"><input type="checkbox" checked={data.consent} onChange={(event) => update("consent", event.target.checked)} /><span>{copy.consent}</span></label>
            </div>
          </fieldset>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions">
          {step > 0 && <button className="form-back" type="button" onClick={() => { setStep(step - 1); setError(""); }}><Arrow direction="left" />{copy.back}</button>}
          <button className="form-next" type="submit">{step === 3 ? copy.finish : copy.next}<Arrow /></button>
        </div>
      </div>
    </form>
  );
}

function ContactPage({ locale }: { locale: Locale }) {
  const copy = content.contact[locale];
  return (
    <>
      <PageIntro code="N/05" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
      <section className="brief-builder">
        <div className="demo-notice"><span>i</span><p>{copy.demo}</p></div>
        <ProjectForm locale={locale} />
      </section>
      <section className="contact-map shell-section">
        <div>
          <SectionTitle index="05" eyebrow="São Paulo / Brasil" title={copy.areaTitle} text={copy.areaText} />
          <div className="contact-email"><span>{copy.emailLabel}</span><strong>projetos.nivora@example.com</strong></div>
        </div>
        <AreaDiagram locale={locale} />
      </section>
      <section className="faq-section">
        <div className="faq-section__heading">
          <p className="technical-label">FAQ / 04</p>
          <h2>{copy.faqTitle}</h2>
        </div>
        <div className="faq-list">
          {copy.faq.map(([question, answer], index) => (
            <details key={question}>
              <summary><span>0{index + 1}</span>{question}<i>+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

function PrivacyPage({ locale }: { locale: Locale }) {
  const privacy = content.privacy[locale];
  return (
    <>
      <PageIntro code="N/06" eyebrow={privacy.eyebrow} title={privacy.title} intro={privacy.intro} />
      <section className="privacy-ledger shell-section">
        <p>{privacy.updated}</p>
        <div>
          {privacy.sections.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <InlineLink href={hrefFor(locale, "home")}>{privacy.back}</InlineLink>
      </section>
    </>
  );
}

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
    document.documentElement.classList.add("motion-ready");
    localStorage.setItem("nivora-locale", locale);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [locale, page, projectSlug]);

  const project = useMemo(() => projects.find((item) => item.slug === projectSlug), [projectSlug]);
  return (
    <>
      <ViewTransitions />
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
