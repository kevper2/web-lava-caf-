import { CoffeeBean, Reward, Subscription, Order, LoyaltyProfile, BrewingGuide, BagSize } from '../types';

export const COFFEE_BEANS: CoffeeBean[] = [
  {
    id: 'andes-colombianos',
    name: 'Andes Colombianos',
    subtitle: 'Selección de Altura Suprema',
    region: 'Huila / Tolima',
    country: 'Colombia',
    altitude: '1800 msnm',
    personality: {
      title: 'El Visionario Estratégico',
      archetype: 'Claridad, agudeza mental y estética vanguardista',
      description: 'Diseñado para mentes analíticas que buscan lucidez intelectual, precisión en sus ideas y una frescura aromática sofisticada sin estridencias.',
      quote: '“La lucidez no se improvisa: se cultiva en cada decisión matutina.”',
      traits: ['Pensamiento estratégico', 'Apreciación por el detalle fino', 'Búsqueda de claridad absoluta'],
      idealRitual: 'Filtrados de alta precisión matutinos antes de sesiones de alta concentración.',
    },
    notes: ['Chocolate y caramelo', 'Clavo y canela', 'Frutas Tropicales'],
    roastTitle: 'Tueste Medio Noble',
    roastDesc: 'Aromático & Vibrante',
    roastPercentage: 75,
    acidityTitle: 'Acidez Cítrica Brillante',
    acidityPercentage: 45,
    bodyTitle: 'Cuerpo Sedoso',
    bodyDesc: 'Fluido y elegante',
    bodyPercentage: 65,
    prices: {
      '250g': 20000,
      '500g': 38000,
      '1kg': 73000,
    },
    image: '/src/assets/images/lava_hero_mountain_1788194433698.jpg',
    accentColor: '#d49a55',
    flavorTags: ['Canela Noble', 'Frutas Doradas', 'Cacao Tibio'],
    bestFor: ['Filtro V60', 'Chemex', 'Aeropress', 'Prensa Francesa'],
    recommendedMethod: 'Filtrados de precisión o Prensa para liberar su bouquet especiado y acidez refinada.',
    cuppingScore: 88.5,
    description: 'Nacido en las laderas más empinadas de la cordillera andina. Su altitud concentra azúcares complejos que entregan una experiencia aromática luminosa, con notas a especias cálidas y un final largo de caramelo tostado.',
  },
  {
    id: 'serra-da-mantiqueira',
    name: 'Serra da Mantiqueira',
    subtitle: 'Reserva Clásica de Montaña',
    region: 'Minas Gerais',
    country: 'Brasil',
    altitude: '1200 msnm',
    personality: {
      title: 'El Hedonista Sofisticado',
      archetype: 'Serenidad, calidez envolvente y dominio del balance',
      description: 'Para quienes no negocian el confort de un café con presencia redonda, textura de terciopelo y un equilibrio impecable de dulzura natural.',
      quote: '“El verdadero lujo es la calma de un momento inalterable.”',
      traits: ['Atracción por el confort premium', 'Carácter templado', 'Amante de la armonía absoluta'],
      idealRitual: 'Pausas vespertinas o espressos dobles después de un almuerzo de negocios.',
    },
    notes: ['Cacao tostado', 'Frutas secas y nueces', 'Caramelo'],
    roastTitle: 'Tueste Medio Perfecto',
    roastDesc: 'Secado natural al sol',
    roastPercentage: 60,
    acidityTitle: 'Acidez Dulce Aterciopelada',
    acidityPercentage: 40,
    bodyTitle: 'Cuerpo Cremoso',
    bodyDesc: 'Denso y envolvente',
    bodyPercentage: 75,
    prices: {
      '250g': 19000,
      '500g': 34000,
      '1kg': 66000,
    },
    image: '/src/assets/images/lava_roasted_beans_1788194453416.jpg',
    accentColor: '#c6894b',
    flavorTags: ['Avellana Tostada', 'Cacao Puro', 'Toffee'],
    bestFor: ['Espresso', 'Moka Italiana', 'Prensa', 'Flat White'],
    recommendedMethod: 'Cafetera Italiana Moka o Espresso para coronar una crema densa y notas a frutos secos.',
    cuppingScore: 87.0,
    description: 'El epítome de la armonía de montaña. Su secado natural bajo el sol de Mantiqueira forja un perfil suntuoso de cacao, almendras tostadas y una dulzura acaramelada que acaricia el paladar.',
  },
  {
    id: 'alpi-italiane',
    name: 'Alpi Italiane',
    subtitle: 'Tueste Nómada de Carácter Imponente',
    region: 'Tradición Alpina Norte',
    country: 'Selección Especial',
    altitude: '1200 msnm',
    personality: {
      title: 'La Fuerza Determinada',
      archetype: 'Presencia regia, decisiones firmes y poder sin concesiones',
      description: 'Concebido para quienes avanzan con determinación. Un café de enorme peso sensorial, carácter oscuro y un retrogusto ahumado inconfundible.',
      quote: '“La intensidad no pide permiso: marca el rumbo.”',
      traits: ['Liderazgo contundente', 'Atracción por lo intenso y clásico', 'Determinación sin fisuras'],
      idealRitual: 'Primer shot de espresso al amanecer para activar una jornada de alto rendimiento.',
    },
    notes: ['Chocolate amargo', 'Frutos secos y caramelo', 'Nuez moscada'],
    roastTitle: 'Tueste Oscuro Magistral',
    roastDesc: 'Robusto & Resinoso',
    roastPercentage: 92,
    acidityTitle: 'Acidez Mínima y Noble',
    acidityPercentage: 20,
    bodyTitle: 'Cuerpo Pleno & Denso',
    bodyDesc: 'Profundo y persistente',
    bodyPercentage: 95,
    prices: {
      '250g': 19000,
      '500g': 34000,
      '1kg': 66000,
    },
    image: '/src/assets/images/lava_brewing_ritual_1788194473817.jpg',
    accentColor: '#9e6231',
    flavorTags: ['Chocolate 80%', 'Maderas Nobles', 'Nuez Moscada'],
    bestFor: ['Espresso Intenso', 'Ristretto', 'Moka Italiana', 'Cortado'],
    recommendedMethod: 'Espresso o Moka a alta temperatura para una extracción intensa y un retrogusto legendario.',
    cuppingScore: 89.0,
    description: 'Inspirado en la cultura de refugios de alta montaña del norte italiano. Un tueste profundo con notas intensas a cacao amargo, maderas nobles y nuez moscada que impone su presencia con autoridad.',
  },
];

export const DEMO_CLIENTS: LoyaltyProfile[] = [
  {
    id: 'CLI-001',
    customerName: 'Santiago Villar',
    phone: '+54 9 11 3147-6953',
    email: 'santiago.villar@patagoniaprive.com',
    tier: 'Summit Elite',
    points: 840,
    lifetimePoints: 1820,
    ordersCount: 6,
    favoriteBeanId: 'alpi-italiane',
    memberSince: 'Marzo 2025',
    tastingLog: [
      {
        beanId: 'alpi-italiane',
        beanName: 'Alpi Italiane',
        grind: 'Espresso',
        size: '500g',
        date: '28 Ago 2026',
        orderId: 'LAV-9812',
      },
      {
        beanId: 'andes-colombianos',
        beanName: 'Andes Colombianos',
        grind: 'Filtro',
        size: '250g',
        date: '14 Ago 2026',
        orderId: 'LAV-9420',
      },
      {
        beanId: 'serra-da-mantiqueira',
        beanName: 'Serra da Mantiqueira',
        grind: 'Prensa',
        size: '1kg',
        date: '22 Jul 2026',
        orderId: 'LAV-8910',
      },
      {
        beanId: 'alpi-italiane',
        beanName: 'Alpi Italiane',
        grind: 'Moka',
        size: '500g',
        date: '02 Jul 2026',
        orderId: 'LAV-8430',
      },
    ],
  },
  {
    id: 'CLI-002',
    customerName: 'Florencia de la Serna',
    phone: '+54 9 294 489-1122',
    email: 'florencia@estudiodesign.ar',
    tier: 'Master Reserve',
    points: 460,
    lifetimePoints: 920,
    ordersCount: 3,
    favoriteBeanId: 'andes-colombianos',
    memberSince: 'Mayo 2026',
    tastingLog: [
      {
        beanId: 'andes-colombianos',
        beanName: 'Andes Colombianos',
        grind: 'Filtro',
        size: '500g',
        date: '19 Ago 2026',
        orderId: 'LAV-9602',
      },
      {
        beanId: 'serra-da-mantiqueira',
        beanName: 'Serra da Mantiqueira',
        grind: 'Filtro',
        size: '250g',
        date: '03 Ago 2026',
        orderId: 'LAV-9214',
      },
    ],
  },
  {
    id: 'CLI-003',
    customerName: 'Ignacio Roca',
    phone: '+54 9 11 5500-3344',
    email: 'iroca@inversiones.com',
    tier: 'Privé',
    points: 210,
    lifetimePoints: 210,
    ordersCount: 1,
    favoriteBeanId: 'serra-da-mantiqueira',
    memberSince: 'Agosto 2026',
    tastingLog: [
      {
        beanId: 'serra-da-mantiqueira',
        beanName: 'Serra da Mantiqueira',
        grind: 'Granos',
        size: '1kg',
        date: '25 Ago 2026',
        orderId: 'LAV-9740',
      },
    ],
  },
];

export const INITIAL_LOYALTY_PROFILE: LoyaltyProfile | null = null;
export const INITIAL_CLIENTS: LoyaltyProfile[] = DEMO_CLIENTS;

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'SUB-902',
    beanId: 'alpi-italiane',
    beanName: 'Alpi Italiane',
    grind: 'Espresso',
    size: '500g',
    quantity: 1,
    frequency: 'biweekly',
    status: 'activa',
    startDate: '2026-06-10',
    nextDeliveryDate: '2026-09-08',
    pricePerCycle: 23375, // 15% VIP discount
    discountPercentage: 15,
    customerName: 'Santiago Villar',
    phone: '+54 9 11 3147-6953',
    address: 'Barrio Las Pendientes, San Martín de los Andes',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'LAV-9812',
    date: '2026-08-28',
    customerName: 'Santiago Villar',
    phone: '+54 9 11 3147-6953',
    email: 'santiago.villar@patagoniaprive.com',
    address: 'Barrio Las Pendientes',
    city: 'San Martín de los Andes',
    province: 'Neuquén',
    paymentMethod: 'Transferencia Bancaria',
    items: [
      {
        id: 'it-1',
        beanId: 'alpi-italiane',
        beanName: 'Alpi Italiane',
        grind: 'Espresso',
        size: '500g',
        unitPrice: 27500,
        quantity: 1,
        frequency: 'biweekly',
      },
    ],
    subtotal: 27500,
    discount: 4125,
    shipping: 0,
    total: 23375,
    status: 'despachado',
    trackingCode: 'LAVA-SMA-8921',
    earnedPoints: 120,
  },
  {
    id: 'LAV-9420',
    date: '2026-08-14',
    customerName: 'Santiago Villar',
    phone: '+54 9 11 3147-6953',
    email: 'santiago.villar@patagoniaprive.com',
    address: 'Barrio Las Pendientes',
    city: 'San Martín de los Andes',
    province: 'Neuquén',
    paymentMethod: 'MercadoPago',
    items: [
      {
        id: 'it-2',
        beanId: 'andes-colombianos',
        beanName: 'Andes Colombianos',
        grind: 'Filtro',
        size: '250g',
        unitPrice: 14500,
        quantity: 1,
        frequency: 'one_time',
      },
    ],
    subtotal: 14500,
    discount: 0,
    shipping: 0,
    total: 14500,
    status: 'entregado',
    trackingCode: 'LAVA-SMA-7714',
    earnedPoints: 80,
  },
];

export const REWARDS_CATALOG: Reward[] = [
  {
    id: 'rew-1',
    title: 'Bolsa Reserva 250g a Elección',
    description: 'Canje de cortesía exclusivo para miembros por cualquier estilo de café con molienda personalizada.',
    pointsCost: 400,
    badge: 'Beneficio Exclusivo',
    code: 'RESERVA-250G-MAGMA',
    unlocked: true,
    type: 'free_product',
  },
  {
    id: 'rew-2',
    title: '20% OFF en tu Próxima Orden',
    description: 'Sólo aplicable a pedidos individuales',
    pointsCost: 500,
    badge: 'Descuento VIP',
    code: 'MAGMA20-SANMARTIN',
    unlocked: true,
    type: 'discount',
  },
  {
    id: 'rew-3',
    title: 'Kit prensa francesa y molinillo manual y envase hermético para camping',
    description: 'Set completo de aventura patagónica para extraer café de montaña en cualquier lugar.',
    pointsCost: 800,
    badge: 'Kit Aventura',
    code: 'KIT-CAMPING-MAGMA',
    unlocked: true,
    type: 'vip_experience',
  },
];

// Helper: 1 punto por cada 10g de café (ej: 500g = 50 puntos, 250g = 25 puntos, 1kg = 100 puntos)
export function getGramsForBagSize(size: BagSize): number {
  switch (size) {
    case '250g':
      return 250;
    case '500g':
      return 500;
    case '1kg':
      return 1000;
    default:
      return 500;
  }
}

export function calculatePointsForBag(size: BagSize, quantity: number = 1): number {
  const grams = getGramsForBagSize(size);
  return Math.floor((grams * quantity) / 10);
}

export function calculateEarnedPointsFromItems(items: { size: BagSize; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + calculatePointsForBag(item.size, item.quantity), 0);
}

export const BREWING_GUIDES: BrewingGuide[] = [
  {
    id: 'prensa',
    name: 'Prensa Francesa',
    grind: 'Gruesa · Textura sal marina',
    ratio: '1:15 (20g café / 300ml agua)',
    temp: '93°C',
    time: '4:00 min',
    description: 'Extracción por inmersión total que resalta cuerpo denso y notas a chocolate oscuro.',
    steps: [
      'Pesar 20g de café molido grueso y colocar en la jarra precalentada.',
      'Verter 300ml de agua caliente a 93°C cubriendo todo el grano.',
      'Dejar reposar 4 minutos exactos sin empujar el émbolo.',
      'Romper la costra superficial suavemente con cuchara y retirar la espuma.',
      'Colocar el émbolo, bajar lentamente hasta el fondo y servir de inmediato.',
    ],
  },
  {
    id: 'filtro',
    name: 'Filtro / V60',
    grind: 'Media · Textura arena de río',
    ratio: '1:16 (18g café / 300ml agua)',
    temp: '91°C',
    time: '3:00 min',
    description: 'Claridad cristalina y acidez brillante que realza los perfiles florales y cítricos.',
    steps: [
      'Enjuagar el filtro de papel con agua caliente para eliminar sabores residuales.',
      'Agregar 18g de café molido medio y nivelar la cama.',
      'Pre-infusión: verter 50g de agua en espiral y aguardar 40 segundos.',
      'Completar el vertido en pulsos continuos circulares hasta alcanzar 300g.',
      'Dejar decantar totalmente y oxigenar la jarra antes de degustar.',
    ],
  },
  {
    id: 'moka',
    name: 'Moka Italiana',
    grind: 'Media-Fina · Tacto sedoso',
    ratio: '1:10 (15g café / 150ml agua)',
    temp: 'Fuego medio-bajo',
    time: '3:30 min',
    description: 'Intensidad concentrada, cuerpo untuoso y aromas profundos con perfil clásico.',
    steps: [
      'Llenar la caldera inferior con agua caliente hasta justo debajo de la válvula.',
      'Llenar el embudo con 15g de café molido sin prensar fuertemente.',
      'Enroscar la cafetera y colocar a fuego moderado con la tapa entreabierta.',
      'Retirar del fuego en cuanto el flujo se torne dorado y espumoso.',
      'Enfriar la base con un paño húmedo para cortar la extracción térmica.',
    ],
  },
  {
    id: 'espresso',
    name: 'Espresso Barista',
    grind: 'Fina · Harina granulada',
    ratio: '1:2 (18g café / 36g líquido)',
    temp: '92°C a 9 bar',
    time: '25-30 seg',
    description: 'Crema avellanada persistente, concentración extrema y cuerpo aterciopelado.',
    steps: [
      'Purgar el grupo y secar la canasta del portafiltro.',
      'Pesar 18g de molienda fina distribuida de forma homogénea.',
      'Tampado parejo y horizontal con 15kg de presión.',
      'Iniciar la erogación inmediatamente: 36g de líquido en taza en 27 segundos.',
      'Mezclar la crema con cuchara y disfrutar al instante.',
    ],
  },
];
