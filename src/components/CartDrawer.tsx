import React, { useEffect } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, MessageCircle, Sparkles, RefreshCw, ShieldCheck, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  setCartItems,
  onOpenCheckout,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#080808] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-[#0e0e0e] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#d49a55]" />
              <h3 className="text-base font-bold text-[#f7eedf]">
                Tu Selección ({cartItems.reduce((a, b) => a + b.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#8c8276] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 p-6 overflow-y-auto modal-scrollbar space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center text-[#7d7367] space-y-3">
                <ShoppingBag className="w-10 h-10 mx-auto text-[#4d453d]" />
                <p className="text-sm font-semibold text-[#c9bba8]">Tu carrito está vacío</p>
                <p className="text-xs text-[#7d7367]">
                  Explorá la colección de 3 orígenes y armá tu pedido a medida.
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#111111] border border-white/5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-[#f7eedf]">{item.beanName}</h4>
                        {item.beanId === 'pack-magma' && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-[10px] font-bold">
                            10% OFF
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#8c8276] mt-0.5">
                        <span>{item.size}</span>
                        <span>·</span>
                        <span className="text-[#d49a55] font-medium">{item.grind}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-[#6e655a] hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    {/* Quantity controls */}
                    <div className="flex items-center bg-black border border-white/10 rounded-lg p-0.5">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs text-[#a99c8d] hover:bg-white/10 rounded cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs text-[#a99c8d] hover:bg-white/10 rounded cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-[#f7eedf]">
                        ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
                      </span>
                      <span className="text-[10px] text-[#7d7367] ml-1">ARS</span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Offer Pack Magma Degustación inside CartDrawer */}
            {cartItems.length > 0 && !cartItems.some((i) => i.beanId === 'pack-magma') && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#17120b] to-[#120e09] border border-[#d49a55]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#f7eedf] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d49a55]" />
                    <span>Pack Magma Degustación</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded-full border border-[#25D366]/30">
                    10% OFF
                  </span>
                </div>
                <p className="text-[11px] text-[#a89d8f] leading-relaxed">
                  Sumá los 3 orígenes en granos (750g totales) por <span className="text-white font-semibold font-mono">$51.300</span> <span className="line-through text-[#6d6459]">$57.000</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const packItem: CartItem = {
                      id: `pack-magma-${Date.now()}`,
                      beanId: 'pack-magma',
                      beanName: 'Pack Magma · Degustación 3 Orígenes (3x250g en Granos)',
                      grind: 'Granos',
                      size: '3 x 250g (750g)',
                      unitPrice: 51300,
                      quantity: 1,
                      frequency: 'one_time',
                    };
                    setCartItems((prev) => [...prev, packItem]);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[#d49a55]/30 text-[11px] font-bold text-[#d49a55] hover:text-[#f7eedf] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#d49a55]" />
                  <span>Sumar Pack Magma al Carrito ($51.300)</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer Checkout Trigger */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-[#0e0e0e] border-t border-white/5 space-y-4">
              <div className="space-y-1.5 text-xs text-[#8c8276]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-white">${subtotal.toLocaleString('es-AR')} ARS</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#f7eedf] pt-2 border-t border-white/5">
                  <span>Total Estimado:</span>
                  <span className="text-[#d49a55]">${subtotal.toLocaleString('es-AR')} ARS</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#14110d] border border-[#d49a55]/20 text-[11px] text-[#a89d8f] space-y-1">
                <div className="flex items-center gap-1.5 text-[#f7eedf] font-semibold text-xs">
                  <Truck className="w-3.5 h-3.5 text-[#d49a55]" />
                  <span>Envío gratis desde 500g</span>
                </div>
                <p className="text-[10px] text-[#8c8276] leading-relaxed">
                  Sin costo entre Centro y La Vega Maipú. O elegí retiro sin cargo por Centro o Villa Vega San Martín.
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366] border border-[#25D366]/50 text-[#25D366] hover:text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-black/50"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir por WhatsApp Ahora</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#7d7367]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d49a55]" />
                <span>Atención directa desde San Martín de los Andes</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
