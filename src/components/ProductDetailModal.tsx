import React, { useState, useEffect } from 'react';
import { Product, GoldRates } from '../types';
import { calculateProductPrice, formatINR } from '../utils/priceCalculator';
import { ImageInputSelector } from './ImageInputSelector';
import {
  X,
  ShieldCheck,
  Scale,
  Sparkles,
  MessageCircle,
  ShoppingBag,
  Heart,
  ChevronDown,
  ChevronUp,
  Award,
  Truck,
  RotateCcw,
  Plus,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  rates: GoldRates;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onWhatsAppInquiry: (p: Product) => void;
  darkMode: boolean;
  isAdmin?: boolean;
  onUpdateProductDescription?: (id: string, newDesc: string) => void;
  onUpdateProductImage?: (id: string, newPrimaryImg: string, newGallery: string[]) => void;
  whatsappNumber?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  rates,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onWhatsAppInquiry,
  darkMode,
  isAdmin = false,
  onUpdateProductDescription,
  onUpdateProductImage,
  whatsappNumber,
}) => {
  const cleanNum = (whatsappNumber || '919820012345').replace(/[^0-9]/g, '');
  const formattedWa = cleanNum.length === 10 ? `91${cleanNum}` : cleanNum;
  const displayPhone = formattedWa.startsWith('91') && formattedWa.length === 12
    ? `+91 ${formattedWa.slice(2)}`
    : `+${formattedWa}`;
  const [selectedImg, setSelectedImg] = useState<string>(product?.image || '');
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(true);
  const [zoom, setZoom] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState<string>(product?.description || '');
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newPhotoVal, setNewPhotoVal] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedImg(product.image);
      setDescValue(product.description || '');
      setZoom(false);
      setIsEditingDesc(false);
      setIsAddingPhoto(false);
      setNewPhotoVal('');
    }
  }, [product]);

  if (!product) return null;

  const priceInfo = calculateProductPrice(product, rates);

  const handleSaveDesc = () => {
    if (onUpdateProductDescription && product) {
      onUpdateProductDescription(product.id, descValue);
    }
    setIsEditingDesc(false);
  };

  const handleAddPhotoToProduct = (photoUrl: string) => {
    if (!photoUrl || !product) return;
    const currentGallery = product.gallery || [product.image];
    const updatedGallery = [...currentGallery, photoUrl];
    if (onUpdateProductImage) {
      onUpdateProductImage(product.id, product.image, updatedGallery);
    } else {
      product.gallery = updatedGallery;
    }
    setSelectedImg(photoUrl);
    setIsAddingPhoto(false);
    setNewPhotoVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className={`relative max-w-4xl w-full rounded-2xl border overflow-hidden shadow-2xl my-auto ${
          darkMode
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-[#FAF7F2] border-amber-200 text-amber-950'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Left Column: Gallery & Zoom Viewer */}
          <div className="flex flex-col space-y-4">
            <div
              className={`relative aspect-square rounded-2xl overflow-hidden border cursor-zoom-in group shadow-luxury jewel-sweep ${
                darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-amber-200/80'
              }`}
              onClick={() => setZoom(!zoom)}
            >
              <img
                src={selectedImg}
                alt={product.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                  zoom ? 'scale-150' : 'scale-100 group-hover:scale-108'
                }`}
              />

              {/* Dynamic Sparkle in Corner */}
              <div className="absolute bottom-3 right-3 pointer-events-none">
                <Sparkles className="w-5 h-5 text-[#FFE58F] animate-diamond-glint drop-shadow-[0_0_10px_#D4AF37]" />
              </div>

              <div className="absolute top-3 left-3 bg-gradient-to-r from-[#4A0E17] to-[#2B050D] text-[#F3E5AB] text-[11px] font-bold font-cinzel px-3 py-1 rounded-full shadow-md border border-[#D4AF37]/50 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D4AF37] animate-spin" />
                <span>{product.purity} BIS Hallmarked</span>
              </div>
            </div>

            {/* Gallery Thumbnails & Admin Photo Adder */}
            <div className="space-y-2">
              <div className="flex space-x-3 overflow-x-auto pb-1 items-center">
                {product.gallery && product.gallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(imgUrl)}
                    className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImg === imgUrl
                        ? 'border-[#D4AF37] scale-105 shadow-md ring-2 ring-[#D4AF37]/30'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt="Thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}

                {isAdmin && !isAddingPhoto && (
                  <button
                    onClick={() => setIsAddingPhoto(true)}
                    className="w-16 h-16 shrink-0 rounded-xl border-2 border-dashed border-[#D4AF37] bg-[#4A0E17]/10 dark:bg-zinc-800 flex flex-col items-center justify-center text-[#4A0E17] dark:text-[#D4AF37] text-[10px] font-bold hover:bg-[#4A0E17]/20 transition-all"
                    title="Admin: Add Photo"
                  >
                    <Plus className="w-4 h-4 mb-0.5" />
                    <span>+ Photo</span>
                  </button>
                )}
              </div>

              {isAdmin && isAddingPhoto && (
                <div className={`p-3 rounded-xl border space-y-2 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-amber-50 border-amber-300'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37]">
                      Admin: Add Photo to Product Gallery
                    </span>
                    <button
                      onClick={() => setIsAddingPhoto(false)}
                      className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    >
                      Cancel
                    </button>
                  </div>

                  <ImageInputSelector
                    label="Choose New Photo"
                    value={newPhotoVal}
                    onChange={(val) => {
                      setNewPhotoVal(val);
                      if (val) handleAddPhotoToProduct(val);
                    }}
                    placeholder="Paste photo URL..."
                    darkMode={darkMode}
                    helpText="Provide a direct Image URL or pick a photo from your gallery."
                  />
                </div>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-[10px] font-semibold pt-2 border-t border-amber-200/50 dark:border-zinc-800">
              <div className={`flex flex-col items-center p-2.5 rounded-xl border shadow-xs ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-amber-200/70 text-amber-950'}`}>
                <Award className="w-4 h-4 text-[#D4AF37] mb-1" />
                <span className="font-montserrat">100% Certified</span>
              </div>
              <div className={`flex flex-col items-center p-2.5 rounded-xl border shadow-xs ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-amber-200/70 text-amber-950'}`}>
                <Truck className="w-4 h-4 text-[#D4AF37] mb-1" />
                <span className="font-montserrat">Insured Delivery</span>
              </div>
              <div className={`flex flex-col items-center p-2.5 rounded-xl border shadow-xs ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-amber-200/70 text-amber-950'}`}>
                <RotateCcw className="w-4 h-4 text-[#D4AF37] mb-1" />
                <span className="font-montserrat">Lifetime Buyback</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specs, Price Breakdown & Inquiry */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#F3E5AB] bg-gradient-to-r from-[#4A0E17] to-[#2B050D] px-3 py-1 rounded-full border border-[#D4AF37]/40 font-cinzel">
                  {product.category} • {product.collection}
                </span>
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-2 rounded-full border transition-all active:scale-90 ${
                    isWishlisted
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'border-amber-300 dark:border-zinc-700 hover:bg-rose-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h2 className={`text-xl sm:text-2xl font-bold font-playfair leading-snug mb-2 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                {product.title}
              </h2>

              {/* Description Section with Admin Quick Edit */}
              <div className="mb-4">
                {isAdmin && isEditingDesc ? (
                  <div className={`space-y-2 p-2 rounded-xl border ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-amber-50 border-amber-300'}`}>
                    <label className="block text-[11px] font-bold text-[#4A0E17] dark:text-[#D4AF37]">
                      Admin: Edit Product Description
                    </label>
                    <textarea
                      rows={3}
                      value={descValue}
                      onChange={(e) => setDescValue(e.target.value)}
                      className={`w-full p-2 text-xs rounded-lg border ${darkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'}`}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditingDesc(false)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded ${darkMode ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-black'}`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveDesc}
                        className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#4A0E17] text-[#D4AF37]"
                      >
                        Save Description
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className={`text-xs font-normal leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {product.description}
                    </p>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setDescValue(product.description || '');
                          setIsEditingDesc(true);
                        }}
                        className="mt-1 text-[10px] text-[#4A0E17] dark:text-[#D4AF37] font-bold underline hover:opacity-80"
                      >
                        ✏️ Admin Edit Description
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Technical Specifications */}
              <div className={`grid grid-cols-2 gap-3 p-3.5 rounded-2xl border text-xs mb-4 shadow-xs ${
                darkMode ? 'bg-[#181315] border-zinc-800' : 'bg-white border-amber-200/70'
              }`}>
                <div>
                  <span className={`font-medium text-[10px] uppercase tracking-wider block ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Gross Weight
                  </span>
                  <strong className={`text-sm font-bold font-mono ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{product.weightGrams} Grams</strong>
                </div>
                <div>
                  <span className={`font-medium text-[10px] uppercase tracking-wider block ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Gold Purity
                  </span>
                  <strong className={`text-sm font-bold font-cinzel ${darkMode ? 'text-[#F3E5AB]' : 'text-[#4A0E17]'}`}>{product.purity} Hallmark</strong>
                </div>
                <div>
                  <span className={`font-medium text-[10px] uppercase tracking-wider block ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Gender / Style
                  </span>
                  <strong className={`font-semibold ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{product.gender}</strong>
                </div>
                <div>
                  <span className={`font-medium text-[10px] uppercase tracking-wider block ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Live Rate Applied
                  </span>
                  <strong className={`font-bold font-mono ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{formatINR(priceInfo.ratePerGram)}/g</strong>
                </div>
              </div>

              {/* Dynamic Price Breakdown Accordion */}
              <div className="rounded-2xl border border-[#D4AF37]/40 overflow-hidden mb-4 shadow-luxury">
                <button
                  onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                  className="w-full p-3.5 bg-gradient-to-r from-[#4A0E17] via-[#5A101C] to-[#3B0813] text-[#F3E5AB] font-bold text-xs flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center space-x-1.5 font-cinzel tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Transparent Price Breakdown</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold font-sans text-[#F3E5AB]">{formatINR(priceInfo.totalPrice)}</span>
                    {showPriceBreakdown ? (
                      <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
                    )}
                  </div>
                </button>

                {showPriceBreakdown && (
                  <div className={`p-4 text-xs space-y-2.5 border-t ${darkMode ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100' : 'bg-white border-amber-200/80 text-zinc-900'}`}>
                    <div className="flex justify-between">
                      <span className={`font-medium ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Gold Metal Cost ({product.weightGrams}g × {formatINR(priceInfo.ratePerGram)})
                      </span>
                      <span className="font-bold font-mono">{formatINR(priceInfo.metalCost)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className={`font-medium ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Making Charges ({priceInfo.makingChargePercent}% on Gold)
                      </span>
                      <span className="font-bold font-mono">{formatINR(priceInfo.makingCharges)}</span>
                    </div>

                    <div className="flex justify-between pt-1.5 border-t border-dashed border-amber-300/60 dark:border-zinc-700">
                      <span className={`font-medium ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Subtotal</span>
                      <span className="font-bold font-mono">{formatINR(priceInfo.subtotal)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className={`font-medium ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>3% Indian GST</span>
                      <span className="font-bold font-mono">{formatINR(priceInfo.gstAmount)}</span>
                    </div>

                    <div className="flex justify-between pt-2.5 border-t border-[#D4AF37]/40 font-bold text-sm text-[#4A0E17] dark:text-[#F3E5AB]">
                      <span className="font-cinzel tracking-wider">Total Net Price</span>
                      <span className="font-sans font-extrabold text-base">{formatINR(priceInfo.totalPrice)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#4A0E17] via-[#5A101C] to-[#3B0813] text-[#F3E5AB] font-bold text-sm rounded-2xl shadow-luxury hover:brightness-110 active:scale-98 transition-all flex items-center justify-center space-x-2 border border-[#D4AF37]/50"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-cinzel tracking-wider">Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => onWhatsAppInquiry(product)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md active:scale-98 transition-all flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on Official WhatsApp ({displayPhone})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
