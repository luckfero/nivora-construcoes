/**
 * Imagem responsiva servida das variantes de public/images/r/.
 *
 * Antes o site entregava sempre o arquivo cheio: o celular baixava os
 * mesmos bytes do desktop. As variantes vêm de scripts/optimize-images.mjs
 * e são versionadas, porque o build da Cloudflare não roda o script.
 *
 * A ordem dentro de `<picture>` importa: vence o primeiro `<source>` que o
 * navegador entende, então AVIF vem antes de WebP. O `<img>` final aponta
 * para o original — se uma variante faltar, degrada em vez de quebrar.
 */
/* Quais larguras existem de fato para cada imagem. Imagem menor que uma
   largura alvo não é ampliada — os retratos da equipe têm 720px e só
   ganharam a variante de 480 —, então citar as quatro no `srcset` faria o
   navegador escolher justamente um arquivo que dá 404. */
import { imageWidths } from "../app/image-manifest";

/** "/images/casa-aurora.webp" → "casa-aurora" */
function baseName(src: string): string {
  return src.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") ?? "";
}

function srcSet(name: string, format: "avif" | "webp"): string {
  return (imageWidths[name] ?? [])
    .map((w) => `/images/r/${name}-${w}.${format} ${w}w`)
    .join(", ");
}

type PictureProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export default function Picture({ src, alt, sizes, className, priority = false }: PictureProps) {
  const name = baseName(src);
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(name, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, "webp")} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}

/** Larguras por contexto, centralizadas para não divergirem do layout real. */
export const SIZES = {
  /**
   * Foto do hero.
   *
   * Não corresponde à largura da caixa, e é de propósito. A foto é 2,11:1
   * dentro de uma caixa 1,30:1: com `object-fit: cover`, quem determina o
   * recorte é a **altura**, não a largura. Para cobrir 656px de altura são
   * necessários 1.385px de imagem — bem mais que os 835px que a caixa
   * sugere. Declarar a largura real da caixa fazia o navegador escolher uma
   * variante pequena e ampliá-la, que era a origem da foto borrada.
   *
   * No celular o descompasso é maior ainda: a caixa fica em pé (390×480),
   * então cobrir exige quase 2.030px — cinco vezes a largura da tela.
   * Lembrando que o navegador multiplica este valor pela densidade da tela:
   * `800px` num aparelho 2x vira um pedido de 1.600px. É meio-termo
   * deliberado — o arquivo nativo ficaria nítido, mas a 194 KB numa imagem
   * que é o primeiro elemento a carregar.
   */
  hero: "(max-width: 900px) 800px, 100vw",
  /** Imagem grande de projeto em destaque. */
  feature: "(max-width: 900px) 100vw, 55vw",
  /** Cartão em grade de projetos. */
  card: "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw",
  /** Metade da tela nos blocos de antes e depois. */
  half: "(max-width: 900px) 100vw, 50vw",
  /** Retrato da equipe. */
  portrait: "(max-width: 700px) 45vw, 240px",
} as const;
