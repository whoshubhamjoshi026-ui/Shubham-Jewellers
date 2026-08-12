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
        <div className="bg-[#4A0E17] text-[#D4AF37] p-4 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-sm font-bold font-serif">Your Royal Jewellery Bag ({cart.length})</h3>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-[#D4AF37] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {orderPlaced ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#4A0E17] dark:text-[#D4AF37]">
                Order Confirmed!
              </h3>
              <p className="text-xs text-amber-900/80 dark:text-zinc-300">
                Thank you, {user.name}! Your order has been placed successfully with 100% Insured Delivery to {user.address.street}, {user.address.city}.
              </p>
              <button
                onClick={() => {
                  onClearCart();
                  setOrderPlaced(false);
                  onClose();
                }}
                className="py-2.5 px-6 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#6B1423]"
              >
                Continue Shopping
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-amber-300/60 mx-auto" />
              <p className="text-xs text-amber-900/80 dark:text-zinc-400 font-medium">
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
                    className="p-3 rounded-xl border bg-white dark:bg-zinc-800 flex space-x-3 items-center"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-lg border border-amber-200"
                    />
                    <div className="flex-1 text-xs">
                      <strong className={`block font-serif font-bold line-clamp-1 ${darkMode ? 'text-white' : 'text-black'}`}>
                        {item.product.title}
                      </strong>
                      <span className="text-[10px] text-amber-800/80 dark:text-zinc-400 font-mono">
                        {item.product.purity} • {item.product.weightGrams}g
                      </span>
                      <strong className="block text-sm text-[#4A0E17] dark:text-[#D4AF37] mt-1">
                        {formatINR(item.calculatedPrice)}
                      </strong>
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={item.quantity}
                        onChange={(e) => onUpdateQuantity(item.product.id, Number(e.target.value))}
                        className="text-xs p-1 rounded border bg-amber-50 dark:bg-zinc-700"
                      >
                        {[1, 2, 3, 4, 5].map((q) => (
                          <option key={q} value={q}>
                            Qty {q}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => onRemoveFromCart(item.product.id)}
                        className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Voucher Box */}
              <div className="p-3 rounded-xl bg-amber-100/50 dark:bg-zinc-800 border text-xs">
                <label className="block font-bold mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#D4AF37]" /> Apply Festive Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Try SHUBHAM1000"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 p-1.5 rounded border text-xs bg-white dark:bg-zinc-900 uppercase font-mono"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded hover:bg-[#6B1423]"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                    {couponMsg}
                  </p>
                )}
              </div>

              {/* Summary Breakdown */}
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>3% GST</span>
                  <span className="font-bold">{formatINR(gst)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>- {formatINR(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t font-extrabold text-sm text-[#4A0E17] dark:text-[#D4AF37]">
                  <span>Total Amount Payable</span>
                  <span>{formatINR(grandTotal)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout CTA */}
        {cart.length > 0 && !orderPlaced && (
          <div className="p-4 border-t border-amber-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            {!user.isLoggedIn ? (
              <button
                onClick={onOpenAuth}
                className="w-full py-3 bg-[#D4AF37] text-[#4A0E17] font-bold text-xs rounded-xl hover:bg-amber-400 flex items-center justify-center space-x-2 shadow"
              >
                <span>Verify Email OTP to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                className="w-full py-3 bg-[#4A0E17] text-[#D4AF37] font-bold text-sm rounded-xl hover:bg-[#6B1423] flex items-center justify-center space-x-2 shadow border border-[#D4AF37]/40"
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
