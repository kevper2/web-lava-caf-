import React, { useState, useEffect } from 'react';
import { CoffeeBean, GrindType, BagSize, Frequency, CartItem } from '../types';
import { COFFEE_BEANS } from '../data/coffeeData';
import { LavaLogo } from './LavaLogo';
import { X, Sparkles, MessageCircle, ShoppingBag, Check } from 'lucide-react';
import { triggerCoffeeBeanConfetti } from '../utils/coffeeConfetti';

interface BeanCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBean: CoffeeBean | null;
  onAddToCart: (item: CartItem) => void;
  onDirectWhatsApp: (item: CartItem) => void;
}

export const BeanCustomizerModal: React.FC<BeanCustomizerModalProps> = ({
  isOpen,
  onClose,
  initialBean,
  onAddToCart,
  onDirectWhatsApp,
}) => {
  const [selectedBeanId, setSelectedBeanId] = useState<string>(
    initialBean ? initialBean.id : COFFEE_BEANS[0].id
  );
  // Default to 250g as requested
  const [selectedSize, setSelectedSize] = useState<BagSize>('250g');
  const [selectedGrind, setSelectedGrind] = useState<GrindType>('Granos');
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency>('one_time');
  const [quantity, setQuantity] = useState(1);
  const [showAddedCheck, setShowAddedCheck] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Sync selected bean whenever initialBean or isOpen changes
  useEffect(() => {
    if (initialBean) {
      setSelectedBeanId(initialBean.id);
    }
  }, [initialBean, isOpen]);

  if (!isOpen) return null;

  const currentBean = COFFEE_BEANS.find((b) => b.id === selectedBeanId) || COFFEE_BEANS[0];
  const basePrice = currentBean.prices[selectedSize];
  const discountMultiplier = selectedFrequency !== 'one_time' ? 0.85 : 1;
  const unitPrice = Math.round(basePrice * discountMultiplier);
  const totalPrice = unitPrice * quantity;

  const grindOptions: { type: GrindType; label: string; desc: string }[] = [
    { type: 'Granos', label: 'Granos Enteros', desc: 'Para moler al momento' },
    { type: 'Filtro', label: 'Filtro / V60', desc: 'Molienda media cristalina' },
    { type: 'Espresso', label: 'Espresso', desc: 'Molienda fina de presión' },
    { type: 'Moka', label: 'Moka Italiana', desc: 'Molienda media-fina densa' },
    { type: 'Prensa', label: 'Prensa Francesa', desc: 'Molienda gruesa inmersión' },
  ];

  const sizeOptions: { size: BagSize; cups: string }[] = [
    { size: '250g', cups: 'Aprox 15 tazas' },
    { size: '500g', cups: 'Aprox 30 tazas' },
    { size: '1kg', cups: 'Aprox 60 tazas' },
  ];

  const handleAddToCart = () => {
    const item: CartItem = {
      id: `${currentBean.id}-${selectedSize}-${selectedGrind}-${Date.now()}`,
      beanId: currentBean.id,
      beanName: currentBean.name,
      grind: selectedGrind,
      size: selectedSize,
      unitPrice,
      quantity,
      frequency: selectedFrequency,
    };

    onAddToCart(item);
    setShowAddedCheck(true);
    triggerCoffeeBeanConfetti();

    setTimeout(() => {
      setShowAddedCheck(false);
      onClose();
    }, 900);
  };

  const handleWhatsAppDirect = () => {
    const item: CartItem = {
      id: `${currentBean.id}-${selectedSize}-${selectedGrind}-${Date.now()}`,
      beanId: currentBean.id,
      beanName: currentBean.name,
      grind: selectedGrind,
      size: selectedSize,
      unitPrice,
      quantity,
      frequency: selectedFrequency,
    };

    onDirectWhatsApp(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Container: Flex column with fixed header so Close Button is ALWAYS visible */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl text-left overflow-hidden">
        
        {/* Pinned Header: Always visible X button and Logo */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md shrink-0 z-20">
          <div className="flex items-center gap-3">
            <LavaLogo size="sm" />
            <span className="text-[11px] uppercase tracking-wider text-[#d49a55] font-semibold hidden sm:inline">
              Personalizador
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8c8276] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar modal (Esc)"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body with contained custom scrollbar */}
        <div className="overflow-y-auto modal-scrollbar p-6 sm:p-10 space-y-6 flex-1">

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#f7eedf] tracking-tight">
              Personalizador de Molienda & Estilo de Café
            </h3>
            <p className="text-xs text-[#8c8276] mt-1">
              Ajustá cada variable a tu método de extracción preferido.
            </p>
          </div>

          <div className="space-y-6 pt-2">
            
            {/* Style selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8c8276] uppercase tracking-wider block">
                1. Seleccionar Estilo de Café
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {COFFEE_BEANS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBeanId(b.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedBeanId === b.id
                        ? 'bg-white/10 border-[#d49a55] text-white shadow-lg'
                        : 'bg-[#111111] border-white/5 text-[#8c8276] hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{b.name}</div>
                    <div className="text-[10px] text-[#a99c8d]">{b.personality.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8c8276] uppercase tracking-wider block">
                2. Tamaño de la Bolsa
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {sizeOptions.map((opt) => (
                  <button
                    key={opt.size}
                    onClick={() => setSelectedSize(opt.size)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedSize === opt.size
                        ? 'bg-white/10 border-[#d49a55] text-white'
                        : 'bg-[#111111] border-white/5 text-[#8c8276] hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.size}</div>
                    <div className="text-[10px] text-[#7d7367]">{opt.cups}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Grind selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8c8276] uppercase tracking-wider block">
                3. Tipo de Molienda
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {grindOptions.map((g) => (
                  <button
                    key={g.type}
                    onClick={() => setSelectedGrind(g.type)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex justify-between items-center ${
                      selectedGrind === g.type
                        ? 'bg-[#d49a55]/15 border-[#d49a55] text-white'
                        : 'bg-[#111111] border-white/5 text-[#8c8276] hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{g.label}</div>
                      <div className="text-[10px] text-[#7d7367]">{g.desc}</div>
                    </div>
                    {selectedGrind === g.type && <Check className="w-4 h-4 text-[#d49a55]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8c8276] uppercase tracking-wider block">
                4. Cantidad
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-[#111111] border border-white/10 text-white font-bold hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-mono text-base font-bold text-white px-3">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl bg-[#111111] border border-white/10 text-white font-bold hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total and CTA buttons */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#8c8276] block">Precio Total:</span>
                  <span className="text-2xl font-bold text-[#f7eedf] font-mono">
                    ${totalPrice.toLocaleString('es-AR')} ARS
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#8c8276] block">Presentación:</span>
                  <span className="text-sm font-semibold text-[#d49a55]">
                    {selectedSize} · {selectedGrind}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleWhatsAppDirect}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366] border border-[#25D366]/50 text-[#25D366] hover:text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-black/40"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir directo por WhatsApp</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 px-4 rounded-2xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    showAddedCheck
                      ? 'bg-[#d49a55] text-black border-[#d49a55]'
                      : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
                  }`}
                >
                  {showAddedCheck ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Agregado al Carrito!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Agregar al Carrito</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
