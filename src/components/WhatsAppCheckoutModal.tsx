import React, { useState, useEffect } from 'react';
import { CartItem, Order, GrindType, BagSize, LoyaltyProfile } from '../types';
import { LavaLogo } from './LavaLogo';
import { 
  X, 
  MessageCircle, 
  Truck, 
  Check, 
  Sparkles, 
  MapPin,
  Mail,
  Trash2
} from 'lucide-react';
import { triggerCoffeeBeanConfetti } from '../utils/coffeeConfetti';

interface WhatsAppCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  onOrderCreated: (order: Order) => void;
  directItem?: CartItem | null;
  currentUserProfile?: LoyaltyProfile | null;
  onUpdateQuantity?: (itemId: string, newQty: number) => void;
  onRemoveItem?: (itemId: string) => void;
}

export const WhatsAppCheckoutModal: React.FC<WhatsAppCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  discount,
  shipping,
  total,
  onOrderCreated,
  directItem,
  currentUserProfile,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  // Form fields - Only prefill if user is logged in
  const [name, setName] = useState(currentUserProfile?.customerName || '');
  const [phone, setPhone] = useState(currentUserProfile?.phone || '+54 9 ');
  const [email, setEmail] = useState(currentUserProfile?.email || '');
  const [address, setAddress] = useState('');
  const [mapsLink, setMapsLink] = useState('');
  const [city, setCity] = useState('San Martín de los Andes');
  const [province, setProvince] = useState('Neuquén');
  const [isPickup, setIsPickup] = useState(false);
  const [pickupLocation, setPickupLocation] = useState<'Centro' | 'Villa Vega San Martín'>('Centro');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pack Magma degustación state (exclusivo en granos)
  const [includePackMagma, setIncludePackMagma] = useState(false);

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

  // Sync state if currentUserProfile changes or modal opens
  useEffect(() => {
    if (currentUserProfile) {
      setName(currentUserProfile.customerName);
      setPhone(currentUserProfile.phone);
      setEmail(currentUserProfile.email);
    } else {
      setName('');
      setPhone('+54 9 ');
      setEmail('');
      setAddress('');
      setMapsLink('');
      setIsPickup(false);
      setPickupLocation('Centro');
    }

    if (directItem?.beanId === 'pack-magma') {
      setIncludePackMagma(false);
    } else {
      setIncludePackMagma(false);
    }

    setErrorMessage(null);
  }, [currentUserProfile, isOpen, directItem]);

  if (!isOpen) return null;

  const isPackMagmaDirect = directItem?.beanId === 'pack-magma';
  const packItemFormatted: CartItem = {
    id: directItem?.id || `pack-magma-${Date.now()}`,
    beanId: 'pack-magma',
    beanName: 'Pack Magma · Degustación 3 Orígenes (3x250g en Granos)',
    grind: 'Granos',
    size: '3 x 250g (750g)',
    unitPrice: 51300,
    quantity: directItem?.quantity || 1,
    frequency: 'one_time',
  };

  const baseItems = isPackMagmaDirect
    ? [packItemFormatted]
    : (directItem ? [directItem] : cartItems);

  const packRegularPrice = 57000;
  const packDiscount = 5700; // 10% OFF
  const packFinalPrice = 51300;

  const isPackMagmaInItems = baseItems.some((i) => i.beanId === 'pack-magma');
  const shouldAddExtraPack = includePackMagma && !isPackMagmaInItems;

  const currentSubtotal = baseItems.reduce((acc, item) => {
    if (item.beanId === 'pack-magma') {
      return acc + packRegularPrice * item.quantity;
    }
    return acc + item.unitPrice * item.quantity;
  }, 0) + (shouldAddExtraPack ? packRegularPrice : 0);

  const currentDiscount = baseItems.reduce((acc, item) => {
    if (item.beanId === 'pack-magma') {
      return acc + packDiscount * item.quantity;
    }
    return acc;
  }, 0) + (shouldAddExtraPack ? packDiscount : 0);

  const currentShipping = 0;
  const currentTotal = currentSubtotal - currentDiscount + currentShipping;

  // Calculate total grams in current order
  const baseGrams = baseItems.reduce((acc, item) => {
    if (item.beanId === 'pack-magma') {
      return acc + 750 * item.quantity;
    }
    let grams = 250;
    const lower = item.size.toLowerCase();
    if (lower.includes('1kg') || lower.includes('1000')) {
      grams = 1000;
    } else if (lower.includes('500')) {
      grams = 500;
    } else if (lower.includes('250')) {
      grams = 250;
    }
    return acc + grams * item.quantity;
  }, 0);

  const totalGrams = baseGrams + (shouldAddExtraPack ? 750 : 0);

  const handleGenerateWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (baseItems.length === 0 && !includePackMagma) {
      setErrorMessage('Por favor seleccioná al menos un café o activá el Pack Magma degustación para continuar con el pedido.');
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Por favor completá tu nombre y apellido.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      setErrorMessage('Por favor completá un número de WhatsApp válido.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor completá un email válido para enviarte el comprobante y detalle de despacho.');
      return;
    }
    if (!isPickup && !address.trim()) {
      setErrorMessage('Por favor indicá la dirección de entrega en San Martín de los Andes, o seleccioná la opción de pasar a buscarlo sin costo.');
      return;
    }

    setIsSubmitting(true);
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yy = now.getFullYear().toString().slice(-2);
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const min = pad(now.getMinutes());
    const orderCode = `#LAVA-${yy}${mm}${dd}${hh}${min}`;

    const regularLines = baseItems.map((item) => {
      if (item.beanId === 'pack-magma') {
        return `• *${item.beanName}* (x${item.quantity})
  - Contenido: ${item.quantity * 3} x 250g (${item.quantity * 750}g totales en Granos)
  - Variedades: Serra da Mantiqueira + Alpi Italiane + Andes Colombianos
  - Precio: $${(item.unitPrice * item.quantity).toLocaleString('es-AR')} ARS _(10% OFF aplicado · Regular $${(packRegularPrice * item.quantity).toLocaleString('es-AR')})_`;
      }
      return `• *${item.beanName}* (${item.size} | Molienda ${item.grind}) x${item.quantity} -> $${(item.unitPrice * item.quantity).toLocaleString('es-AR')}`;
    });

    const packLines = shouldAddExtraPack
      ? [`• *Pack Magma · Degustación 3 Orígenes (En Granos)* (3 x 250g: Serra da Mantiqueira + Alpi Italiane + Andes Colombianos) -> $${packFinalPrice.toLocaleString('es-AR')} ARS (10% OFF aplicado)`]
      : [];

    const itemsSummary = [...regularLines, ...packLines].join('\n');

    const mapsLine = (!isPickup && mapsLink.trim()) ? `\n*Ubicación Google Maps:* ${mapsLink.trim()}` : '';

    const deliveryDetail = isPickup
      ? `*Modalidad:* Retiro sin costo (Take Away)\n*Punto de Retiro:* ${pickupLocation} (San Martín de los Andes)`
      : `*Modalidad:* Envío a domicilio\n*Dirección:* ${address.trim()}, ${city} (${province})${mapsLine}`;

    const shippingLine = totalGrams >= 500 ? 'Bonificado sin costo' : 'Consultar - Retiro gratuito';
    const discountLine = currentDiscount > 0 ? `*Descuento (10% OFF):* -$${currentDiscount.toLocaleString('es-AR')} ARS\n` : '';

    const whatsappMessage = `*ORDEN DE CAFÉ ${orderCode}*
━━━━━━━━━━━━━━━━━━━━
*Cliente:* ${name.trim()}
*WhatsApp:* ${phone.trim()}
*Email:* ${email.trim()}
${deliveryDetail}

*DETALLE DEL PEDIDO:*
${itemsSummary}

*Subtotal:* $${currentSubtotal.toLocaleString('es-AR')} ARS
${discountLine}*Envío en SMA:* ${shippingLine}
*Total a Pagar:* $${currentTotal.toLocaleString('es-AR')} ARS
━━━━━━━━━━━━━━━━━━━━
_Enviado desde San Martín de los Andes_`;

    const orderItems: CartItem[] = [...baseItems];
    if (shouldAddExtraPack) {
      orderItems.push({
        id: `pack-magma-${Date.now()}`,
        beanId: 'pack-magma',
        beanName: 'Pack Magma · Degustación 3x250g en Granos (10% OFF)',
        grind: 'Granos',
        size: '3 x 250g (750g)',
        unitPrice: packFinalPrice,
        quantity: 1,
        frequency: 'one_time',
      });
    }

    const newOrder: Order = {
      id: orderCode,
      date: new Date().toISOString().split('T')[0],
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: isPickup ? `Retiro sin costo: ${pickupLocation}` : address.trim(),
      mapsLink: isPickup ? undefined : (mapsLink.trim() || undefined),
      city: isPickup ? 'San Martín de los Andes' : city.trim(),
      province: isPickup ? 'Neuquén' : province.trim(),
      paymentMethod: 'Coordinar con Tostaduría',
      items: orderItems,
      subtotal: currentSubtotal,
      discount: currentDiscount,
      shipping: currentShipping,
      total: currentTotal,
      status: 'confirmado',
      trackingCode: orderCode,
      earnedPoints: 0,
    };

    onOrderCreated(newOrder);

    // Trigger coffee bean confetti!
    triggerCoffeeBeanConfetti();

    // Open WhatsApp
    const waUrl = `https://wa.me/5492972544894?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank');

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Modal Container: Flex column with fixed header so Close Button is ALWAYS visible */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl text-left overflow-hidden">
        
        {/* Pinned Header: Always visible X button and Logo */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md shrink-0 z-20">
          <div className="flex items-center gap-3">
            <LavaLogo size="sm" />
            <span className="text-[11px] uppercase tracking-wider text-[#d49a55] font-semibold hidden sm:inline">
              Checkout Directo
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
              Finalizar Pedido de Café
            </h3>
            <p className="text-xs text-[#8c8276] mt-1 leading-relaxed">
              Completá tus datos de entrega en San Martín de los Andes. Te derivamos a WhatsApp para coordinar despacho.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200">
              {errorMessage}
            </div>
          )}

          {/* Items Summary Accordion / Preview */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-[#121212] border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#d49a55] font-semibold block">
                Resumen de Productos ({baseItems.reduce((acc, i) => acc + i.quantity, 0) + (shouldAddExtraPack ? 1 : 0)}):
              </span>
              <span className="text-[10px] text-[#8c8276]">
                Ajustá unidades o eliminá con + / -
              </span>
            </div>

            <div className="space-y-2 pt-1 max-h-56 overflow-y-auto modal-scrollbar pr-1">
              {baseItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs py-2.5 border-b border-white/5 last:border-0">
                  <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white block">{item.beanName}</span>
                      {item.beanId === 'pack-magma' && (
                        <span className="px-2 py-0.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-[10px] font-bold">
                          10% OFF
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#8c8276] block leading-relaxed">
                      {item.beanId === 'pack-magma'
                        ? '3 x 250g (750g totales) en Granos · 3 Orígenes'
                        : `${item.size} · Molienda ${item.grind}`
                      }
                    </span>
                  </div>

                  {/* Quantity controls and price */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="flex items-center bg-black/80 border border-white/10 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity <= 1) {
                            if (onRemoveItem) onRemoveItem(item.id);
                            else if (onUpdateQuantity) onUpdateQuantity(item.id, 0);
                          } else {
                            if (onUpdateQuantity) onUpdateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        className="w-6 h-6 flex items-center justify-center text-xs text-[#a99c8d] hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors"
                        title={item.quantity <= 1 ? "Eliminar del pedido" : "Restar unidad"}
                      >
                        {item.quantity <= 1 ? (
                          <Trash2 className="w-3 h-3 text-rose-400" />
                        ) : (
                          <span className="font-bold text-sm leading-none">-</span>
                        )}
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-white font-mono">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (onUpdateQuantity) onUpdateQuantity(item.id, item.quantity + 1);
                        }}
                        className="w-6 h-6 flex items-center justify-center text-xs text-[#a99c8d] hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors"
                        title="Sumar unidad"
                      >
                        <span className="font-bold text-sm leading-none">+</span>
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="font-mono text-[#d49a55] font-semibold block text-xs sm:text-sm">
                        ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
                      </span>
                      {item.beanId === 'pack-magma' && (
                        <span className="text-[10px] text-[#6d6459] line-through font-mono block">
                          ${(packRegularPrice * item.quantity).toLocaleString('es-AR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {baseItems.length === 0 && !shouldAddExtraPack && (
                <div className="text-xs text-[#8c8276] py-4 text-center bg-black/40 rounded-xl border border-dashed border-white/10">
                  El carrito está vacío. Podés sumar el Pack Magma degustación abajo o volver al catálogo para elegir cafés.
                </div>
              )}
            </div>

            {/* Pack Magma degustación checkbox option - Solo visible si no está ya en el carrito */}
            {!isPackMagmaInItems && (
              <div className="pt-3 border-t border-white/5">
                <label className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-[#17120b] to-[#120e09] border border-[#d49a55]/30 cursor-pointer select-none hover:border-[#d49a55]/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={includePackMagma}
                    onChange={(e) => setIncludePackMagma(e.target.checked)}
                    className="mt-0.5 accent-[#d49a55] w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#f7eedf]">
                        Sumar Pack Magma Degustación (3x250g en Granos)
                      </span>
                      <span className="text-[#25D366] font-bold">10% OFF</span>
                    </div>
                    <p className="text-[11px] text-[#a89d8f] mt-0.5">
                      3 bolsas de 250g en granos (Serra da Mantiqueira, Alpi Italiane y Andes Colombianos) por <strong className="text-[#f7eedf] font-mono">$51.300</strong> <span className="line-through text-[#6d6459]">$57.000</span>.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Total calculation */}
            <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#8c8276]">
                <span>Subtotal:</span>
                <span className="font-mono text-white">${currentSubtotal.toLocaleString('es-AR')}</span>
              </div>
              {currentDiscount > 0 && (
                <div className="flex justify-between text-[#25D366]">
                  <span>Descuento Pack (10% OFF):</span>
                  <span className="font-mono">-${currentDiscount.toLocaleString('es-AR')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#8c8276]">
                <span>Envío:</span>
                <span className={totalGrams >= 500 ? "text-[#25D366] font-medium" : "text-[#d49a55] font-medium"}>
                  {totalGrams >= 500 ? 'Gratis (SMA)' : 'Consultar - Retiro gratuito'}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#f7eedf] pt-1 border-t border-white/10">
                <span>Total a Pagar:</span>
                <span className="font-mono text-[#d49a55] text-lg">${currentTotal.toLocaleString('es-AR')} ARS</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleGenerateWhatsAppOrder} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a39788] uppercase tracking-wider block">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-sm text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a39788] uppercase tracking-wider block">
                  WhatsApp de Contacto *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+54 9 2972 54-4894"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-sm text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#a39788] uppercase tracking-wider block">
                  Email *
                </label>
                <span className="text-[10px] text-[#a89d8f]">
                  Para enviarte el comprobante y detalle de despacho
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8c8276] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="tuemail@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#141414] border border-white/10 text-sm text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
                />
              </div>
            </div>

            {/* Delivery Address & Pickup Mode */}
            <div className="space-y-3.5">
              
              {/* Checkbox para pasar a buscarlo sin costo */}
              <div className="p-3.5 rounded-2xl bg-[#121212] border border-white/10 space-y-3 transition-all">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={isPickup}
                      onChange={(e) => setIsPickup(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isPickup 
                        ? 'bg-[#d49a55] border-[#d49a55] text-black' 
                        : 'bg-[#1a1a1a] border-white/20 peer-hover:border-white/40 text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#f7eedf]">
                        Pasar a buscarlo sin costo (Take Away)
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-[10px] font-semibold">
                        Sin Costo
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8c8276] mt-0.5">
                      Habilitá este casillero para retirar personalmente tu pedido por el Centro o por Villa Vega San Martín.
                    </p>
                  </div>
                </label>

                {/* Selector de puntos de retiro cuando el checkbox está activo (sin la frase Punto de tostaduría) */}
                {isPickup && (
                  <div className="pt-3 border-t border-white/5 space-y-2 animate-in fade-in duration-200">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#a39788] block">
                      Seleccioná tu lugar de retiro:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPickupLocation('Centro')}
                        className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 border transition-all text-left cursor-pointer ${
                          pickupLocation === 'Centro'
                            ? 'bg-[#d49a55]/15 border-[#d49a55] text-white shadow-sm'
                            : 'bg-[#161616] border-white/5 text-[#8c8276] hover:text-white hover:border-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          pickupLocation === 'Centro' ? 'border-[#d49a55] bg-[#d49a55]' : 'border-white/30'
                        }`}>
                          {pickupLocation === 'Centro' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                        <div>
                          <span className="block text-[#f7eedf] font-medium">Centro</span>
                          <span className="block text-[10px] text-[#8c8276]">San Martín de los Andes</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPickupLocation('Villa Vega San Martín')}
                        className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 border transition-all text-left cursor-pointer ${
                          pickupLocation === 'Villa Vega San Martín'
                            ? 'bg-[#d49a55]/15 border-[#d49a55] text-white shadow-sm'
                            : 'bg-[#161616] border-white/5 text-[#8c8276] hover:text-white hover:border-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          pickupLocation === 'Villa Vega San Martín' ? 'border-[#d49a55] bg-[#d49a55]' : 'border-white/30'
                        }`}>
                          {pickupLocation === 'Villa Vega San Martín' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                        <div>
                          <span className="block text-[#f7eedf] font-medium">Villa Vega San Martín</span>
                          <span className="block text-[10px] text-[#8c8276]">San Martín de los Andes</span>
                        </div>
                      </button>
                    </div>
                    <p className="text-[10px] text-[#d49a55] mt-1 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 flex-shrink-0" />
                      <span>Te pasamos por WhatsApp la dirección exacta y coordinamos el horario para que pases a buscarlo.</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Dirección de entrega (cuando NO es retiro) */}
              {!isPickup ? (
                <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#a39788] uppercase tracking-wider block">
                      Dirección de Entrega *
                    </label>
                    <input
                      type="text"
                      required={!isPickup}
                      placeholder="Calle y altura, barrio (ej: Belgrano 840, Centro)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-sm text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
                    />
                  </div>

                  {/* Google Maps link opcional */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#a39788] uppercase tracking-wider block">
                        Ubicación en Google Maps (Opcional)
                      </label>
                      <span className="text-[10px] text-[#8c8276]">Facilita la entrega</span>
                    </div>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#8c8276] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        placeholder="https://maps.app.goo.gl/..."
                        value={mapsLink}
                        onChange={(e) => setMapsLink(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#141414] border border-white/10 text-sm text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#a39788] uppercase tracking-wider block">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-sm text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#a39788] uppercase tracking-wider block">
                        Provincia
                      </label>
                      <input
                        type="text"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-sm text-white"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Apartado informativo: Envíos gratis mínimo 500g Centro a Vega Maipú */}
              <div className="p-3.5 rounded-2xl bg-[#14110d] border border-[#d49a55]/25 flex items-start gap-3 text-xs leading-relaxed">
                <div className="p-2 rounded-xl bg-[#d49a55]/10 border border-[#d49a55]/30 text-[#d49a55] flex-shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-[#f7eedf] text-xs">
                      Zona de Envío sin Cargo
                    </span>
                    {totalGrams >= 500 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-[10px] font-semibold">
                        <Check className="w-3 h-3" />
                        <span>¡Envío gratis activado! ({totalGrams}g)</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#1c1611] border border-[#d49a55]/30 text-[#d49a55] text-[10px] font-medium">
                        Pedido actual: {totalGrams}g (mín. 500g)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#a89d8f]">
                    Los pedidos son <strong className="text-white font-semibold">gratis comprando un mínimo de 500g</strong> en la zona comprendida entre el <span className="text-[#f7eedf] font-medium">centro de San Martín de los Andes</span> y <span className="text-[#f7eedf] font-medium">La Vega Maipú</span>.
                  </p>
                </div>
              </div>

            </div>

            {/* Submit Action - Unified WhatsApp Green */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || (baseItems.length === 0 && !shouldAddExtraPack)}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-black/50 ${
                  baseItems.length === 0 && !shouldAddExtraPack
                    ? 'bg-white/5 text-[#6d6459] border border-white/10 cursor-not-allowed'
                    : 'bg-[#25D366]/20 hover:bg-[#25D366] border border-[#25D366]/50 text-[#25D366] hover:text-black cursor-pointer active:scale-95'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>
                  {isSubmitting
                    ? 'Abriendo WhatsApp...'
                    : baseItems.length === 0 && !shouldAddExtraPack
                    ? 'Seleccioná al menos 1 café'
                    : 'Confirmar Pedido por WhatsApp'
                  }
                </span>
              </button>
              <p className="text-center text-[10px] text-[#7d7367]">
                Se abrirá un chat directo con el equipo LAVA en San Martín de los Andes para coordinar entrega.
              </p>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};
