import React from 'react';
import { X, Gift, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatINR } from '../utils/priceCalculator';

interface GiftingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoinsCategory: () => void;
  onOpenWhatsApp: () => void;
  darkMode: boolean;
}

export const GiftingModal: React.FC<GiftingModalProps> = ({
  isOpen,
  onClose,
  onSelectCoinsCategory,
  onOpenWhatsApp,
  darkMode,
}) => {
  if (!isOpen) return null;

  const giftItems = [
    {
      title: '24K Laxmi Ganesh Pure Gold Coin (10g)',
      price: 76500,
      purity: '999.9 Fine Pure Gold',
      img: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=400',
    },
    {
      title: '999 Fine Pure Silver Divine Coin (50g)',
      price: 4950,
      purity: '999 Pure Sterling Silver',
      img: 'https://images.unsplash.com/photo-1611591475281-b1c9c811f016?auto=format&fit=crop&q=80&w=400',
    },
    {
      title: 'Royal Bridal Solitaire Diamond Gift Set',
      price: 245000,
      purity: 'VVS-EF Certified Diamond',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`relative max-w-lg w-full rounded-2xl border overflow-hidden shadow-2xl flex flex-col max-h-[85vh] ${
          darkMode
            ? 'bg-zinc-900 border-amber-900/60 text-zinc-100'
            : 'bg-[#FAF7F2] border-amber-200 text-amber-950'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A0E17] via-[#6B1423] to-[#4A0E17] text-[#D4AF37] p-5 flex items-center justify-between border-b border-[#D4AF37]/40 relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif tracking-tight">Royal Gifting & Coins</h2>
              <p className="text-xs text-amber-200/90 font-light">Custom Jewellery Gift Sets & Certified Bullion</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#D4AF37] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent border border-[#D4AF37]/40">
            <div className="flex items-center space-x-2 text-[#4A0E17] dark:text-[#D4AF37] font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Complimentary Luxury Gift Packaging & Tamper-Proof Box</span>
            </div>
            <p className="text-[11px] text-amber-900/80 dark:text-zinc-300 mt-1">
              Every gifting order comes with a personalized velvet box, wax-sealed authenticity certificate, and custom message card.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900/70 dark:text-zinc-400">
              Featured Festive Gift Collections
            </h3>

            {giftItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border bg-white dark:bg-zinc-800 border-amber-200 dark:border-zinc-700 flex items-center space-x-3 shadow-sm"
              >
                <img src={item.img} alt={item.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-xs truncate text-[#4A0E17] dark:text-[#D4AF37] font-serif">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">{item.purity}</p>
                  <p className="text-xs font-black font-mono mt-1">{formatINR(item.price)}</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenWhatsApp();
                  }}
                  className="px-3 py-1.5 bg-[#4A0E17] text-[#D4AF37] rounded-lg text-[11px] font-bold shrink-0 hover:bg-[#6B1423]"
                >
                  Gift Now
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              onClose();
              onSelectCoinsCategory();
            }}
            className="w-full py-3 bg-[#D4AF37] text-[#4A0E17] font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center space-x-2 shadow"
          >
            <span>Explore All Gold & Silver Coins Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
