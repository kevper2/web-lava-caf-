import React, { useState } from 'react';
import { CoffeeBean, GrindType, BagSize, CartItem } from '../types';
import { COFFEE_BEANS } from '../data/coffeeData';
import { LavaLogo } from './LavaLogo';
import { Sparkles, MessageCircle, SlidersHorizontal, Check, ShieldCheck, ArrowRight } from 'lucide-react';

interface CoffeeStickersShowcaseProps {
  beans?: CoffeeBean[];
  onSelectBeanToCustomize?: (bean: CoffeeBean) => void;
  onSelectBeanForCustomizer?: (bean: CoffeeBean) => void;
  onAddToCart: (item: CartItem | CoffeeBean, grind?: GrindType, size?: BagSize) => void;
  onDirectWhatsApp?: (item: CartItem) => void;
  onDirectWhatsAppOrder?: (bean: CoffeeBean, grind: GrindType, size: BagSize) => void;
}

export const CoffeeStickersShowcase: React.FC<CoffeeStickersShowcaseProps> = ({
  beans = COFFEE_BEANS,
  onSelectBeanToCustomize,
  onSelectBeanForCustomizer,
  onAddToCart,
  onDirectWhatsApp,
  onDirectWhatsAppOrder,
}) => {
  const displayBeans = beans && beans.length > 0 ? beans : COFFEE_BEANS;

  // State for user selections on each card
  const [selectedSizes, setSelectedSizes] = useState<Record<string, BagSize>>({
    'andes-colombianos': '500g',
    'serra-da-mantiqueira': '500g',
    'alpi-italiane': '500g',
  });

  const [selectedGrinds, setSelectedGrinds] = useState<Record<string, GrindType>>({
    'andes-colombianos': 'Filtro',
    'serra-da-mantiqueira': 'Prensa',
    'alpi-italiane': 'Espresso',
  });

  const [addedAnimation, setAddedAnimation] = useState<string | null>(null);

  const grindOptions: GrindType[] = ['Granos', 'Filtro', 'Espresso', 'Moka', 'Prensa'];
  const sizeOptions: BagSize[] = ['250g', '500g', '1kg'];

  const handleSizeChange = (beanId: string, size: BagSize) => {
    setSelectedSizes((prev) => ({ ...prev, [beanId]: size }));
  };

  const handleGrindChange = (beanId: string, grind: GrindType) => {
    setSelectedGrinds((prev) => ({ ...prev, [beanId]: grind }));
  };

  const handleQuickAdd = (bean: CoffeeBean) => {
    const size = selectedSizes[bean.id] || '500g';
    const grind = selectedGrinds[bean.id] || 'Granos';
    const unitPrice = bean.prices[size];

    const cartItem: CartItem = {
      id: `${bean.id}-${size}-${grind}-${Date.now()}`,
      beanId: bean.id,
      beanName: bean.name,
      grind,
      size,
      unitPrice,
      quantity: 1,
      frequency: 'one_time',
    };

    onAddToCart(cartItem, grind, size);
    setAddedAnimation(bean.id);
    setTimeout(() => setAddedAnimation(null), 1800);
  };

  const handleQuickWhatsApp = (bean: CoffeeBean) => {
    const size = selectedSizes[bean.id] || '500g';
    const grind = selectedGrinds[bean.id] || 'Granos';
    const unitPrice = bean.prices[size];

    if (onDirectWhatsAppOrder) {
      onDirectWhatsAppOrder(bean, grind, size);
      return;
    }

    const cartItem: CartItem = {
      id: `${bean.id}-${size}-${grind}-${Date.now()}`,
      beanId: bean.id,
      beanName: bean.name,
      grind,
      size,
      unitPrice,
      quantity: 1,
      frequency: 'one_time',
    };

    if (onDirectWhatsApp) {
      onDirectWhatsApp(cartItem);
    }
  };

  const handleCustomizer = (bean: CoffeeBean) => {
    if (onSelectBeanToCustomize) {
      onSelectBeanToCustomize(bean);
    } else if (onSelectBeanForCustomizer) {
      onSelectBeanForCustomizer(bean);
    }
  };

  return (
    <section id="catalog" className="py-24 sm:py-32 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto bg-black">
      
      {/* Section Header - Airy, clean, high presence */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#d49a55] font-semibold">
          Colección Permanente · 3 Arquetipos
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold text-[#f7eedf] tracking-tight">
          La Trilogía de Montaña
        </h2>
        <p className="text-base text-[#9e9386] font-normal leading-relaxed pt-1">
          Tres orígenes curados meticulosamente. Cada perfil expresa una personalidad sensorial única para elevar tu ritual diario.
        </p>
      </div>

      {/* 3 Origin Cards - Airy, Spacious, Minimalist Luxury */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 items-stretch">
        {displayBeans.map((bean) => {
          const currentSize = selectedSizes[bean.id] || '500g';
          const currentGrind = selectedGrinds[bean.id] || 'Granos';
          const currentPrice = bean.prices[currentSize];
          const isAdded = addedAnimation === bean.id;

          return (
            <div
              key={bean.id}
              className="group relative flex flex-col justify-between rounded-3xl bg-[#080808] border border-white/[0.08] hover:border-[#d49a55]/40 transition-all duration-500 p-8 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_10px_40px_rgba(212,154,85,0.08)]"
            >
              {/* Subtle top ember glow on hover */}
              <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-[#d49a55]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div>
                {/* Header of the Card: Personality Archetype & Altitude */}
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/5">
                  <div>
                    <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d49a55] mb-1">
                      {bean.personality.title}
                    </span>
                    <h3 className="text-2xl font-bold text-[#f7eedf] tracking-tight">
                      {bean.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-white/90 block">
                      {bean.altitude}
                    </span>
                    <span className="text-[10px] text-[#7d7367] tracking-wider uppercase">
                      {bean.country}
                    </span>
                  </div>
                </div>

                {/* Personality Quote / Essence */}
                <div className="py-6 space-y-3">
                  <p className="text-xs italic text-[#c9bba8] leading-relaxed">
                    {bean.personality.quote}
                  </p>
                  <p className="text-xs text-[#8c8276] leading-relaxed">
                    {bean.personality.description}
                  </p>
                </div>

                {/* Tasting Notes Tags */}
                <div className="space-y-2 pb-6 border-b border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-[#6e655a] font-semibold block">
                    Notas de Cata
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {bean.flavorTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-[11px] bg-white/[0.03] border border-white/[0.08] text-[#e0d6c8] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sensory Balance Indicators (Roast, Acidity, Body) */}
                <div className="py-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8c8276]">Tueste:</span>
                    <span className="text-[#e0d6c8] font-medium">{bean.roastTitle}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-[#d49a55] h-full rounded-full transition-all duration-700"
                      style={{ width: `${bean.roastPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#8c8276]">Cuerpo:</span>
                    <span className="text-[#e0d6c8] font-medium">{bean.bodyTitle}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-[#c6894b] h-full rounded-full transition-all duration-700"
                      style={{ width: `${bean.bodyPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Configuration: Size & Grind */}
                <div className="space-y-4 pt-2 pb-6">
                  {/* Size selector */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#8c8276]">Presentación</span>
                      <span className="text-[#d49a55] font-semibold">{currentSize}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {sizeOptions.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => handleSizeChange(bean.id, sz)}
                          className={`py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                            currentSize === sz
                              ? 'bg-white/10 text-white border border-[#d49a55]/60'
                              : 'bg-white/[0.02] text-[#8c8276] border border-white/5 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grind selector */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#8c8276]">Molienda</span>
                      <span className="text-[#e0d6c8]">{currentGrind}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {grindOptions.map((gr) => (
                        <button
                          key={gr}
                          onClick={() => handleGrindChange(bean.id, gr)}
                          className={`py-1.5 text-[10px] rounded-lg font-medium transition-all cursor-pointer ${
                            currentGrind === gr
                              ? 'bg-[#d49a55] text-black font-bold'
                              : 'bg-white/[0.02] text-[#7d7367] hover:text-white border border-white/5'
                          }`}
                        >
                          {gr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Price, WhatsApp Checkout, and Quick Add */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#7d7367]">Precio sugerido</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#f7eedf]">
                      ${currentPrice.toLocaleString('es-AR')}
                    </span>
                    <span className="text-[10px] text-[#7d7367] block">ARS · Envío inmediato</span>
                  </div>
                </div>

                {/* Primary CTA: WhatsApp Direct Checkout */}
                <button
                  onClick={() => handleQuickWhatsApp(bean)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#1b3820] hover:bg-[#234b2a] border border-[#2d6335]/60 text-[#4ade80] hover:text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer shadow-lg shadow-black/40"
                >
                  <MessageCircle className="w-4 h-4 text-[#4ade80]" />
                  <span>Pedir directo por WhatsApp</span>
                </button>

                {/* Secondary Actions: Add to Cart & Customizer */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleQuickAdd(bean)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isAdded
                        ? 'bg-[#d49a55] text-black border-[#d49a55]'
                        : 'border-white/10 text-[#d6c9b8] hover:text-white hover:border-white/20 bg-white/[0.02]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Agregado</span>
                      </>
                    ) : (
                      <span>Al Carrito</span>
                    )}
                  </button>

                  <button
                    onClick={() => handleCustomizer(bean)}
                    className="py-2.5 px-3 rounded-xl border border-white/10 text-xs font-medium text-[#9e9386] hover:text-white hover:border-[#d49a55]/40 transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-white/[0.02]"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#d49a55]" />
                    <span>Personalizar</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
