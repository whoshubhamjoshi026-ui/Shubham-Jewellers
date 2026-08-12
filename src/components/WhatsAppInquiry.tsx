import React, { useState, useEffect } from 'react';
import { Product, GoldRates } from '../types';
import { calculateProductPrice, formatINR } from '../utils/priceCalculator';
import { MessageCircle, X, ExternalLink, Edit3 } from 'lucide-react';

interface WhatsAppInquiryProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  rates: GoldRates;
  darkMode: boolean;
}

export const WhatsAppInquiryModal: React.FC<WhatsAppInquiryProps> = ({
  isOpen,
  onClose,
  product,
  rates,
  darkMode,
}) => {
  const shopPhone = '919876543210';
  const [editedMessage, setEditedMessage] = useState('');

  useEffect(() => {
    if (product) {
      const priceInfo = calculateProductPrice(product, rates);
      const initialText = `Namaste Shubham Jewellers! 🙏\nI am interested in inquiring about this jewellery piece:\n\n👑 *${product.title}*\n• Code: ${product.id}\n• Purity: ${product.purity} BIS Hallmarked\n• Gross Weight: ${product.weightGrams}g\n• Estimated Price: ${formatINR(priceInfo.totalPrice)} (Live Rate: ${formatINR(priceInfo.ratePerGram)}/g)\n• Product Photo: ${product.image}\n\nPlease share available stock in store and booking guidance. Thank you!`;
      setEditedMessage(initialText);
    }
  }, [product, rates]);

  if (!isOpen || !product) return null;

  const priceInfo = calculateProductPrice(product, rates);
  const whatsappUrl = `https://wa.me/${shopPhone}?text=${encodeURIComponent(editedMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative max-w-md w-full rounded-2xl border overflow-hidden shadow-2xl ${
          darkMode
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-[#FAF7F2] border-amber-200 text-amber-950'
        }`}
      >
        {/* Header */}
        <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-white" />
            <h3 className="text-sm font-bold font-serif">Shubham Jewellers WhatsApp Desk</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white hover:bg-emerald-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <img
              src={product.image}
              alt={product.title}
              className="w-14 h-14 object-cover rounded-lg border border-emerald-300 shrink-0"
            />
            <div className="text-xs">
              <strong className="block font-serif font-bold text-emerald-950 dark:text-emerald-200">
                {product.title}
              </strong>
              <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block font-mono">
                {product.purity} • {product.weightGrams}g • {formatINR(priceInfo.totalPrice)}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                Pre-Formatted WhatsApp Message (Editable):
              </label>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                Tap box below to edit
              </span>
            </div>
            <textarea
              rows={8}
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-zinc-800 border border-emerald-300 dark:border-emerald-700 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none leading-relaxed shadow-inner"
              placeholder="Type your custom message here..."
            />
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-2 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Send Message on WhatsApp (+91 98765 43210)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
