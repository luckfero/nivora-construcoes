"use client";

import { useEffect, useRef } from "react";

/**
 * Indicador de posição na rolagem.
 *
 * Substitui a barra nativa, que foi ocultada. A barra do sistema não dá o
 * que se quer aqui: não há como pedir que ela apareça só durante a rolagem,
 * nem que ocupe zero espaço de layout.
 *
 * O que este indicador mostra é o mesmo que um polegar de barra: **onde** a
 * página está e **quanto** dela cabe na tela — a altura dele é a proporção
 * entre a janela e o documento. Não há trilho: sem o sulco atrás, o que
 * sobra é só a marca.
 *
 * Decisões que valem registro:
 *
 *  - `position: fixed` e `pointer-events: none`. Ele flutua sobre o
 *    conteúdo, então não empurra nada, e nunca intercepta um clique.
 *  - Não é arrastável, de propósito. Arrastar exigiria capturar o ponteiro,
 *    e aí ele deixaria de ser um indicador para virar um controle que
 *    compete com a rolagem normal.
 *  - `aria-hidden`. Para quem usa leitor de tela isto é ruído: a posição no
 *    documento já é anunciada pela própria navegação.
 *  - A posição é escrita em `transform`, não em `top`. Só a primeira roda no
 *    compositor; a outra recalcula layout a cada quadro de rolagem.
 */

/** Enquanto a rolagem não para, o indicador fica visível. */
const OCIOSO_MS = 900;

/** Abaixo disto o polegar vira um ponto e perde a leitura de proporção. */
const ALTURA_MINIMA = 28;

export default function ScrollIndicator() {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const polegarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trilho = trilhoRef.current;
    const polegar = polegarRef.current;
    if (!trilho || !polegar) return;

    let quadro = 0;
    let ocioso = 0;

    const desenhar = () => {
      quadro = 0;
      const alturaJanela = window.innerHeight;
      const alturaDoc = document.documentElement.scrollHeight;
      const rolavel = alturaDoc - alturaJanela;

      /* Página que cabe na tela não tem o que indicar. */
      if (rolavel <= 4) {
        trilho.dataset.ativo = "nao";
        return;
      }

      const alturaTrilho = trilho.clientHeight;
      const altura = Math.max(ALTURA_MINIMA, (alturaJanela / alturaDoc) * alturaTrilho);
      const progresso = Math.min(1, Math.max(0, window.scrollY / rolavel));
      const deslocamento = progresso * (alturaTrilho - altura);

      polegar.style.height = `${altura}px`;
      polegar.style.transform = `translate3d(0, ${deslocamento}px, 0)`;
    };

    const aoRolar = () => {
      trilho.dataset.ativo = "sim";
      if (!quadro) quadro = window.requestAnimationFrame(desenhar);
      window.clearTimeout(ocioso);
      ocioso = window.setTimeout(() => {
        trilho.dataset.ativo = "nao";
      }, OCIOSO_MS);
    };

    /* Redimensionar muda a proporção sem gerar evento de rolagem. */
    const observador = new ResizeObserver(() => {
      if (!quadro) quadro = window.requestAnimationFrame(desenhar);
    });
    observador.observe(document.documentElement);

    desenhar();
    window.addEventListener("scroll", aoRolar, { passive: true });

    return () => {
      window.removeEventListener("scroll", aoRolar);
      observador.disconnect();
      window.clearTimeout(ocioso);
      if (quadro) window.cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <div className="scroll-indicator" ref={trilhoRef} data-ativo="nao" aria-hidden="true">
      <div className="scroll-indicator__thumb" ref={polegarRef} />
    </div>
  );
}
