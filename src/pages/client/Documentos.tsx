import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, FolderOpen } from 'lucide-react'

const mockDocuments = [
  { id: '1', name: 'DS-160 — João Silva.pdf', size: 245760, mime_type: 'application/pdf', created_at: '2024-01-20T10:00:00Z' },
  { id: '2', name: 'DS-160 — Maria Silva.pdf', size: 238592, mime_type: 'application/pdf', created_at: '2024-01-20T10:05:00Z' },
  { id: '3', name: 'Comprovante taxa consular.pdf', size: 102400, mime_type: 'application/pdf', created_at: '2024-01-21T14:30:00Z' },
]

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date(iso))
}

const Documentos = () => {
  const docs = mockDocuments

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <span>Documentos</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Meus documentos</h1>
        <p className="text-muted-foreground mt-1">Documentos preparados pela sua consultora.</p>
      </div>

      {docs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-foreground mb-2">Nenhum documento disponível</h3>
            <p className="text-sm text-muted-foreground">
              Assim que sua consultora preparar os documentos, eles aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(doc.size)} • Disponível em {formatDate(doc.created_at)}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Baixar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-muted/50">
        <CardContent className="py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Precisa de ajuda? Fale diretamente com sua consultora via{' '}
            <a href="https://wa.me/5511999999999" className="text-primary font-semibold hover:underline" target="_blank" rel="noopener">
              WhatsApp
            </a>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Documentos
