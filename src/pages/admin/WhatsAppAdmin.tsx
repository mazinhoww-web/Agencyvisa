import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const WhatsAppAdmin = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground">WhatsApp</h1>
      <p className="text-muted-foreground mt-1">Atendimento e templates via Z-API</p>
    </div>

    <Tabs defaultValue="inbox">
      <TabsList>
        <TabsTrigger value="inbox">Atendimento</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
      </TabsList>

      <TabsContent value="inbox" className="mt-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center py-8">
              Inbox de mensagens WhatsApp disponível após configurar Z-API e ativar Lovable Cloud.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="templates" className="mt-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center py-8">
              Templates de WhatsApp disponíveis após ativar Lovable Cloud.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
)

export default WhatsAppAdmin
