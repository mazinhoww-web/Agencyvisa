export const PACKAGES = {
  start_plus: {
    id: 'start_plus',
    name: 'Start+',
    maxApplicants: 1,
    priceInCents: 29900,
    stripePriceId: 'price_1TCPpe7fFXNXhdEIqgPRclYf',
    stripeProductId: 'prod_UAlMSvR8w7D7vF',
    features: [
      'Assessoria para 1 solicitante',
      'Preenchimento do DS-160',
      'Orientação para entrevista',
      'Suporte por WhatsApp',
      'Acompanhamento do processo',
    ],
    highlighted: false,
  },
  pro_plus: {
    id: 'pro_plus',
    name: 'Pro+',
    maxApplicants: 3,
    priceInCents: 59900,
    stripePriceId: 'price_1TCPpn7fFXNXhdEI8vGEZ8cl',
    stripeProductId: 'prod_UAlMawOEjk47RU',
    features: [
      'Assessoria para até 3 solicitantes',
      'Preenchimento do DS-160 completo',
      'Preparação para entrevista consular',
      'Suporte prioritário por WhatsApp',
      'Acompanhamento completo do processo',
      'Revisão de documentação',
    ],
    highlighted: true,
    badge: 'Mais popular',
  },
  vip_plus: {
    id: 'vip_plus',
    name: 'Vip+',
    maxApplicants: 6,
    priceInCents: 99900,
    stripePriceId: 'price_1TCPpp7fFXNXhdEI8RKzazuq',
    stripeProductId: 'prod_UAlMyHVta6c5ZZ',
    features: [
      'Assessoria para até 6 solicitantes',
      'Preenchimento do DS-160 completo',
      'Preparação intensiva para entrevista',
      'Suporte VIP por WhatsApp (canal exclusivo)',
      'Acompanhamento premium',
      'Revisão completa de documentação',
      'Simulação de entrevista',
    ],
    highlighted: false,
    badge: 'Melhor para grupos',
  },
} as const;

export type PackageId = keyof typeof PACKAGES;
export type Package = (typeof PACKAGES)[PackageId];
