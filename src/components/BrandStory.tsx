import React from 'react';
import { Mountain, Flame, Award } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const BrandStory: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 px-6 sm:px-10 lg:px-12 bg-black border-t border-white/5 relative overflow-hidden">
      
      {/* Subtle background lava texture */}
      <div className="absolute inset-0 bg-lava-subtle opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10 relative z-10">
        
        {/* Brand Philosophy Header */}
        <ScrollReveal>
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#d49a55] font-semibold block">
              Nuestra Filosofía
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#f7eedf] tracking-tight leading-tight">
              La pureza de la alta montaña aplicada al arte del café
            </h2>

            <p className="text-sm sm:text-base text-[#9e9386] font-normal leading-relaxed pt-1">
              LAVA no es un café más. Es un estándar intransigente de calidad nacido en el corazón de la cordillera patagónica para quienes reconocen la excelencia en el primer sorbo.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Core High-Ticket Pillars - Centered rectangles and content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-1 max-w-md md:max-w-none mx-auto justify-center">
          
          <ScrollReveal delay={0.1}>
            <div className="space-y-3 p-6 sm:p-7 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col items-center text-center justify-start h-full">
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#d49a55] mx-auto">
                <Mountain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#f7eedf] pt-1 text-center">
                Selección de Altura Suprema
              </h3>
              <p className="text-xs text-[#8c8276] leading-relaxed text-center max-w-xs mx-auto">
                Granos seleccionados de las altitudes más representativas del mundo. La delicadeza del grano forja una complejidad aromática superior.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-3 p-6 sm:p-7 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col items-center text-center justify-start h-full">
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#d49a55] mx-auto">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#f7eedf] pt-1 text-center">
                Tueste Magistral
              </h3>
              <p className="text-xs text-[#8c8276] leading-relaxed text-center max-w-xs mx-auto">
                Curvas térmicas para desbloquear la máxima expresión de notas nobles de cada estilo de café: cacao puro, frutos secos y especias cálidas.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="space-y-3 p-6 sm:p-7 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col items-center text-center justify-start h-full">
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#d49a55] mx-auto">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#f7eedf] pt-1 text-center">
                Atención Directa Barista
              </h3>
              <p className="text-xs text-[#8c8276] leading-relaxed text-center max-w-xs mx-auto">
                Pedidos directos sin intermediarios y atención personalizada vía WhatsApp desde San Martín de los Andes.
              </p>
            </div>
          </ScrollReveal>
 
        </div>

      </div>

    </section>
  );
};
