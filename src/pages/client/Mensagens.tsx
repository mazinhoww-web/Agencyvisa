import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2 } from 'lucide-react'

type MessageItem = {
  id: string
  process_id: string
  sender_id: string
  sender_type: 'client' | 'admin'
  content: string
  is_read: boolean
  created_at: string
}

const Mensagens = () => {
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [processId, setProcessId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data: process } = await supabase
        .from('processes')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (process) {
        setProcessId(process.id)
        await fetchMessages(process.id)
      } else {
        setLoading(false)
      }
    }

    init()
  }, [])

  // Realtime subscription
  useEffect(() => {
    if (!processId) return

    const channel = supabase
      .channel(`messages-client-${processId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `process_id=eq.${processId}`,
        },
        (payload) => {
          const newMsg = payload.new as MessageItem
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [processId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async (pid: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('process_id', pid)
      .order('created_at', { ascending: true })

    if (data) setMessages(data as MessageItem[])
    setLoading(false)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!processId || !userId || !content.trim() || sending) return

    setSending(true)

    const newMsg: MessageItem = {
      id: crypto.randomUUID(),
      process_id: processId,
      sender_id: userId,
      sender_type: 'client',
      content: content.trim(),
      is_read: false,
      created_at: new Date().toISOString(),
    }

    // Optimistic update
    setMessages((prev) => [...prev, newMsg])
    setContent('')

    const { error } = await supabase.from('messages').insert({
      process_id: processId,
      sender_id: userId,
      sender_type: 'client',
      content: newMsg.content,
    })

    if (error) {
      console.error('Error sending message:', error)
      setMessages((prev) => prev.filter((m) => m.id !== newMsg.id))
    }

    setSending(false)
  }

  const formatTime = (iso: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short'
    }).format(new Date(iso))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Carregando...</span>
      </div>
    )
  }

  if (!processId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Nenhum processo encontrado</h2>
        <p className="text-muted-foreground">Entre em contato pelo WhatsApp para iniciar.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <Card className="flex flex-col h-[calc(100vh-200px)]">
        <CardHeader className="border-b border-border">
          <CardTitle className="font-display text-lg">Mensagens</CardTitle>
          <p className="text-sm text-muted-foreground">Comunicação direta com nossa equipe</p>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Nenhuma mensagem ainda.</p>
              <p className="text-sm text-muted-foreground mt-1">Envie uma mensagem para nossa equipe!</p>
            </div>
          ) : (
            messages.map((msg) => (
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
            ))
          )}
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

        <p className="px-4 pb-3 text-xs text-muted-foreground">
          Respondemos em horário comercial. Para urgências, use o WhatsApp.
        </p>
      </Card>
    </div>
  )
}

export default Mensagens
