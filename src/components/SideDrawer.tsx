import React, { useState } from 'react';
import { UserProfile, CategoryItem, DrawerConfig } from '../types';
import {
  ArrowLeft,
  User,
  ShoppingBag,
  Gift,
  Crown,
  PiggyBank,
  MessageCircle,
  Moon,
  Sun,
  LogOut,
  LogIn,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  KeyRound,
  Grid,
  Info,
  Building2,
} from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onSelectCategoryFilter: (cat: string) => void;
  onSelectGenderFilter: (gender: 'Men' | 'Women' | 'Kids' | 'All') => void;
  onOpenScheme: () => void;
  onOpenWhatsApp: () => void;
  onOpenOrders: () => void;
  onOpenAbout: () => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  customCategories?: (CategoryItem | string)[];
  drawerConfig?: DrawerConfig;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
  onLogout,
  darkMode,
  setDarkMode,
  onSelectCategoryFilter,
  onSelectGenderFilter,
  onOpenScheme,
  onOpenWhatsApp,
  onOpenOrders,
  onOpenAbout,
  isAdmin,
  onOpenAdmin,
  customCategories = [],
  drawerConfig,
}) => {
  if (!isOpen) return null;

  const cfg = {
    headerTitle: drawerConfig?.headerTitle || 'SHUBHAM JEWELLERS',
    welcomeSubtitle: drawerConfig?.welcomeSubtitle || 'Welcome to Shubham Jewellers',
    aboutBtnText: drawerConfig?.aboutBtnText || 'About Us & Showroom Info',
    schemeBtnTitle: drawerConfig?.schemeBtnTitle || 'Jewellery Savings Plan',
    whatsappBtnTitle: drawerConfig?.whatsappBtnTitle || 'Direct WhatsApp Support',
    categorySectionTitle: drawerConfig?.categorySectionTitle || 'Shop By Category',
    shopForSectionTitle: drawerConfig?.shopForSectionTitle || 'Shop For',
    footerTagline: drawerConfig?.footerTagline || 'Shubham Jewellers v2.1.0 • Verified BIS Hallmarked',
  };

  const getGreetingName = () => {
    if (!user.isLoggedIn) return 'Shubham';
    if (user.name && user.name.trim() && !user.name.toLowerCase().includes('valued')) {
      return user.name.split(' ')[0];
    }
    if (user.email) {
      const emailPrefix = user.email.split('@')[0] || '';
      if (emailPrefix) {
        return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      }
    }
    return 'Customer';
  };

  const customerFirstName = getGreetingName();

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Drawer Panel - Pure White (#FFFFFF) background for Light Mode, Deep Black (#121212) for Dark Mode */}
      <div
        className="relative w-4/5 max-w-sm bg-white dark:bg-[#121212] text-zinc-900 dark:text-zinc-100 h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto no-scrollbar border-r border-zinc-200 dark:border-zinc-800"
      >
        {/* Upper Header Card */}
        <div className="bg-white dark:bg-[#121212]">
          {/* Top Back Arrow Button Row */}
          <div className="pt-4 px-4 flex justify-between items-center bg-white dark:bg-[#121212]">
            <span className="font-serif font-extrabold text-sm text-[#4A0E17] dark:text-[#D4AF37] tracking-wider uppercase">
              {cfg.headerTitle}
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-amber-300 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-xs"
              title="Close Menu"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Header Box */}
          <div className="px-5 pt-4 pb-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs mb-3">
            <div className="flex items-center space-x-3">
              {/* Profile Avatar & Name */}
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/20 text-[#4A0E17] dark:text-[#D4AF37] border border-amber-300 dark:border-amber-500/40 flex items-center justify-center shrink-0 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={customerFirstName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-extrabold text-lg leading-tight text-zinc-950 dark:text-zinc-100">
                  Hi {customerFirstName}!
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold mt-0.5">
                  {user.isLoggedIn ? user.email : cfg.welcomeSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Account & Feature Cards */}
          <div className="px-4 space-y-3 bg-white dark:bg-[#121212]">
            {/* About Quick Action Button */}
            <div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAbout();
                }}
                className="w-full p-3 bg-amber-50 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 text-amber-950 dark:text-amber-200 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border border-amber-200 dark:border-zinc-700 shadow-xs transition-all active:scale-95"
              >
                <Building2 className="w-4 h-4 text-[#4A0E17] dark:text-[#D4AF37]" />
                <span>{cfg.aboutBtnText}</span>
              </button>
            </div>

            {/* Card 1: My Profile & Order History */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full p-3.5 flex items-center justify-between bg-white dark:bg-zinc-900 hover:bg-amber-50 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-100"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-zinc-950 dark:text-zinc-100">My Profile</span>
                  <span className="bg-amber-200 dark:bg-amber-900/50 text-[#4A0E17] dark:text-amber-200 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                    New
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenOrders();
                }}
                className="w-full p-3.5 flex items-center justify-between bg-white dark:bg-zinc-900 hover:bg-amber-50 dark:hover:bg-zinc-800 transition-colors text-zinc-950 dark:text-zinc-100"
              >
                <span className="font-bold text-xs text-zinc-950 dark:text-zinc-100">Order History</span>
                <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>

            {/* Card 2: Shop By Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 shadow-xs">
              <h4 className="px-3 pt-2 pb-1 font-serif font-extrabold text-sm text-[#4A0E17] dark:text-[#D4AF37]">
                {cfg.categorySectionTitle}
              </h4>

              <div className="space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => {
                    onClose();
                    onSelectCategoryFilter('All');
                  }}
                  className="w-full p-2.5 rounded-xl flex items-center justify-between hover:bg-amber-50 dark:hover:bg-zinc-800 transition-colors text-left text-zinc-950 dark:text-zinc-100 font-bold"
                >
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>All Jewellery</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                </button>

                {customCategories.map((item, idx) => {
                  const catName = typeof item === 'string' ? item : item.name;
                  const catImg = typeof item === 'object' ? item.image : undefined;

                  return (
                    <button
                      key={typeof item === 'object' ? (item.id ? `drawer-cat-${item.id}` : `drawer-cat-${idx}`) : `drawer-cat-${catName}-${idx}`}
                      onClick={() => {
                        onClose();
                        onSelectCategoryFilter(catName);
                      }}
                      className="w-full p-2.5 rounded-xl flex items-center justify-between hover:bg-amber-50 dark:hover:bg-zinc-800 transition-colors text-left text-zinc-950 dark:text-zinc-100 font-bold"
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        {catImg ? (
                          <img
                            src={catImg}
                            alt={catName}
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full object-cover border border-amber-300 dark:border-amber-500/40 shrink-0"
                          />
                        ) : (
                          <Crown className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                        )}
                        <span className="truncate">{catName}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0 ml-1" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card 3: Shop For Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 shadow-xs">
              <h4 className="px-3 pt-2 pb-1 font-serif font-extrabold text-sm text-[#4A0E17] dark:text-[#D4AF37]">
                {cfg.shopForSectionTitle}
              </h4>

              <div className="space-y-0.5 text-xs font-semibold">
                {[
                  { label: 'Men', gender: 'Men' as const },
                  { label: 'Women', gender: 'Women' as const },
                  { label: 'Kids', gender: 'Kids' as const },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      onClose();
                      onSelectGenderFilter(item.gender);
                    }}
                    className="w-full p-3 rounded-xl flex items-center justify-between hover:bg-amber-50 dark:hover:bg-zinc-800 transition-colors text-left text-zinc-950 dark:text-zinc-100 font-bold"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Savings Scheme & WhatsApp Quick Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenScheme();
                }}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#4A0E17] to-[#6B1423] text-[#D4AF37] font-bold text-xs flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center space-x-2">
                  <PiggyBank className="w-4 h-4 text-[#D4AF37]" />
                  <span>{cfg.schemeBtnTitle}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenWhatsApp();
                }}
                className="w-full p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 font-bold text-xs flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{cfg.whatsappBtnTitle}</span>
                </div>
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="w-full p-3.5 rounded-2xl bg-amber-500 text-[#4A0E17] font-extrabold text-xs flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4" />
                    <span>Admin Control Suite</span>
                  </div>
                  <span className="text-[10px] bg-[#4A0E17] text-[#D4AF37] px-2 py-0.5 rounded font-black">
                    ACTIVE
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer Login/Logout */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-4 text-zinc-950 dark:text-zinc-100">
          <div className="flex items-center justify-between mb-3 px-2 text-xs font-bold text-zinc-950 dark:text-zinc-100">
            <span>Dark Theme</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-full bg-amber-100 dark:bg-zinc-800 text-amber-950 dark:text-amber-300"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {user.isLoggedIn ? (
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Account</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="w-full py-2.5 px-4 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded-xl shadow hover:bg-[#6B1423] flex items-center justify-center space-x-2 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Gmail OTP</span>
            </button>
          )}

          <p className="text-[10px] text-center text-zinc-600 dark:text-zinc-400 mt-2 font-mono font-semibold">
            {cfg.footerTagline}
          </p>
        </div>
      </div>
    </div>
  );
};
