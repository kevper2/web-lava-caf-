import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const [paymentMethod, setPaymentMethod] = useState<'Transferencia Bancaria' | 'MercadoPago'>('Transferencia Bancaria');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pack Magma degustación state (exclusivo en granos)
  const [includePackMagma, setIncludePackMagma] = useState(false);
  const packMagmaGrind: GrindType = 'Granos';

  // Sync state if currentUserProfile changes or modal opens
  React.useEffect(() => {
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
      setIncludePackMagma(true);
    } else {
      setIncludePackMagma(false);
    }

    setErrorMessage(null);
  }, [currentUserProfile, isOpen, directItem]);

  if (!isOpen) return null;

  const isPackMagmaDirect = directItem?.beanId === 'pack-magma';
  const baseItems = directItem && !isPackMagmaDirect ? [directItem] : (isPackMagmaDirect ? [] : cartItems);
  const baseSubtotal = directItem && !isPackMagmaDirect ? directItem.unitPrice * directItem.quantity : (isPackMagmaDirect ? 0 : subtotal);
  const baseDiscount = directItem ? 0 : discount;

  const packRegularPrice = 57000;
  const packDiscount = 5700; // 10% OFF
  const packFinalPrice = 51300;

  const currentSubtotal = baseSubtotal + (includePackMagma ? packRegularPrice : 0);
  const currentDiscount = baseDiscount + (includePackMagma ? packDiscount : 0);
  const currentShipping = 0;
  const currentTotal = currentSubtotal - currentDiscount + currentShipping;

  // Calculate total grams in current order
  const baseGrams = baseItems.reduce((acc, item) => {
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

  const totalGrams = baseGrams + (includePackMagma ? 750 : 0);

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
    const orderId = `LAV-${Math.floor(1000 + Math.random() * 9000)}`;

    const regularLines = baseItems.map(
      (item) => `• *${item.beanName}* (${item.size} | Molienda ${item.grind}) x${item.quantity} -> $${(item.unitPrice * item.quantity).toLocaleString('es-AR')}`
    );

    const packLines = includePackMagma
      ? [`• *Pack Magma · Degustación 3 Orígenes (En Granos)* (3 x 250g: Serra da Mantiqueira + Alpi Italiane + Andes Colombianos) -> $${packFinalPrice.toLocaleString('es-AR')} ARS (10% OFF aplicado)`]
      : [];

    const itemsSummary = [...regularLines, ...packLines].join('\n');

    const mapsLine = (!isPickup && mapsLink.trim()) ? `\n*Ubicación Google Maps:* ${mapsLink.trim()}` : '';

    const deliveryDetail = isPickup
      ? `*Modalidad:* Retiro sin costo (Take Away)\n*Punto de Retiro:* ${pickupLocation} (San Martín de los Andes)`
      : `*Modalidad:* Envío a domicilio\n*Dirección:* ${address.trim()}, ${city} (${province})${mapsLine}`;

    const whatsappMessage = `*ORDEN DE CAFÉ LAVA #${orderId}*
━━━━━━━━━━━━━━━━━━━━
*Cliente:* ${name.trim()}
*WhatsApp:* ${phone.trim()}
*Email:* ${email.trim()}
${deliveryDetail}
*Pago:* ${paymentMethod}

*DETALLE DEL PEDIDO:*
${itemsSummary}

*Total a Pagar:* $${currentTotal.toLocaleString('es-AR')} ARS
━━━━━━━━━━━━━━━━━━━━
_Enviado desde San Martín de los Andes_`;

    const orderItems: CartItem[] = [...baseItems];
    if (includePackMagma) {
      orderItems.push({
        id: `pack-magma-${Date.now()}`,
        beanId: 'pack-magma',
        beanName: 'Pack Magma · Degustación 3x250g en Granos (10% OFF)',
        grind: 'Granos',
        size: '250g',
        unitPrice: packFinalPrice,
        quantity: 1,
        frequency: 'one_time',
      });
    }

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: isPickup ? `Retiro sin costo: ${pickupLocation}` : address.trim(),
      mapsLink: isPickup ? undefined : (mapsLink.trim() || undefined),
      city: isPickup ? 'San Martín de los Andes' : city.trim(),
      province: isPickup ? 'Neuquén' : province.trim(),
      paymentMethod,
      items: orderItems,
      subtotal: currentSubtotal,
      discount: currentDiscount,
      shipping: currentShipping,
      total: currentTotal,
      status: 'confirmado',
      trackingCode: `LAVA-SMA-${Math.floor(10000 + Math.random() * 90000)}`,
      earnedPoints: 0,
    };

    onOrderCreated(newOrder);

    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}

    // Open WhatsApp
    const waUrl = `https://wa.me/5491131476953?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank');

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0a0a0a] border border-white/10 p-6 sm:p-10 shadow-2xl text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <LavaLogo size="sm" />
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8c8276] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#f7eedf] tracking-tight">
            Checkout Directo por WhatsApp
          </h3>
          <p className="text-xs text-[#8c8276] mt-1">
            Coordiná tu despacho directamente en San Martín de los Andes.
          </p>
        </div>

        <form onSubmit={handleGenerateWhatsAppOrder} className="space-y-5 pt-2">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs leading-relaxed font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Oferta Destacada al entrar en el Checkout: Pack Magma Degustación (Exclusivo en Granos) */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
            includePackMagma
              ? 'bg-gradient-to-br from-[#1c150c] to-[#0e0c0a] border-[#d49a55] shadow-lg shadow-[#d49a55]/10'
              : 'bg-[#12100e] border-[#d49a55]/30 hover:border-[#d49a55]/60'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d49a55]/15 border border-[#d49a55]/35 text-[#d49a55] text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#d49a55]" />
                  <span>Oferta Especial · Exclusivo en Granos (10% OFF)</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-[#f7eedf]">
                  Pack Magma · Degustación 3 Orígenes en Granos (250g c/u)
                </h4>
                <p className="text-xs text-[#a89d8f] leading-relaxed">
                  Degustación en grano entero con los 3 paquetes diferentes de 250g (<strong className="text-[#f7eedf] font-semibold">Serra da Mantiqueira</strong> + <strong className="text-[#f7eedf] font-semibold">Alpi Italiane</strong> + <strong className="text-[#f7eedf] font-semibold">Andes Colombianos</strong>). Oferta exclusiva en granos con un 10% de descuento.
                </p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-base sm:text-lg font-extrabold text-[#f7eedf]">
                    ${packFinalPrice.toLocaleString('es-AR')} ARS
                  </span>
                  <span className="text-xs text-[#7d7367] line-through">
                    ${packRegularPrice.toLocaleString('es-AR')}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    (Ahorrás ${packDiscount.toLocaleString('es-AR')} · 10% OFF)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIncludePackMagma(!includePackMagma)}
                className={`shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  includePackMagma
                    ? 'bg-[#d49a55] text-black shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-[#f7eedf] border border-white/15'
                }`}
              >
                {includePackMagma ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Pack en Granos Agregado</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Pack Magma (Granos)</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Items Preview */}
          <div className="p-4 rounded-2xl bg-[#111111] border border-white/5 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#7d7367] font-semibold block">
              Resumen del Pedido
            </span>
            <div className="space-y-2 max-h-44 overflow-y-auto">
              {baseItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-[#e0d6c8]">
                    {item.beanName} ({item.size} · {item.grind}) x{item.quantity}
                  </span>
                  <span className="font-semibold text-white">
                    ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
                  </span>
                </div>
              ))}

              {includePackMagma && (
                <div className="flex justify-between items-start text-xs p-2 rounded-xl bg-[#d49a55]/10 border border-[#d49a55]/20">
                  <div className="space-y-0.5">
                    <span className="text-[#f7eedf] font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#d49a55]" />
                      Pack Magma Degustación (3 x 250g · En Granos)
                    </span>
                    <span className="text-[10px] text-[#a89d8f] block">
                      Serra da Mantiqueira + Alpi Italiane + Andes Colombianos (10% OFF)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-white block">
                      ${packFinalPrice.toLocaleString('es-AR')}
                    </span>
                    <span className="text-[10px] text-[#7d7367] line-through">
                      ${packRegularPrice.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              )}

              {baseItems.length === 0 && !includePackMagma && (
                <p className="text-xs text-[#7d7367] italic py-1">
                  Tu carrito está vacío. Agregá cafés o sumá el Pack Magma degustación.
                </p>
              )}
            </div>

            <div className="pt-2.5 border-t border-white/5 flex justify-between items-center text-sm font-bold text-[#d49a55]">
              <span>Total a Abonar:</span>
              <span>${currentTotal.toLocaleString('es-AR')} ARS</span>
            </div>
          </div>

          {/* Contact Details: Name, WhatsApp & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#a39788] uppercase tracking-wider block">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Sofia Gómez"
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
                placeholder="+54 9 11 3147-6953"
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
            
            {/* Tic para pasar a buscarlo sin costo */}
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
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-600/40 text-emerald-400 text-[10px] font-semibold">
                      Sin Costo
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8c8276] mt-0.5">
                    Habilitá este tic para retirar personalmente tu pedido por el Centro o por Villa Vega San Martín.
                  </p>
                </div>
              </label>

              {/* Selector de puntos de retiro cuando el tic está activo */}
              {isPickup && (
                <div className="pt-3 border-t border-white/5 space-y-2 animate-in fade-in duration-200">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#a39788] block">
                    Seleccioná tu punto de retiro:
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
                        <span className="block text-[10px] text-[#8c8276]">Punto Tostaduría / Residencial</span>
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
                    required
                    placeholder="Calle y número / Barrio / Departamento"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-sm text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
                  />
                </div>

                {/* Google Maps link field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#a39788] uppercase tracking-wider block">
                      Link de Google Maps
                    </label>
                    <span className="text-[10px] text-[#8c8276]">
                      Para accesos poco claros o cabañas de montaña
                    </span>
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
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-[10px] font-semibold">
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

          {/* Payment method */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#a39788] uppercase tracking-wider block">
              Método de Pago Preferido
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(['Transferencia Bancaria', 'MercadoPago'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    paymentMethod === m
                      ? 'bg-white/10 text-white border border-[#d49a55]'
                      : 'bg-[#111111] text-[#7d7367] border border-white/5 hover:text-white'
                  }`}
                >
                  {m === 'Transferencia Bancaria' ? 'Transferencia Bancaria' : 'MercadoPago'}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#1b3820] hover:bg-[#234b2a] border border-[#2d6335] text-[#4ade80] hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xl shadow-black/50"
            >
              <MessageCircle className="w-5 h-5 text-[#4ade80]" />
              <span>{isSubmitting ? 'Abriendo WhatsApp...' : 'Confirmar Pedido por WhatsApp'}</span>
            </button>
            <p className="text-center text-[10px] text-[#7d7367]">
              Se abrirá un chat directo con el equipo LAVA en San Martín de los Andes para coordinar entrega y pago.
            </p>
          </div>

        </form>

      </div>

    </div>
  );
};
