import React, { useState, useEffect } from 'react';
import { Sparkles, Gem, ShieldCheck, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ShubhamLogo } from './ShubhamLogo';

interface JewelleryLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  fullScreen?: boolean;
  subtext?: string;
}

const LUXURY_PHRASES = [
  'Polishing Handcrafted Jewels...',
  'Authenticating BIS 916 Hallmark...',
  'Synchronizing Live Gold Bullion Rates...',
  'Curating Royal Shubham Masterpieces...',
  'Loading Pure 22K & 24K Gold Collections...',
];

export const JewelleryLoader: React.FC<JewelleryLoaderProps> = ({
  message,
  size = 'md',
  fullScreen = false,
  subtext,
}) => {
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % LUXURY_PHRASES.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const activeMessage = message || LUXURY_PHRASES[phraseIdx];

  const content = (
    <div className="flex flex-col items-center justify-center p-6 space-y-5 text-center select-none">
      {/* Central Rotating Jewellery Orbits & Diamond Insignia */}
      <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32">
        {/* Outer Radiant Gold Halo */}
        <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 blur-[2px] animate-pulse" />

        {/* Counter-rotating decorative mandala rings */}
        <div className="absolute inset-1 rounded-full border-2 border-dashed border-[#D4AF37]/60 animate-gold-halo pointer-events-none" />
        <div className="absolute inset-3 rounded-full border border-dotted border-[#F5D77F]/70 animate-gold-halo-rev pointer-events-none" />

        {/* 4 Corner Sparkling Diamonds floating in orbit */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-[#FFF8D6] to-[#D4AF37] shadow-[0_0_10px_#D4AF37] flex items-center justify-center animate-bounce">
          <Gem className="w-2.5 h-2.5 text-[#380A12]" />
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-[#FFF8D6] to-[#D4AF37] shadow-[0_0_10px_#D4AF37] flex items-center justify-center animate-bounce">
          <Crown className="w-2.5 h-2.5 text-[#380A12]" />
        </div>

        {/* Center Logo Crest */}
        <div className="relative z-10 scale-90 sm:scale-100 drop-shadow-[0_4px_18px_rgba(212,175,55,0.45)]">
          <ShubhamLogo size={size === 'sm' ? 'sm' : 'md'} animated={true} showRings={false} />
        </div>

        {/* Dynamic Sparkle Glints */}
        <Sparkles className="w-5 h-5 text-[#FFF8DC] absolute -top-2 -right-2 animate-ping" />
        <Sparkles className="w-4 h-4 text-[#D4AF37] absolute -bottom-2 -left-2 animate-pulse" />
      </div>

      {/* Brand Title & Dynamic Animated Status Message */}
      <div className="space-y-1.5 max-w-xs sm:max-w-sm">
        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <p className="text-xs font-bold font-cinzel tracking-[0.2em] text-[#4A0E17] dark:text-[#F3E5AB] uppercase">
            SHUBHAM JEWELLERS
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={activeMessage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-200/80 font-medium font-serif italic"
          >
            {activeMessage}
          </motion.p>
        </AnimatePresence>

        {subtext && (
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 tracking-wider font-sans uppercase">
            {subtext}
          </p>
        )}
      </div>

      {/* Subtle Gold Progress Shimmer Line */}
      <div className="w-36 h-1 rounded-full bg-amber-200/40 dark:bg-zinc-800 overflow-hidden relative">
        <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-gold-shimmer rounded-full" />
      </div>
    </div>
  );

  if (fullScreen || size === 'fullscreen') {
    return (
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md"
      >
        <div className="bg-[#FAF8F5]/95 dark:bg-[#140E10]/95 border border-[#D4AF37]/40 rounded-3xl p-4 sm:p-6 shadow-2xl max-w-sm w-[90%] ring-1 ring-[#D4AF37]/30">
          {content}
        </div>
      </motion.div>
    );
  }

  return content;
};
