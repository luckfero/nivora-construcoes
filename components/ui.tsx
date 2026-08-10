"use client";

import Link from "next/link";
import { useState } from "react";
import { content, hrefFor, Locale } from "@/lib/content";
import Picture, { SIZES } from "./Picture";

/**
 * Peças usadas por mais de uma página: ícones, links, títulos de seção e
 * os dois blocos visuais que aparecem tanto na home quanto numa página
 * interna — o comparador antes/depois e o diagrama de atendimento.
 */

export function Logo({ markOnly = false }: { markOnly?: boolean }) {
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

export function Arrow({ direction = "right" }: { direction?: "right" | "down" | "left" }) {
  return (
    <svg className={`arrow arrow--${direction}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function DiagonalArrow() {
  return (
    <svg className="arrow arrow--diagonal" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 16 16 8M9 8h7v7" />
    </svg>
  );
}

export function ButtonLink({
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

export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="inline-link" href={href}>
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}

export function SectionTitle({
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

export function PageIntro({
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

export function Closing({ locale, text }: { locale: Locale; text: string }) {
  return (
    <section className="closing-section">
      <span className="technical-index">07 / 07</span>
      <p className="technical-label">Nívora · {locale.toUpperCase()}</p>
      <h2>{text}</h2>
      <ButtonLink href={hrefFor(locale, "contact")} inverted>{content.shared[locale].cta}</ButtonLink>
    </section>
  );
}

export function BeforeAfter({
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

export function AreaDiagram({ locale }: { locale: Locale }) {
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
