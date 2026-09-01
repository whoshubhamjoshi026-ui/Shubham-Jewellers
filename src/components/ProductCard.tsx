import React, { useState } from 'react';
import { Product, GoldRates } from '../types';
import { calculateProductPrice, formatINR } from '../utils/priceCalculator';
import { Heart, MessageCircle, ShoppingBag, ShieldCheck, Scale, ChevronLeft, ChevronRight, Sparkles, Gem } from 'lucide-react';
import { motion } from 'motion/react';

const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800';

interface ProductCardProps {
  product: Product;
  rates: GoldRates;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  onWhatsAppInquiry: (p: Product) => void;
  darkMode: boolean;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  rates,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onWhatsAppInquiry,
  darkMode,
  index = 0,
}) => {
  const priceInfo = calculateProductPrice(product, rates);
  
  // Safe extraction of all gallery images avoiding duplicates and empty items
  const rawGallery = Array.isArray(product?.gallery)
    ? product.gallery
    : typeof product?.gallery === 'string'
    ? [product.gallery]
    : [];

  const allImages: string[] = Array.from(
    new Set([product?.image, (product as any)?.imageUrl, ...rawGallery].filter(Boolean) as string[])
  );

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [loadedImgMap, setLoadedImgMap] = useState<Record<string, boolean>>({});
  const [isHeartPopping, setIsHeartPopping] = useState(false);
  const [isBagBouncing, setIsBagBouncing] = useState(false);

  const safeImgIdx = activeImgIdx < allImages.length ? activeImgIdx : 0;
  const currentImageSrc = allImages[safeImgIdx] || product?.image || FALLBACK_PRODUCT_IMAGE;
  const isCurrentImgLoaded = !!loadedImgMap[currentImageSrc];

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHeartPopping(true);
    setTimeout(() => setIsHeartPopping(false), 600);
    onToggleWishlist(product);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBagBouncing(true);
    setTimeout(() => setIsBagBouncing(false), 600);
    onAddToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min((index % 8) * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group relative ${
        darkMode
          ? 'bg-[#151012] border-zinc-800/90 text-zinc-100 hover:border-[#D4AF37]/70 shadow-luxury hover:shadow-luxury-hover hover:ring-1 hover:ring-[#D4AF37]/30'
          : 'bg-[#FFFFFF] border-amber-200/70 text-amber-950 hover:border-[#D4AF37] shadow-luxury hover:shadow-luxury-hover hover:ring-1 hover:ring-[#D4AF37]/40'
      }`}
    >
      {/* Product Image Box - Fixed Aspect Ratio, Shimmer Skeleton & Swipable Gallery */}
      <div 
        onClick={() => onSelectProduct(product)}
        className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-amber-50/50 to-amber-100/40 dark:from-zinc-900/50 dark:to-zinc-800/60 cursor-pointer group/img jewel-sweep"
      >
        {/* Shimmer Placeholder while image is loading */}
        {!isCurrentImgLoaded && (
          <div className="absolute inset-0 z-0 flex items-center justify-center bg-gradient-to-tr from-amber-100/40 via-amber-50/70 to-amber-100/40 dark:from-zinc-900/80 dark:via-zinc-800/90 dark:to-zinc-900/80 animate-pulse">
            <div className="flex flex-col items-center gap-1.5 opacity-60">
              <Gem className="w-8 h-8 text-[#D4AF37] animate-bounce" />
              <span className="text-[10px] font-cinzel text-amber-800/70 dark:text-amber-200/70 tracking-wider">Loading Jewels...</span>
            </div>
          </div>
        )}

        {/* Main Jewellery Picture with Smooth Fade-In and Error Fallback */}
        <motion.img
          key={currentImageSrc}
          initial={{ opacity: 0 }}
          animate={{ opacity: isCurrentImgLoaded ? 1 : 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          src={currentImageSrc}
          alt={product.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => {
            setLoadedImgMap((prev) => ({ ...prev, [currentImageSrc]: true }));
          }}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== FALLBACK_PRODUCT_IMAGE) {
              target.src = FALLBACK_PRODUCT_IMAGE;
            }
            setLoadedImgMap((prev) => ({ ...prev, [currentImageSrc]: true }));
          }}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out z-1"
        />

        {/* Dynamic Jewelry Shimmer Accent Top Edge */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

        {/* Dynamic Floating Diamond Glint on Hover / In-view */}
        <div className="absolute top-3 left-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <Sparkles className="w-4 h-4 text-[#FFE58F] animate-diamond-glint drop-shadow-[0_0_8px_#D4AF37]" />
        </div>

        {/* Carousel Navigation Arrows if multiple pictures exist */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-200 z-20 shadow-md active:scale-90 cursor-pointer"
              title="Previous Picture"
              aria-label="Previous Picture"
            >
              <ChevronLeft className="w-4 h-4 text-[#F3E5AB]" />
            </button>
            <button
              onClick={handleNextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-200 z-20 shadow-md active:scale-90 cursor-pointer"
              title="Next Picture"
              aria-label="Next Picture"
            >
              <ChevronRight className="w-4 h-4 text-[#F3E5AB]" />
            </button>

            {/* Pagination Dot Indicators */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-20 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm shadow-md">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImgIdx(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === safeImgIdx ? 'bg-[#D4AF37] w-3.5 shadow-[0_0_6px_#D4AF37]' : 'bg-white/60 hover:bg-white w-1.5'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Purity & Hallmark Dynamic Badges */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-20">
          <span className="bg-gradient-to-r from-[#4A0E17] via-[#5E121E] to-[#2B050D] text-[#F3E5AB] text-[9.5px] font-bold px-2.5 py-0.5 rounded-md shadow-md border border-[#D4AF37]/50 tracking-wider font-cinzel flex items-center gap-1">
            <Gem className="w-2.5 h-2.5 text-[#D4AF37]" />
            {product.purity || '22K'}
          </span>
          {product.hallmarkCertified && (
            <span className="bg-emerald-950/90 text-emerald-300 text-[9px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm border border-emerald-500/40 shadow-xs group-hover:border-emerald-400/80 transition-colors">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> BIS 916
            </span>
          )}
        </div>

        {/* Wishlist Interactive Heart with Sparkle Pop */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-md z-20 active:scale-75 cursor-pointer ${
            isWishlisted
              ? 'bg-rose-600 text-white shadow-rose-600/40 scale-105'
              : 'bg-black/40 hover:bg-black/70 text-white hover:text-rose-300'
          } ${isHeartPopping ? 'animate-ping' : ''}`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className={`flex items-center justify-between text-[10.5px] mb-1 font-medium ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            <span className="flex items-center gap-1 font-mono">
              <Scale className="w-3 h-3 text-[#D4AF37]" /> {product.weightGrams || 0}g Gross
            </span>
            <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
              darkMode ? 'bg-zinc-800 text-amber-200/90' : 'bg-amber-100/70 text-amber-900'
            }`}>
              {product.gender || 'Unisex'}
            </span>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className={`text-xs sm:text-sm font-bold font-playfair line-clamp-2 cursor-pointer hover:text-[#D4AF37] transition-colors leading-snug mb-1.5 ${
              darkMode ? 'text-zinc-100' : 'text-zinc-900'
            }`}
          >
            {product.title}
          </h3>
        </div>

        <div>
          {/* Price & Breakdown */}
          <div className={`mt-1.5 pt-2 border-t ${darkMode ? 'border-zinc-800/80' : 'border-amber-200/60'}`}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm sm:text-base font-bold font-sans tracking-tight text-[#4A0E17] dark:text-[#F3E5AB]">
                {formatINR(priceInfo.totalPrice)}
              </span>
              <span className={`text-[9.5px] font-medium tracking-wide ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Incl. 3% GST
              </span>
            </div>
            <p className={`text-[9px] font-medium mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Metal: {formatINR(priceInfo.metalCost)} + Making: {formatINR(priceInfo.makingCharges)}
            </p>
          </div>

          {/* Action Row */}
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <button
              onClick={() => onWhatsAppInquiry(product)}
              className="flex-1 py-2 px-2.5 bg-zinc-900 hover:bg-black text-white rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95 border border-zinc-700/80 hover:border-zinc-500 hover:shadow-emerald-950/20 cursor-pointer"
              title="Inquire via WhatsApp"
              aria-label="Inquire via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            </button>

            <button
              onClick={handleCartClick}
              className={`flex-1 py-2 px-2.5 bg-gradient-to-r from-[#4A0E17] via-[#5A101C] to-[#3B0813] hover:brightness-110 text-[#F3E5AB] rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95 border border-[#D4AF37]/40 cursor-pointer ${
                isBagBouncing ? 'scale-110 ring-2 ring-[#D4AF37]' : ''
              }`}
              title="Add to Shopping Bag"
              aria-label="Add to Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
