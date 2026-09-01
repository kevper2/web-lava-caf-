import React, { useState, useEffect } from 'react';
import { LavaLogo } from './LavaLogo';
import { RollingBanner } from './RollingBanner';
import { CartItem, LoyaltyProfile } from '../types';
import { ShoppingBag, User, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'catalog' | 'club' | 'guides';
  setActiveTab: (tab: 'home' | 'catalog' | 'club' | 'guides') => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  setIsQuizOpen: (open: boolean) => void;
  loyaltyProfile: LoyaltyProfile;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartItems,
  setIsCartOpen,
  setIsQuizOpen,
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

  const navLinks: { id: 'home' | 'catalog' | 'club' | 'guides'; label: string }[] = [
    { id: 'home', label: 'Colección' },
    { id: 'catalog', label: 'Los 3 Estilos' },
    { id: 'club', label: 'CLUB MAGMA' },
    { id: 'guides', label: 'Guías Barista' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Rolling announcement banner */}
      <RollingBanner
        onOpenQuiz={() => setIsQuizOpen(true)}
        onNavigateClub={() => setActiveTab('club')}
      />

      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-lg border-b border-white/5 py-2.5 shadow-2xl'
            : 'bg-gradient-to-b from-black/90 via-black/70 to-transparent py-3 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between">
          
          {/* Brand Logo - pure horizontal logo with generous breathing room */}
          <button
            onClick={() => setActiveTab('home')}
            className="cursor-pointer transition-opacity hover:opacity-90 flex items-center py-1"
            title="LAVA - San Martín de los Andes"
          >
            <LavaLogo size="md" />
          </button>

          {/* Desktop Navigation - Compressed, refined typography */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-10">
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
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions: Member Portal & Cart Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Club Privé / Member Portal Trigger */}
            <button
              onClick={() => setActiveTab('club')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer text-[11px] ${
                activeTab === 'club'
                  ? 'bg-white/10 border-[#d49a55] text-white'
                  : 'bg-white/[0.02] border-white/10 text-[#8e8477] hover:text-white hover:border-white/20'
              }`}
            >
              <User className="w-3 h-3 text-[#d49a55]" />
              <span className="hidden sm:inline font-normal">{loyaltyProfile.customerName.split(' ')[0]}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[8.5px] bg-white/5 font-medium text-[#d49a55]">
                {loyaltyProfile.tier}
              </span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-[#cfc5b8] hover:text-white transition-colors cursor-pointer hover:bg-white/5"
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
              className="md:hidden p-1.5 text-[#a89d90] hover:text-white cursor-pointer"
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
                className={`block w-full text-left text-xs uppercase tracking-widest font-semibold py-2 ${
                  activeTab === link.id ? 'text-[#d49a55]' : 'text-[#8e857c]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => {
                setActiveTab('club');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#d49a55] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>CLUB MAGMA ({loyaltyProfile.customerName.split(' ')[0]})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


