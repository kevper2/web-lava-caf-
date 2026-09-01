import React, { useState } from 'react';
import { Subscription, CoffeeBean, GrindType, BagSize } from '../types';
import { COFFEE_BEANS } from '../data/coffeeData';
import { RefreshCw, Pause, Play, Trash2, Calendar, Sparkles, Check, Edit3, Plus, ShieldCheck, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubscriptionDashboardProps {
  subscriptions: Subscription[];
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
  onOpenCustomizer: (bean: CoffeeBean) => void;
}

export const SubscriptionDashboard: React.FC<SubscriptionDashboardProps> = ({
  subscriptions,
  setSubscriptions,
  onOpenCustomizer,
}) => {
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editGrind, setEditGrind] = useState<GrindType>('Filtro');
  const [editFrequency, setEditFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('biweekly');
  const [editSize, setEditSize] = useState<BagSize>('500g');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleToggleStatus = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subId) {
          const newStatus = sub.status === 'activa' ? 'pausada' : 'activa';
          showToast(newStatus === 'activa' ? 'Membresía reanudada con éxito' : 'Membresía pausada temporalmente');
          return { ...sub, status: newStatus };
        }
        return sub;
      })
    );
  };

  const handleDeleteSubscription = (subId: string) => {
    if (window.confirm('¿Deseas cancelar esta entrega recurrente?')) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== subId));
      showToast('Entrega cancelada');
    }
  };

  const handleStartEdit = (sub: Subscription) => {
    setEditingSubId(sub.id);
    setEditGrind(sub.grind);
    setEditFrequency(sub.frequency);
    setEditSize(sub.size);
  };

  const handleSaveEdit = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subId) {
          const bean = COFFEE_BEANS.find((b) => b.id === sub.beanId) || COFFEE_BEANS[0];
          const newPrice = Math.round(bean.prices[editSize] * 0.85);
          return {
            ...sub,
            grind: editGrind,
            frequency: editFrequency,
            size: editSize,
            pricePerCycle: newPrice,
          };
        }
        return sub;
      })
    );
    setEditingSubId(null);
    showToast('Preferencias actualizadas');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <section id="subscriptions" className="py-24 sm:py-32 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto bg-black">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#142817] border border-[#2d5f34] text-[#86efac] text-xs font-semibold shadow-2xl flex items-center gap-2.5">
          <Check className="w-4 h-4 text-[#4ade80]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/5">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#d49a55] font-semibold">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Membresía Recurrente de Montaña</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f7eedf] tracking-tight">
            Envíos Periódicos a Tu Puerta
          </h2>
          <p className="text-sm text-[#8c8276] max-w-xl">
            Asegurá tu suministro continuo con 15% de cortesía permanente y flexibilidad absoluta para pausar o cambiar orígenes.
          </p>
        </div>

        <button
          onClick={() => onOpenCustomizer(COFFEE_BEANS[0])}
          className="px-6 py-3.5 rounded-full bg-[#f7eedf] hover:bg-white text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Configurar Membresía (15% OFF)</span>
        </button>
      </div>

      {/* Subscriptions List */}
      <div className="pt-12 space-y-6">
        {subscriptions.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-[#080808] border border-white/5 space-y-4 max-w-xl mx-auto">
            <RefreshCw className="w-10 h-10 text-[#5e554a] mx-auto" />
            <h3 className="text-lg font-bold text-[#f7eedf]">No tenés entregas periódicas activas</h3>
            <p className="text-xs text-[#8c8276] leading-relaxed">
              Recibí automáticamente tus orígenes preferidos con molienda exacta en San Martín de los Andes y envíos a todo el país.
            </p>
            <button
              onClick={() => onOpenCustomizer(COFFEE_BEANS[0])}
              className="mt-2 px-6 py-3 rounded-full bg-[#d49a55] text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Comenzar Ahora
            </button>
          </div>
        ) : (
          subscriptions.map((sub) => {
            const bean = COFFEE_BEANS.find((b) => b.id === sub.beanId) || COFFEE_BEANS[0];
            const isEditing = editingSubId === sub.id;

            return (
              <div
                key={sub.id}
                className="p-8 rounded-3xl bg-[#080808] border border-white/[0.08] hover:border-white/15 transition-all space-y-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  <div className="flex items-start gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span
                          className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                            sub.status === 'activa'
                              ? 'bg-[#152a19] text-[#4ade80] border border-[#23502b]'
                              : 'bg-white/5 text-[#a19688] border border-white/10'
                          }`}
                        >
                          {sub.status === 'activa' ? '● Entrega Activa' : '❚❚ Pausada'}
                        </span>
                        <span className="text-xs text-[#6e655a] font-mono">#{sub.id}</span>
                      </div>

                      <h4 className="text-2xl font-bold text-[#f7eedf]">{sub.beanName}</h4>

                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#8c8276]">
                        <span>Presentación: <strong className="text-white">{sub.size}</strong></span>
                        <span>·</span>
                        <span>Molienda: <strong className="text-white">{sub.grind}</strong></span>
                        <span>·</span>
                        <span>Frecuencia: <strong className="text-[#d49a55]">
                          {sub.frequency === 'weekly' ? 'Semanal' : sub.frequency === 'biweekly' ? 'Quincenal' : 'Mensual'}
                        </strong></span>
                      </div>

                      <div className="flex items-center gap-2 mt-3 text-xs text-[#c9bba8]">
                        <Calendar className="w-3.5 h-3.5 text-[#d49a55]" />
                        <span>Próximo despacho: <strong>{sub.nextDeliveryDate}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-[#7d7367] block">Precio por entrega (15% OFF VIP)</span>
                      <span className="text-2xl font-bold text-[#f7eedf]">
                        ${sub.pricePerCycle.toLocaleString('es-AR')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(sub.id)}
                        className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-[#d6c9b8] hover:text-white hover:border-white/20 transition-all cursor-pointer flex items-center gap-1.5 bg-white/[0.02]"
                      >
                        {sub.status === 'activa' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{sub.status === 'activa' ? 'Pausar' : 'Reanudar'}</span>
                      </button>

                      <button
                        onClick={() => (isEditing ? setEditingSubId(null) : handleStartEdit(sub))}
                        className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-[#d6c9b8] hover:text-white hover:border-[#d49a55]/40 transition-all cursor-pointer flex items-center gap-1.5 bg-white/[0.02]"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#d49a55]" />
                        <span>{isEditing ? 'Cerrar' : 'Ajustar'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteSubscription(sub.id)}
                        className="p-2.5 rounded-xl border border-white/5 text-[#8c8276] hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
                        title="Cancelar entrega"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Inline Edit Box */}
                {isEditing && (
                  <div className="pt-6 border-t border-white/5 p-6 rounded-2xl bg-[#111111] space-y-4">
                    <span className="text-xs font-bold text-[#d49a55] uppercase tracking-wider block">
                      Ajustar Parámetros de la Membresía:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] text-[#8c8276] mb-1 font-semibold">Tamaño:</label>
                        <select
                          value={editSize}
                          onChange={(e) => setEditSize(e.target.value as BagSize)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-white"
                        >
                          <option value="250g">250g</option>
                          <option value="500g">500g</option>
                          <option value="1kg">1kg</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#8c8276] mb-1 font-semibold">Molienda:</label>
                        <select
                          value={editGrind}
                          onChange={(e) => setEditGrind(e.target.value as GrindType)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-white"
                        >
                          <option value="Granos">Granos Enteros</option>
                          <option value="Filtro">Filtro / V60</option>
                          <option value="Espresso">Espresso</option>
                          <option value="Moka">Moka Italiana</option>
                          <option value="Prensa">Prensa Francesa</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#8c8276] mb-1 font-semibold">Frecuencia:</label>
                        <select
                          value={editFrequency}
                          onChange={(e) => setEditFrequency(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-white"
                        >
                          <option value="weekly">Semanal</option>
                          <option value="biweekly">Quincenal</option>
                          <option value="monthly">Mensual</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingSubId(null)}
                        className="px-4 py-2 rounded-xl text-xs text-[#8c8276] hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleSaveEdit(sub.id)}
                        className="px-5 py-2 rounded-xl bg-[#d49a55] text-black text-xs font-bold"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </section>
  );
};
