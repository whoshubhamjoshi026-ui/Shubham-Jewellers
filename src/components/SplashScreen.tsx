import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Award, ShieldCheck, ArrowRight, Gem, Volume2, VolumeX } from 'lucide-react';
import { ShubhamLogo } from './ShubhamLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

const SPLASH_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4';

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      onClick={onComplete}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-4 sm:p-6 bg-[#080204] text-amber-50 cursor-pointer select-none overflow-hidden"
    >
      {/* Background Cinematic Video Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src={SPLASH_VIDEO_URL}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`w-full h-full object-cover object-center transition-opacity duration-1000 scale-105 ${
            isVideoLoaded ? 'opacity-85' : 'opacity-0'
          }`}
        />

        {/* Luxury Vignette & Deep Burgundy Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090204] via-[#0E0306]/75 to-[#090204]/90" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#26050C]/40 to-[#080204]/80" />

        {/* Ambient Gold Particle Dust & Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] rounded-full bg-radial from-[#D4AF37]/25 via-[#7A1220]/15 to-transparent blur-3xl pointer-events-none animate-pulse" />

        {/* Regal Corner Filigrees */}
        <div className="absolute top-5 left-5 w-10 h-10 border-t-2 border-l-2 border-[#D4AF37]/50 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-5 right-5 w-10 h-10 border-t-2 border-r-2 border-[#D4AF37]/50 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-5 left-5 w-10 h-10 border-b-2 border-l-2 border-[#D4AF37]/50 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-5 right-5 w-10 h-10 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-xl pointer-events-none" />
      </div>

      {/* Top Credentials & Sound Toggle Bar */}
      <div className="w-full max-w-2xl flex justify-between items-center text-[10px] sm:text-xs font-semibold tracking-widest text-[#D4AF37]/90 uppercase z-10 pt-2 px-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-cinzel bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> BIS 916 HALLMARKED
          </span>
          <span className="hidden sm:flex items-center gap-1.5 font-cinzel bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/30">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" /> EST. 1984
          </span>
        </div>

        {/* Audio Mute/Unmute Control */}
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-md transition-all active:scale-90"
          title={isMuted ? 'Unmute Video' : 'Mute Video'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFF8DC]" />}
        </button>
      </div>

      {/* CENTERPIECE BRAND CREST & TYPOGRAPHY */}
      <div className="flex flex-col items-center justify-center my-auto z-10 text-center max-w-sm sm:max-w-md py-4">
        {/* Emblem Insignia Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-5"
        >
          {/* Animated Pulsing Outer Halo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: [0.25, 0.75, 0.25], scale: [0.9, 1.12, 0.9] }}
            transition={{ duration: 2.8, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute -inset-6 rounded-full border border-[#D4AF37]/40 blur-sm pointer-events-none"
          />

          {/* Luxury Frame for Crest with Backdrop Blur */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl p-1 bg-gradient-to-b from-[#F5D77F] via-[#D4AF37] to-[#5E4300] shadow-[0_12px_45px_rgba(212,175,55,0.45)] flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[#180509]/90 backdrop-blur-md rounded-[22px] flex items-center justify-center p-2 relative overflow-hidden">
              <ShubhamLogo size="splash" animated={true} showRings={false} />
            </div>
          </div>
        </motion.div>

        {/* Crisp Brand Name with Pure Gold Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
          className="space-y-1 bg-black/35 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-[#D4AF37]/30 shadow-lg"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-cinzel tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF0] via-[#F5D77F] to-[#D4AF37] drop-shadow-md uppercase">
            SHUBHAM
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-[0.42em] text-[#D4AF37] uppercase font-montserrat">
            JEWELLERS
          </p>
        </motion.div>

        {/* Elegant Devanagari Script & Heritage Line */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: 'easeOut' }}
          className="mt-3.5 flex flex-col items-center gap-1"
        >
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-sm sm:text-base font-medium text-[#F3E5AB] font-serif tracking-wider drop-shadow-xs">
              शुभम् ज्वेलर्स
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <p className="text-[11px] sm:text-xs text-amber-100/80 tracking-widest font-light drop-shadow-xs">
            Crafting Timeless Elegance & Pure Gold
          </p>
        </motion.div>
      </div>

      {/* BOTTOM EXPLICIT TAP BUTTON - USER MUST TAP TO ENTER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="w-full max-w-xs flex flex-col items-center space-y-2.5 z-10 pb-4"
      >
        {/* Interactive Luxury Enter Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          animate={{
            boxShadow: [
              '0 0 15px rgba(212,175,55,0.3)',
              '0 0 35px rgba(212,175,55,0.65)',
              '0 0 15px rgba(212,175,55,0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ECC86A] via-[#D4AF37] to-[#B8860B] text-[#240409] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase font-cinzel flex items-center justify-center gap-2.5 shadow-2xl border border-[#FFF8DC]/60 hover:brightness-110 active:brightness-95 transition-all"
        >
          <Gem className="w-4 h-4 text-[#240409]" />
          <span>Tap To Enter</span>
          <ArrowRight className="w-4 h-4 text-[#240409]" />
        </motion.button>

        <p className="text-[10px] text-amber-200/75 tracking-widest uppercase flex items-center gap-1.5 font-montserrat drop-shadow-xs">
          <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
          Click anywhere to explore showroom
        </p>
      </motion.div>
    </motion.div>
  );
};
