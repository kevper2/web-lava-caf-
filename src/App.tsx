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
  
  // Orders registry in CRM
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  
  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  
  // Complete clients list in CRM
  const [clients, setClients] = useState<LoyaltyProfile[]>(INITIAL_CLIENTS);
  
  // Starts logged out (null) as requested
  const [loyaltyProfile, setLoyaltyProfile] = useState<LoyaltyProfile | null>(null);

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
      if (loyaltyProfile && loyaltyProfile.id === matchedClient.id) {
        setLoyaltyProfile(updatedClient);
      }
    } else {
      const newClientProfile: LoyaltyProfile = {
        id: `CLI-${Date.now().toString().slice(-4)}`,
        customerName: newOrder.customerName,
        phone: newOrder.phone,
        email: newOrder.email || `${newOrder.customerName.toLowerCase().replace(/\s+/g, '')}@magma.ar`,
        tier: 'Privé',
        points: newOrder.earnedPoints,
        lifetimePoints: newOrder.earnedPoints,
        ordersCount: 1,
        favoriteBeanId: newOrder.items[0]?.beanId || 'andes-colombianos',
        memberSince: 'Septiembre 2026',
        tastingLog: newTastings,
      };
      setClients((prev) => [newClientProfile, ...prev]);
      if (loyaltyProfile) {
        setLoyaltyProfile(newClientProfile);
      }
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
        loyaltyProfile={loyaltyProfile}
      />

      {/* Main Views */}
      <main>
        {/* PÁGINA PRINCIPAL */}
        {activeTab === 'home' && (
          <>
            <HeroSection
              onExploreClick={() => {
                setActiveTab('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onQuizClick={() => setIsQuizOpen(true)}
            />
            <BrandStory />
          </>
        )}

        {/* CATÁLOGO: Los 3 Estilos de Café */}
        {activeTab === 'catalog' && (
          <div className="pt-20 sm:pt-24 lg:pt-28">
            <CoffeeStickersShowcase
              beans={COFFEE_BEANS}
              onSelectBeanToCustomize={(bean) => handleOpenCustomizer(bean)}
              onDirectWhatsAppOrder={handleDirectWhatsAppOrder}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {/* CLUB MAGMA: Versión Compacta para Socios */}
        {activeTab === 'club' && (
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
        )}

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
