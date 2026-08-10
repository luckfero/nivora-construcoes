"use client";

import { content, hrefFor, Locale } from "@/lib/content";
import { InlineLink, PageIntro } from "./ui";

/** Privacidade e termos. */

export function PrivacyPage({ locale }: { locale: Locale }) {
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
