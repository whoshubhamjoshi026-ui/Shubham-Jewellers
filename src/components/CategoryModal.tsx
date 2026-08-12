import React from 'react';
import { X, Grid, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import { CategoryItem } from '../types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: (CategoryItem | string)[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  darkMode: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  darkMode,
}) => {
  if (!isOpen) return null;

  const categoryThumbnails: Record<string, string> = {
    Gold: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
    Diamond: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
    Silver: 'https://images.unsplash.com/photo-1611591475281-b1c9c811f016?auto=format&fit=crop&q=80&w=400',
    Coins: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=400',
    Solitaires: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
    'Kundan & Antique': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    Mangalsutra: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400',
  };

  const defaultThumb = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`relative max-w-lg w-full rounded-2xl border overflow-hidden shadow-2xl flex flex-col max-h-[85vh] ${
          darkMode
            ? 'bg-zinc-900 border-amber-900/60 text-zinc-100'
            : 'bg-[#FAF7F2] border-amber-200 text-amber-950'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A0E17] via-[#6B1423] to-[#4A0E17] text-[#D4AF37] p-5 flex items-center justify-between border-b border-[#D4AF37]/40 relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center shrink-0">
              <Grid className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif tracking-tight">Select Jewellery Partition</h2>
              <p className="text-xs text-amber-200/90 font-light">Explore Shubham Heritage Collections</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#D4AF37] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3 no-scrollbar">
          <button
            onClick={() => {
              onSelectCategory('All');
              onClose();
            }}
            className={`w-full p-3.5 rounded-xl border flex items-center justify-between font-bold text-sm transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#4A0E17] text-[#D4AF37] border-[#D4AF37] shadow-md'
                : 'bg-white dark:bg-zinc-800 border-amber-200 dark:border-zinc-700 hover:bg-amber-100/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span>All Royal Collections</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {categories.map((item, idx) => {
              const catName = typeof item === 'string' ? item : item.name;
              const catImg = (typeof item === 'object' && item.image) ? item.image : (categoryThumbnails[catName] || defaultThumb);
              const isSelected = selectedCategory === catName;

              return (
                <button
                  key={typeof item === 'object' ? item.id || idx : `${catName}-${idx}`}
                  onClick={() => {
                    onSelectCategory(catName);
                    onClose();
                  }}
                  className={`group relative rounded-xl overflow-hidden border shadow-sm text-left transition-all hover:scale-[1.02] ${
                    isSelected
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]'
                      : 'border-amber-200 dark:border-zinc-800'
                  }`}
                >
                  <div className="h-28 w-full relative">
                    <img src={catImg} alt={catName} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                    <span className="font-serif font-bold text-xs truncate drop-shadow">{catName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
