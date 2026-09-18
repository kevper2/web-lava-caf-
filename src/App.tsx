import React, { useState, useEffect } from 'react';
import { CoffeeBean, CartItem, Order, Subscription, LoyaltyProfile, GrindType, BagSize } from './types';
import { COFFEE_BEANS, INITIAL_ORDERS, INITIAL_SUBSCRIPTIONS, INITIAL_CLIENTS } from './data/coffeeData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CoffeeStickersShowcase } from './components/CoffeeStickersShowcase';
import { BrandStory } from './components/BrandStory';
import { LoyaltyClub } from './components/LoyaltyClub';
import { CrmDashboard } from './components/CrmDashboard';
import { BrewingGuides } from './components/BrewingGuides';
import { BeanCustomizerModal } from './components/BeanCustomizerModal';
import { WhatsAppCheckoutModal } from './components/WhatsAppCheckoutModal';
import { OnboardingQuizModal } from './components/OnboardingQuizModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'club' | 'guides' | 'crm'>('home');

  // Automatic scroll to top whenever tab/link changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Initial cart starts clean/empty
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Orders registry in CRM with persistent storage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('lava_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading stored orders', e);
    }
    return INITIAL_ORDERS;
  });

  // Save orders to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('lava_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Error saving orders to localStorage', e);
    }
  }, [orders]);
  
  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  
  // Complete clients list in CRM with persistent storage
  const [clients, setClients] = useState<LoyaltyProfile[]>(() => {
    try {
      const saved = localStorage.getItem('lava_clients');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading stored clients', e);
    }
    return INITIAL_CLIENTS;
  });

  // Save clients to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('lava_clients', JSON.stringify(clients));
    } catch (e) {
      console.warn('Error saving clients to localStorage', e);
    }
  }, [clients]);
  
  // Starts logged out (null) as requested
  const [loyaltyProfile, setLoyaltyProfile] = useState<LoyaltyProfile | null>(() => {
    try {
      const saved = localStorage.getItem('lava_active_member');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Save active member profile
  useEffect(() => {
    try {
      if (loyaltyProfile) {
        localStorage.setItem('lava_active_member', JSON.stringify(loyaltyProfile));
      } else {
        localStorage.removeItem('lava_active_member');
      }
    } catch (e) {}
  }, [loyaltyProfile]);

  // Redirect club tab while in pause
  useEffect(() => {
    if (activeTab === 'club') {
      setActiveTab('catalog');
    }
  }, [activeTab]);

  // Modals state
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizingBean, setCustomizingBean] = useState<CoffeeBean | null>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<CartItem | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Handlers
  const handleOpenCustomizer = (bean: CoffeeBean) => {
    setCustomizingBean(bean);
    setIsCustomizerOpen(true);
  };

  const handleAddToCart = (beanOrItem: CoffeeBean | CartItem, grind: GrindType = 'Granos', size: BagSize = '500g') => {
    if ('unitPrice' in beanOrItem) {
      setCartItems((prev) => [...prev, beanOrItem]);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        beanId: beanOrItem.id,
        beanName: beanOrItem.name,
        grind,
        size,
        unitPrice: beanOrItem.prices[size],
        quantity: 1,
        frequency: 'one_time',
      };
      setCartItems((prev) => [...prev, newItem]);
    }
    setIsCartOpen(true);
  };

  const handleDirectWhatsAppOrder = (bean: CoffeeBean, grind: GrindType, size: BagSize) => {
    const singleItem: CartItem = {
      id: `direct-${Date.now()}`,
      beanId: bean.id,
      beanName: bean.name,
      grind,
      size,
      unitPrice: bean.prices[size],
      quantity: 1,
      frequency: 'one_time',
    };
    setDirectCheckoutItem(singleItem);
    setIsCheckoutOpen(true);
  };

  const handleDirectCheckoutFromCustomizer = (item: CartItem) => {
    setDirectCheckoutItem(item);
    setIsCheckoutOpen(true);
  };

  const handleOrderPackMagma = () => {
    const packItem: CartItem = {
      id: `pack-magma-${Date.now()}`,
      beanId: 'pack-magma',
      beanName: 'Pack Magma Degustación · 3 Estilos (3 x 250g en Granos)',
      grind: 'Granos',
      size: '250g',
      unitPrice: 51300,
      quantity: 1,
      frequency: 'one_time',
    };
    setDirectCheckoutItem(packItem);
    setIsCheckoutOpen(true);
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setDirectCheckoutItem(null);

    // If customer was logged in or if customer already exists in CRM
    const cleanPhone = newOrder.phone.replace(/\D/g, '');
    let matchedClient = clients.find((c) => c.phone.replace(/\D/g, '').includes(cleanPhone));

    const newTastings = newOrder.items.map((item) => ({
      date: newOrder.date,
      beanId: item.beanId,
      beanName: item.beanName,
      grind: item.grind,
      size: item.size,
      orderId: newOrder.id,
    }));

    if (matchedClient) {
      const updatedClient: LoyaltyProfile = {
        ...matchedClient,
        points: matchedClient.points + newOrder.earnedPoints,
        lifetimePoints: matchedClient.lifetimePoints + newOrder.earnedPoints,
        ordersCount: matchedClient.ordersCount + 1,
        tastingLog: [...newTastings, ...matchedClient.tastingLog],
      };
      setClients((prev) => prev.map((c) => (c.id === matchedClient!.id ? updatedClient : c)));
      setLoyaltyProfile(updatedClient);
    } else {
      const newClientProfile: LoyaltyProfile = {
        id: `CLI-${Date.now().toString().slice(-4)}`,
        customerName: newOrder.customerName,
        phone: newOrder.phone,
        email: newOrder.email || `${newOrder.customerName.toLowerCase().replace(/\s+/g, '')}@magma.ar`,
        tier: 'Socio Magma',
        points: newOrder.earnedPoints,
        lifetimePoints: newOrder.earnedPoints,
        ordersCount: 1,
        favoriteBeanId: newOrder.items[0]?.beanId || 'andes-colombianos',
        memberSince: 'Septiembre 2026',
        tastingLog: newTastings,
      };
      setClients((prev) => [newClientProfile, ...prev]);
      setLoyaltyProfile(newClientProfile);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discount = 0;
  const shipping = 0;
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-black text-[#f7eedf] font-sans antialiased selection:bg-[#d49a55]/30 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        setIsQuizOpen={setIsQuizOpen}
        onOpenCustomizer={() => handleOpenCustomizer(COFFEE_BEANS[0])}
        loyaltyProfile={loyaltyProfile}
      />

      {/* Main Views */}
      <main>
        {/* PÁGINA PRINCIPAL */}
        {activeTab === 'home' && (
          <>
            <HeroSection
              onExploreClick={() => {
                const catalogEl = document.getElementById('catalog');
                if (catalogEl) {
                  catalogEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onQuizClick={() => setIsQuizOpen(true)}
            />
            <BrandStory />
            <div className="border-t border-white/5">
              <CoffeeStickersShowcase
                beans={COFFEE_BEANS}
                onSelectBeanToCustomize={(bean) => handleOpenCustomizer(bean)}
                onDirectWhatsAppOrder={handleDirectWhatsAppOrder}
                onDirectWhatsApp={handleDirectCheckoutFromCustomizer}
                onOrderPackMagma={handleOrderPackMagma}
                onAddToCart={handleAddToCart}
                onOpenQuiz={() => setIsQuizOpen(true)}
              />
            </div>
          </>
        )}

        {/* CATÁLOGO: Los 3 Estilos de Café */}
        {activeTab === 'catalog' && (
          <div className="pt-20 sm:pt-24 lg:pt-28">
            <CoffeeStickersShowcase
              beans={COFFEE_BEANS}
              onSelectBeanToCustomize={(bean) => handleOpenCustomizer(bean)}
              onDirectWhatsAppOrder={handleDirectWhatsAppOrder}
              onDirectWhatsApp={handleDirectCheckoutFromCustomizer}
              onOrderPackMagma={handleOrderPackMagma}
              onAddToCart={handleAddToCart}
              onOpenQuiz={() => setIsQuizOpen(true)}
            />
          </div>
        )}

        {/* CLUB MAGMA: En pausa por el momento para retomar en un futuro */}
        {/* {activeTab === 'club' && (
          <div className="pt-20 sm:pt-24 lg:pt-28">
            <LoyaltyClub
              currentProfile={loyaltyProfile}
              onUpdateProfile={setLoyaltyProfile}
              onDirectWhatsApp={(item) => handleDirectCheckoutFromCustomizer(item)}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              onOpenCustomizer={(bean) => handleOpenCustomizer(bean)}
              allClients={clients}
              setAllClients={setClients}
            />
          </div>
        )} */}

        {/* CRM ADMINISTRATIVO */}
        {activeTab === 'crm' && (
          <div className="pt-20 sm:pt-24 lg:pt-28">
            <CrmDashboard
              orders={orders}
              setOrders={setOrders}
              clients={clients}
              setClients={setClients}
              currentUserProfile={loyaltyProfile}
              onUpdateCurrentUserProfile={setLoyaltyProfile}
            />
          </div>
        )}

        {/* GUÍAS BARISTA */}
        {activeTab === 'guides' && (
          <div className="pt-20 sm:pt-24 lg:pt-28">
            <BrewingGuides />
          </div>
        )}
      </main>

      {/* Modals & Slide-overs */}
      <BeanCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        initialBean={customizingBean}
        onAddToCart={handleAddToCart}
        onDirectWhatsApp={handleDirectCheckoutFromCustomizer}
      />

      <WhatsAppCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectCheckoutItem(null);
        }}
        cartItems={cartItems}
        subtotal={subtotal}
        discount={discount}
        shipping={shipping}
        total={total}
        onOrderCreated={handleOrderCreated}
        directItem={directCheckoutItem}
        currentUserProfile={loyaltyProfile}
      />

      <OnboardingQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        beans={COFFEE_BEANS}
        onSelectRecommended={(bean) => handleOpenCustomizer(bean)}
        onDirectWhatsAppOrder={handleDirectWhatsAppOrder}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
        onOpenCheckout={() => {
          setDirectCheckoutItem(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Footer */}
      <Footer
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

    </div>
  );
}

export default App;
