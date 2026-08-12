import React, { useState } from 'react';
import { Product, GoldRates } from '../types';
import { calculateProductPrice, formatINR } from '../utils/priceCalculator';
import { Heart, MessageCircle, ShoppingBag, ShieldCheck, Scale, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  rates: GoldRates;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  onWhatsAppInquiry: (p: Product) => void;
  darkMode: boolean;
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
}) => {
  const priceInfo = calculateProductPrice(product, rates);
  
  // Combine primary image and gallery images without duplicates
  const allImages = Array.from(new Set([product.image, ...(product.gallery || [])].filter(Boolean)));
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group ${
        darkMode
          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-[#D4AF37]/60'
          : 'bg-white border-amber-200/80 text-amber-950 hover:border-[#D4AF37] hover:shadow-xl'
      }`}
    >
      {/* Product Image Box - Swipable Gallery */}
      <div className="relative aspect-square overflow-hidden bg-amber-50/50 dark:bg-zinc-800/50 cursor-pointer group/img">
        <img
          src={allImages[activeImgIdx] || product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          onClick={() => onSelectProduct(product)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Carousel Navigation Arrows if multiple pictures exist */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImg}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover/img:opacity-100 transition-opacity z-10 shadow-md"
              title="Previous Picture"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImg}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover/img:opacity-100 transition-opacity z-10 shadow-md"
              title="Next Picture"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Pagination Dot Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-1 z-10 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImgIdx(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === activeImgIdx ? 'bg-[#D4AF37] w-3' : 'bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Purity & Hallmark Badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <span className="bg-[#4A0E17] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-[#D4AF37]/40 tracking-wider">
            {product.purity}
          </span>
          {product.hallmarkCertified && (
            <span className="bg-emerald-950/85 text-emerald-300 text-[9px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5 backdrop-blur-sm border border-emerald-500/30">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> BIS 916
            </span>
          )}
        </div>

        {/* Wishlist Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md z-10 ${
            isWishlisted
              ? 'bg-rose-600 text-white'
              : 'bg-black/40 hover:bg-black/70 text-white'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className={`flex items-center justify-between text-[11px] mb-1 font-semibold ${darkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>
            <span className="flex items-center gap-1">
              <Scale className="w-3 h-3 text-[#D4AF37]" /> {product.weightGrams}g
            </span>
            <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
              darkMode ? 'bg-zinc-800 text-amber-200' : 'bg-amber-100 text-amber-950'
            }`}>
              {product.gender}
            </span>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className={`text-xs sm:text-sm font-extrabold font-serif line-clamp-2 cursor-pointer hover:text-[#D4AF37] transition-colors leading-snug mb-2 ${
              darkMode ? 'text-white' : 'text-black'
            }`}
          >
            {product.title}
          </h3>
        </div>

        <div>
          {/* Price & Breakdown */}
          <div className={`mt-2 pt-2 border-t ${darkMode ? 'border-zinc-800' : 'border-amber-200/80'}`}>
            <div className="flex items-baseline justify-between">
              <span className="text-base sm:text-lg font-extrabold font-sans text-[#4A0E17] dark:text-[#D4AF37]">
                {formatINR(priceInfo.totalPrice)}
              </span>
              <span className={`text-[10px] font-medium ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Incl. 3% GST
              </span>
            </div>
            <p className={`text-[10px] font-medium mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-zinc-800'}`}>
              Metal: {formatINR(priceInfo.metalCost)} + Making: {formatINR(priceInfo.makingCharges)}
            </p>
          </div>

          {/* Action Row showing icon-only buttons as requested */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              onClick={() => onWhatsAppInquiry(product)}
              className="flex-1 py-2.5 px-3 bg-[#00a884] hover:bg-[#008f70] text-white rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95"
              title="Inquire via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#00a884]" />
            </button>

            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 py-2.5 px-3 bg-[#4A0E17] hover:bg-[#6B1423] text-[#D4AF37] rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95 border border-[#D4AF37]/30"
              title="Add to Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
