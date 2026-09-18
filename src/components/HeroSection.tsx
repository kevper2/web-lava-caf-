import React from 'react';
import { motion } from 'motion/react';
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
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-6 sm:px-10 pt-28 sm:pt-32 pb-10 sm:pb-14 overflow-hidden bg-black">
      
      {/* Subtle Lava Texture / Gradient (Deep ambient warmth without clutter) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1100px] h-[450px] bg-radial from-[#c65d1e]/14 via-[#c65d1e]/4 to-transparent blur-3xl opacity-80" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 sm:space-y-10 my-auto">
        
        {/* Origin Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[11px] sm:text-xs text-[#a99c8d] uppercase tracking-[0.25em]"
        >
          <MapPin className="w-3 h-3 text-[#d49a55]" />
          <span>San Martín de los Andes · Patagonia Argentina</span>
        </motion.div>

        {/* Prominent Logo Presentation - Doubled size with subtle scale/fade in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="py-2 sm:py-4 flex justify-center w-full max-w-3xl"
        >
          <LavaLogo 
            src="/Logo%20Lava%20transparencia.png" 
            size="4xl" 
            className="justify-center drop-shadow-[0_15px_45px_rgba(212,154,85,0.25)]" 
          />
        </motion.div>

        {/* Primary High-Ticket Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 sm:pt-4 w-full sm:w-auto"
        >
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#f7eedf] text-black font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer"
          >
            Explorar los 3 Estilos
          </button>

          <button
            onClick={onQuizClick}
            className="w-full sm:w-auto px-7 py-4 rounded-full border border-white/15 bg-white/[0.02] text-[#d6c9b8] hover:text-white hover:border-[#d49a55]/50 hover:bg-white/[0.05] font-semibold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#d49a55]" />
            <span>Descubrí tu Café según tu Personalidad</span>
          </button>
        </motion.div>

      </div>

      {/* Down Scroll Indicator with subtle delay entrance */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        onClick={onExploreClick}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#5a5247] hover:text-[#d49a55] transition-colors p-2 cursor-pointer"
        aria-label="Ir a los cafés"
      >
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </motion.button>

    </section>
  );
};
