export const BRAND = {
  azulConsulado: "#1B3A6B",
  azulPassaporte: "#2C5282",
  turquesa: "#38B2AC",
  coral: "#E07B54",
  areia: "#F6E8D0",
  branco: "#FAFAF7",
} as const;

export const TIMING = {
  fps: 30,
  duration: 150, // 5 segundos
  // Keyframes principais:
  bgIn: 0,           // fundo entra
  logoIn: 8,         // logo aparece
  taglineIn: 20,     // "APROVADA!" aparece
  nomeIn: 40,        // nome do cliente
  carimboIn: 65,     // carimbo APPROVED bate na tela
  ctaIn: 100,        // CTA final aparece
  confettiStart: 70, // confetti estoura junto com carimbo
} as const;
