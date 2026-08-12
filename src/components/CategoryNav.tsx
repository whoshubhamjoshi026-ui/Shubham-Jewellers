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
  const normalizedCategories: { name: string; image?: string }[] = [
    { name: 'All' },
    ...customCategories.map((c: CategoryItem | string) =>
      typeof c === 'string' ? { name: c } : { name: c.name, image: c.image }
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
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      {/* Category Icon Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-7 gap-2.5 mb-4">
        {normalizedCategories.map((catObj) => {
          const catName = catObj.name;
          const isActive = selectedCategory === catName;
          return (
            <button
              key={catName}
              onClick={() => setSelectedCategory(catName)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-[#4A0E17] text-[#D4AF37] border-[#D4AF37] shadow-md scale-105 font-bold'
                  : darkMode
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                  : 'bg-white border-amber-200 text-amber-950 hover:bg-amber-50 shadow-sm'
              }`}
            >
              <div
                className={`p-2 rounded-full mb-1 ${
                  isActive
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                    : 'bg-amber-100 dark:bg-zinc-700 text-amber-800 dark:text-amber-300'
                }`}
              >
                {getCategoryIcon(catName, catObj.image)}
              </div>
              <span className="text-xs font-serif tracking-tight truncate w-full text-center">
                {catName === 'All' ? 'All Jewel' : catName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Row */}
      <div
        className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
          darkMode
            ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
            : 'bg-amber-50/60 border-amber-200/80 text-amber-950'
        }`}
      >
        {/* Gender Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> For:
          </span>
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 ${
                selectedGender === g
                  ? 'bg-[#D4AF37] text-[#4A0E17] font-bold shadow-sm'
                  : darkMode
                  ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  : 'bg-white text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Purity Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="font-bold text-amber-800 dark:text-amber-400 shrink-0">Purity:</span>
          {purities.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPurity(p)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 ${
                selectedPurity === p
                  ? 'bg-[#4A0E17] text-[#D4AF37] border border-[#D4AF37] font-bold shadow-sm'
                  : darkMode
                  ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  : 'bg-white text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Max Price Slider */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="font-bold text-amber-800 dark:text-amber-400 text-[11px]">
            Max Price: ₹{(priceRange / 1000).toFixed(0)}k
          </span>
          <input
            type="range"
            min={10000}
            max={500000}
            step={10000}
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-24 accent-[#D4AF37] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
