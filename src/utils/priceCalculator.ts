import { GoldRates, Product, Purity } from '../types';

export function getRatePerGram(purity: Purity, rates: GoldRates): number {
  switch (purity) {
    case '24K':
      return rates.gold24k;
    case '22K':
      return rates.gold22k;
    case '18K':
      return rates.gold18k;
    case '14K':
      return Math.round(rates.gold18k * 0.8);
    case '999 Silver':
      return rates.silver;
    case '925 Silver':
      return Math.round(rates.silver * 0.93);
    default:
      return rates.gold22k;
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

export function calculateProductPrice(product: Product, rates: GoldRates): PriceBreakdown {
  const ratePerGram = getRatePerGram(product.purity, rates);
  const metalCost = product.weightGrams * ratePerGram;
  
  // Making charges can be percentage or base fixed
  const percentMaking = metalCost * (product.makingChargePercent / 100);
  const makingCharges = Math.max(product.baseMakingCharge, percentMaking);
  
  const subtotal = metalCost + makingCharges;
  const gstAmount = subtotal * 0.03; // 3% standard Indian GST on Gold/Jewellery
  const totalPrice = Math.round(subtotal + gstAmount);

  return {
    purity: product.purity,
    weightGrams: product.weightGrams,
    ratePerGram,
    metalCost: Math.round(metalCost),
    makingChargePercent: product.makingChargePercent,
    makingCharges: Math.round(makingCharges),
    subtotal: Math.round(subtotal),
    gstAmount: Math.round(gstAmount),
    totalPrice,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
