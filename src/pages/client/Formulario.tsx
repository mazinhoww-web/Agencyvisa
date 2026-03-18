import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const FORM_STEPS = [
  { id: 1, title: 'Dados pessoais', description: 'Nome, data de nascimento, estado civil' },
  { id: 2, title: 'Informações de contato', description: 'Endereço, telefone, e-mail' },
  { id: 3, title: 'Passaporte', description: 'Tipo, número, validade' },
  { id: 4, title: 'Viagem', description: 'Propósito, datas, endereço nos EUA' },
  { id: 5, title: 'Situação profissional', description: 'Emprego, renda, educação' },
  { id: 6, title: 'Família', description: 'Pais, cônjuge, filhos' },
  { id: 7, title: 'Viagens anteriores', description: 'Histórico de viagens e vistos' },
  { id: 8, title: 'Questões de segurança', description: 'Perguntas obrigatórias do DS-160' },
]

const Formulario = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Record<string, string>>({})

  const progress = ((currentStep - 1) / (FORM_STEPS.length - 1)) * 100

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <span>Formulário DS-160</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Formulário DS-160</h1>
        <p className="text-muted-foreground mt-1">Preencha com calma — você pode salvar e continuar depois.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Steps Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Etapas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {FORM_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  step.id === currentStep
                    ? 'bg-primary/10 text-primary font-medium'
                    : step.id < currentStep
                    ? 'text-success'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <span className="font-mono mr-2">{step.id}.</span>
                {step.title}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Etapa {currentStep} de {FORM_STEPS.length}: {FORM_STEPS[currentStep - 1].title}</span>
                <span className="text-muted-foreground">{Math.round(progress)}% completo</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">{FORM_STEPS[currentStep - 1].description}</p>
            </div>
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Data */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">Dados pessoais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sobrenome (como no passaporte) *</Label>
                    <Input
                      value={formData.surname || ''}
                      onChange={(e) => updateField('surname', e.target.value)}
                      placeholder="SILVA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome(s) (como no passaporte) *</Label>
                    <Input
                      value={formData.given_name || ''}
                      onChange={(e) => updateField('given_name', e.target.value)}
                      placeholder="JOAO"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data de nascimento *</Label>
                    <Input
                      type="date"
                      value={formData.birth_date || ''}
                      onChange={(e) => updateField('birth_date', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gênero *</Label>
                    <Select value={formData.gender || ''} onValueChange={(v) => updateField('gender', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado civil *</Label>
                    <Select value={formData.marital_status || ''} onValueChange={(v) => updateField('marital_status', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Solteiro(a)</SelectItem>
                        <SelectItem value="married">Casado(a)</SelectItem>
                        <SelectItem value="divorced">Divorciado(a)</SelectItem>
                        <SelectItem value="widowed">Viúvo(a)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cidade de nascimento *</Label>
                    <Input
                      value={formData.birth_city || ''}
                      onChange={(e) => updateField('birth_city', e.target.value)}
                      placeholder="São Paulo"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Other steps show placeholder */}
            {currentStep > 1 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Etapa {currentStep}: {FORM_STEPS[currentStep - 1].title}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Os campos desta etapa serão conectados ao banco de dados após ativar o Lovable Cloud.
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                ← Anterior
              </Button>
              <div className="flex gap-3">
                <Button variant="outline">Salvar rascunho</Button>
                {currentStep < FORM_STEPS.length ? (
                  <Button onClick={() => setCurrentStep(currentStep + 1)}>
                    Próxima etapa →
                  </Button>
                ) : (
                  <Button className="bg-success hover:bg-success/90 text-success-foreground">
                    Enviar formulário
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Formulario
