export async function getUsdBrlRate(): Promise<number> {
  try {
    const res = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL')
    const data = await res.json()
    return parseFloat(data.USDBRL.bid)
  } catch {
    console.error('AwesomeAPI indisponível, usando fallback')
    return 5.85 * 1.02
  }
}

export function calculateConsularFee(params: {
  usdAmount: number
  usdRate: number
  paymentMethod: 'card' | 'pix'
  applicants: number
}) {
  const { usdAmount, usdRate, paymentMethod, applicants } = params
  const markup = paymentMethod === 'card' ? 1.10 : 1.15
  const perApplicantBrl = usdAmount * usdRate * markup
  const totalBrl = perApplicantBrl * applicants

  return {
    usdAmount,
    usdRate,
    markup,
    perApplicantBrl: Math.round(perApplicantBrl * 100),
    totalBrl: Math.round(totalBrl * 100),
    perApplicantFormatted: formatCurrency(perApplicantBrl),
    totalFormatted: formatCurrency(totalBrl),
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatCurrencyFromCents(cents: number): string {
  return formatCurrency(cents / 100)
}
