import { PACKAGES } from '@/config/packages';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
};

const Packages = () => {
  const packages = Object.values(PACKAGES);

  return (
    <section id="packages" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Escolha seu <span className="text-primary">pacote</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-body">
            Planos pensados para diferentes necessidades. Todos incluem suporte completo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 flex flex-col ${
                pkg.highlighted
                  ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-105 border-2 border-primary'
                  : 'bg-card text-card-foreground border border-border shadow-sm'
              }`}
            >
              {'badge' in pkg && pkg.badge && (
                <Badge
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-semibold ${
                    pkg.highlighted
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {pkg.badge}
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold mb-1">{pkg.name}</h3>
                <p className={`text-sm ${pkg.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  Até {pkg.maxApplicants} solicitante{pkg.maxApplicants > 1 ? 's' : ''}
                </p>
              </div>

              <div className="mb-8">
                <span className="font-display text-4xl font-bold">
                  {formatPrice(pkg.priceInCents)}
                </span>
                <span className={`text-sm ml-1 ${pkg.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  /processo
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      pkg.highlighted ? 'text-secondary' : 'text-success'
                    }`} />
                    <span className={pkg.highlighted ? 'text-primary-foreground/90' : ''}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={`w-full rounded-xl font-semibold ${
                  pkg.highlighted
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
                asChild
              >
                <a href={`https://wa.me/5511999999999?text=Olá! Tenho interesse no pacote ${pkg.name}`}>
                  Escolher {pkg.name}
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
