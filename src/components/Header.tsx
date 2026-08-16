import React, { useState, useEffect } from 'react';
import { GoldRates, UserProfile } from '../types';
import { formatINR } from '../utils/priceCalculator';
import { getApiUrl } from '../utils/safeFetch';
import { ShubhamLogo } from './ShubhamLogo';
import {
  Sun,
  Moon,
  Search,
  Heart,
  ShoppingBag,
  User,
  ShieldCheck,
  Sparkles,
  Settings,
  Camera,
  PiggyBank,
  MessageCircle,
  KeyRound,
  TrendingUp,
  ShieldAlert,
  Menu,
  Building2,
  Info,
} from 'lucide-react';

interface HeaderProps {
  rates: GoldRates;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  cartCount: number;
  wishlistCount: number;
  onOpenAdmin: () => void;
  onOpenScheme: () => void;
  onOpenWhatsApp: () => void;
  onOpenLiveRates: () => void;
  onOpenSideDrawer: () => void;
  onOpenVisualSearch?: () => void;
  onOpenAbout: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  rates,
  darkMode,
  setDarkMode,
  searchTerm,
  setSearchTerm,
  user,
  onOpenAuth,
  onOpenWishlist,
  onOpenCart,
  cartCount,
  wishlistCount,
  onOpenAdmin,
  onOpenScheme,
  onOpenWhatsApp,
  onOpenLiveRates,
  onOpenSideDrawer,
  onOpenVisualSearch,
  onOpenAbout,
  activeSection,
  setActiveSection,
  isAdmin,
  setIsAdmin,
}) => {
  // Secret 5-Tap State for Invisible Admin Access
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [secretModalOpen, setSecretModalOpen] = useState(false);
  const [secretPin, setSecretPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Countdown timer for PIN lockout
  useEffect(() => {
    if (!lockoutTime) return;
    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= lockoutTime) {
        setLockoutTime(0);
        setFailedAttempts(0);
        setPinError('');
      } else {
        const secs = Math.ceil((lockoutTime - now) / 1000);
        setPinError(`Too many failed attempts. Access locked out for ${secs}s.`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleLogoClick = () => {
    setActiveSection('catalog');
    const newCount = logoTapCount + 1;
    setLogoTapCount(newCount);

    if (newCount >= 5) {
      setLogoTapCount(0);
      setSecretModalOpen(true);
    } else {
      setTimeout(() => setLogoTapCount(0), 3000);
    }
  };

  const handleSecretUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretPin) return;

    const now = Date.now();
    if (lockoutTime && lockoutTime > now) {
      const secs = Math.ceil((lockoutTime - now) / 1000);
      setPinError(`Too many failed attempts. Access locked out for ${secs}s.`);
      return;
    }

    setPinError('');
    setPinLoading(true);

    const cleanPin = secretPin.trim();

    try {
      const res = await fetch(getApiUrl('/api/admin/verify-pin'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: cleanPin }),
      });

      const contentType = res.headers.get('content-type') || '';
      
      // Verify response is JSON to prevent HTML SPA fallback parse errors
      if (contentType.includes('application/json')) {
        const text = await res.text();
        if (text && !text.trim().startsWith('<')) {
          const data = JSON.parse(text);
          setPinLoading(false);

          if (data.success) {
            setFailedAttempts(0);
            setIsAdmin(true);
            setSecretModalOpen(false);
            setSecretPin('');
            setPinError('');
            onOpenAdmin();
            return;
          } else if (data.lockout) {
            const lockoutUntil = now + (data.remainingSeconds || 60) * 1000;
            setLockoutTime(lockoutUntil);
            setFailedAttempts(3);
            setPinError(`3 incorrect attempts. Access locked out for ${data.remainingSeconds || 60} seconds.`);
            return;
          } else {
            const msg = data.message || 'Invalid Admin Passcode.';
            setPinError(msg);
            return;
          }
        }
      }
      
      // Response was not JSON (e.g. backend unreachable or static host HTML fallback)
      setPinLoading(false);
      setPinError('Admin verification service unavailable. Please ensure the backend server is running and try again.');
    } catch (err: any) {
      setPinLoading(false);
      setPinError('Admin verification service unavailable. Please check your connection or server status.');
    }
  };

  return (
    <header className="sticky top-0 z-40 shadow-luxury transition-all duration-300">
      {/* Main Header Navigation */}
      <div
        className={`${
          darkMode
            ? 'bg-[#120E0F]/95 backdrop-blur-md text-amber-50 border-b border-[#D4AF37]/20'
            : 'bg-[#FAF8F5]/95 backdrop-blur-md text-amber-950 border-b border-[#D4AF37]/30'
        } px-2 sm:px-4 lg:px-8 py-2 sm:py-2.5 transition-colors duration-300 w-full overflow-hidden`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-4">
          {/* Group 3-Line Hamburger Menu & Brand Logo together */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink min-w-0">
            {/* 3-Line Hamburger Menu Button */}
            <button
              onClick={onOpenSideDrawer}
              className="p-1.5 sm:p-2 rounded-lg text-[#4A0E17] dark:text-[#D4AF37] hover:bg-amber-500/10 active:scale-95 transition-all shrink-0 outline-none"
              title="Open Menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Clean Typography Brand Name - Luxury royal jewelry typography with emblem */}
            <button
              onClick={handleLogoClick}
              className="group flex items-center space-x-1.5 sm:space-x-2 text-left focus:outline-none relative py-0.5 shrink min-w-0 transition-transform active:scale-98"
              title="Shubham Jewellers - Royal Crafts"
            >
              <div className="shrink-0">
                <ShubhamLogo size="sm" animated={false} showRings={false} className="scale-85 sm:scale-100 shadow-xs" />
              </div>
              <div className="flex flex-col min-w-0 truncate">
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-base lg:text-xl font-bold tracking-[0.08em] sm:tracking-[0.12em] text-[#4A0E17] dark:text-[#F3E5AB] font-cinzel leading-none uppercase drop-shadow-xs truncate">
                    SHUBHAM
                  </span>
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37] animate-sparkle opacity-80 group-hover:opacity-100 shrink-0" />
                </div>
                <span className="text-[7px] sm:text-[9.5px] font-semibold tracking-[0.2em] sm:tracking-[0.32em] text-amber-800 dark:text-[#D4AF37]/90 font-montserrat leading-tight uppercase mt-0.5 truncate">
                  JEWELLERS
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar on Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-2 lg:mx-4">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800/60 dark:text-amber-300/60" />
            <input
              type="text"
              placeholder="Search Royal Gold, Solitaires, Polki, Kundan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-10 py-2 text-xs rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent ${
                darkMode
                  ? 'bg-zinc-900/80 border-zinc-700/80 text-zinc-100 placeholder-zinc-400 focus:bg-zinc-900'
                  : 'bg-white/90 border-amber-200/90 text-amber-950 placeholder-amber-800/50 shadow-xs focus:bg-white'
              }`}
            />
            {onOpenVisualSearch && (
              <button
                type="button"
                onClick={onOpenVisualSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#4A0E17] dark:text-[#D4AF37] hover:scale-110 active:scale-95 transition-all"
                title="Camera Visual Search"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Top Dashboard Header Icons - Contained with precise sizing and shrink-0 so About icon is NEVER out of frame */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

            {/* 2. My Cart / Shopping Bag Icon */}
            <button
              onClick={onOpenCart}
              className="p-1.5 sm:p-2 rounded-full text-[#4A0E17] dark:text-[#D4AF37] hover:bg-amber-500/10 active:scale-90 transition-all relative shrink-0"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7A1E] text-[#2A050D] text-[9px] sm:text-[10px] font-extrabold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 3. View Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="p-1.5 sm:p-2 rounded-full text-rose-700 dark:text-rose-400 hover:bg-rose-500/10 active:scale-90 transition-all relative shrink-0"
              title="View Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 4. About Store Icon */}
            <button
              onClick={onOpenAbout}
              className="p-1.5 sm:p-2 rounded-full text-[#4A0E17] dark:text-[#D4AF37] hover:bg-amber-500/10 active:scale-90 transition-all shrink-0"
              title="About Shubham Jewellers"
            >
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - With Search icon on left and Camera button on right */}
        <div className="mt-2.5 md:hidden">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800/60 dark:text-amber-400/60 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Gold, Solitaires, Polki, Kundan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-10 py-2 text-xs rounded-full border transition-all ${
                darkMode
                  ? 'bg-zinc-900 border-zinc-700/80 text-zinc-100 placeholder-zinc-400 focus:border-[#D4AF37]'
                  : 'bg-white border-amber-200 text-amber-950 placeholder-amber-800/50 shadow-xs focus:border-[#D4AF37]'
              }`}
            />
            {onOpenVisualSearch && (
              <button
                type="button"
                onClick={onOpenVisualSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#4A0E17] dark:text-[#D4AF37] hover:scale-110 active:scale-95 transition-all"
                title="Camera Visual Search"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Secret Invisible Admin Passcode Modal Triggered by 5-Taps on Logo */}
      {secretModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#FAF7F2] dark:bg-zinc-900 border-2 border-[#D4AF37] rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-amber-950 dark:text-zinc-100">
            <button
              onClick={() => setSecretModalOpen(false)}
              className="absolute top-3 right-3 text-amber-700 hover:text-amber-900 dark:text-amber-300 font-bold"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-[#4A0E17] dark:text-[#D4AF37]">
                Owner & Admin Access
              </h3>
              <p className="text-xs text-amber-900/80 dark:text-zinc-400">
                Hidden Security Passcode required to access inventory & live rate controls.
              </p>
            </div>

            <form onSubmit={handleSecretUnlock} className="mt-4 space-y-3">
              {pinError && (
                <p className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/50 p-2 rounded text-center border border-rose-200">
                  {pinError}
                </p>
              )}

              <div>
                <label className="block text-xs font-bold mb-1">Enter Secret PIN</label>
                <input
                  type="password"
                  value={secretPin}
                  onChange={(e) => setSecretPin(e.target.value)}
                  placeholder="••••"
                  className="w-full p-2.5 text-center text-lg font-mono font-bold tracking-widest rounded-xl border border-amber-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={pinLoading}
                className="w-full py-2.5 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#6B1423] shadow disabled:opacity-50 transition-all"
              >
                {pinLoading ? 'Verifying...' : 'Unlock Shop Admin'}
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

