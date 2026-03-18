import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'

const ProcessoDetalhe = () => {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/processos"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Processo #{id?.slice(0, 8)}</h1>
          <p className="text-muted-foreground">João Silva • Pro+</p>
        </div>
        <Badge variant="secondary" className="ml-auto">Taxa paga</Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Informações do cliente</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Nome</span><span>João Silva</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>joao@email.com</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pacote</span><span>Pro+</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Solicitantes</span><span>3</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Atualizar status</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Funcionalidade disponível após ativar Lovable Cloud.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Notas internas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Adicionar nota sobre este processo..." />
              <Button size="sm">Salvar nota</Button>
              <p className="text-sm text-muted-foreground">As notas serão salvas no banco de dados após ativar Lovable Cloud.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Assessoria</span><span>R$ 599,00</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Taxa consular</span><span>Pendente</span></div>
              <div className="flex justify-between font-bold border-t pt-2"><span>Total recebido</span><span>R$ 599,00</span></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center py-8">Chat disponível após ativar Lovable Cloud.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProcessoDetalhe
