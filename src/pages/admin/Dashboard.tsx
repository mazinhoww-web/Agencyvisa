import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, DollarSign, TrendingUp, Clock } from 'lucide-react'

const stats = [
  { label: 'Processos ativos', value: '24', icon: Users, change: '+3 este mês' },
  { label: 'Receita mensal', value: 'R$ 14.370', icon: DollarSign, change: '+12%' },
  { label: 'Taxa de conversão', value: '68%', icon: TrendingUp, change: '+5pp' },
  { label: 'Tempo médio', value: '18 dias', icon: Clock, change: '-2 dias' },
]

const recentProcesses = [
  { id: '1', client: 'João Silva', package: 'Pro+', status: 'form_completed', date: '18/03/2026' },
  { id: '2', client: 'Maria Santos', package: 'Vip+', status: 'consular_fee_paid', date: '17/03/2026' },
  { id: '3', client: 'Pedro Costa', package: 'Start+', status: 'pending_form', date: '16/03/2026' },
  { id: '4', client: 'Ana Oliveira', package: 'Pro+', status: 'docs_ready', date: '15/03/2026' },
]

const statusLabels: Record<string, string> = {
  pending_form: 'Formulário pendente',
  form_completed: 'Formulário enviado',
  consular_fee_paid: 'Taxa paga',
  appointment_requested: 'Agendamento',
  docs_in_preparation: 'Preparando docs',
  docs_ready: 'Docs prontos',
  completed: 'Concluído',
}

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-success font-medium">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Processos recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentProcesses.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.client}</p>
                  <p className="text-xs text-muted-foreground">{p.package} • {p.date}</p>
                </div>
                <Badge variant="outline">{statusLabels[p.status] || p.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard
