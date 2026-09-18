export type GrindType = 'Granos' | 'Prensa' | 'Filtro' | 'Moka' | 'Espresso';
export type BagSize = '250g' | '500g' | '1kg' | '3 x 250g (750g)';
export type Frequency = 'one_time' | 'weekly' | 'biweekly' | 'monthly';

export interface CoffeePersonality {
  title: string;
  archetype: string;
  description: string;
  quote: string;
  traits: string[];
  idealRitual: string;
}

export interface CoffeeBean {
  id: string;
  name: string;
  subtitle: string;
  region: string;
  country: string;
  altitude: string;
  shortSummary?: string;
  representation?: string;
  personality: CoffeePersonality;
  notes: string[];
  roastTitle: string;
  roastDesc: string;
  roastPercentage: number; // 0 - 100
  acidityTitle: string;
  acidityPercentage: number; // 0 - 100
  bodyTitle: string;
  bodyDesc: string;
  bodyPercentage: number; // 0 - 100
  prices: {
    '250g': number;
    '500g': number;
    '1kg': number;
  };
  image: string;
  accentColor: string;
  flavorTags: string[];
  bestFor: string[];
  recommendedMethod: string;
  cuppingScore: number;
  description: string;
}

export interface CartItem {
  id: string;
  beanId: string;
  beanName: string;
  grind: GrindType;
  size: BagSize;
  unitPrice: number;
  quantity: number;
  frequency: Frequency;
  customNote?: string;
}

export type OrderStatus = 
  | 'confirmado'
  | 'recibido'
  | 'tostado_fresco'
  | 'molienda_empaque'
  | 'en_preparacion' 
  | 'despachado' 
  | 'en_camino'
  | 'entregado';

export interface BrewingGuide {
  id: string;
  name: string;
  grind: string;
  ratio: string;
  temp: string;
  time: string;
  description: string;
  steps: string[];
}

export interface OrderNotificationPrefs {
  whatsapp: boolean;
  email: boolean;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  mapsLink?: string;
  city: string;
  province: string;
  paymentMethod: 'Transferencia Bancaria' | 'MercadoPago' | 'Coordinar con Tostaduría' | string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  trackingCode: string;
  earnedPoints?: number;
}

export interface Subscription {
  id: string;
  beanId: string;
  beanName: string;
  grind: GrindType;
  size: BagSize;
  quantity: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  status: 'activa' | 'pausada' | 'cancelada';
  startDate: string;
  nextDeliveryDate: string;
  pricePerCycle: number;
  discountPercentage: number;
  customerName: string;
  phone: string;
  address: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  badge: string;
  code: string;
  unlocked: boolean;
  type: 'discount' | 'free_product' | 'vip_experience';
}

export interface LoyaltyProfile {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  tier: string;
  points: number;
  lifetimePoints: number;
  ordersCount: number;
  favoriteBeanId: string;
  tastingLog: {
    beanId: string;
    beanName: string;
    grind: GrindType;
    size: BagSize;
    date: string;
    orderId: string;
  }[];
  memberSince: string;
}

export interface PointLog {
  id: string;
  clientId: string;
  clientName: string;
  pointsDelta: number;
  reason: string;
  date: string;
  performedBy: string;
}

export interface PersonalityQuizAnswer {
  workStyle: string;
  aestheticSpace: string;
  decisionStyle: string;
  sensoryGoal: string;
  energyType: string;
}
