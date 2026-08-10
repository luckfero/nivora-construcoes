"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { content, hrefFor, Locale, PageKey } from "@/lib/content";
import { uiCopy } from "@/lib/ui-copy";
import { Arrow, ButtonLink, Logo } from "./ui";

/** Cabeçalho e rodapé — a moldura que envolve todas as páginas. */

export function Header({
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

export function Footer({ locale }: { locale: Locale }) {
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
