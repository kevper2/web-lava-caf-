import React from 'react';
import { LavaLogo } from './LavaLogo';
import { Sparkles, ArrowDown, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onQuizClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onQuizClick,
}) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-6 sm:px-10 pt-28 pb-16 overflow-hidden bg-black">
      
      {/* Subtle Lava Texture / Gradient (Deep ambient warmth without clutter) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-radial from-[#c65d1e]/10 via-[#c65d1e]/3 to-transparent blur-3xl opacity-70" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-8 sm:space-y-10">
        
        {/* Origin Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[11px] sm:text-xs text-[#a99c8d] uppercase tracking-[0.25em]">
          <MapPin className="w-3 h-3 text-[#d49a55]" />
          <span>San Martín de los Andes · Patagonia Argentina</span>
        </div>

        {/* Prominent Logo Presentation */}
        <div className="py-2">
          <LavaLogo size="xl" className="justify-center" />
        </div>

        {/* Main Headline - High-Ticket & Clear */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f7eedf] leading-[1.12]">
            Café de montaña concebido para paladares que no aceptan concesiones.
          </h1>
          
          <p className="text-base sm:text-lg text-[#9e9386] font-normal max-w-2xl mx-auto leading-relaxed pt-2">
            Tres perfiles supremos de altitud tostados con precisión absoluta en la cordillera. Elegí el café que refleja tu personalidad y recibilo directo vía WhatsApp.
          </p>
        </div>

        {/* Primary High-Ticket Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#f7eedf] text-black font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer"
          >
            Explorar los 3 Orígenes
          </button>

          <button
            onClick={onQuizClick}
            className="w-full sm:w-auto px-7 py-4 rounded-full border border-white/15 bg-white/[0.02] text-[#d6c9b8] hover:text-white hover:border-[#d49a55]/50 hover:bg-white/[0.05] font-semibold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#d49a55]" />
            <span>Descubrí tu Café según tu Personalidad</span>
          </button>
        </div>

      </div>

      {/* Down Scroll Indicator */}
      <button
        onClick={onExploreClick}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#5a5247] hover:text-[#d49a55] transition-colors p-2 cursor-pointer"
        aria-label="Ir a los cafés"
      >
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </button>

    </section>
  );
};
