import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PACKAGES } from '@/config/packages'
import { formatCurrencyFromCents } from '@/utils/currency'
import type { PackageId } from '@/config/packages'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard, ArrowLeft } from 'lucide-react'

const Checkout = () => {
  const [searchParams] = useSearchParams()
  const defaultPkg = (searchParams.get('package') as PackageId) || 'pro_plus'
  const [selectedPackage, setSelectedPackage] = useState<PackageId>(
    Object.keys(PACKAGES).includes(defaultPkg) ? defaultPkg : 'pro_plus'
  )
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('pix')
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', cpf: '' })
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const pkg = PACKAGES[selectedPackage]
  const finalPriceInCents = pkg.priceInCents

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Redirecionando para pagamento...')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">C</span>
            </div>
            <span className="font-display font-bold text-foreground">Cia do <span className="text-primary">Visto</span></span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {['Escolha do plano', 'Seus dados', 'Pagamento'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i < step ? 'bg-success text-success-foreground' :
                i === step - 1 ? 'bg-primary text-primary-foreground' :
                'bg-muted text-muted-foreground'
              }`}>{i < step ? <Check className="h-4 w-4" /> : i + 1}</div>
              <span className="text-sm hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">Escolha seu plano</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.values(PACKAGES).map((p) => (
                    <label key={p.id} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      selectedPackage === p.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    }`}>
                      <input type="radio" name="package" checked={selectedPackage === p.id}
                        onChange={() => setSelectedPackage(p.id as PackageId)} className="mt-1 accent-primary" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{p.name}</span>
                          {'badge' in p && p.badge && <Badge variant="secondary" className="text-xs">{p.badge}</Badge>}
                        </div>
                        <p className="text-lg font-bold text-primary mt-1">{formatCurrencyFromCents(p.priceInCents)}</p>
                        <p className="text-xs text-muted-foreground">Até {p.maxApplicants} solicitante{p.maxApplicants > 1 ? 's' : ''}</p>
                      </div>
                    </label>
                  ))}

                  <div className="pt-4">
                    <p className="text-sm font-medium mb-3">Forma de pagamento</p>
                    <div className="grid grid-cols-2 gap-3">
                      {(['pix', 'card'] as const).map((m) => (
                        <button key={m} onClick={() => setPaymentMethod(m)}
                          className={`p-3 rounded-xl border-2 text-center transition-colors ${
                            paymentMethod === m ? 'border-primary bg-primary/5' : 'border-border'
                          }`}>
                          <p className="font-semibold">{m === 'pix' ? 'PIX' : 'Cartão'}</p>
                          <p className="text-xs text-muted-foreground">{m === 'pix' ? 'Aprovação imediata' : 'Visa, Master, Elo'}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={() => setStep(2)} className="w-full" size="lg">Continuar →</Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">Seus dados</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nome completo *</Label>
                      <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="João da Silva" required />
                    </div>
                    <div className="space-y-2">
                      <Label>E-mail *</Label>
                      <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="joao@email.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label>WhatsApp *</Label>
                      <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="(11) 99999-9999" required />
                    </div>
                    <div className="space-y-2">
                      <Label>CPF *</Label>
                      <Input value={formData.cpf} onChange={(e) => setFormData({...formData, cpf: e.target.value})} placeholder="000.000.000-00" required />
                    </div>

                    <div className="space-y-2">
                      <Label>Cupom de desconto</Label>
                      <div className="flex gap-2">
                        <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="EX: PROMO10" className="font-mono" />
                        <Button type="button" variant="outline" onClick={() => setCouponApplied(true)}>Aplicar</Button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                      </Button>
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? 'Processando...' : `Pagar ${formatCurrencyFromCents(finalPriceInCents)}`}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <Card className="h-fit">
            <CardHeader><CardTitle className="text-sm">Resumo do pedido</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between font-semibold">
                <span>{pkg.name}</span>
                <span>{formatCurrencyFromCents(pkg.priceInCents)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Até {pkg.maxApplicants} solicitante{pkg.maxApplicants > 1 ? 's' : ''}</p>
              <ul className="space-y-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 mt-0.5 text-success flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Assessoria</span><span>{formatCurrencyFromCents(pkg.priceInCents)}</span></div>
                <div className="flex justify-between text-xs text-muted-foreground"><span>Taxa consular (separado)</span><span>US$ 185/pessoa</span></div>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>Total hoje</span>
                <span className="text-primary">{formatCurrencyFromCents(finalPriceInCents)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Checkout
