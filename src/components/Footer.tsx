import React from 'react';
import { Award, ShieldCheck, Truck, RotateCcw, MapPin, Phone, Mail, Sparkles } from 'lucide-react';
import { BottomBanner, FooterConfig } from '../types';

interface FooterProps {
  darkMode: boolean;
  bottomBanner?: BottomBanner;
  footerConfig?: FooterConfig;
  onOpenScheme?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ darkMode, bottomBanner, footerConfig, onOpenScheme }) => {
  const cfg = {
    trustBadges: footerConfig?.trustBadges && footerConfig.trustBadges.length > 0 ? footerConfig.trustBadges : [
      { title: '100% BIS Hallmarked', subtitle: 'Certified 22K & 18K Pure Gold', icon: 'Award' },
      { title: 'Lifetime Buyback', subtitle: 'Guaranteed Valuation at Market Rate', icon: 'ShieldCheck' },
      { title: '15-Day Easy Exchange', subtitle: 'Hassle-free return & exchange', icon: 'RotateCcw' },
      { title: 'Insured Free Shipping', subtitle: 'Safe door delivery across India', icon: 'Truck' },
    ],
    brandTitle: footerConfig?.brandTitle || 'SHUBHAM JEWELLERS',
    brandDescription: footerConfig?.brandDescription || "Inspired by royal Indian heritage and Tanishq's fine craftsmanship. Bringing you authentic certified gold, diamond solitaires, and silver ornaments since 1984.",
    officialStoreLabel: footerConfig?.officialStoreLabel || 'Official Authorised Store',
    collectionsTitle: footerConfig?.collectionsTitle || 'Collections & Categories',
    collectionsList: footerConfig?.collectionsList && footerConfig.collectionsList.length > 0 ? footerConfig.collectionsList : [
      'Royal Kundan Bridal Necklaces',
      'Solitaire Diamond Rings',
      '24K Pure Gold Coins (Lakshmi Ganesh)',
      'Temple Antique Bangle Kadas',
      '925 Sterling Silver Payal',
    ],
    customerCareTitle: footerConfig?.customerCareTitle || 'Customer Care & Store',
    tollFreeText: footerConfig?.tollFreeText || 'Toll Free: 1800-888-GOLD (4653)',
    careEmail: footerConfig?.careEmail || 'care@shubhamjewellers.com',
    storeAddress: footerConfig?.storeAddress || 'Royal Flagship Store: MG Road, Heritage District, Mumbai - 400001',
    schemeTitle: footerConfig?.schemeTitle || 'Shubham Swarna Scheme',
    schemeDescription: footerConfig?.schemeDescription || 'Join our 11-month gold savings scheme and get 1 FREE month bonus installment on maturity.',
    schemeHighlightBox: footerConfig?.schemeHighlightBox || 'Pay 10 Installments • Get 11th Free',
    copyrightText: footerConfig?.copyrightText || '© 2026 Shubham Jewellers. All Rights Reserved. Inspired by Tanishq fine jewellery.',
  };

  const renderBadgeIcon = (iconName?: string, index: number = 0) => {
    const className = "w-6 h-6 text-[#D4AF37]";
    const key = iconName?.toLowerCase() || '';
    if (key.includes('award')) return <Award className={className} />;
    if (key.includes('shield')) return <ShieldCheck className={className} />;
    if (key.includes('rotate') || key.includes('exchange')) return <RotateCcw className={className} />;
    if (key.includes('truck') || key.includes('ship')) return <Truck className={className} />;
    
    // Default by index
    if (index === 0) return <Award className={className} />;
    if (index === 1) return <ShieldCheck className={className} />;
    if (index === 2) return <RotateCcw className={className} />;
    return <Truck className={className} />;
  };

  return (
    <footer
      className={`border-t transition-colors mt-12 ${
        darkMode
          ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
          : 'bg-[#2D080E] border-amber-900 text-amber-100'
      }`}
    >
      {/* Dynamic Bottom-Most Banner Section */}
      {bottomBanner && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-4">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-300/40 dark:border-amber-500/20 group">
            <img
              src={bottomBanner.image}
              alt={bottomBanner.title}
              referrerPolicy="no-referrer"
              className="w-full h-52 sm:h-72 object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent p-6 sm:p-10 flex flex-col justify-center max-w-xl text-white">
              {bottomBanner.discountBadge && (
                <span className="bg-[#D4AF37] text-[#2D080E] font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-2 shadow-sm">
                  {bottomBanner.discountBadge}
                </span>
              )}
              <h3 className="text-xl sm:text-3xl font-extrabold font-serif text-[#D4AF37] mb-2 leading-tight">
                {bottomBanner.title}
              </h3>
              {bottomBanner.subtitle && (
                <p className="text-xs sm:text-sm text-amber-100/90 mb-4 line-clamp-2">
                  {bottomBanner.subtitle}
                </p>
              )}
              {bottomBanner.ctaText && (
                <button
                  onClick={onOpenScheme}
                  className="bg-[#7A1C28] hover:bg-[#6B1423] text-[#D4AF37] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-[#D4AF37]/40 w-fit flex items-center space-x-2 shadow-lg transition-all"
                >
                  <span>{bottomBanner.ctaText}</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Guarantee Bar */}
      <div className="border-b border-amber-900/60 py-6 px-4 lg:px-8 bg-[#4A0E17]/60">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs font-medium">
          {cfg.trustBadges.map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1 p-2">
              {renderBadgeIcon(badge.icon, idx)}
              <strong className="text-[#D4AF37] font-serif text-sm">{badge.title}</strong>
              <span className="text-[10px] text-amber-200/80">{badge.subtitle}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        <div>
          <h3 className="text-base font-bold font-serif text-[#D4AF37] flex items-center space-x-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>{cfg.brandTitle}</span>
          </h3>
          <p className="text-[11px] text-amber-200/80 leading-relaxed mb-4">
            {cfg.brandDescription}
          </p>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>{cfg.officialStoreLabel}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#D4AF37] mb-3">
            {cfg.collectionsTitle}
          </h4>
          <ul className="space-y-2 text-amber-200/80">
            {cfg.collectionsList.map((item, idx) => (
              <li key={idx} className="hover:text-white cursor-pointer transition-colors">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#D4AF37] mb-3">
            {cfg.customerCareTitle}
          </h4>
          <ul className="space-y-2 text-amber-200/80">
            <li className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{cfg.tollFreeText}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{cfg.careEmail}</span>
            </li>
            <li className="flex items-start space-x-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] mt-0.5 shrink-0" />
              <span>{cfg.storeAddress}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#D4AF37] mb-3">
            {cfg.schemeTitle}
          </h4>
          <p className="text-[11px] text-amber-200/80 leading-relaxed mb-3">
            {cfg.schemeDescription}
          </p>
          <div className="bg-[#4A0E17] border border-[#D4AF37]/40 p-3 rounded-xl text-[11px] text-[#D4AF37] font-bold text-center">
            {cfg.schemeHighlightBox}
          </div>
        </div>
      </div>

      <div className="border-t border-amber-900/60 py-4 text-center text-[11px] text-amber-300/60">
        {cfg.copyrightText}
      </div>
    </footer>
  );
};
