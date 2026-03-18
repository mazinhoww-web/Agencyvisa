import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Configuracoes = () => (
  <div className="space-y-6 max-w-2xl">
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground">Configurações</h1>
      <p className="text-muted-foreground mt-1">Ajustes gerais do sistema</p>
    </div>

    <Card>
      <CardHeader><CardTitle className="text-sm">Dados da empresa</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Nome da empresa</Label>
          <Input defaultValue="Cia do Visto" />
        </div>
        <div className="space-y-2">
          <Label>WhatsApp de contato</Label>
          <Input defaultValue="5511999999999" placeholder="5511999999999" />
        </div>
        <div className="space-y-2">
          <Label>Email de contato</Label>
          <Input defaultValue="contato@ciadovisto.com.br" />
        </div>
        <Button>Salvar alterações</Button>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="text-sm">Integrações</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium text-sm">Z-API (WhatsApp)</p>
            <p className="text-xs text-muted-foreground">Envio de mensagens via WhatsApp</p>
          </div>
          <Button variant="outline" size="sm">Configurar</Button>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium text-sm">Stripe (Pagamentos)</p>
            <p className="text-xs text-muted-foreground">Cartão de crédito e PIX</p>
          </div>
          <Button variant="outline" size="sm">Configurar</Button>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium text-sm">Resend (Email)</p>
            <p className="text-xs text-muted-foreground">Emails transacionais</p>
          </div>
          <Button variant="outline" size="sm">Configurar</Button>
        </div>
      </CardContent>
    </Card>
  </div>
)

export default Configuracoes
