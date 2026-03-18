import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Quanto tempo leva o processo completo?',
    answer: 'O processo completo, desde a contratação até a entrevista consular, leva em média 30 a 60 dias, dependendo da disponibilidade de datas no CASV e no Consulado.',
  },
  {
    question: 'O que está incluído no preenchimento do DS-160?',
    answer: 'Nossos especialistas preenchem todo o formulário DS-160 com base nas informações que você fornece, garantindo que todas as respostas estejam corretas e otimizadas para aumentar suas chances de aprovação.',
  },
  {
    question: 'E se meu visto for negado?',
    answer: 'Oferecemos orientação pós-entrevista em caso de negativa. Analisamos os motivos e preparamos um plano para uma nova solicitação com as melhores estratégias.',
  },
  {
    question: 'Posso parcelar o pagamento?',
    answer: 'Sim! Aceitamos cartão de crédito em até 12x e PIX à vista. Entre em contato conosco para saber mais sobre as opções de pagamento.',
  },
  {
    question: 'Vocês atendem todo o Brasil?',
    answer: 'Sim! Nossa assessoria é 100% online. Atendemos clientes de todo o Brasil. O único momento presencial é a entrevista no CASV e Consulado americano.',
  },
  {
    question: 'O que é o CASV?',
    answer: 'O CASV (Centro de Atendimento ao Solicitante de Visto) é onde você faz a coleta de dados biométricos (impressões digitais e foto). É uma etapa obrigatória antes da entrevista no Consulado.',
  },
  {
    question: 'Qual a diferença entre os pacotes?',
    answer: 'O Start+ é ideal para um solicitante individual. O Pro+ atende até 3 pessoas (ideal para casais ou famílias pequenas) com suporte prioritário. O Vip+ atende até 6 pessoas com canal exclusivo e simulação de entrevista.',
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Perguntas <span className="text-primary">frequentes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-body">
            Tire suas dúvidas sobre nosso processo de assessoria.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border/50 px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-body font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-body pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
