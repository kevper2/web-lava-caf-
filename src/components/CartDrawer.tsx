import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, MessageCircle, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';

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
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
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
                      <h4 className="font-bold text-sm text-[#f7eedf]">{item.beanName}</h4>
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

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-[#1b3820] hover:bg-[#234b2a] border border-[#2d6335] text-[#4ade80] hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-black/50"
              >
                <MessageCircle className="w-4 h-4 text-[#4ade80]" />
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
