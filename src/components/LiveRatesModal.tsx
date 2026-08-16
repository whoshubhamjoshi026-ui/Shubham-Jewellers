import React, { useState } from 'react';
import { GoldRates } from '../types';
import { formatINR } from '../utils/priceCalculator';
import { X, TrendingUp, TrendingDown, ShieldCheck, Sparkles, Calculator, Award, ArrowRight } from 'lucide-react';

interface LiveRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: GoldRates;
  darkMode: boolean;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const LiveRatesModal: React.FC<LiveRatesModalProps> = ({
  isOpen,
  onClose,
  rates,
  darkMode,
  isAdmin,
  onOpenAdmin,
}) => {
  const [calcWeight, setCalcWeight] = useState<number>(10);
  const [calcPurity, setCalcPurity] = useState<'24K' | '22K' | '18K' | 'Silver'>('22K');
  const [calcMaking, setCalcMaking] = useState<number>(12);

  if (!isOpen) return null;

  // Calculate Rate for Estimator
  let baseRatePerGram = rates.gold22k;
  if (calcPurity === '24K') baseRatePerGram = rates.gold24k;
  if (calcPurity === '18K') baseRatePerGram = rates.gold18k;
  if (calcPurity === 'Silver') baseRatePerGram = rates.silver;

  const rawMetalPrice = baseRatePerGram * calcWeight;
  const makingCharge = (rawMetalPrice * calcMaking) / 100;
  const subtotal = rawMetalPrice + makingCharge;
  const gst = Math.round(subtotal * 0.03); // 3% GST
  const estimatedTotal = subtotal + gst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`relative max-w-2xl w-full rounded-2xl border overflow-hidden shadow-2xl flex flex-col max-h-[90vh] ${
          darkMode
            ? 'bg-zinc-900 border-amber-900/60 text-zinc-100'
            : 'bg-[#FAF7F2] border-amber-200 text-amber-950'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A0E17] via-[#5A101C] to-[#3B0813] text-[#F3E5AB] p-5 flex items-center justify-between border-b border-[#D4AF37]/40 relative shadow-md">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-[#F3E5AB] animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-cinzel tracking-wider text-[#F3E5AB]">Today's Live Bullion Rates</h2>
              <p className="text-xs text-amber-200/80 font-normal flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Official Market Rate • Last updated: {rates.lastUpdated}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAdmin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-[#ECC86A] via-[#D4AF37] to-[#B8860B] text-[#2B050D] font-bold text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all font-cinzel shadow-xs"
              >
                Update Rates
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#F3E5AB] hover:bg-white/10 active:scale-90 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Rate Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 24K Gold Card */}
            <div className="p-5 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-br from-amber-50 to-white dark:from-zinc-900 dark:to-[#181214] dark:border-zinc-800 shadow-luxury relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-gradient-to-r from-[#4A0E17] to-[#2B050D] text-[#F3E5AB] font-cinzel border border-[#D4AF37]/40">
                    24K Pure Gold (99.9%)
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-mono text-[#4A0E17] dark:text-[#F3E5AB] mt-2.5">
                    {formatINR(rates.gold24k)}
                    <span className="text-xs text-amber-900/70 dark:text-zinc-400 font-sans font-normal"> /gram</span>
                  </h3>
                  <p className="text-xs font-semibold text-amber-900/90 dark:text-amber-200 mt-1 font-mono">
                    {formatINR(rates.gold24k * 10)} per 10 Grams (1 Tola)
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{rates.trend24k || 0.45}%</span>
                </div>
              </div>
            </div>

            {/* 22K Gold Card */}
            <div className="p-5 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-br from-amber-50 to-white dark:from-zinc-900 dark:to-[#181214] dark:border-zinc-800 shadow-luxury relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-gradient-to-r from-[#4A0E17] to-[#2B050D] text-[#F3E5AB] font-cinzel border border-[#D4AF37]/40">
                    22K Hallmark Gold (91.6% BIS)
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-mono text-[#4A0E17] dark:text-[#F3E5AB] mt-2.5">
                    {formatINR(rates.gold22k)}
                    <span className="text-xs text-amber-900/70 dark:text-zinc-400 font-sans font-normal"> /gram</span>
                  </h3>
                  <p className="text-xs font-semibold text-amber-900/90 dark:text-amber-200 mt-1 font-mono">
                    {formatINR(rates.gold22k * 10)} per 10 Grams
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{rates.trend24k || 0.38}%</span>
                </div>
              </div>
            </div>

            {/* 18K Gold Card */}
            <div className="p-4 sm:p-5 rounded-2xl border border-amber-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-100 dark:bg-zinc-800 text-[#4A0E17] dark:text-[#F3E5AB] font-cinzel">
                    18K Diamond Gold (75.0%)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-mono text-[#4A0E17] dark:text-[#F3E5AB] mt-2">
                    {formatINR(rates.gold18k)}
                    <span className="text-xs text-amber-900/70 dark:text-zinc-400 font-sans font-normal"> /gram</span>
                  </h3>
                  <p className="text-xs text-amber-900/80 dark:text-zinc-400 mt-1 font-mono">
                    {formatINR(rates.gold18k * 10)} per 10 Grams
                  </p>
                </div>
              </div>
            </div>

            {/* 999 Fine Silver Card */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-300 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:text-slate-200 font-cinzel">
                    999 Pure Silver
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-2">
                    {formatINR(rates.silver)}
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-sans font-normal"> /gram</span>
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-mono">
                    {formatINR(rates.silver * 1000)} per 1 KG Bar
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{rates.trendSilver || 0.62}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Custom Gold Value Calculator */}
          <div className="p-5 sm:p-6 rounded-2xl border bg-amber-50/60 dark:bg-[#181214] border-[#D4AF37]/40 shadow-luxury space-y-4">
            <div className="flex items-center space-x-2 text-[#4A0E17] dark:text-[#F3E5AB]">
              <Calculator className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-sm sm:text-base font-bold font-cinzel tracking-wide">Instant Jewellery Value Estimator</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block font-medium mb-1.5 text-zinc-700 dark:text-zinc-300 font-montserrat">
                  Gross Weight (Grams)
                </label>
                <input
                  type="number"
                  min={0.5}
                  step={0.1}
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-amber-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-medium mb-1.5 text-zinc-700 dark:text-zinc-300 font-montserrat">
                  Select Purity
                </label>
                <select
                  value={calcPurity}
                  onChange={(e: any) => setCalcPurity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold"
                >
                  <option value="24K">24K Pure Gold ({formatINR(rates.gold24k)}/g)</option>
                  <option value="22K">22K Hallmark Gold ({formatINR(rates.gold22k)}/g)</option>
                  <option value="18K">18K Diamond Gold ({formatINR(rates.gold18k)}/g)</option>
                  <option value="Silver">999 Pure Silver ({formatINR(rates.silver)}/g)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1.5 text-zinc-700 dark:text-zinc-300 font-montserrat">
                  Making Charges (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={calcMaking}
                  onChange={(e) => setCalcMaking(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-amber-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono font-bold"
                />
              </div>
            </div>

            {/* Price Estimation Breakdown */}
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-200/80 dark:border-zinc-800 space-y-2.5 text-xs shadow-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Metal Cost ({calcWeight}g @ {formatINR(baseRatePerGram)}/g):</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {formatINR(rawMetalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Making Charges ({calcMaking}%):</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {formatINR(makingCharge)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>3% Indian GST:</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {formatINR(gst)}
                </span>
              </div>
              <div className="flex justify-between pt-2.5 border-t border-[#D4AF37]/30 font-bold text-sm text-[#4A0E17] dark:text-[#F3E5AB]">
                <span className="font-cinzel tracking-wider">Estimated Total:</span>
                <span className="font-sans font-extrabold text-base">{formatINR(estimatedTotal)}</span>
              </div>
            </div>
          </div>

          {/* BIS Certification Assurance Footer */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs flex items-center space-x-3">
            <Award className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <strong className="block text-emerald-950 dark:text-emerald-200 font-serif">
                100% BIS Hallmarked Certified Guarantee
              </strong>
              <p className="text-emerald-800/80 dark:text-emerald-400 text-[11px] mt-0.5">
                Every Shubham Jewellers article carries six-digit HUID (Hallmark Unique Identification) code stamped by Govt-approved assaying centres.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
