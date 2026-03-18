import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { calculateConsularFee, formatCurrencyFromCents } from '@/utils/currency'

const TaxaConsular = () => {
  const [usdRate, setUsdRate] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('pix')
  const [loading, setLoading] = useState(false)
  const [loadingRate, setLoadingRate] = useState(true)

  const applicantsCount = 2
  const USD_AMOUNT = 185

  useEffect(() => {
    fetch('https://economia.awesomeapi.com.br/last/USD-BRL')
      .then((r) => r.json())
      .then((data) => {
        setUsdRate(parseFloat(data.USDBRL.bid))
        setLoadingRate(false)
      })
      .catch(() => {
        setUsdRate(5.90)
        setLoadingRate(false)
      })
  }, [])

  const fee = usdRate
    ? calculateConsularFee({ usdAmount: USD_AMOUNT, usdRate, paymentMethod, applicants: applicantsCount })
    : null

  const handlePay = async () => {
    setLoading(true)
    // TODO: integrate with payment API
    setTimeout(() => {
      setLoading(false)
      alert('Redirecionando para pagamento...')
    }, 1500)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <span>Taxa consular</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Taxa Consular Americana</h1>
        <p className="text-muted-foreground mt-1">Pague a taxa MRV obrigatória para todos os solicitantes.</p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-2">Sobre a taxa MRV</h3>
          <p className="text-sm text-muted-foreground">
            A taxa de US$ 185 por pessoa é cobrada diretamente pelo governo americano e é obrigatória para todos os solicitantes de visto B1/B2.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Cálculo da taxa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Taxa por pessoa</span>
            <span className="font-semibold">US$ {USD_AMOUNT}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Solicitantes</span>
            <span className="font-semibold">{applicantsCount}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Cotação USD/BRL</span>
            <span className="font-semibold">
              {loadingRate ? 'Carregando...' : `R$ ${usdRate?.toFixed(4)}`}
            </span>
          </div>

          <div className="pt-4">
            <p className="text-sm font-medium text-foreground mb-3">Forma de pagamento</p>
            <div className="grid grid-cols-2 gap-3">
              {(['pix', 'card'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-4 rounded-xl border-2 text-center transition-colors ${
                    paymentMethod === method
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <p className="font-semibold text-foreground">{method === 'pix' ? 'PIX' : 'Cartão'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Spread de {method === 'pix' ? '15%' : '10%'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {fee && (
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Por solicitante</span>
                <span className="font-semibold">{fee.perApplicantFormatted}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-primary">{fee.totalFormatted}</span>
              </div>
            </div>
          )}

          <Button onClick={handlePay} disabled={loading || !fee} className="w-full mt-4" size="lg">
            {loading ? 'Processando...' : `Pagar ${fee?.totalFormatted || ''}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default TaxaConsular
