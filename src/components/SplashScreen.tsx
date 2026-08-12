import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Award, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  durationMs = 2800,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [onComplete, durationMs]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onClick={onComplete}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 bg-[#0E0608] text-amber-50 cursor-pointer select-none overflow-hidden"
    >
      {/* Radial Ambient Gold Lighting in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Center Radial Gold Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.45, 0.3], scale: [0.6, 1.2, 1] }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] rounded-full bg-radial from-[#D4AF37]/35 via-[#8B6508]/15 to-transparent blur-3xl pointer-events-none"
        />

        {/* Top & Bottom Subtle Corner Ornaments */}
        <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#D4AF37]/40 rounded-tl-lg" />
        <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37]/40 rounded-tr-lg" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[#D4AF37]/40 rounded-bl-lg" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#D4AF37]/40 rounded-br-lg" />
      </div>

      {/* Top Spacer */}
      <div className="w-full flex justify-between items-center text-[10px] sm:text-xs font-semibold tracking-widest text-[#D4AF37]/70 uppercase z-10 pt-2">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> BIS 916 HALLMARKED
        </span>
        <span className="flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-[#D4AF37]" /> ROYAL COLLECTION
        </span>
      </div>

      {/* CENTERPIECE LOGO & ANIMATION */}
      <div className="flex flex-col items-center justify-center my-auto z-10 text-center max-w-sm sm:max-w-md">
        {/* Logo Container with Smooth Zoom & Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.78, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          {/* Animated Pulsing Outer Gold Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.8, 0.4], scale: [0.85, 1.12, 1.05] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute -inset-4 rounded-full border border-[#D4AF37]/30 blur-sm pointer-events-none"
          />

          {/* High-Resolution Emblem Image */}
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-3xl p-1 bg-gradient-to-b from-[#F5D77F] via-[#D4AF37] to-[#5E4300] shadow-[0_10px_40px_rgba(212,175,55,0.35)] flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[#12080A] rounded-[22px] flex items-center justify-center p-2 relative">
              <img
                src="/pwa-512x512.png"
                alt="Shubham Jewellers Logo"
                className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(212,175,55,0.5)]"
                onError={(e) => {
                  // Fallback icon if image hasn't finished loading
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Brand Title - Entrance Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.4, ease: 'easeOut' }}
          className="space-y-1.5"
        >
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8DC] via-[#F5D77F] to-[#D4AF37] drop-shadow-sm uppercase">
            SHUBHAM
          </h1>
          <p className="text-xs sm:text-sm font-black tracking-[0.38em] text-[#D4AF37] uppercase font-sans">
            JEWELLERS
          </p>
        </motion.div>

        {/* Devanagari Script & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.8, ease: 'easeOut' }}
          className="mt-4 flex flex-col items-center gap-1.5"
        >
          <span className="text-lg sm:text-xl font-bold text-[#E2C065] tracking-wide font-serif">
            शुभम् ज्वेलर्स
          </span>
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-1" />
          <p className="text-[11px] sm:text-xs text-amber-100/70 tracking-wider">
            Trust & Perfection In Pure Gold
          </p>
        </motion.div>
      </div>

      {/* BOTTOM PROGRESS & SKIP INDICATION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="w-full max-w-xs flex flex-col items-center space-y-3 z-10 pb-4"
      >
        {/* Animated Loading Bar */}
        <div className="w-full h-1 bg-amber-950/80 rounded-full overflow-hidden border border-[#D4AF37]/20">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: durationMs / 1000, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#D4AF37] shadow-[0_0_8px_#D4AF37]"
          />
        </div>

        <p className="text-[10px] text-amber-200/50 tracking-widest uppercase flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Tap anywhere to enter
        </p>
      </motion.div>
    </motion.div>
  );
};
