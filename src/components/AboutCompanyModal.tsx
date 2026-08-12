import React from 'react';
import { X, Building2, MapPin, Phone, MessageCircle, Clock, ShieldCheck, Award, Sparkles, ExternalLink } from 'lucide-react';
import { CompanyInfo } from '../types';

interface AboutCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  info: CompanyInfo;
  darkMode: boolean;
}

export const AboutCompanyModal: React.FC<AboutCompanyModalProps> = ({
  isOpen,
  onClose,
  info,
  darkMode,
}) => {
  if (!isOpen) return null;

  const cleanDigits = (info.whatsappNumber || '919820012345').replace(/[^0-9]/g, '');
  const formattedPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
  const displayWaNumber = formattedPhone.startsWith('91') && formattedPhone.length === 12
    ? `+91 ${formattedPhone.slice(2)}`
    : `+${formattedPhone}`;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent('Namaste Shubham Jewellers! I would like to inquire about store visit and collections.')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className={`relative max-w-lg w-full rounded-2xl border overflow-hidden shadow-2xl ${
          darkMode
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-[#FAF7F2] border-amber-200 text-amber-950'
        }`}
      >
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-[#4A0E17] via-[#6B1423] to-[#4A0E17] p-5 text-[#D4AF37] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#D4AF37] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-serif tracking-tight text-[#D4AF37] uppercase">
                {info.name || 'SHUBHAM JEWELLERS'}
              </h2>
              <p className="text-xs text-amber-200 font-sans tracking-wider">
                EST. {info.establishedYear || '1984'} • {info.tagline || 'Heritage & BIS Hallmarked Gold'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Story / About text */}
          <div className="p-4 rounded-xl bg-amber-100/60 dark:bg-zinc-800/80 border border-amber-200/80 dark:border-zinc-700">
            <div className="flex items-center space-x-1.5 mb-2 text-[#4A0E17] dark:text-[#D4AF37] font-serif font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Our Heritage & Craftsmanship</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-950/90 dark:text-zinc-300 font-sans">
              {info.aboutText}
            </p>
          </div>

          {/* BIS Hallmark Guarantee */}
          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-xs">
              <strong className="block font-bold text-emerald-950 dark:text-emerald-200">
                100% BIS Hallmarked Purity Guarantee
              </strong>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300">
                Reg. No: {info.bisHallmarkReg} • Certified 22K/18K Gold & Certified Solitaires
              </span>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="space-y-3 text-xs">
            {/* Store Address */}
            <div className="flex items-start space-x-3 p-3 rounded-xl bg-white dark:bg-zinc-800 border border-amber-200/60 dark:border-zinc-700">
              <MapPin className="w-4 h-4 text-[#4A0E17] dark:text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-950 dark:text-zinc-100">
                  Store Location & Address
                </strong>
                <p className="text-amber-900/80 dark:text-zinc-300 mt-0.5 leading-snug">
                  {info.address}
                </p>
              </div>
            </div>

            {/* Store Timing */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white dark:bg-zinc-800 border border-amber-200/60 dark:border-zinc-700">
              <Clock className="w-4 h-4 text-[#4A0E17] dark:text-[#D4AF37] shrink-0" />
              <div>
                <strong className="block font-bold text-amber-950 dark:text-zinc-100">
                  Showroom Business Hours
                </strong>
                <p className="text-amber-900/80 dark:text-zinc-300">{info.storeHours}</p>
              </div>
            </div>

            {/* Phone & Direct Calling */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white dark:bg-zinc-800 border border-amber-200/60 dark:border-zinc-700">
              <Phone className="w-4 h-4 text-[#4A0E17] dark:text-[#D4AF37] shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <strong className="block font-bold text-amber-950 dark:text-zinc-100">
                    Direct Phone Contact
                  </strong>
                  <p className="text-amber-900/80 dark:text-zinc-300 font-mono">{info.phone}</p>
                </div>
                <a
                  href={`tel:${info.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-3 py-1 bg-[#4A0E17] text-[#D4AF37] font-bold text-[11px] rounded-lg hover:bg-[#6B1423]"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>

          {/* Shifted WhatsApp Contact Section */}
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <MessageCircle className="w-4.5 h-4.5 fill-white text-emerald-600" />
              <span>Connect directly on WhatsApp ({displayWaNumber})</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
