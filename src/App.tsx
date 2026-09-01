import React, { useState } from 'react';
import { CoffeeBean, CartItem, Order, Subscription, LoyaltyProfile, GrindType, BagSize } from './types';
import { COFFEE_BEANS, INITIAL_ORDERS, INITIAL_SUBSCRIPTIONS, INITIAL_LOYALTY_PROFILE } from './data/coffeeData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CoffeeStickersShowcase } from './components/CoffeeStickersShowcase';
import { BrandStory } from './components/BrandStory';
import { LoyaltyClub } from './components/LoyaltyClub';
import { BrewingGuides } from './components/BrewingGuides';
import { BeanCustomizerModal } from './components/BeanCustomizerModal';
import { WhatsAppCheckoutModal } from './components/WhatsAppCheckoutModal';
import { OnboardingQuizModal } from './components/OnboardingQuizModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'club' | 'guides'>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'initial-1',
      beanId: 'andes-colombianos',
      beanName: 'Andes Colombianos',
      grind: 'Filtro',
      size: '500g',
      unitPrice: 26000,
      quantity: 1,
      frequency: 'one_time',
    },
  ]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [loyaltyProfile, setLoyaltyProfile] = useState<LoyaltyProfile>(INITIAL_LOYALTY_PROFILE);

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

    // Update loyalty profile & tasting history
    setLoyaltyProfile((prev) => {
      const newTastings = newOrder.items.map((item) => ({
        date: newOrder.date,
        beanId: item.beanId,
        beanName: item.beanName,
        grind: item.grind,
        size: item.size,
        orderId: newOrder.id,
      }));

      return {
        ...prev,
        points: prev.points + newOrder.earnedPoints,
        lifetimePoints: prev.lifetimePoints + newOrder.earnedPoints,
        ordersCount: prev.ordersCount + 1,
        tastingLog: [...newTastings, ...prev.tastingLog],
      };
    });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discount = 0;
  const shipping = 0;
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-black text-[#f7eedf] font-sans antialiased selection:bg-[#d49a55]/30 selection:text-white">
      
      {/* Top Navigation Bar (Slim & Compressed) */}
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
        {/* PÁGINA PRINCIPAL: Solo la primera sección (Hero) y la tercera (BrandStory) + Footer */}
        {activeTab === 'home' && (
          <>
            {/* 1ra Sección: Hero con llamado a la acción y Test de Personalidad */}
            <HeroSection
              onExploreClick={() => {
                setActiveTab('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onQuizClick={() => setIsQuizOpen(true)}
            />

            {/* 3ra Sección: La Tostaduría de Montaña (Brand Story) */}
            <BrandStory />
          </>
        )}

        {/* CATÁLOGO: Los 3 Orígenes de Café */}
        {activeTab === 'catalog' && (
          <div className="pt-12 sm:pt-16">
            <CoffeeStickersShowcase
              beans={COFFEE_BEANS}
              onSelectBeanToCustomize={(bean) => handleOpenCustomizer(bean)}
              onDirectWhatsAppOrder={handleDirectWhatsAppOrder}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {/* CLUB PRIVÉ & MEMBRESÍA: Unificado con Bitácora, Membresía y CRM con Canje de Puntos */}
        {activeTab === 'club' && (
          <div className="pt-12 sm:pt-16">
            <LoyaltyClub
              currentProfile={loyaltyProfile}
              onUpdateProfile={setLoyaltyProfile}
              onDirectWhatsApp={(item) => handleDirectCheckoutFromCustomizer(item)}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              onOpenCustomizer={(bean) => handleOpenCustomizer(bean)}
            />
          </div>
        )}

        {/* GUÍAS BARISTA */}
        {activeTab === 'guides' && (
          <div className="pt-12 sm:pt-16">
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
