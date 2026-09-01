import React, { useState } from 'react';
import { CartItem, Order, GrindType, BagSize } from '../types';
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
}) => {
  // Form fields
  const [name, setName] = useState('Santiago Villar');
  const [phone, setPhone] = useState('+54 9 11 3147-6953');
  const [email, setEmail] = useState('santiago@patagoniaprive.com');
  const [address, setAddress] = useState('Barrio Las Pendientes');
  const [city, setCity] = useState('San Martín de los Andes');
  const [province, setProvince] = useState('Neuquén');
  const [paymentMethod, setPaymentMethod] = useState<'Transferencia Bancaria' | 'MercadoPago' | 'Tarjeta de Crédito'>('Transferencia Bancaria');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const itemsToCheckout = directItem ? [directItem] : cartItems;
  const currentSubtotal = directItem ? directItem.unitPrice * directItem.quantity : subtotal;
  const currentDiscount = directItem ? 0 : discount;
  const currentShipping = 0;
  const currentTotal = currentSubtotal - currentDiscount + currentShipping;

  const handleGenerateWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Por favor completá los campos principales para coordinar tu envío.');
      return;
    }

    setIsSubmitting(true);
    const orderId = `LAV-${Math.floor(1000 + Math.random() * 9000)}`;

    const itemsSummary = itemsToCheckout
      .map((item, idx) => `• *${item.beanName}* (${item.size} | Molienda ${item.grind}) x${item.quantity} -> $${(item.unitPrice * item.quantity).toLocaleString('es-AR')}`)
      .join('\n');

    const whatsappMessage = `*ORDEN DE CAFÉ LAVA #${orderId}*
━━━━━━━━━━━━━━━━━━━━
*Cliente:* ${name}
*Teléfono:* ${phone}
*Dirección:* ${address}, ${city} (${province})
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
      customerName: name,
      phone,
      email,
      address,
      city,
      province,
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

        <form onSubmit={handleGenerateWhatsAppOrder} className="space-y-6 pt-2">
          
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

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8c8276] uppercase tracking-wider">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8c8276] uppercase tracking-wider">
                WhatsApp de Contacto *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8c8276] uppercase tracking-wider">
                Dirección de Entrega *
              </label>
              <input
                type="text"
                required
                placeholder="Calle y número / Barrio / Departamento"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8c8276] uppercase tracking-wider">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8c8276] uppercase tracking-wider">
                  Provincia
                </label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#8c8276] uppercase tracking-wider block">
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
            <p className="text-center text-[10px] text-[#5e554a]">
              Se abrirá un chat privado con el equipo LAVA en San Martín de los Andes para coordinar entrega y pago.
            </p>
          </div>

        </form>

      </div>

    </div>
  );
};
