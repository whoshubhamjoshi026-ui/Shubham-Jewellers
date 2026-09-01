import { GoldRates, Product, Purity } from '../types';

const defaultFallbackRates: GoldRates = {
  gold24k: 7350,
  gold22k: 6735,
  gold18k: 5510,
  silver: 88,
  lastUpdated: 'Live',
  trend24k: 0,
  trendSilver: 0,
};

export function getRatePerGram(purity: Purity, rates?: GoldRates): number {
  const safeRates = rates && rates.gold24k ? rates : defaultFallbackRates;
  switch (purity) {
    case '24K':
      return safeRates.gold24k || 7350;
    case '22K':
      return safeRates.gold22k || 6735;
    case '18K':
      return safeRates.gold18k || 5510;
    case '14K':
      return Math.round((safeRates.gold18k || 5510) * 0.8);
    case '999 Silver':
      return safeRates.silver || 88;
    case '925 Silver':
      return Math.round((safeRates.silver || 88) * 0.93);
    default:
      return safeRates.gold22k || 6735;
  }
}

export interface PriceBreakdown {
  purity: Purity;
  weightGrams: number;
  ratePerGram: number;
  metalCost: number;
  makingChargePercent: number;
  makingCharges: number;
  subtotal: number;
  gstAmount: number; // 3% GST
  totalPrice: number;
}

export function calculateProductPrice(product: Product, rates?: GoldRates): PriceBreakdown {
  const safePurity = product?.purity || '22K';
  const ratePerGram = getRatePerGram(safePurity, rates);
  const weightGrams = Number(product?.weightGrams) || 0;
  const metalCost = weightGrams * ratePerGram;
  
  // Making charges can be percentage or base fixed
  const makingChargePercent = Number(product?.makingChargePercent) || 12;
  const baseMakingCharge = Number(product?.baseMakingCharge) || 200;
  const percentMaking = metalCost * (makingChargePercent / 100);
  const makingCharges = Math.max(baseMakingCharge, percentMaking);
  
  const subtotal = metalCost + makingCharges;
  const gstAmount = subtotal * 0.03; // 3% standard Indian GST on Gold/Jewellery
  const totalPrice = Math.round(subtotal + gstAmount);

  return {
    purity: safePurity,
    weightGrams,
    ratePerGram,
    metalCost: Math.round(metalCost),
    makingChargePercent,
    makingCharges: Math.round(makingCharges),
    subtotal: Math.round(subtotal),
    gstAmount: Math.round(gstAmount),
    totalPrice: Math.max(totalPrice, 0),
  };
}

export function formatINR(amount: number): string {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

