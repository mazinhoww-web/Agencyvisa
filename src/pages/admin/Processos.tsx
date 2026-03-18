import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Eye } from 'lucide-react'

const statusLabels: Record<string, string> = {
  pending_form: 'Formulário pendente',
  form_completed: 'Formulário enviado',
  consular_fee_paid: 'Taxa paga',
  appointment_requested: 'Agendamento',
  docs_in_preparation: 'Preparando docs',
  docs_ready: 'Docs prontos',
  completed: 'Concluído',
}

const mockProcesses = [
  { id: '1', client_name: 'João Silva', client_email: 'joao@email.com', package: 'Pro+', status: 'form_completed', applicants: 3, created_at: '2024-01-10' },
  { id: '2', client_name: 'Maria Santos', client_email: 'maria@email.com', package: 'Vip+', status: 'consular_fee_paid', applicants: 5, created_at: '2024-01-12' },
  { id: '3', client_name: 'Pedro Costa', client_email: 'pedro@email.com', package: 'Start+', status: 'pending_form', applicants: 1, created_at: '2024-01-15' },
  { id: '4', client_name: 'Ana Oliveira', client_email: 'ana@email.com', package: 'Pro+', status: 'docs_ready', applicants: 2, created_at: '2024-01-08' },
  { id: '5', client_name: 'Carlos Ferreira', client_email: 'carlos@email.com', package: 'Start+', status: 'completed', applicants: 1, created_at: '2024-01-05' },
]

const Processos = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = mockProcesses.filter((p) => {
    const matchSearch = p.client_name.toLowerCase().includes(search.toLowerCase()) ||
      p.client_email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Processos</h1>
          <p className="text-muted-foreground mt-1">{mockProcesses.length} processos no total</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Pacote</TableHead>
                <TableHead>Solicitantes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{p.client_name}</p>
                      <p className="text-xs text-muted-foreground">{p.client_email}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{p.package}</Badge></TableCell>
                  <TableCell>{p.applicants}</TableCell>
                  <TableCell><Badge variant="secondary">{statusLabels[p.status]}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.created_at}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/processos/${p.id}`}>
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Processos
