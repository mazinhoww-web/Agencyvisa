import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Mail } from 'lucide-react'

const statusLabels: Record<string, string> = {
  new: 'Novo', contacted: 'Contactado', nurturing: 'Nurturing',
  hot: 'Quente', converted: 'Convertido', lost: 'Perdido',
}

const mockLeads = [
  { id: '1', name: 'Carlos Mendes', email: 'carlos@email.com', phone: '11999998888', source: 'site', status: 'new', lead_score: 45, interested_package: 'Pro+', created_at: '2024-01-20' },
  { id: '2', name: 'Fernanda Lima', email: 'fernanda@email.com', phone: '11999997777', source: 'instagram', status: 'hot', lead_score: 85, interested_package: 'Vip+', created_at: '2024-01-18' },
  { id: '3', name: 'Ricardo Souza', email: 'ricardo@email.com', phone: null, source: 'google', status: 'nurturing', lead_score: 30, interested_package: 'Start+', created_at: '2024-01-15' },
]

const Leads = () => {
  const [search, setSearch] = useState('')

  const filtered = mockLeads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Leads & CRM</h1>
        <p className="text-muted-foreground mt-1">{mockLeads.length} leads cadastrados</p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Interesse</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <p className="font-medium">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{l.email}</p>
                  </TableCell>
                  <TableCell className="capitalize">{l.source}</TableCell>
                  <TableCell><Badge variant="outline">{l.interested_package}</Badge></TableCell>
                  <TableCell>
                    <span className={`font-semibold ${l.lead_score >= 70 ? 'text-success' : l.lead_score >= 40 ? 'text-secondary' : 'text-muted-foreground'}`}>
                      {l.lead_score}
                    </span>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{statusLabels[l.status]}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm"><Mail className="h-4 w-4" /></Button>
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

export default Leads
