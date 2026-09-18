import React, { useState, useEffect } from 'react';
import { LavaLogo } from './LavaLogo';
import { RollingBanner } from './RollingBanner';
import { CartItem, LoyaltyProfile } from '../types';
import { ShoppingBag, Menu, X, Instagram } from 'lucide-react';
import { CoffeeBeanIcon } from './CoffeeBeanIcon';

interface HeaderProps {
  activeTab: 'home' | 'catalog' | 'club' | 'guides' | 'crm';
  setActiveTab: (tab: 'home' | 'catalog' | 'club' | 'guides' | 'crm') => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  setIsQuizOpen: (open: boolean) => void;
  onOpenCustomizer: () => void;
  loyaltyProfile: LoyaltyProfile | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartItems,
  setIsCartOpen,
  setIsQuizOpen,
  onOpenCustomizer,
  loyaltyProfile,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks: { id: 'home' | 'catalog' | 'guides'; label: string }[] = [
    { id: 'home', label: '¿Qué es Lava?' },
    { id: 'catalog', label: 'Los 3 Estilos' },
    { id: 'guides', label: 'Guías Barista' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Rolling announcement banner */}
      <RollingBanner
        onOpenQuiz={() => setIsQuizOpen(true)}
        onNavigateCatalog={() => setActiveTab('catalog')}
      />

      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-lg py-2.5 shadow-2xl'
            : 'bg-gradient-to-b from-black/90 via-black/70 to-transparent py-3 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between relative min-h-[44px]">
          
          {/* Brand Logo (Left) */}
          <div className="flex items-center flex-1 justify-start">
            <button
              onClick={() => setActiveTab('home')}
              className="cursor-pointer transition-opacity hover:opacity-90 flex items-center py-1"
              title="LAVA - San Martín de los Andes"
            >
              <LavaLogo size="md" />
            </button>
          </div>

          {/* Desktop Navigation (Centered with the Web Page) */}
          <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`text-[10px] uppercase tracking-[0.25em] font-normal transition-colors cursor-pointer py-1 ${
                  activeTab === link.id
                    ? 'text-[#f5eedf] border-b border-[#d49a55]'
                    : 'text-[#7d746a] hover:text-[#f5eedf]'
                }`}
              >
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Right actions: Pedí tu café, Instagram & Cart Trigger */}
          <div className="flex items-center justify-end flex-1 gap-1.5 sm:gap-2.5 md:gap-3">
            
            {/* Pedí tu café Customizer Trigger - Strict single-line on mobile */}
            <button
              onClick={onOpenCustomizer}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-[#d49a55]/40 bg-[#d49a55]/15 hover:bg-[#d49a55]/25 text-[#d49a55] hover:text-white transition-all cursor-pointer text-[11px] font-semibold whitespace-nowrap shrink-0"
              title="Personalizá y pedí tu café"
            >
              <CoffeeBeanIcon className="w-3.5 h-3.5 text-[#d49a55] shrink-0" />
              <span className="whitespace-nowrap">Pedí tu café</span>
            </button>

            {/* Instagram Link - Visible on Desktop/Tablet, hidden on mobile (available in mobile menu) */}
            <a
              href="https://www.instagram.com/lavacafe.patagonia/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex p-2 rounded-full text-[#cfc5b8] hover:text-[#E1306C] transition-colors cursor-pointer hover:bg-white/5 shrink-0"
              title="Instagram: @lavacafe.patagonia"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 sm:p-2 rounded-full text-[#cfc5b8] hover:text-white transition-colors cursor-pointer hover:bg-white/5 shrink-0"
              aria-label="Ver carrito"
            >
              <ShoppingBag className="w-4.5 h-4.5 stroke-[1.5]" />
              {totalCartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#d49a55] text-black text-[10px] font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-[#a89d90] hover:text-white cursor-pointer shrink-0"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10 px-6 py-6 space-y-4 backdrop-blur-xl shadow-2xl animate-in fade-in duration-200">
          <div className="space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-xs uppercase tracking-widest font-semibold py-2 flex items-center justify-between ${
                  activeTab === link.id ? 'text-[#d49a55]' : 'text-[#8e857c]'
                }`}
              >
                <span>{link.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <button
              onClick={() => {
                onOpenCustomizer();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#d49a55]/20 border border-[#d49a55]/50 text-[#d49a55] hover:bg-[#d49a55] hover:text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CoffeeBeanIcon className="w-4 h-4 text-[#d49a55]" />
              <span>Pedí tu café</span>
            </button>

            <a
              href="https://www.instagram.com/lavacafe.patagonia/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl border border-white/10 hover:border-[#E1306C]/50 text-[#cfc5b8] hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Instagram className="w-4 h-4 text-[#E1306C]" />
              <span>Instagram @lavacafe.patagonia</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
