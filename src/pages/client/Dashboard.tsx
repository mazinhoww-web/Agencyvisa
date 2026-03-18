import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { ProcessStatus } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FileText, DollarSign, Calendar, FolderOpen, Check, Loader2 } from 'lucide-react'

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

type Applicant = {
  id: string
  label: string
  given_name: string | null
  surname: string | null
  form_step: number
  form_completed_at: string | null
}

type Process = {
  id: string
  package: string
  max_applicants: number
  status: ProcessStatus
  applicants: Applicant[]
}

function getStepIndex(status: ProcessStatus): number {
  return STEP_ORDER.indexOf(status)
}

const ClientDashboard = () => {
  const [process, setProcess] = useState<Process | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          setError('Usuário não autenticado')
          setLoading(false)
          return
        }

        const { data, error: processError } = await supabase
          .from('processes')
          .select('*, applicants(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (processError) {
          setError('Erro ao carregar dados')
          setLoading(false)
          return
        }

        if (!data) {
          setError('Nenhum processo encontrado')
          setLoading(false)
          return
        }

        setProcess(data as unknown as Process)
      } catch (err) {
        console.error('Error fetching process:', err)
        setError('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    fetchProcess()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Carregando seu processo...</span>
      </div>
    )
  }

  if (error || !process) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Nenhum processo encontrado</h2>
        <p className="text-muted-foreground">{error || 'Entre em contato com nossa consultora para iniciar seu processo.'}</p>
      </div>
    )
  }

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
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Meu processo</h1>
        <p className="text-muted-foreground mt-1">Acompanhe o andamento do seu visto americano</p>
      </div>

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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg">
            Solicitantes ({process.applicants.length}/{process.max_applicants})
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
