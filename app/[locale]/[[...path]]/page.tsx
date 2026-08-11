import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Site from "@/components/Site";
import { content, hrefFor, isLocale, locales, projects, resolvePage, routeMap } from "@/lib/content";

type Params = { locale: string; path?: string[] };

const titles = {
  pt: { home: "Precisão para construir", company: "Empresa", services: "Serviços", projects: "Projetos", contact: "Planejar minha obra", privacy: "Privacidade" },
  es: { home: "Precisión para construir", company: "Empresa", services: "Servicios", projects: "Proyectos", contact: "Planificar mi obra", privacy: "Privacidad" },
  en: { home: "Precision to build", company: "Company", services: "Services", projects: "Projects", contact: "Plan my project", privacy: "Privacy" },
} as const;

export function generateStaticParams() {
  const params: Params[] = [];
  for (const locale of locales) {
    params.push({ locale, path: [] });
    Object.values(routeMap[locale]).forEach((path) => params.push({ locale, path: [path] }));
    projects.forEach((project) => params.push({ locale, path: [routeMap[locale].projects, project.slug] }));
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: candidate, path = [] } = await params;
  if (!isLocale(candidate)) return {};
  const resolved = resolvePage(candidate, path);
  if (!resolved) return {};
  const project = resolved.projectSlug ? projects.find((item) => item.slug === resolved.projectSlug) : undefined;
  const title = project?.name ?? titles[candidate][resolved.page as keyof (typeof titles)[typeof candidate]] ?? "Nívora";
  const description = resolved.page === "home"
    ? content.home[candidate].lead
    : resolved.page === "project" && project
      ? content.projectCopy[candidate][project.slug].summary
      : candidate === "pt"
        ? "Conheça a Nívora Construções, seus serviços, projetos e processo de gestão integral de obras."
        : candidate === "es"
          ? "Conoce Nívora Construções, sus servicios, proyectos y proceso de gestión integral de obras."
          : "Discover Nívora Construções, its services, projects and integrated construction management process.";
  return {
    /* A home devolve o título **absoluto**, para escapar do
       `template: "%s | Nívora Construções"` do layout.

       Sem isso, o que o mapa `titles` chama de título da home é o slogan
       ("Precisão para construir"), e o template compunha
       "Precisão para construir | Nívora Construções". A aba do navegador tem
       espaço para poucos caracteres, e o slogan ocupava justamente a parte
       visível, empurrando o nome da empresa para fora.

       As demais páginas continuam compondo, que é onde o template serve:
       "Empresa | Nívora Construções" identifica a aba e diz onde se está.

       Cuidado ao mexer: `/` é servido por `app/page.tsx`, que usa o
       `title.default` do layout e **não passa por aqui**. Conferir os dois
       caminhos, senão um fica certo e o outro não. Foi o que aconteceu. */
    title: resolved.page === "home" ? { absolute: "Nívora Construções" } : title,
    description,
    alternates: {
      canonical: hrefFor(candidate, resolved.page, resolved.projectSlug),
      languages: {
        "pt-BR": hrefFor("pt", resolved.page, resolved.projectSlug),
        "es-ES": hrefFor("es", resolved.page, resolved.projectSlug),
        en: hrefFor("en", resolved.page, resolved.projectSlug),
      },
    },
    openGraph: { title, description, locale: candidate === "pt" ? "pt_BR" : candidate === "es" ? "es_ES" : "en_US", images: project ? [{ url: project.image }] : undefined },
  };
}

export default async function LocalizedPage({ params }: { params: Promise<Params> }) {
  const { locale: candidate, path = [] } = await params;
  if (!isLocale(candidate)) notFound();
  const resolved = resolvePage(candidate, path);
  if (!resolved) notFound();
  if (resolved.page === "project" && !projects.some((item) => item.slug === resolved.projectSlug)) notFound();
  return <Site locale={candidate} page={resolved.page} projectSlug={resolved.projectSlug} />;
}
