import { motion } from 'framer-motion';
import { FileText, CreditCard, Calendar, Award } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Escolha seu pacote',
    description: 'Selecione o plano ideal para você e realize o pagamento de forma segura.',
  },
  {
    icon: FileText,
    title: 'Preenchemos o DS-160',
    description: 'Nossa equipe cuida do formulário DS-160 com todas as informações necessárias.',
  },
  {
    icon: CreditCard,
    title: 'Taxa consular',
    description: 'Orientamos o pagamento da taxa consular com a melhor cotação do dólar.',
  },
  {
    icon: Calendar,
    title: 'Agendamento',
    description: 'Agendamos sua entrevista no CASV e no Consulado na melhor data disponível.',
  },
  {
    icon: Award,
    title: 'Preparação e aprovação',
    description: 'Preparamos você para a entrevista. Resultado: visto aprovado!',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Como <span className="text-primary">funciona</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-body">
            Um processo simples e transparente do início ao fim.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-6 mb-12 last:mb-0"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-px h-12 bg-border mt-2" />
                )}
              </div>
              <div className="pt-1">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                  Passo {index + 1}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground mt-1 mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-body">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
