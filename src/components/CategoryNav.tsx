import React from 'react';
import { Category, Gender, Purity, CategoryItem } from '../types';
import { Coins, Sparkles, Gem, Shield, Crown, Filter, Check } from 'lucide-react';

interface CategoryNavProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedGender: Gender | 'All';
  setSelectedGender: (gender: Gender | 'All') => void;
  selectedPurity: Purity | 'All';
  setSelectedPurity: (purity: Purity | 'All') => void;
  priceRange: number; // max price
  setPriceRange: (val: number) => void;
  darkMode: boolean;
  customCategories?: (CategoryItem | string)[];
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedGender,
  setSelectedGender,
  selectedPurity,
  setSelectedPurity,
  priceRange,
  setPriceRange,
  darkMode,
  customCategories = ['Gold', 'Diamond', 'Silver', 'Coins', 'Solitaires'],
}) => {
  const normalizedCategories: { id: string; name: string; image?: string }[] = [
    { id: 'cat-all', name: 'All' },
    ...customCategories.map((c: CategoryItem | string, idx: number) =>
      typeof c === 'string'
        ? { id: `cat-str-${idx}-${c}`, name: c }
        : { id: c.id || `cat-item-${idx}-${c.name}`, name: c.name, image: c.image }
    ),
  ];

  const getCategoryIcon = (name: string, image?: string) => {
    if (image) {
      return <img src={image} alt={name} referrerPolicy="no-referrer" className="w-5 h-5 rounded-full object-cover" />;
    }
    switch (name.toLowerCase()) {
      case 'gold':
        return <Crown className="w-4 h-4" />;
      case 'diamond':
        return <Gem className="w-4 h-4" />;
      case 'silver':
        return <Shield className="w-4 h-4" />;
      case 'coins':
        return <Coins className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const genders: (Gender | 'All')[] = ['All', 'Women', 'Men', 'Kids', 'Unisex'];
  const purities: (Purity | 'All')[] = ['All', '24K', '22K', '18K', '999 Silver', '925 Silver'];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-3.5">
      {/* Category Icon Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-7 gap-2 sm:gap-2.5 mb-3.5">
        {normalizedCategories.map((catObj, idx) => {
          const catName = catObj.name;
          const isActive = selectedCategory === catName;
          return (
            <button
              key={catObj.id || `${catName}-${idx}`}
              onClick={() => setSelectedCategory(catName)}
              className={`p-2 sm:p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-b from-[#4A0E17] to-[#30050D] text-[#F3E5AB] border-[#D4AF37] shadow-luxury font-bold scale-[1.02] ring-1 ring-[#D4AF37]/50'
                  : darkMode
                  ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-[#D4AF37]/40 hover:bg-zinc-800/90 shadow-xs'
                  : 'bg-white/90 border-amber-200/70 text-amber-950 hover:border-[#D4AF37]/60 hover:bg-amber-50/50 shadow-luxury'
              }`}
            >
              <div
                className={`p-2 rounded-full mb-1 transition-transform duration-300 ${
                  isActive
                    ? 'bg-[#D4AF37]/25 text-[#F3E5AB] scale-105 shadow-xs'
                    : 'bg-amber-100/70 dark:bg-zinc-800 text-amber-900 dark:text-amber-300'
                }`}
              >
                {getCategoryIcon(catName, catObj.image)}
              </div>
              <span className="text-[11px] font-cinzel tracking-wider truncate w-full text-center">
                {catName === 'All' ? 'All Jewels' : catName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Row */}
      <div
        className={`p-2.5 sm:p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs shadow-xs transition-all ${
          darkMode
            ? 'bg-[#151012] border-zinc-800/80 text-zinc-300'
            : 'bg-[#FDFBF7] border-amber-200/70 text-amber-950'
        }`}
      >
        {/* Gender Filter */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="font-bold text-[#4A0E17] dark:text-[#D4AF37] flex items-center gap-1 shrink-0 font-cinzel text-[10.5px] uppercase tracking-wider">
            <Filter className="w-3 h-3 text-[#D4AF37]" /> For:
          </span>
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-2.5 py-1 rounded-full text-[10.5px] font-medium transition-all shrink-0 active:scale-95 ${
                selectedGender === g
                  ? 'bg-gradient-to-r from-[#ECC86A] to-[#D4AF37] text-[#2B050D] font-bold shadow-xs'
                  : darkMode
                  ? 'bg-zinc-800/80 text-zinc-300 hover:text-white border border-zinc-700/50'
                  : 'bg-white text-amber-950 hover:bg-amber-100/50 border border-amber-200/80'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Purity Filter */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="font-bold text-[#4A0E17] dark:text-[#D4AF37] shrink-0 font-cinzel text-[10.5px] uppercase tracking-wider">Purity:</span>
          {purities.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPurity(p)}
              className={`px-2.5 py-1 rounded-full text-[10.5px] font-medium transition-all shrink-0 active:scale-95 ${
                selectedPurity === p
                  ? 'bg-[#4A0E17] text-[#F3E5AB] border border-[#D4AF37] font-bold shadow-xs'
                  : darkMode
                  ? 'bg-zinc-800/80 text-zinc-300 hover:text-white border border-zinc-700/50'
                  : 'bg-white text-amber-950 hover:bg-amber-100/50 border border-amber-200/80'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Max Price Slider */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="font-bold text-[#4A0E17] dark:text-[#D4AF37] text-[10.5px] font-cinzel tracking-wider uppercase">
            Max: ₹{(priceRange / 1000).toFixed(0)}k
          </span>
          <input
            type="range"
            min={10000}
            max={500000}
            step={10000}
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-20 sm:w-24 accent-[#D4AF37] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
