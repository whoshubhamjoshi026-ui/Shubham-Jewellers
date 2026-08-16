import React, { useState } from 'react';
import { CartItem, GoldRates, UserProfile } from '../types';
import { formatINR } from '../utils/priceCalculator';
import { X, ShoppingBag, Trash2, ShieldCheck, MapPin, Tag, CheckCircle2, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onClearCart: () => void;
  user: UserProfile;
  onOpenAuth: () => void;
  darkMode: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
  user,
  onOpenAuth,
  darkMode,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.calculatedPrice * item.quantity, 0);
  const gst = Math.round(subtotal * 0.03); // 3% GST
  const grandTotal = Math.max(0, subtotal + gst - appliedDiscount);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'SHUBHAM1000' || couponCode.toUpperCase() === 'AKSHAYA2026') {
      setAppliedDiscount(1000);
      setCouponMsg('₹1,000 Festive Jewellery Voucher Applied!');
    } else {
      setCouponMsg('Invalid coupon code. Try SHUBHAM1000');
    }
  };

  const handlePlaceOrder = () => {
    if (!user.isLoggedIn) {
      onOpenAuth();
      return;
    }
    setOrderPlaced(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l ${
          darkMode
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-[#FAF7F2] border-amber-200 text-amber-950'
        }`}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#4A0E17] via-[#5A101C] to-[#3B0813] text-[#F3E5AB] p-4 sm:p-5 flex items-center justify-between border-b border-[#D4AF37]/40 shadow-md">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-sm sm:text-base font-bold font-cinzel tracking-wide">Your Royal Bag ({cart.length})</h3>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full text-[#F3E5AB] hover:bg-white/10 active:scale-90 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {orderPlaced ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold font-playfair text-[#4A0E17] dark:text-[#F3E5AB]">
                Order Confirmed!
              </h3>
              <p className="text-xs text-amber-900/80 dark:text-zinc-300 leading-relaxed max-w-xs mx-auto">
                Thank you, {user.name}! Your royal order has been placed successfully with 100% Insured Delivery to {user.address.street}, {user.address.city}.
              </p>
              <button
                onClick={() => {
                  onClearCart();
                  setOrderPlaced(false);
                  onClose();
                }}
                className="py-3 px-6 bg-gradient-to-r from-[#4A0E17] via-[#5A101C] to-[#3B0813] text-[#F3E5AB] font-bold text-xs rounded-xl hover:brightness-110 active:scale-95 shadow-luxury border border-[#D4AF37]/40 font-cinzel tracking-wider"
              >
                Continue Shopping
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100/50 dark:bg-zinc-800/60 flex items-center justify-center mx-auto border border-amber-200/60 dark:border-zinc-700">
                <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <p className="text-xs text-zinc-500 font-medium">
                Your shopping bag is currently empty.
              </p>
            </div>
          ) : (
            <>
              {/* Cart Item List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className={`p-3.5 rounded-2xl border flex space-x-3.5 items-center shadow-xs transition-all ${
                      darkMode ? 'bg-[#181315] border-zinc-800' : 'bg-white border-amber-200/70'
                    }`}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-xl border border-amber-200/80 dark:border-zinc-700 shadow-xs"
                    />
                    <div className="flex-1 text-xs">
                      <strong className={`block font-playfair font-bold line-clamp-1 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                        {item.product.title}
                      </strong>
                      <span className="text-[10px] text-amber-800/80 dark:text-zinc-400 font-mono">
                        {item.product.purity} • {item.product.weightGrams}g
                      </span>
                      <strong className="block text-sm text-[#4A0E17] dark:text-[#F3E5AB] mt-1 font-mono font-bold">
                        {formatINR(item.calculatedPrice)}
                      </strong>
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={item.quantity}
                        onChange={(e) => onUpdateQuantity(item.product.id, Number(e.target.value))}
                        className={`text-xs p-1.5 rounded-lg border font-medium ${
                          darkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-amber-50/80 border-amber-200 text-amber-950'
                        }`}
                      >
                        {[1, 2, 3, 4, 5].map((q) => (
                          <option key={q} value={q}>
                            Qty {q}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => onRemoveFromCart(item.product.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg active:scale-90 transition-all"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Voucher Box */}
              <div className={`p-3.5 rounded-2xl border text-xs shadow-xs ${
                darkMode ? 'bg-[#181315] border-zinc-800' : 'bg-amber-100/40 border-amber-200/80'
              }`}>
                <label className="block font-bold mb-1.5 flex items-center gap-1.5 text-[11px] font-cinzel">
                  <Tag className="w-3.5 h-3.5 text-[#D4AF37]" /> Apply Royal Voucher
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Try SHUBHAM1000"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`flex-1 p-2 rounded-xl border text-xs uppercase font-mono tracking-wider ${
                      darkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-amber-200 text-zinc-900'
                    }`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-gradient-to-r from-[#4A0E17] via-[#5A101C] to-[#3B0813] text-[#F3E5AB] font-bold text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all border border-[#D4AF37]/40 font-cinzel"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <p className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1.5">
                    {couponMsg}
                  </p>
                )}
              </div>

              {/* Summary Breakdown */}
              <div className={`p-4 rounded-2xl border space-y-2.5 text-xs shadow-xs ${
                darkMode ? 'bg-[#181315] border-zinc-800' : 'bg-white border-amber-200/70'
              }`}>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>Subtotal</span>
                  <span className="font-bold font-mono">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>3% Indian GST</span>
                  <span className="font-bold font-mono">{formatINR(gst)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Royal Voucher Discount</span>
                    <span className="font-mono">- {formatINR(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2.5 border-t border-[#D4AF37]/30 font-bold text-sm text-[#4A0E17] dark:text-[#F3E5AB]">
                  <span className="font-cinzel tracking-wider">Total Amount Payable</span>
                  <span className="font-sans font-extrabold text-base">{formatINR(grandTotal)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout CTA */}
        {cart.length > 0 && !orderPlaced && (
          <div className={`p-4 border-t ${darkMode ? 'border-zinc-800 bg-[#120E0F]' : 'border-amber-200/80 bg-white'}`}>
            {!user.isLoggedIn ? (
              <button
                onClick={onOpenAuth}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-bold text-xs rounded-2xl hover:brightness-110 active:scale-98 flex items-center justify-center space-x-2 shadow-luxury font-cinzel tracking-wider"
              >
                <span>Verify Email OTP to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                className="w-full py-3.5 bg-gradient-to-r from-[#4A0E17] via-[#5A101C] to-[#3B0813] text-[#F3E5AB] font-bold text-sm rounded-2xl hover:brightness-110 active:scale-98 flex items-center justify-center space-x-2 shadow-luxury border border-[#D4AF37]/50 font-cinzel tracking-wider"
              >
                <span>Proceed to Insured Pay ({formatINR(grandTotal)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
