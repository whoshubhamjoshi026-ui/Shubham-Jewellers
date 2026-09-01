import React from 'react';
import { GoldRates } from '../types';
import { formatINR } from '../utils/priceCalculator';
import { Sparkles, ArrowRight, Gem, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroCarouselProps {
  banners?: any[];
  rates: GoldRates;
  onSelectCategory?: (cat: any) => void;
  onOpenScheme?: () => void;
  onOpenLiveRates: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  rates,
  onOpenLiveRates,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-3 pb-1">
      {/* Prominent Today's Live Rates Banner */}
      <motion.div
        whileHover={{ scale: 1.008 }}
        whileTap={{ scale: 0.99 }}
        onClick={onOpenLiveRates}
        className="cursor-pointer bg-gradient-to-r from-[#380810] via-[#52101B] to-[#2B050D] text-white p-3 sm:p-4 rounded-2xl border border-[#D4AF37]/60 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 group flex flex-col md:flex-row items-center justify-between gap-3 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#D4AF37]/15 pointer-events-none blur-2xl" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#ECC86A] via-[#D4AF37] to-[#996515]" />

        {/* Dynamic floating jewels in background */}
        <div className="absolute top-2 right-1/4 pointer-events-none opacity-20">
          <Gem className="w-7 h-7 text-[#D4AF37] animate-jewel-float" />
        </div>

        {/* Banner Left Title & Status */}
        <div className="flex items-center space-x-3 z-10">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs relative">
            <Sparkles className="w-4 h-4 text-[#F3E5AB] animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-[#D4AF37] animate-ping opacity-30 pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 bg-gradient-to-r from-[#ECC86A] to-[#D4AF37] text-[#2B050D] text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B050D] animate-ping mr-0.5" />
                LIVE BULLION RATES
              </span>
              <span className="text-[10.5px] text-amber-200/80 font-light hidden sm:inline">
                Synced: {rates.lastUpdated}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold font-cinzel text-[#F3E5AB] mt-0.5 flex items-center gap-1.5">
              <span>Today's Hallmarked Gold & Silver Rates</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37] opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </h3>
          </div>
        </div>

        {/* Live Rates Grid Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full md:w-auto text-xs z-10">
          <div className="bg-black/35 border border-[#D4AF37]/30 px-3 py-1.5 rounded-xl text-center backdrop-blur-md shadow-xs hover:border-[#D4AF37] transition-colors">
            <span className="text-[9.5px] text-amber-200/90 block font-medium uppercase tracking-wider">24K 999 Gold</span>
            <strong className="text-[#F3E5AB] font-mono text-xs sm:text-[13px] font-extrabold">
              {formatINR(rates.gold24k)}/g
            </strong>
          </div>

          <div className="bg-black/35 border border-[#D4AF37]/30 px-3 py-1.5 rounded-xl text-center backdrop-blur-md shadow-xs hover:border-[#D4AF37] transition-colors">
            <span className="text-[9.5px] text-amber-200/90 block font-medium uppercase tracking-wider">22K 916 BIS</span>
            <strong className="text-[#F3E5AB] font-mono text-xs sm:text-[13px] font-extrabold">
              {formatINR(rates.gold22k)}/g
            </strong>
          </div>

          <div className="bg-black/35 border border-[#D4AF37]/30 px-3 py-1.5 rounded-xl text-center backdrop-blur-md shadow-xs hover:border-[#D4AF37] transition-colors">
            <span className="text-[9.5px] text-amber-200/90 block font-medium uppercase tracking-wider">18K Solitaires</span>
            <strong className="text-amber-200 font-mono text-xs sm:text-[13px] font-bold">
              {formatINR(rates.gold18k)}/g
            </strong>
          </div>

          <div className="bg-black/35 border border-slate-400/30 px-3 py-1.5 rounded-xl text-center backdrop-blur-md shadow-xs hover:border-slate-300 transition-colors">
            <span className="text-[9.5px] text-slate-200 block font-medium uppercase tracking-wider">999 Silver</span>
            <strong className="text-slate-100 font-mono text-xs sm:text-[13px] font-bold">
              {formatINR(rates.silver)}/g
            </strong>
          </div>
        </div>

        {/* View Details Button */}
        <button className="w-full md:w-auto px-3.5 py-2 bg-gradient-to-r from-[#ECC86A] via-[#D4AF37] to-[#B8860B] text-[#2B050D] font-bold text-xs rounded-xl shadow-md group-hover:brightness-110 active:scale-95 transition-all shrink-0 flex items-center justify-center space-x-1.5 z-10 cursor-pointer">
          <span>Rate Calculator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
};
