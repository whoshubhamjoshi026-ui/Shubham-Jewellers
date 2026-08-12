import React, { useState, useEffect } from 'react';
import { Banner, Category, GoldRates } from '../types';
import { formatINR } from '../utils/priceCalculator';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, TrendingUp, Award, ArrowUpRight } from 'lucide-react';

interface HeroCarouselProps {
  banners: Banner[];
  rates: GoldRates;
  onSelectCategory: (cat: Category) => void;
  onOpenScheme: () => void;
  onOpenLiveRates: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  banners,
  rates,
  onSelectCategory,
  onOpenScheme,
  onOpenLiveRates,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const current = banners[currentIndex];

  const handleCta = () => {
    if (current.categoryLink) {
      onSelectCategory(current.categoryLink);
    } else if (current.title.toLowerCase().includes('scheme') || current.subtitle.toLowerCase().includes('plan')) {
      onOpenScheme();
    } else {
      onSelectCategory('Gold');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-2 space-y-4">
      {/* Prominent Today's Live Rates Banner */}
      <div
        onClick={onOpenLiveRates}
        className="cursor-pointer bg-gradient-to-r from-[#4A0E17] via-[#6B1423] to-[#4A0E17] text-white p-4 sm:p-5 rounded-2xl border-2 border-[#D4AF37] shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 group flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#D4AF37]/10 pointer-events-none blur-xl"></div>

        {/* Banner Left Title & Status */}
        <div className="flex items-center space-x-3.5 z-10">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-[#D4AF37] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1 bg-[#D4AF37] text-[#4A0E17] text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-[#4A0E17] animate-ping mr-1"></span>
                TODAY'S LIVE RATES
              </span>
              <span className="text-[11px] text-amber-200/90 font-light hidden sm:inline">
                Updated: {rates.lastUpdated}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-serif text-[#D4AF37] mt-0.5 flex items-center gap-1">
              <span>Real-Time Bullion & Jewellery Gold Rates</span>
              <ArrowUpRight className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </h3>
          </div>
        </div>

        {/* Live Rates Grid Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full md:w-auto text-xs z-10">
          <div className="bg-black/30 border border-[#D4AF37]/40 px-3 py-1.5 rounded-xl text-center backdrop-blur-sm">
            <span className="text-[10px] text-amber-200 block font-medium">24K Pure Gold</span>
            <strong className="text-[#D4AF37] font-mono text-xs sm:text-sm font-black">
              {formatINR(rates.gold24k)}/g
            </strong>
          </div>

          <div className="bg-black/30 border border-[#D4AF37]/40 px-3 py-1.5 rounded-xl text-center backdrop-blur-sm">
            <span className="text-[10px] text-amber-200 block font-medium">22K BIS Gold</span>
            <strong className="text-[#D4AF37] font-mono text-xs sm:text-sm font-black">
              {formatINR(rates.gold22k)}/g
            </strong>
          </div>

          <div className="bg-black/30 border border-[#D4AF37]/40 px-3 py-1.5 rounded-xl text-center backdrop-blur-sm">
            <span className="text-[10px] text-amber-200 block font-medium">18K Diamond</span>
            <strong className="text-amber-200 font-mono text-xs sm:text-sm font-bold">
              {formatINR(rates.gold18k)}/g
            </strong>
          </div>

          <div className="bg-black/30 border border-slate-400/40 px-3 py-1.5 rounded-xl text-center backdrop-blur-sm">
            <span className="text-[10px] text-slate-200 block font-medium">999 Pure Silver</span>
            <strong className="text-slate-100 font-mono text-xs sm:text-sm font-bold">
              {formatINR(rates.silver)}/g
            </strong>
          </div>
        </div>

        {/* View Details Button */}
        <button className="w-full md:w-auto px-4 py-2 bg-[#D4AF37] text-[#4A0E17] font-bold text-xs rounded-xl shadow-md group-hover:bg-amber-300 transition-colors shrink-0 flex items-center justify-center space-x-1 z-10">
          <span>Calculate Price</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Hero Slider */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/30 bg-[#4A0E17] text-white aspect-[21/9] sm:aspect-[24/9] md:aspect-[28/9]">
        {/* Background Image with Gradient Overlay */}
        <img
          src={current.image}
          alt={current.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70 transition-all duration-700 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D080E] via-[#4A0E17]/80 to-transparent" />

        {/* Content Box */}
        <div className="relative h-full flex flex-col justify-center p-6 sm:p-10 md:p-12 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 bg-[#D4AF37] text-[#4A0E17] text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 self-start shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{current.discountBadge}</span>
          </div>

          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-serif tracking-tight text-[#D4AF37] drop-shadow-sm leading-tight mb-2">
            {current.title}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-amber-100/90 font-light line-clamp-2 mb-4">
            {current.subtitle}
          </p>

          <div>
            <button
              onClick={handleCta}
              className="inline-flex items-center space-x-2 bg-[#D4AF37] hover:bg-amber-400 text-[#4A0E17] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              <span>{current.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
              title="Previous Banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
              title="Next Banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2">
              {banners.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-[#D4AF37] w-6'
                      : 'bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

