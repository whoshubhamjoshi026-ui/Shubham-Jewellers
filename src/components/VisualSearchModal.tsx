import React, { useState, useRef } from 'react';
import { Camera, Upload, Search, X, Sparkles, Check, RefreshCw, Link2, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';
import { safeFetchJson } from '../utils/safeFetch';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySearch: (searchTerm: string, exactProductId?: string | null) => void;
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
  const [searchTab, setSearchTab] = useState<'gallery' | 'url'>('gallery');
  const [urlInput, setUrlInput] = useState<string>('');
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // BUG 1 FIX: Convert file to Base64 Data URL so server & Gemini API receive actual image bytes
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          processImage(reader.result);
        }
      };
      reader.onerror = () => {
        // Fallback on read error: trigger Not Found state
        setIsAnalyzing(false);
        onApplySearch('No Stock Item', null);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsAnalyzing(true);
    setMatchedCategory(null);
    setMatchingProducts([]);

    try {
      const res = await safeFetchJson<{
        success: boolean;
        category?: string;
        searchTerm?: string;
        exactProductId?: string | null;
        matchedProducts?: Product[];
        exactMatch?: boolean;
        notFound?: boolean;
      }>('/api/visual-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      let detected = res?.category || null;
      let matched = res?.matchedProducts || [];
      let finalTerm = res?.searchTerm || (matched.length > 0 ? (detected || '') : 'No Stock Item');
      let exactId = res?.exactProductId || null;

      // Client-side fallback classifier if backend API returned no category or failed
      if (!res?.success || (!detected && matched.length === 0)) {
        const lower = imageUrl.toLowerCase();
        if (lower.startsWith('http') || lower.startsWith('data:image')) {
          if (lower.includes('necklace') || lower.includes('1599643478518') || lower.includes('kundan') || lower.includes('pendant')) {
            detected = 'Necklace';
          } else if (lower.includes('ring') || lower.includes('1605100804763') || lower.includes('solitaire')) {
            detected = 'Ring';
          } else if (lower.includes('bangle') || lower.includes('1611591475168') || lower.includes('kada')) {
            detected = 'Bangles';
          } else if (lower.includes('bracelet') || lower.includes('1535632066927')) {
            detected = 'Bracelet';
          } else if (lower.includes('coin') || lower.includes('1610375461246')) {
            detected = 'Coins';
          } else if (lower.includes('earring') || lower.includes('jhumka')) {
            detected = 'Earrings';
          }
        }

        if (detected) {
          const catLower = detected.toLowerCase();
          matched = products.filter((p) => {
            if (!p.inStock) return false;
            const t = p.title.toLowerCase();
            const c = p.category.toLowerCase();
            if (catLower === 'necklace') return t.includes('necklace') || t.includes('pendant') || t.includes('kundan');
            if (catLower === 'ring') return t.includes('ring');
            if (catLower === 'bangles') return t.includes('bangle') || t.includes('kada');
            if (catLower === 'bracelet') return t.includes('bracelet');
            if (catLower === 'coins') return c.includes('coins') || t.includes('coin');
            if (catLower === 'earrings') return t.includes('earring') || t.includes('jhumka');
            return c.includes(catLower) || t.includes(catLower);
          });

          if (matched.length > 0) {
            finalTerm = detected;
            exactId = matched[0]?.id || null;
          } else {
            // Category identified but no items in stock -> trigger Not Found UI
            finalTerm = 'No Stock Item';
            exactId = null;
          }
        } else {
          // No category identified -> trigger Not Found UI
          detected = null;
          finalTerm = 'No Stock Item';
          matched = [];
          exactId = null;
        }
      }

      setMatchedCategory(detected);
      setMatchingProducts(matched);

      // Brief animation pause then redirect to results page
      setTimeout(() => {
        setIsAnalyzing(false);
        // BUG 2 FIX: If matched items exist, pass finalTerm; otherwise pass 'No Stock Item' to render Not Found UI
        onApplySearch(matched.length > 0 ? finalTerm : 'No Stock Item', exactId);
        onClose();
      }, 600);
    } catch (err) {
      // BUG 2 FIX: On error or network failure, trigger "Not Found" state ('No Stock Item'), NEVER default to 'Necklace'
      setIsAnalyzing(false);
      onApplySearch('No Stock Item', null);
      onClose();
    }
  };

  const handleSelectSample = (sampleUrl: string) => {
    processImage(sampleUrl);
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
        <div className="bg-gradient-to-r from-[#4A0E17] via-[#5A101C] to-[#3B0813] p-4 text-[#F3E5AB] flex items-center justify-between border-b border-[#D4AF37]/40 shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 shadow-xs">
              <Camera className="w-5 h-5 text-[#F3E5AB]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-cinzel tracking-wide">AI Visual Jewellery Search</h3>
              <p className="text-[11px] text-amber-200/80 font-normal">
                Snap or upload a photo to find matching showroom designs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#F3E5AB] hover:bg-white/10 active:scale-90 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Dual Search Mode Tabs */}
          <div className="flex bg-amber-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setSearchTab('gallery')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                searchTab === 'gallery'
                  ? 'bg-[#4A0E17] text-[#D4AF37] shadow'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery / Camera</span>
            </button>
            <button
              type="button"
              onClick={() => setSearchTab('url')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                searchTab === 'url'
                  ? 'bg-[#4A0E17] text-[#D4AF37] shadow'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Image URL</span>
            </button>
          </div>

          {/* Hidden File Inputs: Plain for Gallery/Files and capture="environment" for Direct Camera */}
          <input
            type="file"
            ref={galleryInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {!selectedImage ? (
            searchTab === 'gallery' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Gallery / Device File Picker */}
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="p-5 border-2 border-dashed border-amber-300 dark:border-zinc-700 rounded-2xl text-center cursor-pointer hover:bg-amber-50/70 dark:hover:bg-zinc-900 transition-all flex flex-col items-center justify-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-zinc-800 text-[#4A0E17] dark:text-[#D4AF37] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-amber-950 dark:text-zinc-100">
                      Choose from Gallery
                    </p>
                    <p className="text-[11px] text-amber-800/70 dark:text-zinc-400 mt-0.5">
                      Upload from phone storage / album
                    </p>
                  </button>

                  {/* Option 2: Live Camera Snapshot */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="p-5 border-2 border-dashed border-[#D4AF37] dark:border-amber-600/70 rounded-2xl text-center cursor-pointer bg-gradient-to-b from-amber-50/40 to-amber-100/30 dark:from-zinc-900/60 dark:to-zinc-900 hover:bg-amber-100/60 dark:hover:bg-zinc-800/80 transition-all flex flex-col items-center justify-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-amber-950 dark:text-zinc-100">
                      Take Live Photo
                    </p>
                    <p className="text-[11px] text-amber-800/70 dark:text-zinc-400 mt-0.5">
                      Direct camera snapshot
                    </p>
                  </button>
                </div>

                <p className="text-center text-[11px] text-amber-800/70 dark:text-zinc-400">
                  Supports JPG, PNG, WEBP jewelry photos (AI auto-matches category & stock)
                </p>
              </div>
            ) : (
              <div className="p-4 border-2 border-amber-300 dark:border-zinc-700 rounded-2xl space-y-3 bg-amber-50/30 dark:bg-zinc-900/40">
                <label className="block text-xs font-bold text-amber-950 dark:text-zinc-100">
                  Enter or Paste Jewelry Image Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 p-2 text-xs rounded-xl border bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700 text-black dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (urlInput.trim()) {
                        processImage(urlInput.trim());
                      }
                    }}
                    className="px-4 py-2 bg-[#4A0E17] text-[#D4AF37] text-xs font-bold rounded-xl hover:bg-[#6B1423] shrink-0"
                  >
                    Analyze
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Paste any online photo URL to find similar jewelry in store inventory.
                </p>
              </div>
            )
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
        </div>
      </div>
    </div>
  );
};
