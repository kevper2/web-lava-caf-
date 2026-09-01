import React, { useState } from 'react';
import { Order, LoyaltyProfile, OrderStatus } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Mail, 
  Search, 
  Phone, 
  MessageCircle, 
  Package, 
  Users, 
  Sparkles, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Clock, 
  Truck, 
  CheckCheck, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  LogOut,
  RefreshCw,
  Award,
  Filter,
  FileText
} from 'lucide-react';
import { LavaLogo } from './LavaLogo';

interface CrmDashboardProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  clients: LoyaltyProfile[];
  setClients: React.Dispatch<React.SetStateAction<LoyaltyProfile[]>>;
  currentUserProfile: LoyaltyProfile | null;
  onUpdateCurrentUserProfile: (profile: LoyaltyProfile | null) => void;
}

interface PointLog {
  id: string;
  clientId: string;
  clientName: string;
  pointsDelta: number; // positive or negative
  reason: string;
  date: string;
  performedBy: string;
}

export const CrmDashboard: React.FC<CrmDashboardProps> = ({
  orders,
  setOrders,
  clients,
  setClients,
  currentUserProfile,
  onUpdateCurrentUserProfile,
}) => {
  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active CRM Tab
  const [crmTab, setCrmTab] = useState<'orders' | 'clients' | 'points'>('orders');

  // Search & Filter States
  const [orderFilter, setOrderFilter] = useState<string>('todos');
  const [clientSearch, setClientSearch] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Points Modal / Form State
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [selectedClientForPoints, setSelectedClientForPoints] = useState<LoyaltyProfile | null>(null);
  const [pointsActionType, setPointsActionType] = useState<'add' | 'deduct'>('deduct');
  const [pointsAmount, setPointsAmount] = useState<number>(50);
  const [pointsReason, setPointsReason] = useState<string>('Canje de beneficio en tostador');
  const [pointLogs, setPointLogs] = useState<PointLog[]>([
    {
      id: 'log-1',
      clientId: 'CLI-001',
      clientName: 'Santiago Villar',
      pointsDelta: -150,
      reason: 'Canje Bolsa 250g Café Andes',
      date: '01/09/2026 10:15',
      performedBy: 'Admin LAVA',
    },
    {
      id: 'log-2',
      clientId: 'CLI-002',
      clientName: 'Florencia de la Serna',
      pointsDelta: 50,
      reason: 'Compra 500g Alpi Italiane',
      date: '31/08/2026 18:30',
      performedBy: 'Sistema Checkout',
    }
  ]);

  // New Client Modal State
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('+54 9 ');
  const [newClientEmail, setNewClientEmail] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (adminEmail.toLowerCase() === 'admin@lavacafe.com' && adminPassword === 'lava2026') ||
      (adminEmail.toLowerCase() === 'admin' && adminPassword === 'lava')
    ) {
      setIsAdminLoggedIn(true);
      setAuthError(null);
      showToast('Sesión de Administrador CRM iniciada');
    } else {
      setAuthError('Credenciales incorrectas. Usá admin@lavacafe.com / lava2026');
    }
  };

  const handleFillDemoAdmin = () => {
    setAdminEmail('admin@lavacafe.com');
    setAdminPassword('lava2026');
    setAuthError(null);
  };

  // Order Status update handler
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    showToast(`Pedido #${orderId} actualizado a "${newStatus.replace('_', ' ').toUpperCase()}"`);
  };

  // Send WhatsApp Update to Client
  const handleSendOrderWhatsApp = (order: Order) => {
    const cleanPhone = order.phone.replace(/\D/g, '');
    const message = `*LAVA CAFÉ DE MONTAÑA*\nHola ${order.customerName}, te contactamos desde el tostador en San Martín de los Andes sobre tu pedido *#${order.id}*.\n\n*Estado actual:* ${order.status.replace('_', ' ').toUpperCase()}\n*Código de seguimiento:* ${order.trackingCode}\n*Total:* $${order.total.toLocaleString('es-AR')}\n\n¿Tenés alguna consulta sobre la entrega o la molienda? Estamos a tu disposición.`;
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // Points Adjustment Handler
  const handleConfirmPointsAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForPoints) return;
    if (pointsAmount <= 0) {
      showToast('Ingresá una cantidad de puntos válida');
      return;
    }

    if (pointsActionType === 'deduct' && selectedClientForPoints.points < pointsAmount) {
      showToast(`El cliente solo cuenta con ${selectedClientForPoints.points} puntos.`);
      return;
    }

    const delta = pointsActionType === 'add' ? pointsAmount : -pointsAmount;
    const newPoints = Math.max(0, selectedClientForPoints.points + delta);

    // Update in clients list
    setClients((prev) =>
      prev.map((c) => (c.id === selectedClientForPoints.id ? { ...c, points: newPoints } : c))
    );

    // If current logged-in client is this one, update their active profile
    if (currentUserProfile && currentUserProfile.id === selectedClientForPoints.id) {
      onUpdateCurrentUserProfile({ ...currentUserProfile, points: newPoints });
    }

    // Add audit log
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('es-AR')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLog: PointLog = {
      id: `log-${Date.now()}`,
      clientId: selectedClientForPoints.id,
      clientName: selectedClientForPoints.customerName,
      pointsDelta: delta,
      reason: pointsReason.trim() || 'Ajuste de puntos',
      date: formattedDate,
      performedBy: 'Admin LAVA',
    };

    setPointLogs([newLog, ...pointLogs]);
    showToast(
      `${pointsActionType === 'add' ? 'Sumados' : 'Descontados'} ${pointsAmount} pts a ${selectedClientForPoints.customerName}. Saldo: ${newPoints} pts.`
    );
    setIsPointsModalOpen(false);
  };

  // Create Manual Client Handler
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPhone) {
      showToast('Completá nombre y teléfono');
      return;
    }

    const newProfile: LoyaltyProfile = {
      id: `CLI-${Date.now().toString().slice(-4)}`,
      customerName: newClientName.trim(),
      phone: newClientPhone.trim(),
      email: newClientEmail.trim() || `${newClientName.toLowerCase().replace(/\s+/g, '')}@cliente.ar`,
      tier: 'Privé',
      points: 0,
      lifetimePoints: 0,
      ordersCount: 0,
      favoriteBeanId: 'andes-colombianos',
      memberSince: 'Septiembre 2026',
      tastingLog: [],
    };

    setClients([newProfile, ...clients]);
    showToast(`Cliente ${newProfile.customerName} registrado con éxito`);
    setIsNewClientModalOpen(false);
    setNewClientName('');
    setNewClientPhone('+54 9 ');
    setNewClientEmail('');
  };

  // Add Demo Order for Testing if orders empty
  const handleAddSampleOrder = () => {
    const sampleOrder: Order = {
      id: `LAV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      customerName: 'Martina Rossi',
      phone: '+54 9 11 3147-6953',
      email: 'martina.rossi@ejemplo.com',
      address: 'Av. San Martín 850',
      city: 'San Martín de los Andes',
      province: 'Neuquén',
      paymentMethod: 'Transferencia Bancaria',
      items: [
        {
          id: `sample-item-${Date.now()}`,
          beanId: 'alpi-italiane',
          beanName: 'Alpi Italiane',
          grind: 'Espresso',
          size: '500g',
          unitPrice: 34000,
          quantity: 1,
          frequency: 'one_time',
        },
      ],
      subtotal: 34000,
      discount: 0,
      shipping: 0,
      total: 34000,
      status: 'en_preparacion',
      trackingCode: `LAVA-SMA-${Math.floor(1000 + Math.random() * 9000)}`,
      earnedPoints: 50, // 500g / 10 = 50
    };

    setOrders([sampleOrder, ...orders]);
    showToast('Pedido demo agregado al CRM');
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'todos') return true;
    return o.status === orderFilter;
  });

  // Filtered Clients
  const filteredClients = clients.filter(
    (c) =>
      c.customerName.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.phone.includes(clientSearch) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.tier.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // ----------------------------------------------------
  // VIEW 1: ADMIN LOGIN SCREEN (IF NOT AUTHENTICATED)
  // ----------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <section className="py-24 sm:py-32 px-6 sm:px-10 lg:px-12 max-w-4xl mx-auto min-h-[75vh] flex items-center justify-center">
        
        {/* Toast Alert */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#142817] border border-[#2d5f34] text-[#86efac] text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#0d0d0d] border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#d49a55]/10 to-transparent blur-3xl pointer-events-none" />

          <div className="text-center space-y-2 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#d49a55]/10 border border-[#d49a55]/20 flex items-center justify-center text-[#d49a55] mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#f7eedf] tracking-tight">
              Acceso al CRM LAVA
            </h2>
            <p className="text-xs text-[#8c8276]">
              Panel de gestión integral: pedidos en curso, registro de clientes y administración de puntos.
            </p>
          </div>

          {/* Credentials Helper Box */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-[#d49a55]/25 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#a89d8f] font-medium">Credenciales de Acceso:</span>
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                className="text-[#d49a55] font-bold hover:underline cursor-pointer"
              >
                Autocompletar
              </button>
            </div>
            <div className="text-[11px] font-mono text-[#c9bba8] space-y-0.5 bg-black/40 p-2 rounded-xl border border-white/5">
              <div>Usuario: <span className="text-[#f7eedf]">admin@lavacafe.com</span></div>
              <div>Contraseña: <span className="text-[#f7eedf]">lava2026</span></div>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10">
            {authError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8c8276] uppercase tracking-wider block">
                Email de Administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8c8276] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@lavacafe.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs placeholder-[#5c5449] focus:outline-none focus:border-[#d49a55]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8c8276] uppercase tracking-wider block">
                Contraseña
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#8c8276] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs placeholder-[#5c5449] focus:outline-none focus:border-[#d49a55]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#d49a55] hover:bg-[#e0a660] text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#d49a55]/20 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Ingresar al CRM</span>
            </button>
          </form>
        </div>

      </section>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: LOGGED IN CRM DASHBOARD
  // ----------------------------------------------------
  return (
    <section className="py-20 sm:py-24 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#142817] border border-[#2d5f34] text-[#86efac] text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* CRM Header with Stats & Logout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090909] border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#d49a55]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d49a55]/10 border border-[#d49a55]/20 text-[10px] uppercase tracking-widest text-[#d49a55] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel de Administración Central · San Martín de los Andes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#f7eedf] tracking-tight">
            Gestión CRM & Operaciones
          </h2>
          <p className="text-xs text-[#8c8276]">
            Monitoreo en tiempo real de despachos, cartera de socios CLUB MAGMA y balance de puntos.
          </p>
        </div>

        {/* Action button & Logout */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-[#a89d8f] hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Cerrar Sesión Admin</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/10 overflow-x-auto">
          <button
            onClick={() => setCrmTab('orders')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              crmTab === 'orders'
                ? 'bg-[#d49a55] text-black shadow-md font-bold'
                : 'text-[#8c8276] hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Pedidos en Curso ({orders.length})</span>
          </button>

          <button
            onClick={() => setCrmTab('clients')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              crmTab === 'clients'
                ? 'bg-[#d49a55] text-black shadow-md font-bold'
                : 'text-[#8c8276] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Todos los Clientes ({clients.length})</span>
          </button>

          <button
            onClick={() => setCrmTab('points')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              crmTab === 'points'
                ? 'bg-[#d49a55] text-black shadow-md font-bold'
                : 'text-[#8c8276] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Sistema de Puntos</span>
          </button>
        </div>

        {/* Quick action buttons per tab */}
        {crmTab === 'orders' && (
          <button
            onClick={handleAddSampleOrder}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#d49a55] font-semibold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generar Pedido Demo</span>
          </button>
        )}

        {crmTab === 'clients' && (
          <button
            onClick={() => setIsNewClientModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#d49a55] text-black text-xs font-bold transition-all cursor-pointer hover:bg-[#e0a660]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Cliente</span>
          </button>
        )}
      </div>

      {/* ========================================================
         TAB 1: PEDIDOS EN CURSO (ORDERS MANAGEMENT)
         ======================================================== */}
      {crmTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'todos', label: 'Todos los Pedidos' },
              { id: 'en_preparacion', label: 'En Preparación' },
              { id: 'despachado', label: 'Despachados' },
              { id: 'entregado', label: 'Entregados' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setOrderFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  orderFilter === f.id
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'bg-white/[0.03] text-[#8c8276] hover:text-white border border-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#090909] border border-white/5 space-y-3">
              <Package className="w-10 h-10 text-[#4c443b] mx-auto" />
              <h4 className="text-base font-bold text-[#f7eedf]">No hay pedidos en este filtro</h4>
              <p className="text-xs text-[#8c8276] max-w-sm mx-auto">
                Los pedidos generados por los clientes en la tienda o vía WhatsApp aparecerán registrados aquí automáticamente.
              </p>
              <button
                onClick={handleAddSampleOrder}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d49a55] text-black text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Crear Pedido de Demostración</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#0c0c0c] border border-white/10 space-y-4 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#d49a55]/10 border border-[#d49a55]/20 flex items-center justify-center text-[#d49a55]">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            Orden #{ord.id}
                          </span>
                          <span className="text-[10px] font-mono text-[#8c8276] px-2 py-0.5 rounded bg-white/5">
                            {ord.trackingCode}
                          </span>
                        </div>
                        <span className="text-xs text-[#a89d8f]">{ord.date}</span>
                      </div>
                    </div>

                    {/* Status badge & WhatsApp button */}
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                          ord.status === 'entregado'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : ord.status === 'despachado'
                            ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {ord.status.replace('_', ' ')}
                      </span>

                      <button
                        onClick={() => handleSendOrderWhatsApp(ord)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b3820] hover:bg-[#234b2a] border border-[#2d6335] text-[#4ade80] text-xs font-semibold transition-all cursor-pointer"
                        title="Enviar actualización por WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Notificar WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer and Order details grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[#8c8276] uppercase tracking-wider text-[10px] font-bold block">
                        Cliente & Envío
                      </span>
                      <p className="text-white font-medium">{ord.customerName}</p>
                      <p className="text-[#a89d8f]">{ord.phone}</p>
                      <p className="text-[#8c8276]">{ord.address}, {ord.city}</p>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <span className="text-[#8c8276] uppercase tracking-wider text-[10px] font-bold block">
                        Ítems del Pedido ({ord.items.length})
                      </span>
                      <div className="space-y-1">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/[0.03]">
                            <span className="text-[#f7eedf]">
                              {item.quantity}x {item.beanName} · <span className="text-[#d49a55]">{item.size}</span> · Molienda {item.grind}
                            </span>
                            <span className="text-white font-mono font-medium">
                              ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-1 font-bold">
                        <span className="text-[#8c8276]">Total: ${ord.total.toLocaleString('es-AR')}</span>
                        <span className="text-[#d49a55] text-[11px]">+{ord.earnedPoints} pts sumados</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Status Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                    <span className="text-[11px] text-[#8c8276]">Cambiar estado del pedido:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'en_preparacion')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          ord.status === 'en_preparacion'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-white/5 text-[#8c8276] hover:text-white'
                        }`}
                      >
                        En preparación
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'despachado')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          ord.status === 'despachado'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : 'bg-white/5 text-[#8c8276] hover:text-white'
                        }`}
                      >
                        Despachado
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'entregado')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          ord.status === 'entregado'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-white/5 text-[#8c8276] hover:text-white'
                        }`}
                      >
                        Entregado
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
         TAB 2: REGISTRO DE TODOS LOS CLIENTES (CLIENTS DIRECTORY)
         ======================================================== */}
      {crmTab === 'clients' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#8c8276] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o email..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090909] border border-white/10 text-white text-xs placeholder-[#5c5449] focus:outline-none focus:border-[#d49a55]"
            />
          </div>

          {filteredClients.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#090909] border border-white/5 space-y-3">
              <Users className="w-10 h-10 text-[#4c443b] mx-auto" />
              <h4 className="text-base font-bold text-[#f7eedf]">No se encontraron clientes</h4>
              <p className="text-xs text-[#8c8276]">
                Podés registrar nuevos clientes manualmente con el botón superior.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="p-5 rounded-2xl bg-[#0c0c0c] border border-white/10 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {client.customerName}
                        </h4>
                        <span className="text-[10px] text-[#8c8276] font-mono">
                          ID: {client.id} · Desde {client.memberSince}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d49a55]/15 text-[#d49a55] border border-[#d49a55]/30">
                        {client.tier}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-[#a89d8f]">
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#8c8276]" />
                        <span>{client.phone}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#8c8276]" />
                        <span className="truncate">{client.email}</span>
                      </p>
                    </div>

                    {/* Points Balance Pill */}
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-[#8c8276] font-bold">
                          Balance de Puntos
                        </span>
                        <div className="text-lg font-bold text-[#f7eedf]">
                          {client.points} <span className="text-xs font-normal text-[#8c8276]">pts</span>
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-[#8c8276]">
                        <div>{client.ordersCount} pedidos</div>
                        <div className="text-[10px]">{client.lifetimePoints} pts acumulados</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        setSelectedClientForPoints(client);
                        setPointsActionType('deduct');
                        setPointsAmount(50);
                        setIsPointsModalOpen(true);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer text-center"
                    >
                      Ajustar Puntos
                    </button>

                    <a
                      href={`https://wa.me/${client.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(client.customerName)},%20te%20escribimos%20desde%20LAVA%20Caf%C3%A9%20de%20Monta%C3%B1a.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#1b3820] hover:bg-[#234b2a] text-[#4ade80] transition-all cursor-pointer"
                      title="Chatear por WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
         TAB 3: SISTEMA DE PUNTOS & HISTORIAL (POINTS ENGINE)
         ======================================================== */}
      {crmTab === 'points' && (
        <div className="space-y-8">
          
          {/* Rules & Quick Action Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#d49a55] font-bold block">
                Regla de Puntos
              </span>
              <h4 className="text-xl font-bold text-white">10 gramos = 1 Punto</h4>
              <p className="text-xs text-[#8c8276]">
                500g = 50 pts · 1kg = 100 pts · 250g = 25 pts. Se calculan automáticamente en compras.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#d49a55] font-bold block">
                Total Puntos en Circulación
              </span>
              <h4 className="text-xl font-bold text-white">
                {clients.reduce((acc, c) => acc + c.points, 0)} pts
              </h4>
              <p className="text-xs text-[#8c8276]">
                Distribuido entre {clients.length} socios registrados en el Club Magma.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-[#d49a55]/20 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#d49a55] font-bold block">
                  Ajuste Directo de Puntos
                </span>
                <p className="text-xs text-[#8c8276]">
                  Sumá puntos por cortesía o descontá por canje de beneficios en mostrador.
                </p>
              </div>
              <button
                onClick={() => {
                  if (clients.length > 0) {
                    setSelectedClientForPoints(clients[0]);
                    setIsPointsModalOpen(true);
                  } else {
                    showToast('Registrá un cliente primero');
                  }
                }}
                className="mt-3 w-full py-2.5 rounded-xl bg-[#d49a55] hover:bg-[#e0a660] text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Operar Puntos</span>
              </button>
            </div>

          </div>

          {/* Audit Logs Table */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#f7eedf] tracking-tight">
              Registro Histórico de Movimientos de Puntos
            </h3>

            <div className="rounded-2xl bg-[#0c0c0c] border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.03] text-[#8c8276] uppercase text-[10px] tracking-wider border-b border-white/5">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Fecha</th>
                      <th className="py-3.5 px-4 font-semibold">Cliente</th>
                      <th className="py-3.5 px-4 font-semibold">Movimiento</th>
                      <th className="py-3.5 px-4 font-semibold">Concepto / Motivo</th>
                      <th className="py-3.5 px-4 font-semibold">Operador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[#c9bba8]">
                    {pointLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.01]">
                        <td className="py-3 px-4 font-mono text-[11px] text-[#8c8276]">
                          {log.date}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          {log.clientName}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-bold ${
                              log.pointsDelta > 0 ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {log.pointsDelta > 0 ? `+${log.pointsDelta}` : log.pointsDelta} pts
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#a89d8f]">
                          {log.reason}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-[#8c8276]">
                          {log.performedBy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
         MODAL: AJUSTE DE PUNTOS (ADD / DEDUCT)
         ======================================================== */}
      {isPointsModalOpen && selectedClientForPoints && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0f0f0f] border border-white/10 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Ajustar Puntos
                </h3>
                <p className="text-xs text-[#8c8276]">
                  Cliente: <span className="text-[#f7eedf] font-semibold">{selectedClientForPoints.customerName}</span> (Saldo actual: {selectedClientForPoints.points} pts)
                </p>
              </div>
              <button
                onClick={() => setIsPointsModalOpen(false)}
                className="text-[#8c8276] hover:text-white cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmPointsAdjustment} className="space-y-4">
              
              {/* Select Client Dropdown */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#8c8276] uppercase">
                  Seleccionar Cliente
                </label>
                <select
                  value={selectedClientForPoints.id}
                  onChange={(e) => {
                    const c = clients.find((item) => item.id === e.target.value);
                    if (c) setSelectedClientForPoints(c);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-[#d49a55]"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.customerName} ({c.points} pts)
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Type: Add vs Deduct */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPointsActionType('deduct')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    pointsActionType === 'deduct'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-white/5 text-[#8c8276] hover:text-white'
                  }`}
                >
                  Descontar (-) Canje
                </button>
                <button
                  type="button"
                  onClick={() => setPointsActionType('add')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    pointsActionType === 'add'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/5 text-[#8c8276] hover:text-white'
                  }`}
                >
                  Sumar (+) Bonificación
                </button>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#8c8276] uppercase">
                  Cantidad de Puntos
                </label>
                <input
                  type="number"
                  min="1"
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-[#d49a55]"
                  required
                />
              </div>

              {/* Reason */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#8c8276] uppercase">
                  Motivo / Concepto
                </label>
                <input
                  type="text"
                  value={pointsReason}
                  onChange={(e) => setPointsReason(e.target.value)}
                  placeholder="Ej: Canje Bolsa Reserva 250g"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-[#d49a55]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#d49a55] hover:bg-[#e0a660] text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Confirmar Ajuste
              </button>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
         MODAL: REGISTRAR NUEVO CLIENTE MANUALMENTE
         ======================================================== */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0f0f0f] border border-white/10 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Registrar Nuevo Cliente
                </h3>
                <p className="text-xs text-[#8c8276]">
                  Alta de socio en el sistema CLUB MAGMA.
                </p>
              </div>
              <button
                onClick={() => setIsNewClientModalOpen(false)}
                className="text-[#8c8276] hover:text-white cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#8c8276] uppercase">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-[#d49a55]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#8c8276] uppercase">
                  WhatsApp de Contacto *
                </label>
                <input
                  type="tel"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="+54 9 11 3147-6953"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-[#d49a55]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#8c8276] uppercase">
                  Email
                </label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="juan@ejemplo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-[#d49a55]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#d49a55] hover:bg-[#e0a660] text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Guardar Cliente
              </button>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};
