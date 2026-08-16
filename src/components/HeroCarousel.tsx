import React, { useState, useEffect } from 'react';
import { Banner, Category, GoldRates } from '../types';
import { formatINR } from '../utils/priceCalculator';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Gem, ArrowUpRight, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FALLBACK_BANNERS: Banner[] = [
  {
    id: 'b1',
    title: 'Royal Bridal Solitaire Collection',
    subtitle: 'Handcrafted Heritage Designs with BIS 916 Hallmark Purity',
    discountBadge: 'Flat 25% Off Making Charges',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
    categoryLink: 'Gold',
    ctaText: 'Explore Royal Jewels',
  },
  {
    id: 'b2',
    title: 'Shubham Swarna Savings Plan',
    subtitle: 'Pay 10 Monthly Installments & Get 1 Month FREE Gold Bonus',
    discountBadge: 'Zero Making Charge Benefit',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=1200',
    categoryLink: 'Gold',
    ctaText: 'Join Swarna Plan',
  },
  {
    id: 'b3',
    title: 'VVS Solitaires & Polki Kundan',
    subtitle: 'Certified Diamond Jewellery with Lifetime Exchange Guarantee',
    discountBadge: 'Certified BIS Hallmark',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200',
    categoryLink: 'Diamond',
    ctaText: 'View Solitaires',
  },
];

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
  const activeBanners = banners && banners.length > 0 ? banners : FALLBACK_BANNERS;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const current = activeBanners[currentIndex % activeBanners.length] || activeBanners[0];

  const handleCta = () => {
    if (current.categoryLink) {
      onSelectCategory(current.categoryLink);
    } else if (current.title?.toLowerCase().includes('scheme') || current.subtitle?.toLowerCase().includes('plan')) {
      onOpenScheme();
    } else {
      onSelectCategory('Gold');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-3 pb-2 space-y-3 sm:space-y-3.5">
      {/* Prominent Today's Live Rates Banner */}
      <motion.div
        whileHover={{ scale: 1.008 }}
        whileTap={{ scale: 0.99 }}
        onClick={onOpenLiveRates}
        className="cursor-pointer bg-gradient-to-r from-[#380810] via-[#52101B] to-[#2B050D] text-white p-3 sm:p-4 rounded-2xl border border-[#D4AF37]/60 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 group flex flex-col md:flex-row items-center justify-between gap-3 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#D4AF37]/15 pointer-events-none blur-2xl"></div>
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#ECC86A] via-[#D4AF37] to-[#996515]"></div>

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
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B050D] animate-ping mr-0.5"></span>
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
        <button className="w-full md:w-auto px-3.5 py-2 bg-gradient-to-r from-[#ECC86A] via-[#D4AF37] to-[#B8860B] text-[#2B050D] font-bold text-xs rounded-xl shadow-md group-hover:brightness-110 active:scale-95 transition-all shrink-0 flex items-center justify-center space-x-1.5 z-10">
          <span>Rate Calculator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Main Hero Slider with Dynamic Jewellery Animation */}
      <div className="relative rounded-2xl overflow-hidden shadow-luxury border border-[#D4AF37]/40 bg-[#2D080E] text-white h-[230px] sm:h-[270px] md:h-[310px] lg:h-[340px] flex items-center group/hero">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id || `banner-${currentIndex}`}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.4 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Jewellery Photo with Gradient Overlay */}
            <img
              src={current.image || current.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200'}
              alt={current.title || current.name || 'Royal Jewellery Collection'}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200';
              }}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out transform scale-100 group-hover/hero:scale-105"
            />
            {/* Gradient Overlay for high text contrast on left, rich jewellery view on right */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A0307]/95 via-[#2F060E]/75 sm:via-[#2F060E]/50 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-transparent to-black/30 pointer-events-none" />

            {/* Dynamic floating jewels & lights inside the slide */}
            <div className="absolute top-6 right-8 hidden lg:flex items-center gap-3.5 pointer-events-none">
              <div className="w-11 h-11 rounded-2xl bg-black/40 border border-[#D4AF37]/40 flex items-center justify-center backdrop-blur-md animate-jewel-float shadow-xl">
                <Crown className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="w-9 h-9 rounded-full bg-black/40 border border-[#D4AF37]/40 flex items-center justify-center backdrop-blur-md animate-jewel-float-slow shadow-xl">
                <Gem className="w-4 h-4 text-[#F3E5AB]" />
              </div>
            </div>

            {/* Content Box - Title, Subtitle, Badge, CTA Button */}
            <div className="relative h-full flex flex-col justify-center p-4 sm:p-7 md:p-9 max-w-xl z-10">
              {(current.discountBadge || current.discountTag) && (
                <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-[#ECC86A] to-[#D4AF37] text-[#2B050D] text-[9px] sm:text-[10.5px] font-extrabold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider mb-2 self-start shadow-md">
                  <Sparkles className="w-3 h-3 text-[#2B050D]" />
                  <span>{current.discountBadge || current.discountTag}</span>
                </div>
              )}

              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold font-playfair tracking-tight text-[#F3E5AB] drop-shadow-md leading-snug sm:leading-tight mb-1.5 sm:mb-2">
                {current.title || current.name || 'Royal Bridal Collection'}
              </h2>

              {(current.subtitle || current.description) && (
                <p className="text-[11px] sm:text-xs md:text-sm text-amber-100/95 font-light line-clamp-2 mb-3 sm:mb-4 font-montserrat drop-shadow-xs">
                  {current.subtitle || current.description}
                </p>
              )}

              <div>
                <button
                  onClick={handleCta}
                  className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-[#ECC86A] via-[#D4AF37] to-[#B8860B] text-[#2B050D] hover:brightness-110 font-bold text-xs sm:text-sm px-4 py-2 sm:px-6 sm:py-2.5 rounded-full shadow-lg active:scale-95 transition-all border border-[#FFF8DC]/40 font-cinzel tracking-wide"
                >
                  <span>{current.ctaText || current.buttonText || 'Explore Royal Jewels'}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Arrows */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1))}
              className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md transition-all active:scale-90 border border-white/10 z-20"
              title="Previous Banner"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
              className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md transition-all active:scale-90 border border-white/10 z-20"
              title="Next Banner"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Luxury Pagination Lines */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 sm:space-x-2 z-20">
              {activeBanners.map((b, idx) => (
                <button
                  key={b.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                    idx === (currentIndex % activeBanners.length)
                      ? 'bg-[#D4AF37] w-6 sm:w-8 shadow-[0_0_8px_#D4AF37]'
                      : 'bg-white/40 hover:bg-white/70 w-2 sm:w-2.5'
                  }`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
