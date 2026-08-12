import React, { useState, useEffect } from 'react';
import { GoldRates, UserProfile } from '../types';
import { formatINR } from '../utils/priceCalculator';
import { getApiUrl } from '../utils/safeFetch';
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
    <header className="sticky top-0 z-40 shadow-md">
      {/* Main Header Navigation */}
      <div
        className={`${
          darkMode
            ? 'bg-black text-amber-50 border-b border-zinc-900'
            : 'bg-white text-amber-950 border-b border-amber-200/80'
        } px-3 sm:px-4 lg:px-8 py-2 transition-colors duration-200`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Group 3-Line Hamburger Menu & Brand Logo together */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 3-Line Hamburger Menu Button */}
            <button
              onClick={onOpenSideDrawer}
              className="p-1.5 text-[#4A0E17] dark:text-[#D4AF37] hover:scale-105 transition-transform shrink-0 bg-transparent border-0 outline-none"
              title="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Clean Typography Brand Name - Positioned right next to hamburger menu */}
            <button
              onClick={handleLogoClick}
              className="flex flex-col text-left focus:outline-none relative py-0.5 shrink-0 hover:opacity-90 transition-opacity"
              title="Shubham Jewellers"
            >
              <span className="text-base sm:text-lg lg:text-xl font-extrabold tracking-wider text-[#4A0E17] dark:text-[#D4AF37] font-serif leading-none uppercase">
                SHUBHAM
              </span>
              <span className="text-[9px] sm:text-[10px] font-black tracking-[0.28em] text-amber-900 dark:text-amber-300 font-sans leading-tight uppercase">
                JEWELLERS
              </span>
            </button>
          </div>

          {/* Search Bar on Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-2 lg:mx-4">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-700/60 dark:text-amber-400/60" />
            <input
              type="text"
              placeholder="Search Gold, Diamond, Kundan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-10 py-1.5 text-xs rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                darkMode
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500'
                  : 'bg-zinc-50 border-amber-200 text-amber-950 placeholder-amber-800/50'
              }`}
            />
            {onOpenVisualSearch && (
              <button
                type="button"
                onClick={onOpenVisualSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#4A0E17] dark:text-[#D4AF37] hover:scale-110 transition-transform"
                title="Camera Visual Search"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Top Dashboard Header Icons - Exactly the 4 requested icons */}
          <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
            {/* 1. Jewellery Search Icon */}
            <button
              onClick={onOpenVisualSearch}
              className="p-1.5 text-[#4A0E17] dark:text-[#D4AF37] hover:opacity-75 transition-opacity bg-transparent"
              title="Jewellery Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* 2. My Cart / Shopping Bag Icon */}
            <button
              onClick={onOpenCart}
              className="p-1.5 text-[#4A0E17] dark:text-[#D4AF37] hover:opacity-75 transition-opacity relative bg-transparent"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#4A0E17] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 3. View Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="p-1.5 text-rose-600 dark:text-rose-400 hover:opacity-75 transition-opacity relative bg-transparent"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 4. About Icon */}
            <button
              onClick={onOpenAbout}
              className="p-1.5 text-[#4A0E17] dark:text-[#D4AF37] hover:opacity-75 transition-opacity bg-transparent"
              title="About Us & Company Details"
            >
              <Building2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-700/60" />
            <input
              type="text"
              placeholder="Search Jewellery catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-full border ${
                darkMode
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                  : 'bg-white border-amber-200 text-amber-950 placeholder-amber-800/50'
              }`}
            />
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

