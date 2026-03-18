import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <>
      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Pronto para realizar seu sonho americano?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto font-body">
            Fale com nossa equipe agora mesmo e dê o primeiro passo rumo ao seu visto americano.
          </p>
          <Button
            size="lg"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base px-8 py-6 rounded-xl shadow-lg"
            asChild
          >
            <a
              href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre a assessoria de visto."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar no WhatsApp
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-navy text-navy-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold">C</span>
              </div>
              <span className="font-display font-bold text-lg">Cia do Visto</span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-navy-foreground/70">
              <a href="#packages" className="hover:text-navy-foreground transition-colors">Pacotes</a>
              <a href="#how-it-works" className="hover:text-navy-foreground transition-colors">Como funciona</a>
              <a href="#testimonials" className="hover:text-navy-foreground transition-colors">Depoimentos</a>
              <a href="#faq" className="hover:text-navy-foreground transition-colors">FAQ</a>
            </nav>
            <p className="text-sm text-navy-foreground/50">
              © {new Date().getFullYear()} Cia do Visto. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
