import React, { useState } from 'react';
import { CartItem, Order, GrindType, BagSize, LoyaltyProfile } from '../types';
import { LavaLogo } from './LavaLogo';
import { calculateEarnedPointsFromItems } from '../data/coffeeData';
import { 
  X, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Check, 
  CreditCard, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  MapPin,
  Mail,
  ExternalLink,
  HelpCircle
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
  const [paymentMethod, setPaymentMethod] = useState<'Transferencia Bancaria' | 'MercadoPago' | 'Tarjeta de Crédito'>('Transferencia Bancaria');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    }
    setErrorMessage(null);
  }, [currentUserProfile, isOpen]);

  if (!isOpen) return null;

  const itemsToCheckout = directItem ? [directItem] : cartItems;
  const currentSubtotal = directItem ? directItem.unitPrice * directItem.quantity : subtotal;
  const currentDiscount = directItem ? 0 : discount;
  const currentShipping = 0;
  const currentTotal = currentSubtotal - currentDiscount + currentShipping;

  const handleGenerateWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

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
      setErrorMessage('Por favor completá un email válido para sumarte al Club Magma y enviarte el comprobante.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Por favor indicá la dirección de entrega en San Martín de los Andes.');
      return;
    }

    setIsSubmitting(true);
    const orderId = `LAV-${Math.floor(1000 + Math.random() * 9000)}`;

    const itemsSummary = itemsToCheckout
      .map((item) => `• *${item.beanName}* (${item.size} | Molienda ${item.grind}) x${item.quantity} -> $${(item.unitPrice * item.quantity).toLocaleString('es-AR')}`)
      .join('\n');

    const mapsLine = mapsLink.trim() ? `\n*Ubicación Google Maps:* ${mapsLink.trim()}` : '';

    const whatsappMessage = `*ORDEN DE CAFÉ LAVA #${orderId}*
━━━━━━━━━━━━━━━━━━━━
*Cliente:* ${name.trim()}
*WhatsApp:* ${phone.trim()}
*Email:* ${email.trim()}
*Dirección:* ${address.trim()}, ${city} (${province})${mapsLine}
*Pago:* ${paymentMethod}

*DETALLE DEL PEDIDO:*
${itemsSummary}

*Total a Pagar:* $${currentTotal.toLocaleString('es-AR')} ARS
━━━━━━━━━━━━━━━━━━━━
_Enviado desde San Martín de los Andes_`;

    const earnedPoints = calculateEarnedPointsFromItems(itemsToCheckout);

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      mapsLink: mapsLink.trim() || undefined,
      city: city.trim(),
      province: province.trim(),
      paymentMethod,
      items: itemsToCheckout,
      subtotal: currentSubtotal,
      discount: currentDiscount,
      shipping: currentShipping,
      total: currentTotal,
      status: 'confirmado',
      trackingCode: `LAVA-SMA-${Math.floor(10000 + Math.random() * 90000)}`,
      earnedPoints,
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
            Coordiná tu despacho directamente con nuestra tostaduría en San Martín de los Andes.
          </p>
        </div>

        <form onSubmit={handleGenerateWhatsAppOrder} className="space-y-5 pt-2">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs leading-relaxed font-semibold">
              {errorMessage}
            </div>
          )}
          
          {/* Items Preview */}
          <div className="p-4 rounded-2xl bg-[#111111] border border-white/5 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#7d7367] font-semibold block">
              Resumen de Selección
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {itemsToCheckout.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-[#e0d6c8]">
                    {item.beanName} ({item.size} · {item.grind}) x{item.quantity}
                  </span>
                  <span className="font-semibold text-white">
                    ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-white/5 flex justify-between items-center text-sm font-bold text-[#d49a55]">
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

          {/* Email field (Mandatory for Club Magma auto-enrolment) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#a39788] uppercase tracking-wider block">
                Email *
              </label>
              <span className="text-[10px] text-[#d49a55] font-medium">
                Te sumamos automáticamente al Club Magma para sumar puntos
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

          {/* Delivery Address */}
          <div className="space-y-4">
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

          {/* Payment method */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#a39788] uppercase tracking-wider block">
              Método de Pago Preferido
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Transferencia Bancaria', 'MercadoPago', 'Tarjeta de Crédito'] as const).map((m) => (
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
                  {m === 'Transferencia Bancaria' ? 'Transferencia' : m}
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
