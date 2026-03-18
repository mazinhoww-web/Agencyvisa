import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'

const mockCoupons = [
  { id: '1', code: 'PROMO10', discount_type: 'percentage', discount_value: 10, uses_count: 5, max_uses: 50, is_active: true, influencer_name: null },
  { id: '2', code: 'INFLUENCER20', discount_type: 'percentage', discount_value: 20, uses_count: 12, max_uses: 100, is_active: true, influencer_name: 'João Influencer' },
  { id: '3', code: 'FIXO50', discount_type: 'fixed', discount_value: 50, uses_count: 3, max_uses: 10, is_active: false, influencer_name: null },
]

const Cupons = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Cupons & Indicações</h1>
        <p className="text-muted-foreground mt-1">Gerencie cupons de desconto e influenciadores</p>
      </div>
      <Button><Plus className="h-4 w-4 mr-1" /> Novo cupom</Button>
    </div>

    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead>Influenciador</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCoupons.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono font-semibold">{c.code}</TableCell>
                <TableCell>
                  {c.discount_type === 'percentage' ? `${c.discount_value}%` : `R$ ${c.discount_value}`}
                </TableCell>
                <TableCell>{c.uses_count}/{c.max_uses || '∞'}</TableCell>
                <TableCell>{c.influencer_name || '—'}</TableCell>
                <TableCell>
                  <Badge variant={c.is_active ? 'default' : 'secondary'}>
                    {c.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
)

export default Cupons
