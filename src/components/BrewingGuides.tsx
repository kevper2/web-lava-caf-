import React, { useState } from 'react';
import { BREWING_GUIDES } from '../data/coffeeData';
import { Sparkles, Clock, Thermometer, Scale, Coffee, Droplets } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface MethodConfig {
  min: number;
  max: number;
  step: number;
  defaultVal: number;
  ratioDivisor: number;
  ratioLabel: string;
  presets: number[];
  generateSteps: (volume: number, coffeeGrams: number) => string[];
}

const METHOD_CONFIGS: Record<string, MethodConfig> = {
  prensa: {
    min: 200,
    max: 1000,
    step: 50,
    defaultVal: 300,
    ratioDivisor: 15,
    ratioLabel: '1:15 (Inmersión)',
    presets: [250, 300, 500, 800],
    generateSteps: (volume, coffeeGrams) => [
      `Pesar ${coffeeGrams}g de café molido grueso (textura sal marina) y colocar en la jarra de la prensa precalentada.`,
      `Verter ${volume}ml de agua caliente a 93°C sobre el café, asegurando que toda la molienda quede sumergida por completo.`,
      `Dejar reposar 4:00 minutos exactos sin empujar el émbolo para permitir una extracción homogénea por inmersión.`,
      `Romper suavemente la costra superficial con una cuchara y retirar la espuma flotante para una taza limpia.`,
      `Colocar el émbolo, bajar lentamente hasta el fondo con presión uniforme y servir de inmediato tus ${volume}ml de Lava recién extraída.`,
    ],
  },
  filtro: {
    min: 150,
    max: 800,
    step: 25,
    defaultVal: 300,
    ratioDivisor: 16,
    ratioLabel: '1:16 (Goteo / V60)',
    presets: [200, 300, 450, 600],
    generateSteps: (volume, coffeeGrams) => {
      const bloom = Math.round(coffeeGrams * 2.5);
      const remaining = volume - bloom;
      return [
        `Enjuagar el filtro de papel con agua caliente para purgar sabores a celulosa y precalentar el cono receptor.`,
        `Colocar ${coffeeGrams}g de café con molienda media (textura arena de río) en el cono y asentar con un golpe seco.`,
        `Pre-infusión (Bloom): verter los primeros ${bloom}ml de agua a 91°C en círculos continuos y aguardar 40 segundos para despertar notas florales y frutales.`,
        `Completar el vertido vertiendo los restantes ${remaining}ml en espiral continua hasta alcanzar los ${volume}ml totales de agua.`,
        `Dejar decantar totalmente por gravedad (tiempo estimado: 3:00 min) y oxigenar la jarra antes de degustar tus ${volume}ml de Lava cristalina.`,
      ];
    },
  },
  moka: {
    min: 80,
    max: 300,
    step: 10,
    defaultVal: 150,
    ratioDivisor: 10,
    ratioLabel: '1:10 (Presión vapor)',
    presets: [100, 150, 200, 250],
    generateSteps: (volume, coffeeGrams) => [
      `Llenar la caldera inferior con ${volume}ml de agua caliente hasta quedar justo debajo de la válvula de seguridad.`,
      `Llenar el embudo con ${coffeeGrams}g de café molienda media-fina, distribuyendo parejo sin compactar.`,
      `Enroscar la cafetera con firmeza y colocar a fuego moderado-bajo con la tapa superior entreabierta.`,
      `Retirar del fuego en cuanto el flujo de extracción se torne dorado, espumoso y comience a borbotear.`,
      `Enfriar la base rápidamente con un paño húmedo o bajo chorro de agua fría para cortar la extracción térmica y servir tus ${volume}ml de Lava concentrada.`,
    ],
  },
  espresso: {
    min: 20,
    max: 72,
    step: 2,
    defaultVal: 36,
    ratioDivisor: 2,
    ratioLabel: '1:2 (9 bar de presión)',
    presets: [20, 36, 50, 70],
    generateSteps: (volume, coffeeGrams) => [
      `Purgar el grupo y secar prolijamente la canasta del portafiltro con paño limpio.`,
      `Pesar en balanza ${coffeeGrams}g de molienda fina y distribuir de manera homogénea en la canasta.`,
      `Efectuar un tampado horizontal parejo aplicando 15kg de presión uniforme para evitar canalizaciones.`,
      `Iniciar la extracción de inmediato a 9 bar: extraer exactamente ${volume}ml (${volume}g) de espresso líquido en taza en 25-30 segundos.`,
      `Mezclar suavemente la crema con cuchara para integrar las notas de cata y degustar tus ${volume}ml de Lava densa al instante.`,
    ],
  },
  coldbrew: {
    min: 250,
    max: 1500,
    step: 50,
    defaultVal: 500,
    ratioDivisor: 8,
    ratioLabel: '1:8 (Maceración fría)',
    presets: [350, 500, 750, 1000],
    generateSteps: (volume, coffeeGrams) => [
      `Pesar ${coffeeGrams}g de café molido grueso (sal marina gruesa) y colocar en frasco hermético o jarra de maceración.`,
      `Verter ${volume}ml de agua fresca (filtrada o mineral fría) asegurando que toda la molienda quede empapada.`,
      `Revolver delicadamente durante 30 a 45 segundos con cuchara para saturar homogéneamente las partículas.`,
      `Tapar herméticamente y refrigerar en heladera durante 16 a 20 horas ininterrumpidas sin mover el frasco.`,
      `Filtrar la infusión lentamente a través de papel o malla fina para separar los sedimentos y servir tus ${volume}ml de Cold Brew Lava refrescante sobre abundantes cubos de hielo.`,
    ],
  },
};

export const BrewingGuides: React.FC = () => {
  const [activeGuideId, setActiveGuideId] = useState<string>('prensa');
  const [volumes, setVolumes] = useState<Record<string, number>>({
    prensa: 300,
    filtro: 300,
    moka: 150,
    espresso: 36,
    coldbrew: 500,
  });

  const activeGuide = BREWING_GUIDES.find((g) => g.id === activeGuideId) || BREWING_GUIDES[0];
  const config = METHOD_CONFIGS[activeGuideId] || METHOD_CONFIGS.prensa;

  const currentVolume = volumes[activeGuideId] ?? config.defaultVal;
  const coffeeGrams = Math.round(currentVolume / config.ratioDivisor);
  const currentSteps = config.generateSteps(currentVolume, coffeeGrams);

  const handleVolumeChange = (newVolume: number) => {
    setVolumes((prev) => ({
      ...prev,
      [activeGuideId]: newVolume,
    }));
  };

  return (
    <section id="guides" className="py-24 sm:py-32 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto bg-black">
      
      {/* Header */}
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#d49a55] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Calibración de Extracción Barista</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#f7eedf] tracking-tight">
            Guías de Preparación Barista
          </h2>

          <p className="text-sm text-[#8c8276] leading-relaxed space-y-0.5">
            <span className="block">Calibrá el <span className="text-[#f7eedf] font-medium">Volúmen de Lava deseada</span> en cada método.</span>
            <span className="block">Las proporciones y cada paso del protocolo se recalculan de forma dinámica.</span>
          </p>
        </div>
      </ScrollReveal>

      {/* Method Selector Tabs */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto mb-12">
          {BREWING_GUIDES.map((guide) => {
            const isSelected = guide.id === activeGuideId;
            return (
              <button
                key={guide.id}
                onClick={() => setActiveGuideId(guide.id)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/10 border-[#d49a55] text-white shadow-lg ring-1 ring-[#d49a55]/40'
                    : 'bg-[#090909] border-white/5 text-[#8c8276] hover:text-white hover:border-white/10'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm">{guide.name}</div>
                <div className="text-[10px] text-[#d49a55] mt-1 font-medium">{guide.grind}</div>
              </button>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Active Guide Content */}
      <ScrollReveal delay={0.2}>
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#090909] border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Specs & Calculator */}
          <div className="lg:col-span-5 space-y-6 border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0 lg:pr-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#f7eedf]">{activeGuide.name}</h3>
                {activeGuideId === 'coldbrew' && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-[10px] font-semibold">
                    Frío
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8c8276] mt-1.5 leading-relaxed">{activeGuide.description}</p>
            </div>

            {/* Ratio Calculator */}
            <div className="p-5 rounded-2xl bg-[#111111] border border-white/5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-[#8c8276] flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#d49a55]" />
                  Ratio de Extracción
                </span>
                <span className="text-xs font-mono text-[#d49a55] font-bold">{config.ratioLabel}</span>
              </div>

              {/* Dynamic Slider: Volúmen de Lava deseada */}
              <div className="space-y-2.5 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#a89d8f] font-medium flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-[#d49a55]" />
                    Volúmen de Lava deseada:
                  </span>
                  <strong className="text-white font-mono text-sm bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                    {currentVolume} ml
                  </strong>
                </div>

                <input
                  type="range"
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={currentVolume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-full accent-[#d49a55] cursor-pointer"
                />

                {/* Quick Presets */}
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  {config.presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleVolumeChange(p)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                        currentVolume === p
                          ? 'bg-[#d49a55] text-black font-bold'
                          : 'bg-white/[0.04] text-[#8c8276] hover:text-white border border-white/5'
                      }`}
                    >
                      {p} ml
                    </button>
                  ))}
                </div>
              </div>

              {/* Gramos de café calculados dinámicamente */}
              <div className="p-3.5 rounded-xl bg-black border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs text-[#8c8276] flex items-center gap-1">
                    <Coffee className="w-3.5 h-3.5 text-[#d49a55]" />
                    Café necesario:
                  </span>
                  <span className="text-[10px] text-[#7d7367]">
                    1g café cada {config.ratioDivisor}ml de Lava
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[#d49a55] font-mono">
                    {coffeeGrams} g
                  </span>
                </div>
              </div>
            </div>

            {/* Temp & Time Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#111111] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-[#d49a55]">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[10px] uppercase">Temperatura</span>
                </div>
                <div className="font-bold text-[#f7eedf] text-xs">{activeGuide.temp}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111111] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-[#d49a55]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[10px] uppercase">Tiempo</span>
                </div>
                <div className="font-bold text-[#f7eedf] text-xs">{activeGuide.time}</div>
              </div>
            </div>

          </div>

          {/* Right: Step-by-Step Workflow with DYNAMIC quantities */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8c8276] block">
                Protocolo Calibrado ({currentVolume}ml de Lava):
              </span>
              <span className="text-[11px] text-[#d49a55] font-mono font-medium">
                {coffeeGrams}g café · {currentVolume}ml
              </span>
            </div>

            <div className="space-y-3">
              {currentSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#111111] border border-white/5 flex items-start gap-3.5 text-xs transition-all hover:border-white/10"
                >
                  <span className="w-6 h-6 rounded-full bg-white/5 border border-[#d49a55]/30 text-[#d49a55] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-[#d6c9b8] leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-[#7d7367] leading-relaxed flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d49a55] shrink-0" />
              <span>
                Tip Barista Magma: Utilizá agua mineral o de vertiente patagónica filtrada para resaltar la acidez brillante y notas frutales del grano.
              </span>
            </div>

          </div>

        </div>
      </div>
      </ScrollReveal>

    </section>
  );
};
