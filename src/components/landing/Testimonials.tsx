import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Ana Carolina S.',
    location: 'São Paulo, SP',
    text: 'Processo impecável! Tive meu visto aprovado na primeira tentativa. A preparação para a entrevista fez toda a diferença.',
    rating: 5,
    package: 'Pro+',
  },
  {
    name: 'Ricardo M.',
    location: 'Rio de Janeiro, RJ',
    text: 'Contratei o pacote Vip+ para toda a família. Todos aprovados! O suporte exclusivo pelo WhatsApp foi essencial.',
    rating: 5,
    package: 'Vip+',
  },
  {
    name: 'Juliana F.',
    location: 'Belo Horizonte, MG',
    text: 'Estava insegura com o processo, mas a equipe da Cia do Visto me guiou em cada etapa. Super recomendo!',
    rating: 5,
    package: 'Start+',
  },
  {
    name: 'Pedro H.',
    location: 'Curitiba, PR',
    text: 'Excelente custo-benefício. O preenchimento do DS-160 foi perfeito e recebi orientações detalhadas para a entrevista.',
    rating: 5,
    package: 'Pro+',
  },
  {
    name: 'Mariana L.',
    location: 'Brasília, DF',
    text: 'Já tinha sido negada uma vez. Com a Cia do Visto, fui aprovada! A simulação de entrevista do Vip+ é incrível.',
    rating: 5,
    package: 'Vip+',
  },
  {
    name: 'Carlos A.',
    location: 'Porto Alegre, RS',
    text: 'Processo rápido e sem dor de cabeça. Em menos de 30 dias tinha meu visto em mãos. Muito obrigado!',
    rating: 5,
    package: 'Start+',
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            O que nossos <span className="text-primary">clientes</span> dizem
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-body">
            Mais de 500 vistos aprovados com a nossa assessoria.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-foreground mb-4 font-body leading-relaxed">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {t.package}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
