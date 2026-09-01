import React, { useState } from 'react';
import { BREWING_GUIDES } from '../data/coffeeData';
import { Sparkles, Clock, Thermometer, Scale } from 'lucide-react';

export const BrewingGuides: React.FC = () => {
  const [activeGuideId, setActiveGuideId] = useState<string>('prensa');
  const [waterAmount, setWaterAmount] = useState<number>(300);

  const activeGuide = BREWING_GUIDES.find((g) => g.id === activeGuideId) || BREWING_GUIDES[0];

  const getRequiredCoffeeGramsDir = () => {
    switch (activeGuideId) {
      case 'prensa':
        return Math.round(waterAmount / 15);
      case 'filtro':
        return Math.round(waterAmount / 16);
      case 'moka':
        return Math.round(waterAmount / 10);
      case 'espresso':
        return 18;
      default:
        return Math.round(waterAmount / 15);
    }
  };

  return (
    <section id="guides" className="py-24 sm:py-32 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto bg-black">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#d49a55] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Calibración de Extracción</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-[#f7eedf] tracking-tight">
          Guías de Preparación Barista
        </h2>

        <p className="text-sm text-[#8c8276] leading-relaxed">
          Ratios exactos y temperatura de agua para liberar las notas nobles de tus cafés de montaña.
        </p>
      </div>

      {/* Method Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-12">
        {BREWING_GUIDES.map((guide) => {
          const isSelected = guide.id === activeGuideId;
          return (
            <button
              key={guide.id}
              onClick={() => setActiveGuideId(guide.id)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white/10 border-[#d49a55] text-white shadow-lg'
                  : 'bg-[#090909] border-white/5 text-[#8c8276] hover:text-white'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm">{guide.name}</div>
              <div className="text-[10px] text-[#d49a55] mt-1">{guide.grind}</div>
            </button>
          );
        })}
      </div>

      {/* Active Guide Content */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-[#090909] border border-white/10 p-8 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Specs & Calculator */}
          <div className="lg:col-span-5 space-y-6 border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0 lg:pr-6">
            <div>
              <h3 className="text-xl font-bold text-[#f7eedf]">{activeGuide.name}</h3>
              <p className="text-xs text-[#8c8276] mt-1">{activeGuide.description}</p>
            </div>

            {/* Ratio Calculator */}
            <div className="p-5 rounded-2xl bg-[#111111] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-[#8c8276] flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#d49a55]" />
                  Ratio de Agua/Café
                </span>
                <span className="text-xs font-mono text-[#d49a55] font-bold">{activeGuide.ratio}</span>
              </div>

              {activeGuideId !== 'espresso' ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-[#8c8276]">
                      <span>Agua deseada:</span>
                      <strong className="text-white">{waterAmount} ml</strong>
                    </div>
                    <input
                      type="range"
                      min="150"
                      max="800"
                      step="50"
                      value={waterAmount}
                      onChange={(e) => setWaterAmount(Number(e.target.value))}
                      className="w-full accent-[#d49a55]"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-black border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-[#8c8276]">Gramos de café:</span>
                    <span className="text-base font-bold text-[#d49a55]">
                      {getRequiredCoffeeGramsDir()} g
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-3 rounded-xl bg-black border border-white/5 text-xs text-[#8c8276]">
                  Doble Shot: <strong>18g de café</strong> para <strong>36g de espresso líquido</strong>.
                </div>
              )}
            </div>

            {/* Temp & Time */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#111111] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-[#d49a55]">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[10px] uppercase">Temperatura</span>
                </div>
                <div className="font-bold text-[#f7eedf]">{activeGuide.temp}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111111] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-[#d49a55]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[10px] uppercase">Tiempo</span>
                </div>
                <div className="font-bold text-[#f7eedf]">{activeGuide.time}</div>
              </div>
            </div>

          </div>

          {/* Right: Step-by-Step Workflow */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8c8276] block">
              Protocolo de Preparación:
            </span>

            <div className="space-y-3">
              {activeGuide.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#111111] border border-white/5 flex items-start gap-3.5 text-xs"
                >
                  <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-[#d49a55] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-[#d6c9b8] leading-relaxed mt-0.5">{step}</p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
