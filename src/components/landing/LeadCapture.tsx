import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { Download, Check } from 'lucide-react'

const LeadCapture = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', package: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Send to Supabase leads table
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1000)
  }

  return (
    <section id="lead-capture" className="py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Checklist <span className="text-primary">gratuito</span>
            </h2>
            <p className="text-lg text-muted-foreground font-body">
              Baixe nosso checklist completo para organizar seu processo de visto americano.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-lg border border-border space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome *</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label>E-mail *</Label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Interesse</Label>
                  <Select value={formData.package} onValueChange={(v) => setFormData({ ...formData, package: v })}>
                    <SelectTrigger><SelectValue placeholder="Qual pacote?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="start_plus">Start+</SelectItem>
                      <SelectItem value="pro_plus">Pro+</SelectItem>
                      <SelectItem value="vip_plus">Vip+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                <Download className="h-4 w-4 mr-2" />
                {loading ? 'Enviando...' : 'Baixar checklist gratuito'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Ao enviar, você concorda em receber comunicações da Cia do Visto.
              </p>
            </form>
          ) : (
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Checklist enviado!</h3>
              <p className="text-muted-foreground">
                Verifique seu e-mail para baixar o checklist completo.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default LeadCapture
