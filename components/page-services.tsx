"use client";

import { useState } from "react";
import { content, hrefFor, Locale } from "@/lib/content";
import { ButtonLink, Closing, PageIntro, SectionTitle } from "./ui";

/** Serviços. `ServiceLayers` mora aqui e é reaproveitado pela home. */

export function ServiceLayers({ locale, full = false }: { locale: Locale; full?: boolean }) {
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

export function ServicesPage({ locale }: { locale: Locale }) {
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
