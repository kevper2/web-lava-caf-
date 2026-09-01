import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { Truck, CheckCircle2, Flame, Package, MapPin, MessageCircle, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DeliveryTrackerProps {
  orders: Order[];
  onSimulateNotification: (orderId: string) => void;
}

export const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({
  orders,
  onSimulateNotification,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.length > 0 ? orders[0].id : ''
  );
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const stepsConfig: { status: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      status: 'recibido',
      label: 'Confirmado',
      icon: <MessageCircle className="w-4 h-4" />,
      desc: 'Validado por WhatsApp en San Martín de los Andes',
    },
    {
      status: 'tostado_fresco',
      label: 'Tueste de Altura',
      icon: <Flame className="w-4 h-4" />,
      desc: 'Curva térmica de precisión aplicada',
    },
    {
      status: 'molienda_empaque',
      label: 'Empaque & Válvula',
      icon: <Package className="w-4 h-4" />,
      desc: 'Sellado hermético tricapa con protección aromática',
    },
    {
      status: 'despachado',
      label: 'Despachado',
      icon: <Truck className="w-4 h-4" />,
      desc: 'En tránsito desde Neuquén',
    },
    {
      status: 'en_camino',
      label: 'En Ruta Local',
      icon: <MapPin className="w-4 h-4" />,
      desc: 'Hacia tu domicilio asignado',
    },
    {
      status: 'entregado',
      label: 'Entregado',
      icon: <CheckCircle2 className="w-4 h-4" />,
      desc: 'Listo para calibrar en tu taza',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    return stepsConfig.findIndex((s) => s.status === status);
  };

  const currentStepIdx = selectedOrder ? getStepIndex(selectedOrder.status) : 0;

  const handleSimulateAlert = () => {
    if (!selectedOrder) return;
    onSimulateNotification(selectedOrder.id);
    setActiveAlert(`[WhatsApp LAVA]: Tu pedido #${selectedOrder.id} actualizó su estado a "${selectedOrder.status.replace('_', ' ').toUpperCase()}". Despachado desde San Martín de los Andes.`);
    try {
      confetti({ particleCount: 30, spread: 60 });
    } catch (e) {}
    setTimeout(() => setActiveAlert(null), 4500);
  };

  return (
    <section id="tracking" className="py-24 sm:py-32 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto bg-black">
      
      {/* Active Toast Notification */}
      {activeAlert && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 max-w-md p-4 rounded-2xl bg-[#0e1f13] border border-[#2d6335] text-[#86efac] shadow-2xl animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1b3820] text-[#4ade80] flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-white mb-0.5">Notificación de Despacho</div>
              <div className="text-[#a9d9b6] font-mono text-[11px] leading-relaxed">{activeAlert}</div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/5">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#d49a55] font-semibold">
            <Truck className="w-3.5 h-3.5" />
            <span>Seguimiento de Despacho</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f7eedf] tracking-tight">
            Trazabilidad del Envío
          </h2>
          <p className="text-sm text-[#8c8276] max-w-xl">
            Monitoreo en tiempo real desde nuestra sede en San Martín de los Andes hasta tu puerta.
          </p>
        </div>

        <button
          onClick={handleSimulateAlert}
          className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#f7eedf] transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Bell className="w-3.5 h-3.5 text-[#d49a55]" />
          <span>Simular Notificación WhatsApp</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12">
        
        {/* Left Column: Orders History List */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8c8276] block mb-2">
            Pedidos Recientes ({orders.length})
          </span>

          {orders.map((order) => {
            const isSelected = selectedOrder?.id === order.id;
            return (
              <button
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/10 border-[#d49a55] shadow-lg'
                    : 'bg-[#090909] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-white">#{order.id}</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#d49a55]">
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#f7eedf]">
                  {order.items.map((i) => `${i.beanName} (${i.size})`).join(', ')}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#7d7367] mt-2 pt-2 border-t border-white/5">
                  <span>{order.date}</span>
                  <span className="font-bold text-white">${order.total.toLocaleString('es-AR')} ARS</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Detailed Order Tracker & Timeline */}
        {selectedOrder && (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Order Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090909] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#d49a55]">Orden #{selectedOrder.id}</span>
                  <span className="text-[#5e554a]">·</span>
                  <span className="text-xs text-[#8c8276]">{selectedOrder.date}</span>
                </div>
                <div className="text-sm text-[#f7eedf] font-medium">
                  Destino: {selectedOrder.address}, {selectedOrder.city} ({selectedOrder.province})
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#7d7367] block">Código de Guía</span>
                <span className="font-mono text-xs font-bold text-[#d49a55] bg-white/5 px-2.5 py-1 rounded-md border border-white/5 inline-block mt-0.5">
                  {selectedOrder.trackingCode}
                </span>
              </div>
            </div>

            {/* Step Progress Bar */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090909] border border-white/5 space-y-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8c8276] block">
                Estado del Proceso:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {stepsConfig.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div
                      key={step.status}
                      className={`p-3.5 rounded-2xl border text-center space-y-2 flex flex-col items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-white/10 border-[#d49a55] text-white shadow-lg'
                          : isCompleted
                          ? 'bg-white/[0.02] border-white/10 text-[#d49a55]'
                          : 'bg-black/40 border-white/5 text-[#5e554a]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5">
                        {step.icon}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-[#f7eedf]">{step.label}</div>
                        <div className="text-[10px] text-[#7d7367] mt-0.5 leading-tight">{step.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

    </section>
  );
};
