import React from 'react';
import { LavaLogo } from './LavaLogo';
import { MapPin, MessageCircle, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: 'home' | 'catalog' | 'club' | 'guides') => void;
  onOpenQuiz: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenQuiz }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-12 px-6 sm:px-10 lg:px-12 text-left relative overflow-hidden">
      
      {/* Subtle lava ambient light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-radial from-[#c65d1e]/8 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Col 1: Brand & Location */}
          <div className="space-y-4 md:col-span-2">
            <LavaLogo size="lg" />
            <p className="text-xs text-[#8c8276] max-w-md leading-relaxed pt-2">
              Café de montaña de élite. Granos supremos de altitud tostados con precisión y maestría en San Martín de los Andes, Patagonia Argentina.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#c9bba8]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d49a55] shrink-0" />
                <span>San Martín de los Andes, Neuquén, Argentina</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#4ade80] shrink-0" />
                <span>WhatsApp Concierge: +54 9 297 241-8890</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#d49a55] font-semibold block">
              Explorar
            </span>
            <ul className="space-y-2.5 text-xs text-[#8c8276]">
              <li>
                <button
                  onClick={() => onNavigateTab('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Los 3 Orígenes
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
                  onClick={() => onNavigateTab('club')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  CLUB MAGMA
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

          {/* Col 3: Direct WhatsApp Concierge */}
          <div className="space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#d49a55] font-semibold block">
              Contacto Barista
            </span>
            <p className="text-xs text-[#8c8276] leading-relaxed">
              ¿Dudas con la molienda para tu cafetera o suscripción? Escribinos directamente por WhatsApp.
            </p>
            <a
              href="https://wa.me/5492972418890?text=Hola%20LAVA!%20Quisiera%20asesoramiento%20para%20elegir%20mi%20caf%C3%A9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1b3820] hover:bg-[#234b2a] border border-[#2d6335] text-[#4ade80] hover:text-white text-xs font-semibold transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chatear con LAVA</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5e554a]">
          <div>
            © {new Date().getFullYear()} LAVA Café de Montaña · San Martín de los Andes, Neuquén. Todos los derechos reservados.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </footer>
  );
};

