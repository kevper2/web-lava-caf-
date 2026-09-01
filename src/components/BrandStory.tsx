import React from 'react';
import { Mountain, Flame, Award } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-12 bg-black border-t border-white/5 relative overflow-hidden">
      
      {/* Subtle background lava texture */}
      <div className="absolute inset-0 bg-lava-subtle opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-14 sm:space-y-16 relative z-10">
        
        {/* Brand Philosophy Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#d49a55] font-semibold block">
            Nuestra Filosofía
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#f7eedf] tracking-tight leading-tight">
            La pureza de la alta montaña aplicada al arte del café.
          </h2>

          <p className="text-sm sm:text-base text-[#9e9386] font-normal leading-relaxed pt-2">
            LAVA no es café más. Es un estándar intransigente de calidad nacido en el corazón de la cordillera patagónica para quienes reconocen la excelencia en el primer sorbo.
          </p>
        </div>

        {/* 3 Core High-Ticket Pillars - Balanced heights & spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 pt-4">
          
          <div className="space-y-3.5 p-6 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col justify-start">
            <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#d49a55]">
              <Mountain className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#f7eedf] pt-1">
              Selección de Altura Suprema
            </h3>
            <p className="text-xs text-[#8c8276] leading-relaxed">
              Granos estrictamente seleccionados en las altitudes más exigentes del mundo. La densidad del grano forja una complejidad aromática superior.
            </p>
          </div>

          <div className="space-y-3.5 p-6 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col justify-start">
            <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#d49a55]">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#f7eedf] pt-1">
              Tueste Magistral
            </h3>
            <p className="text-xs text-[#8c8276] leading-relaxed">
              Curvas térmicas calibradas al segundo para desbloquear la máxima expresión de notas nobles: cacao puro, frutos secos y especias cálidas.
            </p>
          </div>

          <div className="space-y-3.5 p-6 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col justify-start">
            <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#d49a55]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#f7eedf] pt-1">
              Experiencia Club Magma
            </h3>
            <p className="text-xs text-[#8c8276] leading-relaxed">
              Grandes beneficios con tu membresía. Tu café se despacha con asesoramiento dedicado vía WhatsApp, atención directa sin intermediarios.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};
