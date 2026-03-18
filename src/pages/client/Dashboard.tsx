import { Link } from 'react-router-dom'
import { ProcessStatus } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FileText, DollarSign, Calendar, FolderOpen, Check } from 'lucide-react'

const STATUS_CONFIG: Record<ProcessStatus, { label: string; description: string }> = {
  pending_form: { label: 'Formulário pendente', description: 'Preencha seus dados para iniciarmos o processo.' },
  form_completed: { label: 'Formulário enviado', description: 'Nossa consultora está revisando seu formulário.' },
  consular_fee_paid: { label: 'Taxa paga', description: 'Agora informe suas datas para agendamento.' },
  appointment_requested: { label: 'Agendamento solicitado', description: 'Aguardando confirmação de datas disponíveis.' },
  docs_in_preparation: { label: 'Preparando documentos', description: 'Sua documentação está sendo preparada.' },
  docs_ready: { label: 'Documentos prontos', description: 'Seus documentos estão disponíveis para download.' },
  completed: { label: 'Processo concluído', description: 'Parabéns! Toda a documentação foi entregue.' },
}

const PROCESS_STEPS: { key: ProcessStatus; label: string }[] = [
  { key: 'pending_form', label: 'Formulário DS-160' },
  { key: 'consular_fee_paid', label: 'Taxa Consular' },
  { key: 'appointment_requested', label: 'Agendamento' },
  { key: 'docs_in_preparation', label: 'Documentação' },
  { key: 'completed', label: 'Concluído' },
]

const STEP_ORDER: ProcessStatus[] = [
  'pending_form', 'form_completed', 'consular_fee_paid',
  'appointment_requested', 'docs_in_preparation', 'docs_ready', 'completed'
]

// Mock data — will come from Supabase in production
const mockProcess = {
  id: 'mock-id',
  package: 'Pro+',
  maxApplicants: 3,
  status: 'consular_fee_paid' as ProcessStatus,
  applicants: [
    { id: '1', label: 'Solicitante Principal', given_name: 'João', surname: 'Silva', form_step: 8, form_completed_at: '2024-01-15' },
    { id: '2', label: 'Cônjuge', given_name: 'Maria', surname: 'Silva', form_step: 3, form_completed_at: null },
    { id: '3', label: 'Filho', given_name: null, surname: null, form_step: 0, form_completed_at: null },
  ],
}

function getStepIndex(status: ProcessStatus): number {
  return STEP_ORDER.indexOf(status)
}

const ClientDashboard = () => {
  const process = mockProcess
  const statusConfig = STATUS_CONFIG[process.status]
  const currentStepIndex = getStepIndex(process.status)

  const nextAction: Record<ProcessStatus, { label: string; href: string } | null> = {
    pending_form: { label: 'Preencher formulário', href: '/formulario' },
    form_completed: null,
    consular_fee_paid: { label: 'Solicitar agendamento', href: '/agendamento' },
    appointment_requested: null,
    docs_in_preparation: null,
    docs_ready: { label: 'Baixar documentos', href: '/documentos' },
    completed: { label: 'Ver documentos', href: '/documentos' },
  }

  const action = nextAction[process.status]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Meu processo</h1>
        <p className="text-muted-foreground mt-1">Acompanhe o andamento do seu visto americano</p>
      </div>

      {/* Status Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <Badge variant="secondary" className="mb-3">{statusConfig.label}</Badge>
          <p className="text-foreground">{statusConfig.description}</p>
          {action && (
            <Button asChild className="mt-4">
              <Link to={action.href}>{action.label} →</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Progress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Progresso do processo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {PROCESS_STEPS.map((step, index) => {
              const stepStatusIndex = getStepIndex(step.key)
              const isDone = currentStepIndex > stepStatusIndex
              const isCurrent = step.key === process.status
              return (
                <div key={step.key} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isDone ? 'bg-success text-success-foreground' :
                    isCurrent ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isDone ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDone || isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                  </div>
                  <Badge variant={isDone ? 'default' : isCurrent ? 'secondary' : 'outline'} className="text-xs">
                    {isDone ? 'Concluído' : isCurrent ? 'Em andamento' : 'Pendente'}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Applicants */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg">
            Solicitantes ({process.applicants.length}/{process.maxApplicants})
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/formulario">Preencher formulários →</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {process.applicants.map((applicant) => {
              const name = applicant.given_name && applicant.surname
                ? `${applicant.given_name} ${applicant.surname}`
                : applicant.label
              const progress = Math.round((applicant.form_step / 10) * 100)
              return (
                <div key={applicant.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {(applicant.given_name?.[0] || applicant.label[0]).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{name}</p>
                    <p className="text-xs text-muted-foreground">{applicant.label}</p>
                    <Progress value={progress} className="h-1.5 mt-1" />
                  </div>
                  {applicant.form_completed_at ? (
                    <Badge className="bg-success/10 text-success border-0">Completo</Badge>
                  ) : (
                    <Badge variant="outline">Preencher</Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Formulário', href: '/formulario', icon: FileText },
          { label: 'Taxa consular', href: '/taxa-consular', icon: DollarSign },
          { label: 'Agendamento', href: '/agendamento', icon: Calendar },
          { label: 'Documentos', href: '/documentos', icon: FolderOpen },
        ].map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              to={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-colors text-center"
            >
              <Icon className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-foreground">{action.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default ClientDashboard
