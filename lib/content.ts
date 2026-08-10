export const locales = ["pt", "es", "en"] as const;
export type Locale = (typeof locales)[number];

export type PageKey =
  | "home"
  | "company"
  | "services"
  | "projects"
  | "project"
  | "contact"
  | "privacy";

export const routeMap: Record<Locale, Record<Exclude<PageKey, "home" | "project">, string>> = {
  pt: { company: "empresa", services: "servicos", projects: "projetos", contact: "contato", privacy: "privacidade" },
  es: { company: "empresa", services: "servicios", projects: "proyectos", contact: "contacto", privacy: "privacidad" },
  en: { company: "company", services: "services", projects: "projects", contact: "contact", privacy: "privacy" },
};

export const projectSegment: Record<Locale, string> = {
  pt: "projetos",
  es: "proyectos",
  en: "projects",
};

export function hrefFor(locale: Locale, page: PageKey, projectSlug?: string) {
  if (page === "home") return `/${locale}`;
  if (page === "project" && projectSlug) return `/${locale}/${projectSegment[locale]}/${projectSlug}`;
  return `/${locale}/${routeMap[locale][page as keyof (typeof routeMap)[Locale]]}`;
}

export function resolvePage(locale: Locale, path: string[]): { page: PageKey; projectSlug?: string } | null {
  if (!path.length) return { page: "home" };
  if (path[0] === projectSegment[locale] && path[1]) return { page: "project", projectSlug: path[1] };
  const entry = Object.entries(routeMap[locale]).find(([, slug]) => slug === path[0]);
  return entry ? { page: entry[0] as PageKey } : null;
}

export type ProjectSlug =
  | "casa-patio-alto"
  | "residencia-horizonte"
  | "casa-aurora"
  | "arco-escritorios"
  | "vila-1936"
  | "atelie-nexo";

export type Project = {
  slug: ProjectSlug;
  name: string;
  city: string;
  year: string;
  area: string;
  category: "residential" | "renovation" | "rehabilitation" | "commercial";
  image: string;
  gallery: readonly string[];
  before?: string;
  comparison: boolean;
};

export const projects: readonly Project[] = [
  {
    slug: "casa-patio-alto",
    name: "Casa Pátio Alto",
    city: "Itu",
    year: "2025",
    area: "540 m²",
    category: "residential",
    image: "/images/casa-patio-alto.webp",
    gallery: ["/images/casa-patio-alto.webp", "/images/casa-patio-alto-detail.webp"],
    comparison: false,
  },
  {
    slug: "residencia-horizonte",
    name: "Residência Horizonte",
    city: "São Roque",
    year: "2024",
    area: "410 m²",
    category: "renovation",
    image: "/images/residencia-horizonte-after.webp",
    gallery: ["/images/residencia-horizonte-after.webp", "/images/residencia-horizonte-interior.webp"],
    before: "/images/residencia-horizonte-before.webp",
    comparison: true,
  },
  {
    slug: "casa-aurora",
    name: "Casa Aurora",
    city: "Campinas",
    year: "2023",
    area: "365 m²",
    category: "residential",
    image: "/images/casa-aurora.webp",
    gallery: ["/images/casa-aurora.webp", "/images/casa-aurora-exterior.webp"],
    comparison: false,
  },
  {
    slug: "arco-escritorios",
    name: "Arco Escritórios",
    city: "São Paulo",
    year: "2025",
    area: "720 m²",
    category: "commercial",
    image: "/images/arco-escritorios.webp",
    gallery: ["/images/arco-escritorios.webp", "/images/arco-escritorios-detail.webp"],
    comparison: false,
  },
  {
    slug: "vila-1936",
    name: "Vila 1936",
    city: "São Paulo",
    year: "2024",
    area: "285 m²",
    category: "rehabilitation",
    image: "/images/vila-1936-after-v3.webp",
    gallery: ["/images/vila-1936-after-v3.webp", "/images/vila-1936-interior.webp"],
    before: "/images/vila-1936-before.webp",
    comparison: true,
  },
  {
    slug: "atelie-nexo",
    name: "Ateliê Nexo",
    city: "Campinas",
    year: "2023",
    area: "260 m²",
    category: "commercial",
    image: "/images/atelie-nexo.webp",
    gallery: ["/images/atelie-nexo.webp", "/images/atelie-nexo-storefront.webp"],
    comparison: false,
  },
] as const;

const shared = {
  pt: {
    languageName: "Português",
    skip: "Pular para o conteúdo",
    nav: { company: "Empresa", services: "Serviços", projects: "Projetos", contact: "Contato" },
    cta: "Planejar minha obra",
    menu: "Abrir menu",
    close: "Fechar menu",
    language: "Selecionar idioma",
    footerLine: "Construção, reforma e reabilitação com gestão integral.",
    conceptual: "Projeto conceitual desenvolvido para o portfólio da Varanda Estúdio Web. Empresa, equipe, obras e indicadores apresentados são fictícios.",
    privacy: "Privacidade",
    allProjects: "Ver todos os projetos",
    viewProject: "Ver estudo de caso",
    categories: { all: "Todos", residential: "Residencial", renovation: "Reformas", rehabilitation: "Reabilitação", commercial: "Comercial" },
    projectTypes: {
      "casa-patio-alto": "Construção residencial",
      "residencia-horizonte": "Reforma e ampliação",
      "casa-aurora": "Construção residencial",
      "arco-escritorios": "Retrofit corporativo",
      "vila-1936": "Reabilitação arquitetônica",
      "atelie-nexo": "Implantação comercial",
    },
  },
  es: {
    languageName: "Español",
    skip: "Saltar al contenido",
    nav: { company: "Empresa", services: "Servicios", projects: "Proyectos", contact: "Contacto" },
    cta: "Planificar mi obra",
    menu: "Abrir menú",
    close: "Cerrar menú",
    language: "Seleccionar idioma",
    footerLine: "Obra nueva, reforma y rehabilitación con gestión integral.",
    conceptual: "Proyecto conceptual desarrollado para el portfolio de Varanda Estúdio Web. La empresa, el equipo, las obras y los indicadores presentados son ficticios.",
    privacy: "Privacidad",
    allProjects: "Ver todos los proyectos",
    viewProject: "Ver caso de estudio",
    categories: { all: "Todos", residential: "Residencial", renovation: "Reformas", rehabilitation: "Rehabilitación", commercial: "Comercial" },
    projectTypes: {
      "casa-patio-alto": "Obra nueva residencial",
      "residencia-horizonte": "Reforma y ampliación",
      "casa-aurora": "Obra nueva residencial",
      "arco-escritorios": "Rehabilitación corporativa",
      "vila-1936": "Rehabilitación arquitectónica",
      "atelie-nexo": "Implantación comercial",
    },
  },
  en: {
    languageName: "English",
    skip: "Skip to content",
    nav: { company: "Company", services: "Services", projects: "Projects", contact: "Contact" },
    cta: "Plan my project",
    menu: "Open menu",
    close: "Close menu",
    language: "Select language",
    footerLine: "New build, renovation and refurbishment under one management team.",
    conceptual: "A concept project developed for the Varanda Estúdio Web portfolio. The company, team, projects and figures presented are fictional.",
    privacy: "Privacy",
    allProjects: "View all projects",
    viewProject: "View case study",
    categories: { all: "All", residential: "Residential", renovation: "Renovations", rehabilitation: "Refurbishment", commercial: "Commercial" },
    projectTypes: {
      "casa-patio-alto": "Residential new build",
      "residencia-horizonte": "Renovation and extension",
      "casa-aurora": "Residential new build",
      "arco-escritorios": "Corporate refurbishment",
      "vila-1936": "Architectural refurbishment",
      "atelie-nexo": "Commercial fit-out",
    },
  },
} as const;

const home = {
  pt: {
    eyebrow: "Construção contemporânea · São Paulo",
    titleA: "Precisão para construir.",
    titleB: "Clareza para transformar.",
    lead: "Da viabilidade à entrega, uma única gestão conecta projeto, orçamento, obra e decisões — com o rigor técnico que o espaço pede e a clareza que o cliente merece.",
    heroMeta: "Obra nova · Reforma integral · Reabilitação · Comercial",
    stats: [["15", "anos de trajetória"], ["63", "obras entregues"], ["38.400", "m² executados"]],
    portfolioEyebrow: "Projetos selecionados",
    portfolioTitle: "Cada obra começa por compreender o que deve permanecer.",
    portfolioText: "Casas, reformas e espaços de trabalho conduzidos do primeiro diagnóstico à entrega documentada.",
    managementEyebrow: "Gestão integral",
    managementTitle: "Uma obra. Uma gestão. Decisões visíveis.",
    managementText: "Centralizamos planejamento, orçamento, fornecedores e execução para reduzir ruído sem esconder as decisões importantes.",
    managementPoints: ["Um responsável central por projeto", "Cronograma organizado por marcos", "Alterações registradas antes da execução", "Relatórios visuais e entrega documentada"],
    processEyebrow: "Nosso processo",
    processTitle: "O canteiro começa muito antes do canteiro.",
    processText: "Seis etapas transformam intenção em escopo, decisões em obra e execução em um espaço pronto para permanecer.",
    transformationEyebrow: "Transformações responsáveis",
    transformationTitle: "Atualizar sem apagar.",
    transformationText: "Na Residência Horizonte, a estrutura existente orientou uma nova relação entre interiores, luz e paisagem.",
    areaEyebrow: "Área de atuação",
    areaTitle: "Próximos do projeto, onde quer que esteja o cliente.",
    areaText: "Executamos obras no estado de São Paulo e oferecemos acompanhamento comercial em português, espanhol e inglês.",
    closing: "O próximo espaço começa com uma conversa bem estruturada.",
  },
  es: {
    eyebrow: "Construcción contemporánea · São Paulo",
    titleA: "Precisión para construir.",
    titleB: "Claridad para transformar.",
    lead: "Desde la viabilidad hasta la entrega, una única gestión conecta proyecto, presupuesto, obra y decisiones, con rigor técnico y una comunicación siempre comprensible.",
    heroMeta: "Obra nueva · Reforma integral · Rehabilitación · Comercial",
    stats: [["15", "años de trayectoria"], ["63", "obras entregadas"], ["38.400", "m² ejecutados"]],
    portfolioEyebrow: "Proyectos seleccionados",
    portfolioTitle: "Cada obra empieza por comprender lo que debe permanecer.",
    portfolioText: "Viviendas, reformas y espacios de trabajo acompañados desde el diagnóstico inicial hasta la entrega documentada.",
    managementEyebrow: "Gestión integral",
    managementTitle: "Una obra. Una gestión. Decisiones visibles.",
    managementText: "Centralizamos planificación, presupuesto, proveedores y ejecución para reducir la complejidad sin ocultar las decisiones importantes.",
    managementPoints: ["Un responsable central por proyecto", "Calendario organizado por hitos", "Cambios registrados antes de ejecutar", "Informes visuales y entrega documentada"],
    processEyebrow: "Nuestro proceso",
    processTitle: "La obra empieza mucho antes de la obra.",
    processText: "Seis etapas convierten la intención en alcance, las decisiones en ejecución y la ejecución en un espacio preparado para perdurar.",
    transformationEyebrow: "Transformaciones responsables",
    transformationTitle: "Actualizar sin borrar.",
    transformationText: "En Residência Horizonte, la estructura existente orientó una nueva relación entre interiores, luz y paisaje.",
    areaEyebrow: "Área de actuación",
    areaTitle: "Cerca del proyecto, esté donde esté el cliente.",
    areaText: "Ejecutamos obras en el estado de São Paulo y atendemos en portugués, español e inglés.",
    closing: "El próximo espacio empieza con una conversación bien estructurada.",
  },
  en: {
    eyebrow: "Contemporary construction · São Paulo",
    titleA: "Precision to build.",
    titleB: "Clarity to transform.",
    lead: "From feasibility to handover, one management team connects design, budget, construction and decisions — with technical rigour and communication clients can trust.",
    heroMeta: "New build · Full renovation · Refurbishment · Commercial",
    stats: [["15", "years of experience"], ["63", "projects delivered"], ["38,400", "m² completed"]],
    portfolioEyebrow: "Selected projects",
    portfolioTitle: "Every project starts by understanding what should remain.",
    portfolioText: "Homes, renovations and workplaces led from the first assessment through to a documented handover.",
    managementEyebrow: "Construction management",
    managementTitle: "One project. One team. Visible decisions.",
    managementText: "We bring planning, cost, suppliers and delivery together to reduce complexity without hiding the decisions that matter.",
    managementPoints: ["One accountable project lead", "Milestone-based programme", "Changes recorded before execution", "Visual reports and documented handover"],
    processEyebrow: "Our process",
    processTitle: "The site starts long before work begins.",
    processText: "Six stages turn intention into scope, decisions into construction and delivery into a space made to last.",
    transformationEyebrow: "Responsible transformations",
    transformationTitle: "Renew without erasing.",
    transformationText: "At Residência Horizonte, the existing structure shaped a new relationship between interiors, light and landscape.",
    areaEyebrow: "Where we work",
    areaTitle: "Close to the project, wherever the client may be.",
    areaText: "We deliver projects across São Paulo state and support clients in Portuguese, Spanish and English.",
    closing: "Your next space starts with a well-structured conversation.",
  },
} as const;

const process = {
  pt: [["01", "Diagnóstico", "Contexto, necessidades, local e objetivos."], ["02", "Viabilidade", "Riscos, condicionantes, escopo e prioridades."], ["03", "Planejamento", "Orçamento, cronograma e compatibilização."], ["04", "Preparação", "Documentação, compras e mobilização."], ["05", "Execução", "Coordenação, qualidade e decisões registradas."], ["06", "Entrega", "Verificação, dossiê e orientações finais."]],
  es: [["01", "Diagnóstico", "Contexto, necesidades, lugar y objetivos."], ["02", "Viabilidad", "Riesgos, condicionantes, alcance y prioridades."], ["03", "Planificación", "Presupuesto, calendario y coordinación."], ["04", "Preparación", "Documentación, compras y movilización."], ["05", "Ejecución", "Coordinación, calidad y decisiones registradas."], ["06", "Entrega", "Revisión, dossier y orientaciones finales."]],
  en: [["01", "Assessment", "Context, needs, site and objectives."], ["02", "Feasibility", "Risks, constraints, scope and priorities."], ["03", "Planning", "Budget, programme and coordination."], ["04", "Preparation", "Documentation, procurement and mobilisation."], ["05", "Delivery", "Coordination, quality and recorded decisions."], ["06", "Handover", "Inspection, project file and final guidance."]],
} as const;

const company = {
  pt: {
    eyebrow: "Empresa",
    title: "Escala próxima. Gestão rigorosa.",
    intro: "A Nívora nasceu da convicção de que uma boa obra depende tanto do detalhe construído quanto da qualidade das decisões que a antecedem.",
    storyTitle: "Quinze anos aproximando projeto e execução.",
    story: ["Em 2011, Marina Valença e Caio Mendonça iniciaram a Nívora em reformas de apartamentos antigos em São Paulo. Ali, perceberam que orçamento, projeto e canteiro precisavam falar a mesma língua.", "A partir de 2014, a empresa ampliou a atuação para residências novas e estruturou uma etapa própria de pré-construção. Em 2018, incorporou espaços comerciais e reabilitação de imóveis.", "Hoje, a Nívora mantém uma equipe deliberadamente enxuta para preservar acompanhamento sênior, decisões documentadas e proximidade em cada obra."],
    timeline: [["2011", "Fundação e primeiras reformas residenciais"], ["2014", "Estruturação da pré-construção"], ["2018", "Nova frente de reabilitação e espaços comerciais"], ["2021", "Relatórios digitais e acompanhamento remoto"], ["2026", "15 anos de uma gestão feita para permanecer"]],
    timelineLabel: "Linha do tempo da Nívora, rolável na horizontal",
    principlesTitle: "O que orienta cada obra",
    principles: [["Clareza", "Explicar antes de executar."], ["Permanência", "Escolher pelo desempenho ao longo do tempo."], ["Responsabilidade", "Registrar impactos de custo, prazo e escopo."], ["Precisão", "Tratar encontros e acabamentos como parte do projeto."]],
    teamTitle: "Uma liderança presente",
    team: [["Marina Valença", "Sócia-diretora · Projeto e relacionamento"], ["Caio Mendonça", "Diretor de obras · Planejamento e execução"], ["Helena Duarte", "Relacionamento · Novos negócios"]],
  },
  es: {
    eyebrow: "Empresa",
    title: "Escala cercana. Gestión rigurosa.",
    intro: "Nívora nació de la convicción de que una buena obra depende tanto del detalle construido como de la calidad de las decisiones previas.",
    storyTitle: "Quince años acercando proyecto y ejecución.",
    story: ["En 2011, Marina Valença y Caio Mendonça iniciaron Nívora reformando viviendas antiguas en São Paulo. Allí comprobaron que presupuesto, proyecto y obra debían hablar el mismo idioma.", "A partir de 2014, la empresa amplió su actividad a obra nueva residencial y creó una fase propia de preconstrucción. En 2018 incorporó espacios comerciales y rehabilitación.", "Hoy, Nívora mantiene un equipo deliberadamente compacto para garantizar atención sénior, decisiones documentadas y cercanía en cada obra."],
    timeline: [["2011", "Fundación y primeras reformas residenciales"], ["2014", "Estructuración de la preconstrucción"], ["2018", "Nueva área de rehabilitación y espacios comerciales"], ["2021", "Informes digitales y seguimiento remoto"], ["2026", "15 años de una gestión pensada para perdurar"]],
    timelineLabel: "Línea de tiempo de Nívora, desplazable en horizontal",
    principlesTitle: "Lo que orienta cada obra",
    principles: [["Claridad", "Explicar antes de ejecutar."], ["Permanencia", "Elegir pensando en el rendimiento futuro."], ["Responsabilidad", "Registrar impactos de coste, plazo y alcance."], ["Precisión", "Entender los encuentros y acabados como parte del proyecto."]],
    teamTitle: "Un liderazgo presente",
    team: [["Marina Valença", "Socia directora · Proyecto y clientes"], ["Caio Mendonça", "Director de obra · Planificación y ejecución"], ["Helena Duarte", "Relación con clientes · Desarrollo de negocio"]],
  },
  en: {
    eyebrow: "Company",
    title: "A close-knit scale. Rigorous management.",
    intro: "Nívora was founded on the belief that a successful build depends as much on the quality of early decisions as it does on the final detail.",
    storyTitle: "Fifteen years bringing design and delivery closer.",
    story: ["In 2011, Marina Valença and Caio Mendonça founded Nívora through the renovation of older São Paulo apartments. It became clear that budget, design and site teams needed a shared language.", "From 2014, the company expanded into residential new builds and established its own pre-construction stage. Commercial spaces and refurbishment followed in 2018.", "Today, Nívora remains deliberately compact so every project retains senior oversight, documented decisions and direct communication."],
    timeline: [["2011", "Founded through residential renovations"], ["2014", "Pre-construction process established"], ["2018", "Refurbishment and commercial practice launched"], ["2021", "Digital reporting and remote oversight"], ["2026", "15 years of management designed to last"]],
    timelineLabel: "Nívora timeline, scrolls horizontally",
    principlesTitle: "What guides every project",
    principles: [["Clarity", "Explain before executing."], ["Longevity", "Choose for performance over time."], ["Accountability", "Record cost, programme and scope impacts."], ["Precision", "Treat junctions and finishes as part of design."]],
    teamTitle: "Leadership that stays close",
    team: [["Marina Valença", "Managing partner · Design and clients"], ["Caio Mendonça", "Construction director · Planning and delivery"], ["Helena Duarte", "Client relations · New business"]],
  },
} as const;

const services = {
  pt: {
    eyebrow: "Serviços",
    title: "Da primeira leitura à última verificação.",
    intro: "Entramos cedo para tornar o projeto construível e permanecemos até que cada decisão esteja executada, verificada e documentada.",
    list: [["01", "Gestão integral de obras", "Planejamento, orçamento executivo, cronograma, fornecedores, controle físico-financeiro e entrega sob uma liderança única."], ["02", "Construção residencial", "Casas contemporâneas com atenção à implantação, estrutura, conforto, instalações e relação entre interior e exterior."], ["03", "Reformas integrais", "Transformação completa de casas e apartamentos, da redistribuição dos ambientes à atualização de instalações e acabamentos."], ["04", "Reabilitação e retrofit", "Recuperação do que merece permanecer e atualização de desempenho, acessibilidade, infraestrutura e uso."], ["05", "Espaços comerciais", "Escritórios, clínicas, lojas e hospitalidade com planejamento orientado à abertura e à continuidade da operação."], ["06", "Pré-construção e viabilidade", "Leitura técnica, visita, riscos, estimativa inicial, compatibilização e estratégia antes da mobilização."], ["07", "Coordenação de acabamentos", "Amostras, disponibilidade, compra e instalação avaliadas em conjunto com estética, manutenção e orçamento."], ["08", "Pós-entrega", "Dossiê digital, orientações de uso e manutenção e visitas programadas para avaliação final."]],
    detailTitle: "O que torna a gestão visível",
    detail: ["Escopo organizado antes da mobilização", "Marcos de decisão e cronograma compreensível", "Registro de alterações e seus impactos", "Relatórios com fotos, avanços e próximas etapas", "Critérios próprios para acabamento e entrega"],
  },
  es: {
    eyebrow: "Servicios",
    title: "Desde la primera lectura hasta la última revisión.",
    intro: "Entramos pronto para hacer viable el proyecto y permanecemos hasta que cada decisión esté ejecutada, revisada y documentada.",
    list: [["01", "Gestión integral de obras", "Planificación, presupuesto ejecutivo, calendario, proveedores, control físico-financiero y entrega bajo una única dirección."], ["02", "Obra nueva residencial", "Viviendas contemporáneas con atención a implantación, estructura, confort, instalaciones y relación interior-exterior."], ["03", "Reformas integrales", "Transformación completa de viviendas, desde la nueva distribución hasta instalaciones y acabados."], ["04", "Rehabilitación y retrofit", "Recuperación de lo que merece permanecer y actualización de prestaciones, accesibilidad, infraestructura y uso."], ["05", "Espacios comerciales", "Oficinas, clínicas, tiendas y hostelería con planificación orientada a la apertura y continuidad de la actividad."], ["06", "Preconstrucción y viabilidad", "Lectura técnica, visita, riesgos, estimación inicial, coordinación y estrategia antes de movilizar la obra."], ["07", "Coordinación de acabados", "Muestras, disponibilidad, compra e instalación evaluadas junto con estética, mantenimiento y presupuesto."], ["08", "Posentrega", "Dossier digital, pautas de uso y mantenimiento y visitas programadas de revisión."]],
    detailTitle: "Cómo hacemos visible la gestión",
    detail: ["Alcance organizado antes de movilizar", "Hitos de decisión y calendario comprensible", "Registro de cambios y sus impactos", "Informes con fotos, avances y próximos pasos", "Criterios propios para acabados y entrega"],
  },
  en: {
    eyebrow: "Services",
    title: "From the first review to the final inspection.",
    intro: "We join early to make the design buildable and stay until every decision has been delivered, checked and documented.",
    list: [["01", "Construction management", "Planning, detailed cost, programme, procurement, progress control and handover under one accountable lead."], ["02", "Residential new build", "Contemporary homes shaped around site, structure, comfort, services and the connection between indoors and out."], ["03", "Full renovations", "Complete transformation of homes, from spatial reconfiguration to renewed services and finishes."], ["04", "Refurbishment and retrofit", "Preserving what matters while upgrading performance, accessibility, infrastructure and use."], ["05", "Commercial spaces", "Offices, clinics, retail and hospitality planned around opening dates and operational continuity."], ["06", "Pre-construction and feasibility", "Technical review, site visit, risk, early costing, coordination and strategy before mobilisation."], ["07", "Finishes coordination", "Samples, availability, purchasing and installation considered alongside design, maintenance and budget."], ["08", "Aftercare", "A digital project file, use and maintenance guidance and scheduled post-handover reviews."]],
    detailTitle: "How management becomes visible",
    detail: ["A defined scope before mobilisation", "Clear decision gates and programme", "Recorded changes and their impact", "Reports with images, progress and next steps", "Dedicated finish and handover criteria"],
  },
} as const;

const projectsPage = {
  pt: { eyebrow: "Projetos", title: "Espaços construídos a partir do que importa.", intro: "Seis casos mostram diferentes escalas, usos e formas de intervenção — sempre com projeto, execução e decisão no mesmo campo de visão.", filter: "Filtrar projetos", empty: "Nenhum projeto nesta categoria." },
  es: { eyebrow: "Proyectos", title: "Espacios construidos a partir de lo que importa.", intro: "Seis casos muestran escalas, usos y formas de intervención distintas, siempre con proyecto, ejecución y decisión en el mismo campo de visión.", filter: "Filtrar proyectos", empty: "No hay proyectos en esta categoría." },
  en: { eyebrow: "Projects", title: "Spaces built around what matters.", intro: "Six case studies reveal different scales, uses and types of intervention — always keeping design, delivery and decisions in the same field of view.", filter: "Filter projects", empty: "No projects in this category." },
} as const;

const projectCopy = {
  pt: {
    "casa-patio-alto": { summary: "Uma casa implantada no desnível e organizada em torno de um pátio protegido.", challenge: "Criar privacidade sem perder horizonte, luz ou continuidade com o terreno.", solution: "Volumes escalonados acompanham a topografia; concreto, pedra e madeira definem áreas de permanência e transição.", materials: ["Concreto aparente", "Pedra natural", "Madeira termotratada", "Paisagismo nativo"] },
    "residencia-horizonte": { summary: "Uma casa dos anos 1980 reaberta para a paisagem e para uma nova rotina familiar.", challenge: "Atualizar instalações e circulação sem descartar a estrutura que ainda funcionava.", solution: "A intervenção preservou a volumetria, ampliou vãos, reorganizou a área social e aproximou interiores, terraço e jardim.", materials: ["Revestimento mineral", "Madeira natural", "Esquadrias grafite", "Pedra clara"] },
    "casa-aurora": { summary: "Luz natural e espaços flexíveis para uma casa que muda junto com a família.", challenge: "Conciliar privacidade, integração social e diferentes ritmos de uso ao longo do dia.", solution: "Um eixo de luz conecta cozinha, convivência e jardim; painéis móveis permitem reconfigurar os ambientes.", materials: ["Tijolo claro", "Madeira", "Piso mineral", "Vegetação de sombra"] },
    "arco-escritorios": { summary: "Um retrofit corporativo organizado para colaboração, foco e transformação futura.", challenge: "Executar por setores sem interromper toda a operação e melhorar o desempenho acústico.", solution: "Módulos de trabalho, núcleos técnicos e áreas colaborativas foram coordenados por fases e com componentes substituíveis.", materials: ["Carvalho natural", "Metal grafite", "Painéis acústicos", "Vidro canelado"] },
    "vila-1936": { summary: "Uma casa urbana reabilitada sem apagar suas proporções e matéria originais.", challenge: "Atualizar infraestrutura e acessibilidade preservando tijolos, vãos e escala doméstica.", solution: "A nova intervenção concentra serviços, recupera a envoltória e introduz elementos contemporâneos de forma reversível.", materials: ["Tijolo recuperado", "Cal mineral", "Madeira escura", "Aço patinado"] },
    "atelie-nexo": { summary: "Um percurso contínuo entre exposição, atendimento e produção.", challenge: "Organizar funções distintas em uma planta estreita e manter o produto como protagonista.", solution: "Marcenaria e iluminação estruturam o fluxo, ocultam apoio técnico e criam diferentes ritmos de aproximação.", materials: ["Freijó", "Aço escovado", "Argamassa mineral", "Luz difusa"] },
  },
  es: {
    "casa-patio-alto": { summary: "Una vivienda adaptada al desnivel y organizada alrededor de un patio protegido.", challenge: "Crear privacidad sin perder horizonte, luz ni continuidad con el terreno.", solution: "Volúmenes escalonados siguen la topografía; hormigón, piedra y madera definen espacios de estancia y transición.", materials: ["Hormigón visto", "Piedra natural", "Madera termotratada", "Paisajismo autóctono"] },
    "residencia-horizonte": { summary: "Una casa de los años ochenta abierta de nuevo al paisaje y a una nueva vida familiar.", challenge: "Actualizar instalaciones y circulación sin descartar una estructura todavía válida.", solution: "La intervención conservó la volumetría, amplió huecos y acercó interiores, terraza y jardín.", materials: ["Revestimiento mineral", "Madera natural", "Carpinterías grafito", "Piedra clara"] },
    "casa-aurora": { summary: "Luz natural y espacios flexibles para una casa que cambia con la familia.", challenge: "Conciliar privacidad, integración social y ritmos de uso diferentes.", solution: "Un eje de luz conecta cocina, estar y jardín; paneles móviles permiten reconfigurar los espacios.", materials: ["Ladrillo claro", "Madera", "Pavimento mineral", "Vegetación de sombra"] },
    "arco-escritorios": { summary: "Una rehabilitación corporativa preparada para colaboración, concentración y cambio.", challenge: "Ejecutar por sectores sin detener toda la actividad y mejorar la acústica.", solution: "Módulos de trabajo, núcleos técnicos y áreas colaborativas se coordinaron por fases con componentes reemplazables.", materials: ["Roble natural", "Metal grafito", "Paneles acústicos", "Vidrio estriado"] },
    "vila-1936": { summary: "Una casa urbana rehabilitada sin borrar sus proporciones y materia originales.", challenge: "Actualizar infraestructura y accesibilidad preservando ladrillo, huecos y escala doméstica.", solution: "La nueva intervención concentra instalaciones, recupera la envolvente e introduce elementos contemporáneos reversibles.", materials: ["Ladrillo recuperado", "Cal mineral", "Madera oscura", "Acero patinado"] },
    "atelie-nexo": { summary: "Un recorrido continuo entre exposición, atención y producción.", challenge: "Organizar funciones distintas en una planta estrecha y mantener el producto como protagonista.", solution: "Carpintería e iluminación estructuran el flujo, ocultan el soporte técnico y crean distintos ritmos de aproximación.", materials: ["Madera de freijó", "Acero cepillado", "Mortero mineral", "Luz difusa"] },
  },
  en: {
    "casa-patio-alto": { summary: "A home set into its sloping site and organised around a sheltered courtyard.", challenge: "Create privacy without losing the horizon, daylight or continuity with the land.", solution: "Stepped volumes follow the topography while concrete, stone and timber define spaces to pause and transition.", materials: ["Exposed concrete", "Natural stone", "Heat-treated timber", "Native planting"] },
    "residencia-horizonte": { summary: "A 1980s house reopened to the landscape and a new rhythm of family life.", challenge: "Upgrade services and circulation without discarding a structure that still performed.", solution: "The intervention retained the main volume, enlarged openings and reconnected the interior, terrace and garden.", materials: ["Mineral render", "Natural timber", "Graphite frames", "Light stone"] },
    "casa-aurora": { summary: "Natural light and flexible spaces for a home designed to change with its family.", challenge: "Balance privacy, shared life and different patterns of use throughout the day.", solution: "A line of daylight connects kitchen, living spaces and garden; sliding panels allow rooms to adapt.", materials: ["Pale brick", "Timber", "Mineral flooring", "Shade planting"] },
    "arco-escritorios": { summary: "A workplace refurbishment designed for collaboration, focus and future change.", challenge: "Deliver in phases without stopping the entire operation, while improving acoustic performance.", solution: "Work modules, technical cores and shared spaces were phased and detailed with replaceable components.", materials: ["Natural oak", "Graphite metal", "Acoustic panels", "Reeded glass"] },
    "vila-1936": { summary: "An urban house refurbished without erasing its original proportions or material character.", challenge: "Upgrade infrastructure and access while retaining brickwork, openings and domestic scale.", solution: "New services are concentrated, the envelope repaired and contemporary elements introduced reversibly.", materials: ["Reclaimed brick", "Mineral lime", "Dark timber", "Patinated steel"] },
    "atelie-nexo": { summary: "A continuous route between display, client service and making.", challenge: "Organise distinct functions in a narrow plan while keeping the product central.", solution: "Joinery and lighting structure the route, conceal technical support and create changing levels of focus.", materials: ["Freijó timber", "Brushed steel", "Mineral plaster", "Diffuse light"] },
  },
} as const;

const projectLabels = {
  pt: { overview: "Visão do projeto", challenge: "Desafio", solution: "Solução", materials: "Materialidade", comparison: "Antes e depois", before: "Antes", after: "Depois", drag: "Arraste para comparar", related: "Serviço relacionado", next: "Próximo projeto", conceptual: "Imagens e dados de projeto produzidos para esta demonstração conceitual." },
  es: { overview: "Visión del proyecto", challenge: "Reto", solution: "Solución", materials: "Materialidad", comparison: "Antes y después", before: "Antes", after: "Después", drag: "Desliza para comparar", related: "Servicio relacionado", next: "Siguiente proyecto", conceptual: "Imágenes y datos producidos para esta demostración conceptual." },
  en: { overview: "Project overview", challenge: "Challenge", solution: "Solution", materials: "Materiality", comparison: "Before and after", before: "Before", after: "After", drag: "Drag to compare", related: "Related service", next: "Next project", conceptual: "Project imagery and data created for this conceptual demonstration." },
} as const;

const contact = {
  pt: {
    eyebrow: "Planejar minha obra",
    title: "Toda obra começa por organizar as perguntas certas.",
    intro: "Conte o contexto inicial. Ao final, você verá um resumo demonstrativo; nenhuma informação será enviada ou armazenada.",
    demo: "Demonstração: os dados permanecem somente nesta tela e são descartados ao sair.",
    steps: ["Projeto", "Imóvel", "Momento", "Contato"],
    next: "Continuar", back: "Voltar", review: "Revisar informações", finish: "Concluir demonstração", edit: "Editar",
    typeQ: "O que você deseja realizar?", types: ["Construir", "Reformar", "Reabilitar", "Implantar espaço comercial"],
    propertyQ: "Sobre o imóvel", city: "Cidade", property: "Tipo de imóvel", area: "Área aproximada", propertyOptions: ["Casa", "Apartamento", "Imóvel histórico", "Escritório", "Loja ou clínica", "Outro"],
    stageQ: "Em que momento o projeto está?", stage: "Etapa atual", stages: ["Ideia inicial", "Projeto em desenvolvimento", "Projeto completo", "Obra iniciada"], start: "Previsão de início", budget: "Faixa de investimento (opcional)", budgetOptions: ["Prefiro conversar", "Até R$ 500 mil", "R$ 500 mil a R$ 1 milhão", "R$ 1 milhão a R$ 2,5 milhões", "Acima de R$ 2,5 milhões"],
    details: "Objetivos, necessidades e restrições", detailsHint: "Ex.: ambientes prioritários, prazo, ocupação durante a obra ou cuidados especiais.",
    name: "Nome", email: "E-mail", phone: "Telefone (opcional)", consent: "Entendo que este formulário é apenas uma demonstração e não enviará meus dados.", required: "Preencha os campos obrigatórios para continuar.", successTitle: "Diagnóstico organizado.", successText: "A demonstração foi concluída sem enviar ou armazenar informações. Em uma operação real, este resumo seguiria para a equipe responsável.", restart: "Iniciar novamente",
    areaTitle: "Atendimento técnico em São Paulo",
    areaText: "Capital, Região Metropolitana, Campinas, Sorocaba, Jundiaí, São Roque e localidades selecionadas após análise logística.",
    emailLabel: "Contato demonstrativo", faqTitle: "Antes de começar", faq: [["É possível orçar sem projeto completo?", "Sim. A etapa inicial pode mapear riscos e decisões, mas um orçamento executivo exige informações e projetos compatíveis com o escopo."], ["Como as alterações são tratadas?", "Mudanças são registradas com seus impactos em custo, prazo e escopo antes da execução."], ["A Nívora atende clientes no exterior?", "O acompanhamento comercial pode ocorrer em três idiomas, mas as obras apresentadas estão concentradas no estado de São Paulo."], ["O formulário já envia uma solicitação?", "Não. Nesta demonstração, nada é transmitido ou armazenado."]],
  },
  es: {
    eyebrow: "Planificar mi obra", title: "Toda obra empieza por ordenar las preguntas adecuadas.", intro: "Cuéntanos el contexto inicial. Al final verás un resumen demostrativo; ninguna información se enviará ni almacenará.", demo: "Demostración: los datos permanecen solo en esta pantalla y se descartan al salir.", steps: ["Proyecto", "Inmueble", "Momento", "Contacto"], next: "Continuar", back: "Atrás", review: "Revisar información", finish: "Finalizar demostración", edit: "Editar", typeQ: "¿Qué quieres realizar?", types: ["Construir", "Reformar", "Rehabilitar", "Implantar un espacio comercial"], propertyQ: "Sobre el inmueble", city: "Ciudad", property: "Tipo de inmueble", area: "Superficie aproximada", propertyOptions: ["Casa", "Piso", "Inmueble histórico", "Oficina", "Tienda o clínica", "Otro"], stageQ: "¿En qué momento está el proyecto?", stage: "Fase actual", stages: ["Idea inicial", "Proyecto en desarrollo", "Proyecto completo", "Obra iniciada"], start: "Fecha prevista de inicio", budget: "Rango de inversión (opcional)", budgetOptions: ["Prefiero hablarlo", "Hasta R$ 500 mil", "R$ 500 mil–R$ 1 millón", "R$ 1–2,5 millones", "Más de R$ 2,5 millones"], details: "Objetivos, necesidades y restricciones", detailsHint: "Ej.: espacios prioritarios, plazo, ocupación durante la obra o cuidados especiales.", name: "Nombre", email: "Correo electrónico", phone: "Teléfono (opcional)", consent: "Entiendo que este formulario es solo una demostración y no enviará mis datos.", required: "Completa los campos obligatorios para continuar.", successTitle: "Diagnóstico organizado.", successText: "La demostración ha finalizado sin enviar ni almacenar información. En una operación real, este resumen llegaría al equipo responsable.", restart: "Empezar de nuevo", areaTitle: "Atención técnica en São Paulo", areaText: "Capital, área metropolitana, Campinas, Sorocaba, Jundiaí, São Roque y localidades seleccionadas tras un análisis logístico.", emailLabel: "Contacto demostrativo", faqTitle: "Antes de empezar", faq: [["¿Es posible presupuestar sin un proyecto completo?", "Sí. La fase inicial puede identificar riesgos y decisiones, pero un presupuesto ejecutivo exige información y proyectos compatibles con el alcance."], ["¿Cómo se gestionan los cambios?", "Los cambios se registran con su impacto en coste, plazo y alcance antes de ejecutarse."], ["¿Nívora atiende a clientes en el extranjero?", "La atención comercial puede desarrollarse en tres idiomas, pero las obras se concentran en el estado de São Paulo."], ["¿El formulario ya envía una solicitud?", "No. En esta demostración no se transmite ni almacena nada."]],
  },
  en: {
    eyebrow: "Plan my project", title: "Every project starts by organising the right questions.", intro: "Share the initial context. At the end, you will see a demonstration summary; no information is sent or stored.", demo: "Demonstration: data remains on this screen only and is discarded when you leave.", steps: ["Project", "Property", "Timing", "Contact"], next: "Continue", back: "Back", review: "Review information", finish: "Complete demonstration", edit: "Edit", typeQ: "What would you like to do?", types: ["Build", "Renovate", "Refurbish", "Fit out a commercial space"], propertyQ: "About the property", city: "City", property: "Property type", area: "Approximate area", propertyOptions: ["House", "Apartment", "Historic property", "Office", "Retail or clinic", "Other"], stageQ: "What stage is the project at?", stage: "Current stage", stages: ["Initial idea", "Design in progress", "Complete design", "Construction started"], start: "Target start", budget: "Investment range (optional)", budgetOptions: ["I would rather discuss it", "Up to R$500k", "R$500k–R$1m", "R$1m–R$2.5m", "Over R$2.5m"], details: "Objectives, needs and constraints", detailsHint: "E.g. priority rooms, timescale, occupation during the works or special requirements.", name: "Name", email: "Email", phone: "Phone (optional)", consent: "I understand this form is a demonstration and will not send my data.", required: "Complete the required fields to continue.", successTitle: "Assessment organised.", successText: "The demonstration is complete without sending or storing any information. In a live service, this summary would be sent to the responsible team.", restart: "Start again", areaTitle: "Technical service across São Paulo", areaText: "Capital, metropolitan area, Campinas, Sorocaba, Jundiaí, São Roque and selected locations after a logistics review.", emailLabel: "Demonstration contact", faqTitle: "Before you start", faq: [["Can you cost a project without a complete design?", "Yes. An early assessment can map risks and decisions, but detailed costing requires information and designs that match the scope."], ["How are changes handled?", "Changes are recorded with their impact on cost, programme and scope before work proceeds."], ["Does Nívora work with clients overseas?", "Commercial support is available in three languages, while delivery remains focused on São Paulo state."], ["Does the form send an enquiry?", "No. Nothing is transmitted or stored in this demonstration."]],
  },
} as const;

const privacy = {
  pt: { eyebrow: "Privacidade", title: "Transparência também faz parte do projeto.", updated: "Versão demonstrativa · julho de 2026", intro: "Este site é um projeto conceitual. O formulário de pré-diagnóstico funciona somente na interface do navegador e não envia, armazena ou compartilha dados.", sections: [["Dados inseridos", "Nome, e-mail, telefone opcional e informações da obra permanecem apenas na memória temporária da página durante o preenchimento."], ["Envio e armazenamento", "Ao concluir, a interface exibe um resumo demonstrativo. Nenhum servidor, CRM, planilha ou serviço de e-mail recebe os dados."], ["Cookies e medição", "Esta versão não utiliza cookies não essenciais, analytics, pixels de publicidade ou identificação de visitantes."], ["Imagens e informações", "As obras, a equipe e os indicadores são conceituais. As imagens foram produzidas para esta demonstração e não representam clientes ou endereços reais."], ["Antes de uma operação real", "Uma implementação comercial exigirá finalidade, base de tratamento, retenção, controle de acesso, proteção contra abuso e canal para solicitações de privacidade definidos e revisados."]], back: "Voltar ao início" },
  es: { eyebrow: "Privacidad", title: "La transparencia también forma parte del proyecto.", updated: "Versión demostrativa · julio de 2026", intro: "Este sitio es un proyecto conceptual. El formulario de diagnóstico funciona únicamente en el navegador y no envía, almacena ni comparte datos.", sections: [["Datos introducidos", "El nombre, correo, teléfono opcional y datos de la obra permanecen solo en la memoria temporal de la página."], ["Envío y almacenamiento", "Al finalizar, la interfaz muestra un resumen. Ningún servidor, CRM, hoja de cálculo o servicio de correo recibe los datos."], ["Cookies y medición", "Esta versión no utiliza cookies no esenciales, analítica, píxeles publicitarios ni identificación de visitantes."], ["Imágenes e información", "Las obras, el equipo y los indicadores son conceptuales. Las imágenes se produjeron para esta demostración y no representan clientes ni direcciones reales."], ["Antes de una operación real", "Una implantación comercial deberá definir y revisar finalidad, base de tratamiento, conservación, acceso, protección frente a abuso y canal de privacidad."]], back: "Volver al inicio" },
  en: { eyebrow: "Privacy", title: "Transparency is part of the project too.", updated: "Demonstration version · July 2026", intro: "This website is a concept project. The project assessment form operates only in the browser interface and does not send, store or share data.", sections: [["Information entered", "Name, email, optional phone number and project details remain only in the page's temporary memory while the form is in use."], ["Sending and storage", "On completion, the interface displays a demonstration summary. No server, CRM, spreadsheet or email service receives the information."], ["Cookies and measurement", "This version uses no non-essential cookies, analytics, advertising pixels or visitor identification."], ["Images and information", "Projects, team members and figures are conceptual. Imagery was created for this demonstration and does not represent real clients or addresses."], ["Before a live service", "A commercial implementation must define and review purpose, lawful basis, retention, access control, abuse protection and a privacy request channel."]], back: "Back to home" },
} as const;

export const content = { shared, home, process, company, services, projectsPage, projectCopy, projectLabels, contact, privacy };

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
