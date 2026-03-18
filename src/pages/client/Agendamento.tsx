import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { CONSULADOS, CASVS } from '@/config/locations'
import { Check } from 'lucide-react'

const Agendamento = () => {
  const [casvCity, setCasvCity] = useState('')
  const [consulateCity, setConsulateCity] = useState('')
  const [casvDate, setCasvDate] = useState('')
  const [consulateDate, setConsulateDate] = useState('')
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = casvCity && consulateCity && casvDate && consulateDate && disclaimerAccepted

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Solicitação enviada!</h2>
        <p className="text-muted-foreground mb-6">
          Suas preferências de datas foram registradas. Nossa consultora irá verificar a disponibilidade e entrar em contato via WhatsApp.
        </p>
        <p className="text-sm text-muted-foreground mb-8 bg-muted p-4 rounded-lg">
          Lembrete: as datas informadas são apenas uma intenção — não garantimos disponibilidade real.
        </p>
        <Button asChild>
          <Link to="/dashboard">Voltar ao dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <span>Agendamento</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Solicitação de Agendamento</h1>
        <p className="text-muted-foreground mt-1">Informe suas preferências para o CASV e consulado.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">CASV (Coleta de biometria)</CardTitle>
            <p className="text-sm text-muted-foreground">Centro de Solicitações de Visto Americano</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cidade preferida *</Label>
              <Select value={casvCity} onValueChange={setCasvCity}>
                <SelectTrigger><SelectValue placeholder="Selecione uma cidade" /></SelectTrigger>
                <SelectContent>
                  {CASVS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data preferida *</Label>
              <Input type="date" value={casvDate} onChange={(e) => setCasvDate(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Consulado (Entrevista)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Consulado preferido *</Label>
              <Select value={consulateCity} onValueChange={setConsulateCity}>
                <SelectTrigger><SelectValue placeholder="Selecione um consulado" /></SelectTrigger>
                <SelectContent>
                  {CONSULADOS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data preferida *</Label>
              <Input type="date" value={consulateDate} onChange={(e) => setConsulateDate(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-3 p-4 bg-muted rounded-xl">
          <Checkbox
            id="disclaimer"
            checked={disclaimerAccepted}
            onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
          />
          <label htmlFor="disclaimer" className="text-sm text-muted-foreground cursor-pointer">
            Entendo que as datas informadas são apenas uma intenção e que a disponibilidade real será confirmada pela consultora.
          </label>
        </div>

        <Button type="submit" disabled={!canSubmit} className="w-full" size="lg">
          Enviar solicitação
        </Button>
      </form>
    </div>
  )
}

export default Agendamento
