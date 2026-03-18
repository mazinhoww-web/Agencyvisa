import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const EmailAdmin = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Central de Email</h1>
        <p className="text-muted-foreground mt-1">Templates, envio manual e histórico</p>
      </div>
      <Button><Plus className="h-4 w-4 mr-1" /> Novo template</Button>
    </div>

    <Tabs defaultValue="templates">
      <TabsList>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="send">Enviar email</TabsTrigger>
        <TabsTrigger value="history">Histórico</TabsTrigger>
      </TabsList>

      <TabsContent value="templates" className="mt-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center py-8">
              Templates de email disponíveis após ativar Lovable Cloud e configurar Resend.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="send" className="mt-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center py-8">
              Envio manual de emails disponível após configurar Resend.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="mt-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center py-8">
              Histórico de emails enviados aparecerá aqui.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
)

export default EmailAdmin
