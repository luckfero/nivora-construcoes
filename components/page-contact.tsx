"use client";

import { FormEvent, useRef, useState } from "react";
import { content, Locale } from "@/lib/content";
import { uiCopy } from "@/lib/ui-copy";
import { AreaDiagram, Arrow, DiagonalArrow, PageIntro, SectionTitle } from "./ui";

/** Contato: o pré-diagnóstico em etapas. */

/* O `FormData` do navegador existe e é outra coisa; este tipo local o
   sombreia de propósito — é o formato do pré-diagnóstico. */
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

export function ProjectForm({ locale }: { locale: Locale }) {
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
                  {/* Era o caractere U+2197. O iOS renderiza essa seta na
                      apresentação de emoji — vinha um quadradinho azul no
                      lugar do traço fino do resto do site. Vetor não tem
                      apresentação alternativa. */}
                  <span>{item}<DiagonalArrow /></span>
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

export function ContactPage({ locale }: { locale: Locale }) {
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
