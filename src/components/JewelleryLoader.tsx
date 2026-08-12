import React from 'react';
import { Sparkles, Gem } from 'lucide-react';

interface JewelleryLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const JewelleryLoader: React.FC<JewelleryLoaderProps> = ({
  message = 'Loading Shubham Collections...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Outer Rotating Gold Ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-4 border-t-[#D4AF37] border-r-amber-200 border-b-[#4A0E17] border-l-[#D4AF37]/30 animate-spin`}
        ></div>

        {/* Center Sparkling Diamond */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Gem className="w-6 h-6 text-[#D4AF37] animate-pulse" />
        </div>

        {/* Floating Sparkles Accent */}
        <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-ping" />
      </div>

      {message && (
        <div className="space-y-1">
          <p className="text-xs font-bold font-serif text-[#4A0E17] dark:text-[#D4AF37] tracking-wider uppercase">
            Shubham Jewellers
          </p>
          <p className="text-[11px] text-amber-900/70 dark:text-amber-200/70 font-medium animate-pulse">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};
