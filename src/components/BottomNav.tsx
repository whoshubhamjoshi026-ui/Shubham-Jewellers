import React, { useState } from 'react';
import { Home, Gem, ShieldCheck, Sparkles, Shield, X } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'jew_plans' | 'digi_gold' | 'gifting' | 'admin';
  onSelectTab: (tab: 'home' | 'jew_plans' | 'digi_gold' | 'gifting' | 'admin') => void;
  onOpenSchemeModal: () => void;
  onOpenDigiGoldModal: () => void;
  onOpenGiftingModal: () => void;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenSchemeModal,
  onOpenDigiGoldModal,
  onOpenGiftingModal,
  isAdmin,
  onOpenAdmin,
}) => {
  const [showShortcutTooltip, setShowShortcutTooltip] = useState(true);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-2 pb-2 pt-0 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        {/* Floating "Introducing Shortcuts" Banner (Matching Image 3) */}
        {showShortcutTooltip && (
          <div className="mb-2 w-fit mx-auto bg-gradient-to-r from-[#6B1423] via-[#8B1A2B] to-[#6B1423] text-white px-3 py-1.5 rounded-xl border border-[#D4AF37]/50 shadow-xl flex items-center space-x-2 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="text-xs font-bold font-serif text-[#D4AF37] tracking-wide">
              Introducing Shortcuts
            </span>
            <button
              onClick={() => setShowShortcutTooltip(false)}
              className="p-0.5 rounded-full hover:bg-black/20 text-white/80"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Fixed Sticky Bottom Action Bar Container (Home, Jew Plans, Digi Gold, Gifting - Categories Removed) */}
        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl px-3 py-2 flex items-center justify-between gap-1">
          {/* 1. Home Button */}
          <button
            onClick={() => onSelectTab('home')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 ${
              activeTab === 'home'
                ? 'bg-[#7A1C28] text-white shadow-md font-extrabold scale-105'
                : 'text-zinc-600 dark:text-zinc-400 font-medium hover:text-[#7A1C28]'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px] tracking-tight leading-none">Home</span>
          </button>

          {/* 2. Jew Plans Button */}
          <button
            onClick={() => {
              onSelectTab('jew_plans');
              onOpenSchemeModal();
            }}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 ${
              activeTab === 'jew_plans'
                ? 'bg-[#7A1C28] text-white shadow-md font-extrabold scale-105'
                : 'text-zinc-600 dark:text-zinc-400 font-medium hover:text-[#7A1C28]'
            }`}
          >
            <Gem className="w-5 h-5 mb-1" />
            <span className="text-[10px] tracking-tight leading-none truncate max-w-[60px]">
              Jew Plans
            </span>
          </button>

          {/* 3. Digi Gold Button */}
          <button
            onClick={() => {
              onSelectTab('digi_gold');
              onOpenDigiGoldModal();
            }}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 ${
              activeTab === 'digi_gold'
                ? 'bg-[#7A1C28] text-white shadow-md font-extrabold scale-105'
                : 'text-zinc-600 dark:text-zinc-400 font-medium hover:text-[#7A1C28]'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-1" />
            <span className="text-[10px] tracking-tight leading-none truncate max-w-[60px]">
              Digi Gold
            </span>
          </button>

          {/* 4. Gifting Button */}
          <button
            onClick={() => {
              onSelectTab('gifting');
              onOpenGiftingModal();
            }}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 ${
              activeTab === 'gifting'
                ? 'bg-[#7A1C28] text-white shadow-md font-extrabold scale-105'
                : 'text-zinc-600 dark:text-zinc-400 font-medium hover:text-[#7A1C28]'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-1" />
            <span className="text-[10px] tracking-tight leading-none">Gifting</span>
          </button>

          {/* 5. Admin Button (Only visible for logged-in Admin) */}
          {isAdmin && (
            <button
              onClick={() => {
                onSelectTab('admin');
                onOpenAdmin?.();
              }}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 ${
                activeTab === 'admin'
                  ? 'bg-[#7A1C28] text-[#D4AF37] shadow-md font-extrabold scale-105 border border-[#D4AF37]/50'
                  : 'text-[#D4AF37] font-bold hover:bg-[#7A1C28]/20'
              }`}
            >
              <Shield className="w-5 h-5 mb-1 text-[#D4AF37]" />
              <span className="text-[10px] tracking-tight leading-none truncate max-w-[60px] font-extrabold text-[#D4AF37]">
                Admin
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
