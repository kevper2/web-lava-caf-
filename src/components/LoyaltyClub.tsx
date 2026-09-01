import React, { useState } from 'react';
import { LoyaltyProfile, Reward, CartItem, Subscription, CoffeeBean, GrindType, BagSize } from '../types';
import { REWARDS_CATALOG, COFFEE_BEANS } from '../data/coffeeData';
import { 
  User, 
  Sparkles, 
  RotateCcw, 
  MessageCircle, 
  Gift, 
  Coffee, 
  Check, 
  Lock, 
  Mail, 
  Phone, 
  LogOut,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoyaltyClubProps {
  currentProfile: LoyaltyProfile | null;
  onUpdateProfile: (profile: LoyaltyProfile | null) => void;
  onDirectWhatsApp: (item: CartItem) => void;
  subscriptions?: Subscription[];
  setSubscriptions?: React.Dispatch<React.SetStateAction<Subscription[]>>;
  onOpenCustomizer?: (bean: CoffeeBean) => void;
  allClients: LoyaltyProfile[];
  setAllClients: React.Dispatch<React.SetStateAction<LoyaltyProfile[]>>;
}

export const LoyaltyClub: React.FC<LoyaltyClubProps> = ({
  currentProfile,
  onUpdateProfile,
  onDirectWhatsApp,
  subscriptions = [],
  setSubscriptions,
  onOpenCustomizer,
  allClients,
  setAllClients,
}) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'log' | 'subscriptions'>('rewards');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auth Form State (when logged out)
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('+54 9 ');
  const [authEmail, setAuthEmail] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Login / Register for Member
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authPhone) {
      showToast('Por favor ingresá tu número de WhatsApp');
      return;
    }

    const cleanPhone = authPhone.replace(/\D/g, '');
    const existing = allClients.find(
      (c) => c.phone.replace(/\D/g, '').includes(cleanPhone) || 
             (authEmail && c.email.toLowerCase() === authEmail.toLowerCase())
    );

    if (existing) {
      onUpdateProfile(existing);
      showToast(`¡Bienvenido de nuevo, ${existing.customerName}!`);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    } else {
      const newProfile: LoyaltyProfile = {
        id: `CLI-${Date.now().toString().slice(-4)}`,
        customerName: authName.trim() || 'Socio LAVA',
        phone: authPhone.trim(),
        email: authEmail.trim() || `${authName.toLowerCase().replace(/\s+/g, '')}@magma.ar`,
        tier: 'Privé',
        points: 0,
        lifetimePoints: 0,
        ordersCount: 0,
        favoriteBeanId: 'andes-colombianos',
        memberSince: 'Septiembre 2026',
        tastingLog: [],
      };
      setAllClients([newProfile, ...allClients]);
      onUpdateProfile(newProfile);
      showToast(`¡Bienvenido al CLUB MAGMA, ${newProfile.customerName}!`);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }
  };

  // Repeat Order Action
  const handleRepeatOrder = (item: LoyaltyProfile['tastingLog'][0]) => {
    const bean = COFFEE_BEANS.find((b) => b.id === item.beanId) || COFFEE_BEANS[0];
    const cartItem: CartItem = {
      id: `${item.beanId}-${item.size}-${item.grind}-${Date.now()}`,
      beanId: item.beanId,
      beanName: item.beanName,
      grind: item.grind,
      size: item.size,
      unitPrice: bean.prices[item.size] || 34000,
      quantity: 1,
      frequency: 'one_time',
      customNote: `Repetición de orden #${item.orderId}`,
    };
    onDirectWhatsApp(cartItem);
  };

  // Claim Reward via WhatsApp
  const handleClaimReward = (reward: Reward) => {
    if (!currentProfile) return;
    if (currentProfile.points < reward.pointsCost) {
      showToast(`Te faltan ${reward.pointsCost - currentProfile.points} puntos para este beneficio`);
      return;
    }

    const message = `*SOLICITUD DE CANJE CLUB MAGMA*\nHola LAVA, soy *${currentProfile.customerName}* (ID: ${currentProfile.id}).\nQuisiera canjear mi beneficio de *${reward.title}* (${reward.pointsCost} pts).\nMi saldo actual es de ${currentProfile.points} pts.`;
    const waUrl = `https://wa.me/5491131476953?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="club" className="py-16 sm:py-20 px-6 sm:px-10 lg:px-12 max-w-5xl mx-auto">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-[#142817] border border-[#2d5f34] text-[#86efac] text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-[#4ade80]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ---------------------------------------------------------
          VIEW A: LOGGED OUT - COMPACT SIGN IN / SIGN UP
          --------------------------------------------------------- */}
      {!currentProfile ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d49a55]/10 border border-[#d49a55]/20 text-[10px] uppercase tracking-widest text-[#d49a55] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>Comunidad de Café de Altura</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f7eedf] tracking-tight">
              CLUB MAGMA
            </h2>
            <p className="text-xs text-[#8c8276] leading-relaxed">
              Sumá <strong className="text-[#d49a55]">1 punto por cada 10g</strong> de café en todos tus pedidos y canjeá por cafés reserva, descuentos y equipamiento.
            </p>
          </div>

          <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-[#0c0c0c] border border-white/10 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 text-xs">
              <span className="font-semibold text-white">
                {isRegisterMode ? 'Crear Cuenta de Socio' : 'Ingresar con mi WhatsApp'}
              </span>
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-[#d49a55] hover:underline font-medium cursor-pointer"
              >
                {isRegisterMode ? 'Ya soy socio · Ingresar' : 'Registrarme'}
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {isRegisterMode && (
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#8c8276] uppercase tracking-wider block">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Ej: Sofia Gómez"
                    required={isRegisterMode}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs placeholder-[#5c5449] focus:outline-none focus:border-[#d49a55]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[#8c8276] uppercase tracking-wider block">
                  WhatsApp de Contacto
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#8c8276] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="+54 9 11 3147-6953"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs placeholder-[#5c5449] focus:outline-none focus:border-[#d49a55]"
                  />
                </div>
              </div>

              {isRegisterMode && (
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#8c8276] uppercase tracking-wider block">
                    Email (Opcional)
                  </label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="sofia@ejemplo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs placeholder-[#5c5449] focus:outline-none focus:border-[#d49a55]"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#d49a55] hover:bg-[#e0a660] text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#d49a55]/20 flex items-center justify-center gap-2 mt-2"
              >
                <span>{isRegisterMode ? 'Unirme al Club Magma' : 'Ingresar al Portal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Benefits Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-3xl mx-auto text-center">
            <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/5 space-y-1">
              <span className="text-[#d49a55] font-bold text-xs">10g = 1 Punto</span>
              <p className="text-[11px] text-[#8c8276]">Sumás automáticamente en cada bolsa de café</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/5 space-y-1">
              <span className="text-[#d49a55] font-bold text-xs">Recompensas Reserva</span>
              <p className="text-[11px] text-[#8c8276]">Cafés 250g de cortesía y kits de montaña</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/5 space-y-1">
              <span className="text-[#d49a55] font-bold text-xs">Bitácora Personal</span>
              <p className="text-[11px] text-[#8c8276]">Historial de orígenes y moliendas favoritas</p>
            </div>
          </div>

        </div>
      ) : (
        /* ---------------------------------------------------------
           VIEW B: LOGGED IN - COMPACT MEMBER DASHBOARD
           --------------------------------------------------------- */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Compact Member Header Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#090909] border border-white/10 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#d49a55]/10 to-transparent blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#d49a55]/10 border border-[#d49a55]/20 flex items-center justify-center text-[#d49a55] shrink-0 font-bold text-base">
                {currentProfile.customerName.charAt(0)}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#f7eedf]">
                    {currentProfile.customerName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#d49a55]/15 text-[#d49a55] border border-[#d49a55]/30">
                    {currentProfile.tier}
                  </span>
                </div>
                <div className="text-xs text-[#8c8276] flex items-center gap-2">
                  <span>{currentProfile.phone}</span>
                  <span>·</span>
                  <span>Socio desde {currentProfile.memberSince}</span>
                </div>
              </div>
            </div>

            {/* Points Balance & Logout */}
            <div className="flex items-center gap-4 relative z-10 self-end sm:self-auto">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#8c8276] font-bold block">
                  Mis Puntos
                </span>
                <div className="text-2xl font-black text-[#f7eedf]">
                  {currentProfile.points} <span className="text-xs font-normal text-[#d49a55]">pts</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onUpdateProfile(null);
                  showToast('Sesión cerrada');
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#8c8276] hover:text-white transition-all cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <button
              onClick={() => setActiveTab('rewards')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === 'rewards'
                  ? 'bg-[#d49a55] text-black font-bold'
                  : 'text-[#8c8276] hover:text-white bg-white/[0.02]'
              }`}
            >
              Recompensas ({REWARDS_CATALOG.length})
            </button>

            <button
              onClick={() => setActiveTab('log')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === 'log'
                  ? 'bg-[#d49a55] text-black font-bold'
                  : 'text-[#8c8276] hover:text-white bg-white/[0.02]'
              }`}
            >
              Mi Bitácora ({currentProfile.tastingLog.length})
            </button>
          </div>

          {/* SUB-TAB 1: REWARDS */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {REWARDS_CATALOG.map((rew) => {
                  const hasEnoughPoints = currentProfile.points >= rew.pointsCost;
                  return (
                    <div
                      key={rew.id}
                      className="p-4 rounded-2xl bg-[#0c0c0c] border border-white/10 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-[#d49a55] font-bold">
                            {rew.badge}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {rew.pointsCost} pts
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#f7eedf]">
                          {rew.title}
                        </h4>
                        <p className="text-[11px] text-[#8c8276] leading-relaxed">
                          {rew.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleClaimReward(rew)}
                        disabled={!hasEnoughPoints}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                          hasEnoughPoints
                            ? 'bg-[#1b3820] hover:bg-[#244c2c] border border-[#2d6335] text-[#4ade80] cursor-pointer'
                            : 'bg-white/5 text-[#5c5347] border border-white/5 cursor-not-allowed'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{hasEnoughPoints ? 'Canjear vía WhatsApp' : `Faltan ${rew.pointsCost - currentProfile.points} pts`}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: BITACORA DE CATAS */}
          {activeTab === 'log' && (
            <div className="space-y-3">
              {currentProfile.tastingLog.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#090909] border border-white/5 space-y-2">
                  <Coffee className="w-8 h-8 text-[#4c443b] mx-auto" />
                  <h4 className="text-sm font-bold text-[#f7eedf]">Aún no tenés cafés registrados</h4>
                  <p className="text-xs text-[#8c8276] max-w-sm mx-auto">
                    Tus pedidos directos de café se registrarán aquí con la molienda exacta para que puedas repetirlos en un clic.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentProfile.tastingLog.map((log, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-2xl bg-[#0c0c0c] border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-[#8c8276]">{log.date} · #{log.orderId}</span>
                        <h4 className="text-sm font-bold text-white">{log.beanName}</h4>
                        <span className="text-xs text-[#d49a55] block">
                          {log.size} · Molienda {log.grind}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRepeatOrder(log)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer shrink-0"
                      >
                        <RotateCcw className="w-3 h-3 text-[#d49a55]" />
                        <span>Repetir</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </section>
  );
};
