import React, { useState, useEffect } from 'react';
import { LoyaltyProfile, Reward, CartItem, Subscription, CoffeeBean, GrindType, BagSize } from '../types';
import { DEMO_CLIENTS, REWARDS_CATALOG, COFFEE_BEANS } from '../data/coffeeData';
import { LavaLogo } from './LavaLogo';
import { 
  User, 
  Sparkles, 
  RotateCcw, 
  MessageCircle, 
  Gift, 
  Clock, 
  Coffee, 
  ShieldCheck, 
  Search, 
  Phone, 
  CheckCircle,
  TrendingUp,
  MapPin,
  RefreshCw,
  Plus,
  Pause,
  Play,
  Trash2,
  Edit3,
  Calendar,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  MinusCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoyaltyClubProps {
  currentProfile: LoyaltyProfile;
  onUpdateProfile: (profile: LoyaltyProfile) => void;
  onDirectWhatsApp: (item: CartItem) => void;
  subscriptions?: Subscription[];
  setSubscriptions?: React.Dispatch<React.SetStateAction<Subscription[]>>;
  onOpenCustomizer?: (bean: CoffeeBean) => void;
}

interface PointTransaction {
  id: string;
  clientId: string;
  clientName: string;
  pointsDeducted: number;
  reason: string;
  date: string;
  performedBy: string;
}

export const LoyaltyClub: React.FC<LoyaltyClubProps> = ({
  currentProfile,
  onUpdateProfile,
  onDirectWhatsApp,
  subscriptions = [],
  setSubscriptions,
  onOpenCustomizer,
}) => {
  const [activeTab, setActiveTab] = useState<'bitacora' | 'membresia' | 'crm'>('bitacora');
  const [allClients, setAllClients] = useState<LoyaltyProfile[]>(DEMO_CLIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication State (Mail + WhatsApp + Password + OTP)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'credentials' | 'otp'>('credentials');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authChannel, setAuthChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [generatedOtp, setGeneratedOtp] = useState<string>('582914');
  const [otpInput, setOtpInput] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // CRM Points Deduction Modal State
  const [isDeductModalOpen, setIsDeductModalOpen] = useState(false);
  const [selectedClientForDeduct, setSelectedClientForDeduct] = useState<LoyaltyProfile | null>(null);
  const [selectedRewardId, setSelectedRewardId] = useState<string>('custom');
  const [deductPointsAmount, setDeductPointsAmount] = useState<number>(150);
  const [deductReason, setDeductReason] = useState<string>('Canje de beneficio en tostador');
  const [deductionLogs, setDeductionLogs] = useState<PointTransaction[]>([
    {
      id: 'tx-1',
      clientId: 'CLI-001',
      clientName: 'Santiago Villar',
      pointsDeducted: 150,
      reason: 'Canje Bolsa 250g Café Andes',
      date: '01/09/2026 11:30',
      performedBy: 'Barista Principal',
    },
    {
      id: 'tx-2',
      clientId: 'CLI-002',
      clientName: 'Martina Rossi',
      pointsDeducted: 100,
      reason: '20% Descuento en Orden #LAVA-8821',
      date: '28/08/2026 16:45',
      performedBy: 'Tostaduría San Martín',
    },
  ]);

  // Subscription editing inside unified club
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editGrind, setEditGrind] = useState<GrindType>('Filtro');
  const [editFrequency, setEditFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('biweekly');
  const [editSize, setEditSize] = useState<BagSize>('500g');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Timer countdown for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (authStep === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authStep, resendTimer]);

  // Handle Step 1: Submit Credentials & Send OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPhone || !authPassword) {
      showToast('Por favor completa todos los campos requeridos');
      return;
    }

    // Generate 6 digit code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setResendTimer(30);
    setAuthStep('otp');
    setOtpInput('');
    showToast(`Código de seguridad enviado por ${authChannel === 'whatsapp' ? 'WhatsApp' : 'Email'}`);
  };

  // Handle Step 2: Validate OTP and complete Login
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '123456') {
      showToast('Código de verificación incorrecto. Intenta nuevamente.');
      return;
    }

    // Check if client exists by phone or email
    const cleanPhone = authPhone.replace(/\D/g, '');
    const existing = allClients.find(
      (c) => c.phone.replace(/\D/g, '').includes(cleanPhone) || c.email.toLowerCase() === authEmail.toLowerCase()
    );

    if (existing) {
      onUpdateProfile(existing);
      showToast(`¡Bienvenido nuevamente, ${existing.customerName}!`);
    } else {
      const newProfile: LoyaltyProfile = {
        id: `CLI-${Date.now().toString().slice(-3)}`,
        customerName: authName.trim() || 'Socio LAVA',
        phone: authPhone.trim(),
        email: authEmail.trim(),
        tier: 'Privé',
        points: 200,
        lifetimePoints: 200,
        ordersCount: 0,
        favoriteBeanId: 'andes-colombianos',
        memberSince: 'Septiembre 2026',
        tastingLog: [],
      };
      setAllClients([newProfile, ...allClients]);
      onUpdateProfile(newProfile);
      showToast(`¡Bienvenido al Club Privé LAVA, ${newProfile.customerName}!`);
    }

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setIsAuthModalOpen(false);
    setAuthStep('credentials');
    setAuthPassword('');
  };

  const handleSelectClientDirect = (client: LoyaltyProfile) => {
    onUpdateProfile(client);
    setIsAuthModalOpen(false);
    showToast(`Sesión activa cambiada a: ${client.customerName}`);
  };

  const handleRepeatOrder = (item: LoyaltyProfile['tastingLog'][0]) => {
    const cartItem: CartItem = {
      id: `${item.beanId}-${item.size}-${item.grind}-${Date.now()}`,
      beanId: item.beanId,
      beanName: item.beanName,
      grind: item.grind,
      size: item.size,
      unitPrice: item.size === '1kg' ? 47000 : item.size === '500g' ? 26000 : 14500,
      quantity: 1,
      frequency: 'one_time',
      customNote: `Repetición de orden anterior #${item.orderId}`,
    };
    onDirectWhatsApp(cartItem);
  };

  // Open CRM Points Deduction Modal
  const handleOpenDeductModal = (client: LoyaltyProfile) => {
    setSelectedClientForDeduct(client);
    setSelectedRewardId('custom');
    setDeductPointsAmount(150);
    setDeductReason('Canje de recompensa de café');
    setIsDeductModalOpen(true);
  };

  // Execute Points Deduction in CRM
  const handleConfirmDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForDeduct) return;

    if (deductPointsAmount <= 0) {
      showToast('Ingresa una cantidad de puntos válida a descontar.');
      return;
    }

    if (selectedClientForDeduct.points < deductPointsAmount) {
      showToast(`El cliente solo cuenta con ${selectedClientForDeduct.points} puntos.`);
      return;
    }

    const updatedPoints = selectedClientForDeduct.points - deductPointsAmount;

    // Update in allClients state
    const updatedClients = allClients.map((c) => {
      if (c.id === selectedClientForDeduct.id) {
        return { ...c, points: updatedPoints };
      }
      return c;
    });
    setAllClients(updatedClients);

    // If current profile is this client, update global profile state
    if (currentProfile.id === selectedClientForDeduct.id) {
      onUpdateProfile({ ...currentProfile, points: updatedPoints });
    }

    // Register transaction log
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('es-AR')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLog: PointTransaction = {
      id: `tx-${Date.now()}`,
      clientId: selectedClientForDeduct.id,
      clientName: selectedClientForDeduct.customerName,
      pointsDeducted: deductPointsAmount,
      reason: deductReason.trim() || 'Canje de Puntos',
      date: formattedDate,
      performedBy: 'Barista en Turno',
    };
    setDeductionLogs([newLog, ...deductionLogs]);

    showToast(`Se restaron ${deductPointsAmount} pts a ${selectedClientForDeduct.customerName}. Saldo: ${updatedPoints} pts.`);
    setIsDeductModalOpen(false);
  };

  // Quick stepper in CRM (+ / - points)
  const handleQuickAdjustPoints = (client: LoyaltyProfile, delta: number) => {
    const newPoints = Math.max(0, client.points + delta);
    const updatedClients = allClients.map((c) => (c.id === client.id ? { ...c, points: newPoints } : c));
    setAllClients(updatedClients);

    if (currentProfile.id === client.id) {
      onUpdateProfile({ ...currentProfile, points: newPoints });
    }

    showToast(`Puntos de ${client.customerName.split(' ')[0]}: ${newPoints} pts`);
  };

  // Subscription Actions
  const handleToggleSubStatus = (subId: string) => {
    if (!setSubscriptions) return;
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
    if (!setSubscriptions) return;
    if (window.confirm('¿Deseas cancelar esta entrega recurrente?')) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== subId));
      showToast('Entrega cancelada');
    }
  };

  const handleSaveSubEdit = (subId: string) => {
    if (!setSubscriptions) return;
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
    showToast('Parámetros de entrega actualizados');
  };

  const filteredClients = allClients.filter(
    (c) =>
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="club" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto bg-black">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#142817] border border-[#2d5f34] text-[#86efac] text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-[#4ade80]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Unified Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#d49a55] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CLUB MAGMA · Tostaduría de Montaña</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f7eedf] tracking-tight">
            Portal Exclusivo CLUB MAGMA
          </h2>
          <p className="text-xs sm:text-sm text-[#8c8276] max-w-xl">
            Gestioná tus catas históricas, canje de recompensas, entregas quincenales y administración concierge desde San Martín de los Andes.
          </p>
        </div>

        {/* 3 Unified Tabs: Bitácora & Puntos, Membresía Recurrente, CRM */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('bitacora')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bitacora'
                ? 'bg-[#d49a55] text-black shadow-md font-bold'
                : 'text-[#8c8276] hover:text-white'
            }`}
          >
            Mi Bitácora & Puntos
          </button>
          
          <button
            onClick={() => setActiveTab('membresia')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'membresia'
                ? 'bg-[#d49a55] text-black shadow-md font-bold'
                : 'text-[#8c8276] hover:text-white'
            }`}
          >
            Membresía (15% OFF)
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'crm'
                ? 'bg-[#d49a55] text-black shadow-md font-bold'
                : 'text-[#8c8276] hover:text-white'
            }`}
          >
            CRM & Canje de Puntos
          </button>
        </div>
      </div>

      {/* ========================================================
         TAB 1: MI BITÁCORA & PUNTOS (TASTING LOG & REWARDS)
         ======================================================== */}
      {activeTab === 'bitacora' && (
        <div className="pt-10 space-y-14 animate-in fade-in duration-300">
          
          {/* Member Card & Quick Switch */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#090909] border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#d49a55]/8 to-transparent blur-3xl pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#d49a55]">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#f7eedf]">
                    {currentProfile.customerName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#8c8276] mt-0.5">
                    <span>{currentProfile.email}</span>
                    <span>·</span>
                    <span>{currentProfile.phone}</span>
                    <span>·</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d49a55]/15 text-[#d49a55] border border-[#d49a55]/30">
                      Nivel {currentProfile.tier}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 relative z-10 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
              <div className="text-left md:text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#8c8276] block font-semibold">
                  Puntos Privé Disponibles
                </span>
                <span className="text-3xl font-bold text-[#f7eedf]">
                  {currentProfile.points} <span className="text-xs font-normal text-[#d49a55]">pts</span>
                </span>
              </div>

              <button
                onClick={() => {
                  setAuthEmail(currentProfile.email || '');
                  setAuthPhone(currentProfile.phone || '');
                  setAuthName(currentProfile.customerName || '');
                  setAuthStep('credentials');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-[#d6c9b8] hover:text-white hover:border-[#d49a55]/40 transition-all cursor-pointer bg-white/[0.02] flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#d49a55]" />
                <span>Ingreso Seguro (OTP)</span>
              </button>
            </div>
          </div>

          {/* Tasting History ("Qué fue tomando") */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#f7eedf] tracking-tight">
                Tu Historial de Catas & Pedidos Pasados
              </h3>
              <p className="text-xs text-[#8c8276] mt-0.5">
                Registro exacto de los cafés que fuiste tomando para que nunca olvides tus calibraciones preferidas.
              </p>
            </div>

            {currentProfile.tastingLog && currentProfile.tastingLog.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProfile.tastingLog.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#090909] border border-white/5 hover:border-white/15 transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#7d7367] pb-3 border-b border-white/5">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#d49a55]" />
                          {log.date}
                        </span>
                        <span className="font-mono text-[#a19688]">#{log.orderId}</span>
                      </div>

                      <div className="pt-3 space-y-1">
                        <h4 className="text-base font-bold text-[#f7eedf]">
                          {log.beanName}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#a19688]">
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[#d49a55]">
                            {log.size}
                          </span>
                          <span>·</span>
                          <span>Molienda {log.grind}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRepeatOrder(log)}
                      className="w-full py-2.5 px-3 rounded-xl border border-white/10 hover:border-[#d49a55]/40 text-xs font-semibold text-[#d6c9b8] hover:text-white transition-all flex items-center justify-center gap-2 bg-white/[0.02] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#d49a55]" />
                      <span>Repetir este café por WhatsApp</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-[#080808] border border-white/5 text-center space-y-3">
                <Coffee className="w-8 h-8 text-[#5e554a] mx-auto" />
                <p className="text-sm text-[#8c8276]">
                  Aún no tenés pedidos registrados en esta cuenta. Realizá tu primer pedido vía WhatsApp para iniciar tu bitácora.
                </p>
              </div>
            )}
          </div>

          {/* Privé Rewards Catalog */}
          <div className="space-y-6 pt-4">
            <div>
              <h3 className="text-xl font-bold text-[#f7eedf] tracking-tight">
                Beneficios Exclusivos para Miembros
              </h3>
              <p className="text-xs text-[#8c8276] mt-0.5">
                Canjeá tus puntos acumulados de montaña directo al confirmar tu siguiente pedido.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REWARDS_CATALOG.map((reward) => (
                <div
                  key={reward.id}
                  className="p-6 rounded-2xl bg-[#090909] border border-white/5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#d49a55]/10 text-[#d49a55] font-semibold">
                        {reward.badge}
                      </span>
                      <span className="text-xs font-bold text-[#f7eedf]">
                        {reward.pointsCost} pts
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#f7eedf]">
                      {reward.title}
                    </h4>
                    <p className="text-xs text-[#8c8276] leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const text = `Hola LAVA! Quiero canjear el beneficio de mi membresía: ${reward.title} (Código: ${reward.code}) para mi cuenta de ${currentProfile.customerName}.`;
                        window.open(`https://wa.me/5492972418890?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="w-full py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Gift className="w-3.5 h-3.5 text-[#d49a55]" />
                      <span>Solicitar Canje por WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
         TAB 2: MEMBRESÍA RECURRENTE (15% OFF)
         ======================================================== */}
      {activeTab === 'membresia' && (
        <div className="pt-10 space-y-8 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#090909] border border-white/5">
            <div>
              <h3 className="text-lg font-bold text-[#f7eedf]">Gestión de Envíos Periódicos</h3>
              <p className="text-xs text-[#8c8276]">
                15% de cortesía permanente en todas tus entregas automáticas a domicilio.
              </p>
            </div>

            {onOpenCustomizer && (
              <button
                onClick={() => onOpenCustomizer(COFFEE_BEANS[0])}
                className="px-5 py-2.5 rounded-full bg-[#d49a55] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Suscripción</span>
              </button>
            )}
          </div>

          {/* Subscriptions List */}
          <div className="space-y-6">
            {subscriptions.length === 0 ? (
              <div className="p-16 text-center rounded-3xl bg-[#080808] border border-white/5 space-y-4 max-w-xl mx-auto">
                <RefreshCw className="w-10 h-10 text-[#5e554a] mx-auto" />
                <h3 className="text-lg font-bold text-[#f7eedf]">No tenés entregas periódicas activas</h3>
                <p className="text-xs text-[#8c8276] leading-relaxed">
                  Recibí automáticamente tus orígenes preferidos con molienda exacta en San Martín de los Andes y envíos a todo el país.
                </p>
                {onOpenCustomizer && (
                  <button
                    onClick={() => onOpenCustomizer(COFFEE_BEANS[0])}
                    className="mt-2 px-6 py-3 rounded-full bg-[#d49a55] text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Comenzar Ahora (15% OFF)
                  </button>
                )}
              </div>
            ) : (
              subscriptions.map((sub) => {
                const isEditing = editingSubId === sub.id;

                return (
                  <div
                    key={sub.id}
                    className="p-8 rounded-3xl bg-[#080808] border border-white/[0.08] hover:border-white/15 transition-all space-y-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
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

                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#8c8276]">
                          <span>Presentación: <strong className="text-white">{sub.size}</strong></span>
                          <span>·</span>
                          <span>Molienda: <strong className="text-white">{sub.grind}</strong></span>
                          <span>·</span>
                          <span>Frecuencia: <strong className="text-[#d49a55]">
                            {sub.frequency === 'weekly' ? 'Semanal' : sub.frequency === 'biweekly' ? 'Quincenal' : 'Mensual'}
                          </strong></span>
                        </div>

                        <div className="flex items-center gap-2 pt-1 text-xs text-[#c9bba8]">
                          <Calendar className="w-3.5 h-3.5 text-[#d49a55]" />
                          <span>Próximo despacho: <strong>{sub.nextDeliveryDate}</strong></span>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                        <div className="text-left sm:text-right">
                          <span className="text-[11px] text-[#7d7367] block">Precio por entrega (15% OFF)</span>
                          <span className="text-2xl font-bold text-[#f7eedf]">
                            ${sub.pricePerCycle.toLocaleString('es-AR')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleSubStatus(sub.id)}
                            className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-[#d6c9b8] hover:text-white hover:border-white/20 transition-all cursor-pointer flex items-center gap-1.5 bg-white/[0.02]"
                          >
                            {sub.status === 'activa' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            <span>{sub.status === 'activa' ? 'Pausar' : 'Reanudar'}</span>
                          </button>

                          <button
                            onClick={() => {
                              if (isEditing) {
                                setEditingSubId(null);
                              } else {
                                setEditingSubId(sub.id);
                                setEditGrind(sub.grind);
                                setEditFrequency(sub.frequency);
                                setEditSize(sub.size);
                              }
                            }}
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

                    {/* Inline Edit Panel */}
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
                            onClick={() => handleSaveSubEdit(sub.id)}
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

        </div>
      )}

      {/* ========================================================
         TAB 3: DASHBOARD CRM & RESTAR PUNTOS (BARISTA & DUEÑOS)
         ======================================================== */}
      {activeTab === 'crm' && (
        <div className="pt-10 space-y-10 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#f7eedf] tracking-tight">
                Panel Concierge & Descuento de Puntos
              </h3>
              <p className="text-xs text-[#8c8276]">
                Consultá consumos, contactá por WhatsApp y restá puntos inmediatamente cuando un socio realiza un canje.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-[#6e655a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar socio, mail o teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#111111] border border-white/10 text-xs text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
              />
            </div>
          </div>

          {/* CRM Table */}
          <div className="rounded-2xl bg-[#090909] border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111111] border-b border-white/5 text-[#8c8276] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-4 px-6">Socio & Contacto</th>
                    <th className="py-4 px-6">Nivel</th>
                    <th className="py-4 px-6">Pedidos</th>
                    <th className="py-4 px-6">Último Café</th>
                    <th className="py-4 px-6">Puntos Disponibles</th>
                    <th className="py-4 px-6 text-right">Acciones de Barista</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[#e0d6c8]">
                  {filteredClients.map((client) => {
                    const lastTasting = client.tastingLog[0];
                    return (
                      <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {client.customerName}
                            {currentProfile.id === client.id && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#d49a55]/20 text-[#d49a55] font-semibold">
                                Activo
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#7d7367]">{client.email}</div>
                          <div className="text-[10px] text-[#635c52] font-mono">{client.phone}</div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-[#d49a55]">
                            {client.tier}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-medium">
                          {client.tastingLog.length} catas
                        </td>

                        <td className="py-4 px-6">
                          {lastTasting ? (
                            <div>
                              <div className="font-semibold text-white">{lastTasting.beanName}</div>
                              <div className="text-[10px] text-[#7d7367]">
                                {lastTasting.size} · {lastTasting.grind} ({lastTasting.date})
                              </div>
                            </div>
                          ) : (
                            <span className="text-[#5e554a]">Sin registros</span>
                          )}
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#f7eedf]">
                              {client.points} pts
                            </span>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => handleQuickAdjustPoints(client, -50)}
                                className="w-5 h-5 rounded bg-white/5 hover:bg-rose-950 hover:text-rose-400 text-[#8c8276] text-xs flex items-center justify-center font-mono cursor-pointer"
                                title="Restar 50 pts"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleQuickAdjustPoints(client, 50)}
                                className="w-5 h-5 rounded bg-white/5 hover:bg-[#1a3820] hover:text-[#4ade80] text-[#8c8276] text-xs flex items-center justify-center font-mono cursor-pointer"
                                title="Sumar 50 pts"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenDeductModal(client)}
                            className="px-3 py-1.5 rounded-lg bg-[#d49a55] hover:bg-white text-black text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                            <span>Canjear / Restar Puntos</span>
                          </button>

                          <button
                            onClick={() => {
                              const text = `Hola ${client.customerName}, te escribimos desde LAVA Café de Montaña (San Martín de los Andes). Saldo de tu cuenta: ${client.points} puntos. ¿En qué podemos ayudarte hoy?`;
                              window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#1b3820] hover:bg-[#234b2a] text-[#4ade80] text-[11px] font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                            title="Chat WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit History of Point Deductions */}
          <div className="p-6 rounded-2xl bg-[#090909] border border-white/5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d49a55] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Registro de Canjes & Ajustes Recientes</span>
            </h4>

            <div className="divide-y divide-white/5">
              {deductionLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white">{log.clientName}</span>
                    <span className="text-[#8c8276] text-[11px] block">{log.reason} · Registrado por {log.performedBy}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-rose-400 font-bold">-{log.pointsDeducted} pts</span>
                    <span className="text-[10px] text-[#635c52]">{log.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
         MODAL 1: SECURE AUTHENTICATION (MAIL + WHATSAPP + PASSWORD + OTP)
         ======================================================== */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c0c0c] border border-white/10 shadow-2xl space-y-6">
            
            <div className="space-y-1 text-center">
              <LavaLogo size="sm" className="justify-center mb-2" />
              <h3 className="text-xl font-bold text-white">
                {authStep === 'credentials' ? 'Ingreso Seguro a tu Bitácora Privé' : 'Verificación de Seguridad'}
              </h3>
              <p className="text-xs text-[#8c8276]">
                {authStep === 'credentials'
                  ? 'Ingresá con tu Email, WhatsApp y Contraseña para acceder a tu historial.'
                  : `Ingresá el código de 6 dígitos que enviamos por ${authChannel === 'whatsapp' ? 'WhatsApp' : 'Email'}.`}
              </p>
            </div>

            {authStep === 'credentials' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#8c8276] uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#d49a55]" />
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Santiago Villar"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#8c8276] uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#d49a55]" />
                    Email Registrado
                  </label>
                  <input
                    type="email"
                    placeholder="santiago@prive.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#8c8276] uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#d49a55]" />
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+54 9 297 241-8890"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#8c8276] uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#d49a55]" />
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      required
                      className="w-full p-3 pr-10 rounded-xl bg-[#141414] border border-white/10 text-xs text-white placeholder:text-[#5e554a] focus:outline-none focus:border-[#d49a55]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d7367] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Channel Selector */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-semibold text-[#8c8276] uppercase tracking-wider block">
                    Recibir código de verificación por:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthChannel('whatsapp')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        authChannel === 'whatsapp'
                          ? 'bg-[#1b3820] border-[#388544] text-[#4ade80]'
                          : 'bg-[#141414] border-white/5 text-[#8c8276] hover:text-white'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthChannel('email')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        authChannel === 'email'
                          ? 'bg-white/15 border-[#d49a55] text-white'
                          : 'bg-[#141414] border-white/5 text-[#8c8276] hover:text-white'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#d49a55] text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Código de Verificación</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(false)}
                    className="w-full py-2 text-xs text-[#7d7367] hover:text-white transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              /* OTP Step */
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="p-4 rounded-2xl bg-[#141414] border border-[#d49a55]/30 space-y-2 text-center">
                  <span className="text-[11px] text-[#a19688] block">
                    Código de prueba generado:
                  </span>
                  <div className="font-mono text-xl tracking-[0.3em] font-bold text-[#d49a55]">
                    {generatedOtp}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpInput(generatedOtp)}
                    className="text-[10px] text-[#8c8276] hover:text-white underline cursor-pointer"
                  >
                    Auto-completar código
                  </button>
                </div>

                <div className="space-y-1.5 text-center">
                  <label className="text-[11px] font-semibold text-[#8c8276] uppercase tracking-wider block">
                    Ingresá el código de 6 dígitos
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="••••••"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    required
                    autoFocus
                    className="w-full p-4 rounded-xl bg-black border border-white/20 text-center font-mono text-2xl tracking-[0.4em] text-white focus:outline-none focus:border-[#d49a55]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#8c8276]">
                  <span>¿No recibiste el código?</span>
                  {resendTimer > 0 ? (
                    <span className="text-[#635c52]">Reenviar en {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                        setGeneratedOtp(newCode);
                        setResendTimer(30);
                        showToast('Nuevo código enviado');
                      }}
                      className="text-[#d49a55] font-semibold hover:underline cursor-pointer"
                    >
                      Reenviar código
                    </button>
                  )}
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#d49a55] text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirmar Código e Ingresar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthStep('credentials')}
                    className="w-full py-2 text-xs text-[#7d7367] hover:text-white transition-colors cursor-pointer"
                  >
                    ← Modificar teléfono o email
                  </button>
                </div>
              </form>
            )}

            {/* Quick Demo Switcher */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#5e554a] block text-center">
                O acceso rápido para prueba:
              </span>
              <div className="flex flex-wrap gap-2 justify-center">
                {DEMO_CLIENTS.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => handleSelectClientDirect(demo)}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-[#c9bba8] hover:text-white hover:border-[#d49a55]/40 transition-all cursor-pointer"
                  >
                    {demo.customerName} ({demo.points} pts)
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
         MODAL 2: CRM POINTS DEDUCTION MODAL
         ======================================================== */}
      {isDeductModalOpen && selectedClientForDeduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c0c0c] border border-white/10 shadow-2xl space-y-6">
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#d49a55] tracking-widest block">
                Tostaduría San Martín de los Andes
              </span>
              <h3 className="text-xl font-bold text-white">
                Canje & Descuento de Puntos
              </h3>
              <p className="text-xs text-[#8c8276]">
                Descontar puntos al socio <strong className="text-white">{selectedClientForDeduct.customerName}</strong>.
              </p>
            </div>

            {/* Client Balance Summary */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#7d7367] block">Puntos Actuales:</span>
                <span className="text-2xl font-bold text-[#f7eedf]">{selectedClientForDeduct.points} pts</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#7d7367] block">Nivel Privé:</span>
                <span className="text-xs font-semibold text-[#d49a55]">{selectedClientForDeduct.tier}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmDeduction} className="space-y-4">
              
              {/* Select Predefined Reward */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#8c8276] uppercase tracking-wider block">
                  Seleccionar Recompensa del Catálogo:
                </label>
                <select
                  value={selectedRewardId}
                  onChange={(e) => {
                    const rId = e.target.value;
                    setSelectedRewardId(rId);
                    if (rId === 'custom') {
                      setDeductPointsAmount(100);
                      setDeductReason('Canje personalizado');
                    } else {
                      const r = REWARDS_CATALOG.find((rw) => rw.id === rId);
                      if (r) {
                        setDeductPointsAmount(r.pointsCost);
                        setDeductReason(`Canje: ${r.title}`);
                      }
                    }
                  }}
                  className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d49a55]"
                >
                  <option value="custom">-- Canje Personalizado / Ajuste Manual --</option>
                  {REWARDS_CATALOG.map((rw) => (
                    <option key={rw.id} value={rw.id}>
                      {rw.title} ({rw.pointsCost} pts)
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Points Amount */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#8c8276]">
                  <label className="font-semibold uppercase tracking-wider">
                    Puntos a Restar:
                  </label>
                  <span className="text-[#d49a55] font-bold">
                    Nuevo Saldo: {Math.max(0, selectedClientForDeduct.points - deductPointsAmount)} pts
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={selectedClientForDeduct.points}
                    value={deductPointsAmount}
                    onChange={(e) => setDeductPointsAmount(Number(e.target.value))}
                    required
                    className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-base font-bold text-white focus:outline-none focus:border-[#d49a55]"
                  />
                  <div className="flex gap-1">
                    {[50, 100, 150, 300].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDeductPointsAmount(val)}
                        className="px-2.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-mono text-[#c9bba8] cursor-pointer"
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reason / Note */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#8c8276] uppercase tracking-wider block">
                  Motivo / Concepto del Canje:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Canjeó Bolsa 250g en tostadero"
                  value={deductReason}
                  onChange={(e) => setDeductReason(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d49a55]"
                />
              </div>

              {/* Insufficient points alert */}
              {selectedClientForDeduct.points < deductPointsAmount && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>El socio no tiene suficientes puntos para este canje.</span>
                </div>
              )}

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={selectedClientForDeduct.points < deductPointsAmount}
                  className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <MinusCircle className="w-4 h-4" />
                  <span>Confirmar y Descontar {deductPointsAmount} Puntos</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeductModalOpen(false)}
                  className="w-full py-2 text-xs text-[#7d7367] hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
