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
      className={`border-t transition-colors mt-16 ${
        darkMode
          ? 'bg-[#0E0B0C] border-zinc-800 text-zinc-300'
          : 'bg-[#23050B] border-amber-950 text-amber-100'
      }`}
    >
      {/* Dynamic Bottom-Most Banner Section */}
      {bottomBanner && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-10 pb-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/30 group">
            <img
              src={bottomBanner.image || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=1200'}
              alt={bottomBanner.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=1200';
              }}
              className="w-full h-60 sm:h-80 object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent p-6 sm:p-12 flex flex-col justify-center max-w-xl text-white">
              {bottomBanner.discountBadge && (
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#2D080E] font-bold text-[11px] sm:text-xs uppercase tracking-widest px-3.5 py-1 rounded-full w-fit mb-3 shadow-md font-cinzel">
                  {bottomBanner.discountBadge}
                </span>
              )}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-playfair text-[#F3E5AB] mb-2.5 leading-tight">
                {bottomBanner.title}
              </h3>
              {bottomBanner.subtitle && (
                <p className="text-xs sm:text-sm text-amber-100/90 mb-5 font-normal leading-relaxed line-clamp-2">
                  {bottomBanner.subtitle}
                </p>
              )}
              {bottomBanner.ctaText && (
                <button
                  onClick={onOpenScheme}
                  className="bg-gradient-to-r from-[#4A0E17] via-[#5A101C] to-[#3B0813] hover:brightness-110 text-[#F3E5AB] font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl border border-[#D4AF37]/50 w-fit flex items-center space-x-2 shadow-luxury active:scale-95 transition-all font-cinzel tracking-wider"
                >
                  <span>{bottomBanner.ctaText}</span>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Guarantee Bar */}
      <div className="border-b border-[#D4AF37]/20 py-8 px-4 lg:px-8 bg-[#33080F]/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-medium">
          {cfg.trustBadges.map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 transition-all">
              {renderBadgeIcon(badge.icon, idx)}
              <strong className="text-[#F3E5AB] font-cinzel text-xs sm:text-sm tracking-wide">{badge.title}</strong>
              <span className="text-[10.5px] text-amber-200/70">{badge.subtitle}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 text-xs">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-cinzel text-[#F3E5AB] flex items-center space-x-2 mb-3 tracking-wider">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>{cfg.brandTitle}</span>
          </h3>
          <p className="text-[11.5px] text-amber-200/80 leading-relaxed mb-5">
            {cfg.brandDescription}
          </p>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-cinzel tracking-wide">{cfg.officialStoreLabel}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#D4AF37] mb-4 font-cinzel">
            {cfg.collectionsTitle}
          </h4>
          <ul className="space-y-2.5 text-amber-200/80">
            {cfg.collectionsList.map((item, idx) => (
              <li key={idx} className="hover:text-white cursor-pointer transition-colors text-[12px]">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#D4AF37] mb-4 font-cinzel">
            {cfg.customerCareTitle}
          </h4>
          <ul className="space-y-2.5 text-amber-200/80 text-[12px]">
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
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#D4AF37] mb-4 font-cinzel">
            {cfg.schemeTitle}
          </h4>
          <p className="text-[11.5px] text-amber-200/80 leading-relaxed mb-4">
            {cfg.schemeDescription}
          </p>
          <div className="bg-gradient-to-r from-[#4A0E17] to-[#2B050D] border border-[#D4AF37]/40 p-3.5 rounded-2xl text-xs text-[#F3E5AB] font-bold text-center font-cinzel tracking-wider shadow-md">
            {cfg.schemeHighlightBox}
          </div>
        </div>
      </div>

      <div className="border-t border-[#D4AF37]/20 py-5 text-center text-[11px] text-amber-300/60 font-cinzel tracking-wider">
        {cfg.copyrightText}
      </div>
    </footer>
  );
};
