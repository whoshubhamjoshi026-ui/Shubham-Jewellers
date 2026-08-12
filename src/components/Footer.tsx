import React from 'react';
import { Award, ShieldCheck, Truck, RotateCcw, MapPin, Phone, Mail, Sparkles } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ darkMode }) => {
  return (
    <footer
      className={`border-t transition-colors mt-12 ${
        darkMode
          ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
          : 'bg-[#2D080E] border-amber-900 text-amber-100'
      }`}
    >
      {/* Top Guarantee Bar */}
      <div className="border-b border-amber-900/60 py-6 px-4 lg:px-8 bg-[#4A0E17]/60">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs font-medium">
          <div className="flex flex-col items-center space-y-1 p-2">
            <Award className="w-6 h-6 text-[#D4AF37]" />
            <strong className="text-[#D4AF37] font-serif text-sm">100% BIS Hallmarked</strong>
            <span className="text-[10px] text-amber-200/80">Certified 22K & 18K Pure Gold</span>
          </div>

          <div className="flex flex-col items-center space-y-1 p-2">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
            <strong className="text-[#D4AF37] font-serif text-sm">Lifetime Buyback</strong>
            <span className="text-[10px] text-amber-200/80">Guaranteed Valuation at Market Rate</span>
          </div>

          <div className="flex flex-col items-center space-y-1 p-2">
            <RotateCcw className="w-6 h-6 text-[#D4AF37]" />
            <strong className="text-[#D4AF37] font-serif text-sm">15-Day Easy Exchange</strong>
            <span className="text-[10px] text-amber-200/80">Hassle-free return & exchange</span>
          </div>

          <div className="flex flex-col items-center space-y-1 p-2">
            <Truck className="w-6 h-6 text-[#D4AF37]" />
            <strong className="text-[#D4AF37] font-serif text-sm">Insured Free Shipping</strong>
            <span className="text-[10px] text-amber-200/80">Safe door delivery across India</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        <div>
          <h3 className="text-base font-bold font-serif text-[#D4AF37] flex items-center space-x-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>SHUBHAM JEWELLERS</span>
          </h3>
          <p className="text-[11px] text-amber-200/80 leading-relaxed mb-4">
            Inspired by royal Indian heritage and Tanishq's fine craftsmanship. Bringing you authentic certified gold, diamond solitaires, and silver ornaments since 1984.
          </p>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Authorised Store</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#D4AF37] mb-3">
            Collections & Categories
          </h4>
          <ul className="space-y-2 text-amber-200/80">
            <li className="hover:text-white cursor-pointer transition-colors">Royal Kundan Bridal Necklaces</li>
            <li className="hover:text-white cursor-pointer transition-colors">Solitaire Diamond Rings</li>
            <li className="hover:text-white cursor-pointer transition-colors">24K Pure Gold Coins (Lakshmi Ganesh)</li>
            <li className="hover:text-white cursor-pointer transition-colors">Temple Antique Bangle Kadas</li>
            <li className="hover:text-white cursor-pointer transition-colors">925 Sterling Silver Payal</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#D4AF37] mb-3">
            Customer Care & Store
          </h4>
          <ul className="space-y-2 text-amber-200/80">
            <li className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Toll Free: 1800-888-GOLD (4653)</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>care@shubhamjewellers.com</span>
            </li>
            <li className="flex items-start space-x-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] mt-0.5 shrink-0" />
              <span>Royal Flagship Store: MG Road, Heritage District, Mumbai - 400001</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#D4AF37] mb-3">
            Shubham Swarna Scheme
          </h4>
          <p className="text-[11px] text-amber-200/80 leading-relaxed mb-3">
            Join our 11-month gold savings scheme and get 1 FREE month bonus installment on maturity.
          </p>
          <div className="bg-[#4A0E17] border border-[#D4AF37]/40 p-3 rounded-xl text-[11px] text-[#D4AF37] font-bold text-center">
            Pay 10 Installments • Get 11th Free
          </div>
        </div>
      </div>

      <div className="border-t border-amber-900/60 py-4 text-center text-[11px] text-amber-300/60">
        © 2026 Shubham Jewellers. All Rights Reserved. Inspired by Tanishq fine jewellery.
      </div>
    </footer>
  );
};
