import React, { useState, useRef } from 'react';
import { Camera, Upload, Search, X, Sparkles, Check, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySearch: (searchTerm: string) => void;
  products: Product[];
  darkMode: boolean;
}

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({
  isOpen,
  onClose,
  onApplySearch,
  products,
  darkMode,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [matchedCategory, setMatchedCategory] = useState<string | null>(null);
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      processImage(url);
    }
  };

  const processImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsAnalyzing(true);
    setMatchedCategory(null);

    // Simulate AI image recognition of jewelry
    setTimeout(() => {
      setIsAnalyzing(false);
      // Randomly pick or intelligently sample from available products
      const categories = ['Gold', 'Diamond', 'Silver', 'Kundan', 'Solitaires', 'Coins', 'Mangalsutra'];
      const detected = categories[Math.floor(Math.random() * categories.length)];
      setMatchedCategory(detected);

      // Filter products that match
      const matched = products.filter(
        (p) =>
          p.category.toLowerCase().includes(detected.toLowerCase()) ||
          p.title.toLowerCase().includes(detected.toLowerCase()) ||
          p.purity.toLowerCase().includes(detected.toLowerCase())
      );
      setMatchingProducts(matched.length > 0 ? matched.slice(0, 4) : products.slice(0, 4));
    }, 1200);
  };

  const handleSelectSample = (sampleUrl: string, sampleKeyword: string) => {
    setSelectedImage(sampleUrl);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setMatchedCategory(sampleKeyword);
      const matched = products.filter(
        (p) =>
          p.category.toLowerCase().includes(sampleKeyword.toLowerCase()) ||
          p.title.toLowerCase().includes(sampleKeyword.toLowerCase()) ||
          p.description.toLowerCase().includes(sampleKeyword.toLowerCase())
      );
      setMatchingProducts(matched.length > 0 ? matched.slice(0, 4) : products.slice(0, 4));
    }, 800);
  };

  const confirmSearch = (term?: string) => {
    const finalTerm = term || matchedCategory || '';
    onApplySearch(finalTerm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className={`relative max-w-lg w-full rounded-2xl border overflow-hidden shadow-2xl ${
          darkMode
            ? 'bg-zinc-950 border-zinc-800 text-zinc-100'
            : 'bg-white border-amber-200 text-amber-950'
        }`}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#4A0E17] via-[#6B1423] to-[#4A0E17] p-4 text-[#D4AF37] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50">
              <Camera className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif">Visual Jewelry Search</h3>
              <p className="text-[11px] text-amber-200/90 font-light">
                Snap or upload a photo to find matching designs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#D4AF37] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* File Upload Box */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-amber-300 dark:border-zinc-700 rounded-2xl p-6 text-center cursor-pointer hover:bg-amber-50/50 dark:hover:bg-zinc-900 transition-all flex flex-col items-center justify-center group"
            >
              <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-zinc-800 text-[#4A0E17] dark:text-[#D4AF37] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7" />
              </div>
              <p className="text-xs font-bold text-amber-950 dark:text-zinc-100">
                Click to Take Photo or Upload Image
              </p>
              <p className="text-[11px] text-amber-800/70 dark:text-zinc-400 mt-1">
                Supports JPG, PNG, WEBP from your phone camera or gallery
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black/90 border border-amber-300/40 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Uploaded Jewelry"
                  className="max-h-full max-w-full object-contain"
                />

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-amber-300 space-y-2">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37]" />
                    <span className="text-xs font-semibold tracking-wider">
                      Analyzing Jewelry Patterns & Gold Tone...
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-rose-600 transition-colors"
                  title="Retake photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {matchedCategory && !isAnalyzing && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-emerald-900 dark:text-emerald-200 font-bold">
                        Pattern Match Found:
                      </span>{' '}
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                        {matchedCategory} Jewelry
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => confirmSearch(matchedCategory)}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[11px] transition-colors"
                  >
                    View All {matchedCategory}
                  </button>
                </div>
              )}

              {/* Matching products preview */}
              {matchingProducts.length > 0 && !isAnalyzing && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-amber-950 dark:text-zinc-200">
                    Similar Designs in Catalog:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => confirmSearch(p.title)}
                        className="p-2 border rounded-xl bg-amber-50/50 dark:bg-zinc-900 border-amber-200 dark:border-zinc-800 flex items-center space-x-2 cursor-pointer hover:border-[#D4AF37] transition-all"
                      >
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-10 h-10 object-cover rounded-lg shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold truncate text-amber-950 dark:text-zinc-100">
                            {p.title}
                          </p>
                          <p className="text-[10px] text-amber-700 dark:text-amber-400">
                            {p.purity} • {p.weightGrams}g
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Demo Photo Samples */}
          <div>
            <p className="text-[11px] font-bold text-amber-900 dark:text-zinc-300 mb-2">
              Or Select Sample Jewelry Photo:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleSelectSample(
                    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
                    'Gold'
                  )
                }
                className="p-1.5 border border-amber-200 dark:border-zinc-800 rounded-xl flex flex-col items-center hover:border-[#D4AF37] transition-all"
              >
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80"
                  alt="Gold Necklace"
                  className="w-full h-14 object-cover rounded-lg mb-1"
                />
                <span className="text-[10px] font-bold">Gold Necklace</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectSample(
                    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80',
                    'Diamond'
                  )
                }
                className="p-1.5 border border-amber-200 dark:border-zinc-800 rounded-xl flex flex-col items-center hover:border-[#D4AF37] transition-all"
              >
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80"
                  alt="Diamond Ring"
                  className="w-full h-14 object-cover rounded-lg mb-1"
                />
                <span className="text-[10px] font-bold">Diamond Ring</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectSample(
                    'https://images.unsplash.com/photo-1611591475119-216a9a7a6279?auto=format&fit=crop&w=400&q=80',
                    'Kundan'
                  )
                }
                className="p-1.5 border border-amber-200 dark:border-zinc-800 rounded-xl flex flex-col items-center hover:border-[#D4AF37] transition-all"
              >
                <img
                  src="https://images.unsplash.com/photo-1611591475119-216a9a7a6279?auto=format&fit=crop&w=400&q=80"
                  alt="Kundan Set"
                  className="w-full h-14 object-cover rounded-lg mb-1"
                />
                <span className="text-[10px] font-bold">Kundan Set</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
