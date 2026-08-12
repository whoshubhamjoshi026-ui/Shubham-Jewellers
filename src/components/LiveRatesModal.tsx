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
        <div className="bg-gradient-to-r from-[#4A0E17] via-[#6B1423] to-[#4A0E17] text-[#D4AF37] p-5 flex items-center justify-between border-b border-[#D4AF37]/40 relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif tracking-tight">Today's Live Bullion Rates</h2>
              <p className="text-xs text-amber-200/90 font-light flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
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
                className="px-2.5 py-1 bg-[#D4AF37] text-[#4A0E17] font-bold text-xs rounded-lg hover:bg-amber-400 transition-colors"
              >
                Update Rates
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#D4AF37] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Rate Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 24K Gold Card */}
            <div className="p-4 rounded-xl border border-amber-300/80 bg-gradient-to-br from-amber-100/60 to-white dark:from-zinc-800 dark:to-zinc-900 dark:border-amber-900/50 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#4A0E17] text-[#D4AF37]">
                    24K Pure Gold (99.9%)
                  </span>
                  <h3 className="text-2xl font-black font-mono text-[#4A0E17] dark:text-[#D4AF37] mt-2">
                    {formatINR(rates.gold24k)}
                    <span className="text-xs text-amber-900/70 dark:text-zinc-400 font-normal"> /gram</span>
                  </h3>
                  <p className="text-xs font-semibold text-amber-900/90 dark:text-amber-200 mt-1">
                    {formatINR(rates.gold24k * 10)} per 10 Grams (1 Tola)
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{rates.trend24k || 0.45}%</span>
                </div>
              </div>
            </div>

            {/* 22K Gold Card */}
            <div className="p-4 rounded-xl border border-amber-300/80 bg-gradient-to-br from-amber-100/60 to-white dark:from-zinc-800 dark:to-zinc-900 dark:border-amber-900/50 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#4A0E17] text-[#D4AF37]">
                    22K Jewellery Gold (91.6% BIS)
                  </span>
                  <h3 className="text-2xl font-black font-mono text-[#4A0E17] dark:text-[#D4AF37] mt-2">
                    {formatINR(rates.gold22k)}
                    <span className="text-xs text-amber-900/70 dark:text-zinc-400 font-normal"> /gram</span>
                  </h3>
                  <p className="text-xs font-semibold text-amber-900/90 dark:text-amber-200 mt-1">
                    {formatINR(rates.gold22k * 10)} per 10 Grams
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{rates.trend24k || 0.38}%</span>
                </div>
              </div>
            </div>

            {/* 18K Gold Card */}
            <div className="p-4 rounded-xl border border-amber-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-950 dark:bg-zinc-700 dark:text-amber-300">
                    18K Diamond Jewellery (75.0%)
                  </span>
                  <h3 className="text-xl font-bold font-mono text-[#4A0E17] dark:text-[#D4AF37] mt-2">
                    {formatINR(rates.gold18k)}
                    <span className="text-xs text-amber-900/70 dark:text-zinc-400 font-normal"> /gram</span>
                  </h3>
                  <p className="text-xs text-amber-900/80 dark:text-zinc-400 mt-1">
                    {formatINR(rates.gold18k * 10)} per 10 Grams
                  </p>
                </div>
              </div>
            </div>

            {/* 999 Fine Silver Card */}
            <div className="p-4 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/80 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800 dark:bg-zinc-700 dark:text-slate-200">
                    999 Pure Silver
                  </span>
                  <h3 className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-2">
                    {formatINR(rates.silver)}
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-normal"> /gram</span>
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                    {formatINR(rates.silver * 1000)} per 1 KG Bar
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{rates.trendSilver || 0.62}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Custom Gold Value Calculator */}
          <div className="p-5 rounded-2xl border bg-amber-50/70 dark:bg-zinc-800/90 border-amber-300 dark:border-amber-900/40 space-y-4">
            <div className="flex items-center space-x-2 text-[#4A0E17] dark:text-[#D4AF37]">
              <Calculator className="w-5 h-5" />
              <h3 className="text-sm font-bold font-serif">Instant Jewellery Value Estimator</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-amber-900 dark:text-amber-200">
                  Gross Weight (Grams)
                </label>
                <input
                  type="number"
                  min={0.5}
                  step={0.1}
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border bg-white dark:bg-zinc-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-amber-900 dark:text-amber-200">
                  Select Purity
                </label>
                <select
                  value={calcPurity}
                  onChange={(e: any) => setCalcPurity(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-white dark:bg-zinc-900 font-bold"
                >
                  <option value="24K">24K Pure Gold ({formatINR(rates.gold24k)}/g)</option>
                  <option value="22K">22K Hallmark Gold ({formatINR(rates.gold22k)}/g)</option>
                  <option value="18K">18K Diamond Gold ({formatINR(rates.gold18k)}/g)</option>
                  <option value="Silver">999 Pure Silver ({formatINR(rates.silver)}/g)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-amber-900 dark:text-amber-200">
                  Making Charges (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={calcMaking}
                  onChange={(e) => setCalcMaking(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border bg-white dark:bg-zinc-900 font-mono font-bold"
                />
              </div>
            </div>

            {/* Price Estimation Breakdown */}
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-amber-200 dark:border-zinc-700 space-y-2 text-xs">
              <div className="flex justify-between text-amber-900/80 dark:text-zinc-400">
                <span>Metal Cost ({calcWeight}g @ {formatINR(baseRatePerGram)}/g):</span>
                <span className="font-mono font-bold text-amber-950 dark:text-zinc-200">
                  {formatINR(rawMetalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-amber-900/80 dark:text-zinc-400">
                <span>Making Charges ({calcMaking}%):</span>
                <span className="font-mono font-bold text-amber-950 dark:text-zinc-200">
                  {formatINR(makingCharge)}
                </span>
              </div>
              <div className="flex justify-between text-amber-900/80 dark:text-zinc-400">
                <span>3% GST:</span>
                <span className="font-mono font-bold text-amber-950 dark:text-zinc-200">
                  {formatINR(gst)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t font-extrabold text-sm text-[#4A0E17] dark:text-[#D4AF37]">
                <span>Estimated Price:</span>
                <span className="font-mono">{formatINR(estimatedTotal)}</span>
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
