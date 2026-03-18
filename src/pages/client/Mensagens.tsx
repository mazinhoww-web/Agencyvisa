import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

type MessageItem = {
  id: string
  sender_type: 'client' | 'admin'
  content: string
  created_at: string
}

// Mock messages
const mockMessages: MessageItem[] = [
  { id: '1', sender_type: 'admin', content: 'Olá! Bem-vindo à Cia do Visto. Como posso ajudar?', created_at: '2024-01-20T10:00:00Z' },
  { id: '2', sender_type: 'client', content: 'Oi! Tenho dúvidas sobre o formulário DS-160.', created_at: '2024-01-20T10:05:00Z' },
  { id: '3', sender_type: 'admin', content: 'Claro! Pode perguntar que ajudo com tudo. O formulário tem 8 etapas e você pode salvar o progresso a qualquer momento.', created_at: '2024-01-20T10:06:00Z' },
]

const Mensagens = () => {
  const [messages, setMessages] = useState<MessageItem[]>(mockMessages)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || sending) return

    setSending(true)
    const newMessage: MessageItem = {
      id: Date.now().toString(),
      sender_type: 'client',
      content: content.trim(),
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMessage])
    setContent('')
    setSending(false)
  }

  const formatTime = (iso: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(iso))
  }

  return (
    <div className="max-w-2xl">
      <Card className="flex flex-col h-[calc(100vh-200px)]">
        <CardHeader className="border-b border-border">
          <CardTitle className="font-display text-lg">Mensagens</CardTitle>
          <p className="text-sm text-muted-foreground">Converse com sua consultora</p>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                msg.sender_type === 'client'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted text-foreground rounded-bl-md'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${
                  msg.sender_type === 'client' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                }`}>
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </CardContent>

        <form onSubmit={handleSend} className="p-4 border-t border-border flex gap-2">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={sending}
          />
          <Button type="submit" disabled={!content.trim() || sending} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default Mensagens
