import React from 'react';
import { Mountain, Flame, Award } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section className="py-28 sm:py-36 px-6 sm:px-10 lg:px-12 bg-black border-y border-white/5 relative overflow-hidden">
      
      {/* Subtle background lava texture */}
      <div className="absolute inset-0 bg-lava-subtle opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        
        {/* Brand Philosophy Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold text-[#f7eedf] tracking-tight leading-tight">
            La pureza de la alta montaña aplicada al arte del café.
          </h2>

          <p className="text-base sm:text-lg text-[#9e9386] font-normal leading-relaxed">
            LAVA no es una tostaduría más. Es un estándar intransigente de calidad nacido en el corazón de la cordillera patagónica para quienes reconocen la excelencia en el primer sorbo.
          </p>
        </div>

        {/* 3 Core High-Ticket Pillars - Spacious, clean lines, no nested card clutter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
          
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#d49a55]">
              <Mountain className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#f7eedf]">
              Selección de Altura Suprema
            </h3>
            <p className="text-xs text-[#8c8276] leading-relaxed">
              Granos estrictamente seleccionados en las altitudes más exigentes del mundo. La densidad del grano forja una complejidad aromática superior.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#d49a55]">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#f7eedf]">
              Tueste Magistral
            </h3>
            <p className="text-xs text-[#8c8276] leading-relaxed">
              Curvas térmicas calibradas al segundo para desbloquear la máxima expresión de notas nobles: cacao puro, frutos secos y especias cálidas.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#d49a55]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#f7eedf]">
              Experiencia Privé Directa
            </h3>
            <p className="text-xs text-[#8c8276] leading-relaxed">
              Atención directa sin intermediarios. Tu café se despacha con calibración precisa y asesoramiento barista dedicado vía WhatsApp.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};
