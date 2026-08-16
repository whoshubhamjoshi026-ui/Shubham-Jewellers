import React from 'react';
import { X, Building2, MapPin, Phone, MessageCircle, Clock, ShieldCheck, Award, Sparkles, ExternalLink, Gem } from 'lucide-react';
import { CompanyInfo } from '../types';
import { ShubhamLogo } from './ShubhamLogo';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className={`relative max-w-lg w-full rounded-2xl border overflow-hidden shadow-2xl my-auto ${
          darkMode
            ? 'bg-[#140F11] border-zinc-800 text-zinc-100'
            : 'bg-[#FAF7F2] border-amber-200 text-amber-950'
        }`}
      >
        {/* Banner Header - Fully Inset Logo & Controlled Boundary */}
        <div className="bg-gradient-to-r from-[#380810] via-[#52101B] to-[#2B050D] p-4 sm:p-5 text-[#F3E5AB] relative border-b border-[#D4AF37]/50 shadow-md">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-[#F3E5AB] hover:bg-white/15 active:scale-90 transition-all z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Inset Logo & Brand Title Box */}
          <div className="flex items-center space-x-3.5 pr-8">
            {/* Contained, Inset Logo Box */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#180408]/90 border border-[#D4AF37]/60 p-1 flex items-center justify-center shrink-0 shadow-lg ring-1 ring-[#D4AF37]/30">
              <ShubhamLogo size="sm" animated={false} showRings={false} className="scale-95" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold font-cinzel tracking-wider text-[#F3E5AB] uppercase truncate">
                {info.name || 'SHUBHAM JEWELLERS'}
              </h2>
              <p className="text-[11px] text-amber-200/90 font-normal tracking-wide mt-0.5 font-montserrat truncate flex items-center gap-1.5">
                <Award className="w-3 h-3 text-[#D4AF37] shrink-0" />
                <span>EST. {info.establishedYear || '1984'} • {info.tagline || 'Heritage & BIS Hallmarked Gold'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {/* Story / About text */}
          <div className="p-3.5 rounded-xl bg-amber-100/70 dark:bg-zinc-800/80 border border-amber-200/80 dark:border-zinc-700">
            <div className="flex items-center space-x-1.5 mb-1.5 text-[#4A0E17] dark:text-[#D4AF37] font-serif font-bold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Our Heritage & Craftsmanship</span>
            </div>
            <p className="text-[11.5px] sm:text-xs leading-relaxed text-amber-950/90 dark:text-zinc-300 font-sans">
              {info.aboutText}
            </p>
          </div>

          {/* BIS Hallmark Guarantee */}
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 shadow-xs">
            <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-xs">
              <strong className="block font-bold text-emerald-950 dark:text-emerald-200 text-xs">
                100% BIS Hallmarked Purity Guarantee
              </strong>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300">
                Reg. No: {info.bisHallmarkReg} • Certified 22K/18K Gold & Certified Solitaires
              </span>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="space-y-2.5 text-xs">
            {/* Store Address */}
            <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-white dark:bg-zinc-800/90 border border-amber-200/60 dark:border-zinc-700">
              <MapPin className="w-4 h-4 text-[#4A0E17] dark:text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-950 dark:text-zinc-100 text-xs">
                  Store Location & Address
                </strong>
                <p className="text-amber-900/80 dark:text-zinc-300 mt-0.5 text-[11px] leading-snug">
                  {info.address}
                </p>
              </div>
            </div>

            {/* Store Timing */}
            <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-white dark:bg-zinc-800/90 border border-amber-200/60 dark:border-zinc-700">
              <Clock className="w-4 h-4 text-[#4A0E17] dark:text-[#D4AF37] shrink-0" />
              <div>
                <strong className="block font-bold text-amber-950 dark:text-zinc-100 text-xs">
                  Showroom Business Hours
                </strong>
                <p className="text-amber-900/80 dark:text-zinc-300 text-[11px]">{info.storeHours}</p>
              </div>
            </div>

            {/* Phone & Direct Calling */}
            <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-white dark:bg-zinc-800/90 border border-amber-200/60 dark:border-zinc-700">
              <Phone className="w-4 h-4 text-[#4A0E17] dark:text-[#D4AF37] shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <strong className="block font-bold text-amber-950 dark:text-zinc-100 text-xs">
                    Direct Phone Contact
                  </strong>
                  <p className="text-amber-900/80 dark:text-zinc-300 font-mono text-[11px]">{info.phone}</p>
                </div>
                <a
                  href={`tel:${info.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-3 py-1 bg-gradient-to-r from-[#4A0E17] to-[#6B1423] text-[#D4AF37] font-bold text-[11px] rounded-lg hover:brightness-110 shadow-xs active:scale-95 transition-all"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp Contact Section */}
          <div className="pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>Connect directly on WhatsApp ({displayWaNumber})</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
