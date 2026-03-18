import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

const Datas = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground">Datas Disponíveis</h1>
      <p className="text-muted-foreground mt-1">Gerencie datas para CASV e consulados</p>
    </div>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display text-lg">Datas cadastradas</CardTitle>
        <Button size="sm"><Calendar className="h-4 w-4 mr-1" /> Adicionar data</Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center py-8">
          Funcionalidade disponível após ativar Lovable Cloud e criar as tabelas no banco de dados.
        </p>
      </CardContent>
    </Card>
  </div>
)

export default Datas
