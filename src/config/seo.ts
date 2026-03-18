export const SEO_BASE = {
  siteName: 'Cia do Visto',
  siteUrl: 'https://ciadovisto.com.br',
  defaultTitle: 'Cia do Visto — Assessoria para Vistos Americanos de Turismo',
  defaultDescription:
    'Assessoria digital completa para vistos americanos B1/B2 de turismo. Preenchimento do DS-160, taxa consular, agendamento e documentação — tudo no portal, com suporte pelo WhatsApp.',
  defaultKeywords: [
    'visto americano',
    'assessoria visto americano',
    'DS-160',
    'visto turismo EUA',
    'visto B1 B2',
    'taxa consular americana',
    'agendamento visto americano',
    'MRV taxa consular',
    'visto americano Brasil',
    'visto americano São Paulo',
    'como tirar visto americano',
  ],
  locale: 'pt_BR',
  twitterHandle: '@ciadovisto',
  defaultOgImage: '/og-default.png',
  themeColor: '#1e40af',
}

export type PageSEO = {
  title: string
  description: string
  keywords?: string[]
  noIndex?: boolean
  canonical?: string
  ogImage?: string
}

export const PAGE_SEO: Record<string, PageSEO> = {
  home: {
    title: 'Cia do Visto — Assessoria para Vistos Americanos B1/B2',
    description:
      'Tire seu visto americano de turismo com assessoria digital especializada. Preenchemos o DS-160, organizamos a documentação e acompanhamos você do início ao fim. A partir de R$ 299.',
    keywords: [
      'assessoria visto americano',
      'visto americano turismo',
      'DS-160 preenchimento',
      'visto americano SP',
      'como tirar visto americano',
      'assessoria visto B1 B2',
    ],
    canonical: '/',
  },
  checkout: {
    title: 'Contratar Assessoria — Cia do Visto',
    description: 'Contrate sua assessoria para visto americano. Pacotes Start+, Pro+ e Vip+ com preenchimento do DS-160 e acompanhamento completo.',
    noIndex: true,
  },
  login: {
    title: 'Entrar — Cia do Visto',
    description: 'Acesse sua conta para acompanhar o andamento do seu processo de visto americano.',
    noIndex: true,
  },
}
