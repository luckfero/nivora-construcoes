"use client";

import { useEffect } from "react";

/**
 * Revelação por rolagem.
 *
 * A regra que organiza tudo aqui: **animação nunca pode custar conteúdo**.
 * O CSS só esconde depois que a classe de trava entra, e ela só entra
 * quando já se sabe que dá para revelar de volta. Três proteções, nessa
 * ordem:
 *
 *  1. Sem `IntersectionObserver`, a trava nunca é aplicada — a página fica
 *     visível e estática. Antes, `motion-ready` era adicionada sempre: num
 *     navegador sem suporte o site inteiro sumia.
 *  2. Sem JavaScript, o efeito não roda e a trava também não entra.
 *  3. Se o observer não responder em 1 segundo, tudo é revelado e ele é
 *     descartado. Um observer saudável responde quase de imediato;
 *     silêncio significa ambiente que não entrega esses eventos — aba que
 *     nunca pintou, webview embutida, pré-renderização.
 *
 * A terceira não é hipótese: foi observada em teste, onde nenhum callback
 * chegava e a página ficava em branco.
 */

/** Onde a trava é aplicada e o que ela esconde — combina com globals.css. */
const CLASSE_TRAVA = "motion-ready";
const CLASSE_VISIVEL = "is-visible";
const SELETOR = "[data-reveal]";

/** Tempo até desistir do observer e mostrar tudo. */
const LIMITE_MS = 1000;

export default function Reveal({ chave }: { chave: string }) {
  useEffect(() => {
    const alvos = Array.from(document.querySelectorAll<HTMLElement>(SELETOR));
    if (alvos.length === 0) return;

    const mostrarTudo = () => alvos.forEach((el) => el.classList.add(CLASSE_VISIVEL));

    /* Sem suporte não há como revelar de volta: melhor nunca esconder. */
    if (typeof IntersectionObserver === "undefined") {
      mostrarTudo();
      return;
    }

    const raiz = document.documentElement;
    raiz.classList.add(CLASSE_TRAVA);

    let respondeu = false;
    const observer = new IntersectionObserver(
      (entries) => {
        respondeu = true;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add(CLASSE_VISIVEL);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    alvos.forEach((el) => observer.observe(el));

    const rede = window.setTimeout(() => {
      if (respondeu) return;
      mostrarTudo();
      observer.disconnect();
    }, LIMITE_MS);

    return () => {
      window.clearTimeout(rede);
      observer.disconnect();
    };
    /* `chave` muda a cada navegação: os elementos são outros e precisam ser
       observados de novo. */
  }, [chave]);

  return null;
}
