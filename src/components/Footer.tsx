import React from 'react';
import { LavaLogo } from './LavaLogo';
import { MapPin, MessageCircle, ArrowUp, Instagram } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface FooterProps {
  onNavigateTab: (tab: 'home' | 'catalog' | 'club' | 'guides' | 'crm') => void;
  onOpenQuiz: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenQuiz }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const directWhatsAppUrl = "https://wa.me/5492972544894?text=Hola%20Lava!%20Quiero%20encargarte%20caf%C3%A9%20%3E%3E";
  const instagramUrl = "https://www.instagram.com/lavacafe.patagonia/";

  return (
    <footer className="bg-black border-t border-white/5 pt-14 sm:pt-16 pb-12 px-6 sm:px-10 lg:px-12 text-left relative overflow-hidden">
      
      {/* Subtle lava ambient light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-radial from-[#c65d1e]/8 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Top Grid - Items aligned cleanly at the top */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-14 items-start">
            
            {/* Col 1: Brand & Location - Leveled with navigation headings */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center -ml-0.5">
                <LavaLogo size="md" />
              </div>
              <p className="text-xs text-[#8c8276] max-w-md leading-relaxed">
                Granos de altitud tostados con precisión y maestría. Envíos sin cargo en San Martín de los Andes (desde el centro hasta Vega Maipú).
              </p>

              <div className="space-y-2 pt-1 text-xs sm:text-sm text-[#c9bba8]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#d49a55] shrink-0" />
                  <span>San Martín de los Andes, Neuquén, Argentina</span>
                </div>
                <div>
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#25D366] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span>WhatsApp: +54 9 2972 54-4894</span>
                  </a>
                </div>
                <div>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#E1306C] transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-[#E1306C] shrink-0" />
                    <span>Instagram: @lavacafe.patagonia</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#d49a55] font-semibold block">
                Navegación
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#8c8276]">
                <li>
                  <button
                    onClick={() => onNavigateTab('catalog')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Los 3 Estilos
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenQuiz}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Test de Personalidad de Café
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab('guides')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Guías de Barista
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Direct WhatsApp */}
            <div className="space-y-4">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#d49a55] font-semibold block">
                Contacto Barista
              </span>
              <p className="text-xs sm:text-sm text-[#8c8276] leading-relaxed">
                ¿Dudas con la molienda para tu cafetera o despacho? Escribinos directamente por WhatsApp.
              </p>
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] border border-[#25D366]/50 text-[#25D366] hover:text-black text-xs sm:text-sm font-semibold transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chatear con LAVA</span>
              </a>
            </div>

          </div>
        </ScrollReveal>

        {/* Bottom Bar */}
        <ScrollReveal delay={0.1}>
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5e554a]">
            <div className="flex items-center flex-wrap gap-1">
              <span>
                © {new Date().getFullYear()} LAVA Café de Montaña · San Martín de los Andes, Neuquén. Todos los derechos reservados.
              </span>
              <button
                onClick={() => onNavigateTab('crm')}
                className="text-[#24211c] hover:text-[#7d7367] transition-colors cursor-pointer text-[10px] ml-1 select-none font-mono"
                title="Acceso Gestión Interna"
                aria-label="Acceso Gestión"
              >
                [crm]
              </button>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <span>Volver arriba</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </ScrollReveal>

      </div>

    </footer>
  );
};
