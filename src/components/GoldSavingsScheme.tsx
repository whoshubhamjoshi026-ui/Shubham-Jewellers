import React, { useState, useEffect } from 'react';
import { GoldScheme, UserProfile } from '../types';
import { formatINR } from '../utils/priceCalculator';
import { safeFetchJson } from '../utils/safeFetch';
import {
  PiggyBank,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  X,
  Lock,
  Loader2,
} from 'lucide-react';

interface GoldSavingsSchemeProps {
  user: UserProfile;
  onOpenAuth: () => void;
  darkMode: boolean;
}

interface PaymentConfig {
  isConfigured: boolean;
  keyId: string | null;
  mode: 'live' | 'demo';
  message: string;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const GoldSavingsScheme: React.FC<GoldSavingsSchemeProps> = ({
  user,
  onOpenAuth,
  darkMode,
}) => {
  const [selectedMonthly, setSelectedMonthly] = useState<number>(5000);
  const [scheme, setScheme] = useState<GoldScheme | null>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    isConfigured: false,
    keyId: null,
    mode: 'demo',
    message: 'Demo Mode: Razorpay API keys not configured',
  });
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [pendingDemoOrder, setPendingDemoOrder] = useState<{ orderId: string; amount: number } | null>(null);
  const [razorpayScriptLoaded, setRazorpayScriptLoaded] = useState(false);

  // Load Razorpay Checkout SDK script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayScriptLoaded(true);
    document.body.appendChild(script);

    // Fetch payment gateway configuration
    safeFetchJson<{ success?: boolean; isConfigured?: boolean; keyId?: string; mode?: 'live' | 'demo'; message?: string }>(
      '/api/scheme/payment-config'
    )
      .then((res) => {
        if (res?.success) {
          setPaymentConfig({
            isConfigured: Boolean(res.isConfigured),
            keyId: res.keyId || null,
            mode: res.mode || 'demo',
            message: res.message || '',
          });
        }
      })
      .catch((e) => console.log('Payment config error:', e));

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (user.isLoggedIn && user.email) {
      fetchUserScheme();
    }
  }, [user]);

  const fetchUserScheme = async () => {
    if (!user.email) return;
    setLoading(true);
    try {
      const data = await safeFetchJson<{ success?: boolean; scheme?: GoldScheme }>(
        `/api/scheme/${encodeURIComponent(user.email)}`
      );
      if (data?.success && data.scheme) {
        setScheme(data.scheme);
      }
    } catch (err) {
      console.error('Failed to fetch scheme', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiatePayment = async () => {
    if (!user.isLoggedIn) {
      onOpenAuth();
      return;
    }

    const payAmount = scheme?.monthlyInstallment || selectedMonthly;
    setPaying(true);
    setPaymentSuccessMsg('');

    try {
      // 1. Create order on backend
      const orderRes = await safeFetchJson<{
        success?: boolean;
        mode?: 'razorpay' | 'demo';
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        message?: string;
      }>('/api/scheme/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, amount: payAmount }),
      });

      if (!orderRes?.success) {
        throw new Error(orderRes?.message || 'Failed to create payment order');
      }

      // 2. If Razorpay is live and SDK is loaded, open official Razorpay Checkout popup
      if (orderRes.mode === 'razorpay' && orderRes.keyId && window.Razorpay) {
        const options = {
          key: orderRes.keyId,
          amount: orderRes.amount,
          currency: orderRes.currency || 'INR',
          name: 'Shubham Jewellers',
          description: `Swarna Varsha Savings Scheme (Installment ${formatINR(payAmount)})`,
          order_id: orderRes.orderId,
          handler: async (response: any) => {
            setPaying(true);
            try {
              const verifyRes = await safeFetchJson<{
                success?: boolean;
                scheme?: GoldScheme;
                receipt?: any;
                message?: string;
              }>('/api/scheme/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: user.email,
                  amount: payAmount,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  isDemo: false,
                }),
              });

              setPaying(false);
              if (verifyRes?.success && verifyRes.scheme) {
                setScheme(verifyRes.scheme);
                setPaymentSuccessMsg(
                  `Payment of ${formatINR(payAmount)} verified successfully via Razorpay! Ref: ${
                    response.razorpay_payment_id || verifyRes.receipt?.txId
                  }`
                );
              } else {
                alert(verifyRes?.message || 'Payment signature verification failed.');
              }
            } catch (err: any) {
              setPaying(false);
              alert('Error verifying payment: ' + (err?.message || err));
            }
          },
          prefill: {
            name: user.name || 'Valued Customer',
            email: user.email,
          },
          theme: {
            color: '#4A0E17',
          },
          modal: {
            ondismiss: () => {
              setPaying(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // 3. Demo / Test Mode Simulation Dialog
        setPaying(false);
        setPendingDemoOrder({
          orderId: orderRes.orderId || `DEMO_ORD_${Date.now()}`,
          amount: payAmount,
        });
        setShowDemoModal(true);
      }
    } catch (err: any) {
      setPaying(false);
      alert('Unable to initiate payment: ' + (err?.message || err));
    }
  };

  const handleConfirmDemoPayment = async () => {
    if (!pendingDemoOrder || !user.email) return;
    setPaying(true);
    setShowDemoModal(false);

    try {
      const demoTxId = `TXN_DEMO_${Date.now().toString().slice(-6)}`;
      const verifyRes = await safeFetchJson<{
        success?: boolean;
        scheme?: GoldScheme;
        receipt?: any;
        message?: string;
      }>('/api/scheme/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          amount: pendingDemoOrder.amount,
          razorpay_order_id: pendingDemoOrder.orderId,
          razorpay_payment_id: demoTxId,
          isDemo: true,
        }),
      });

      setPaying(false);
      if (verifyRes?.success && verifyRes.scheme) {
        setScheme(verifyRes.scheme);
        setPaymentSuccessMsg(
          `[TEST MODE] Simulated payment of ${formatINR(pendingDemoOrder.amount)} recorded! Ref: ${demoTxId}`
        );
      }
    } catch (err: any) {
      setPaying(false);
      console.error('Demo payment error:', err);
    } finally {
      setPendingDemoOrder(null);
    }
  };

  // Calculator benefits
  const totalMonths = 11;
  const userContribution = selectedMonthly * 10;
  const bonusAmount = selectedMonthly; // 11th month free from Shubham Jewellers
  const totalBenefitValue = userContribution + bonusAmount;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#4A0E17] via-[#6B1423] to-[#4A0E17] text-white p-6 sm:p-10 border border-[#D4AF37]/40 shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-[#D4AF37] text-[#4A0E17] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Shubham Swarna Varsha Savings Scheme</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#D4AF37] tracking-tight mb-2">
            Pay 10 Installments & Get 11th Month Free!
          </h2>

          <p className="text-xs sm:text-sm text-amber-100/90 font-light leading-relaxed mb-4">
            Plan ahead for weddings, anniversaries, or gold investments with Shubham Jewellers’ signature 11-month savings plan. Enjoy 100% discount on making charges + 1 FREE installment bonus on maturity!
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-amber-200">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> 100% BIS Hallmarked Redemption
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Lock-in Today's Rate Security
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Zero Admin Fee
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Razorpay Payment Gateway
            </span>
          </div>
        </div>

        <PiggyBank className="w-64 h-64 absolute -right-10 -bottom-10 text-[#D4AF37]/10 pointer-events-none hidden md:block" />
      </div>

      {/* Gateway Mode Notification Bar */}
      {!paymentConfig.isConfigured && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Gateway Notice:</strong> Razorpay keys are not yet configured in environment. Installments will process via <strong>Simulated Demo Gateway</strong>.
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
            TEST MODE
          </span>
        </div>
      )}

      {/* Grid: Interactive Calculator & Active Passbook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Scheme Benefit Calculator */}
        <div
          className={`p-6 rounded-2xl border shadow-xl flex flex-col justify-between ${
            darkMode
              ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
              : 'bg-white border-amber-200 text-amber-950'
          }`}
        >
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <PiggyBank className="w-6 h-6 text-[#D4AF37]" />
              <h3 className="text-lg font-bold font-serif">Scheme Benefit Calculator</h3>
            </div>

            <p className="text-xs text-amber-900/80 dark:text-zinc-400 mb-6">
              Select your comfortable monthly contribution amount to see your total gold purchase power at the end of 11 months.
            </p>

            {/* Monthly Amount Selector */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 mb-2">
                Choose Monthly Installment (INR)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[2000, 3000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedMonthly(amt)}
                    className={`py-2.5 rounded-xl font-bold text-xs transition-all border ${
                      selectedMonthly === amt
                        ? 'bg-[#4A0E17] text-[#D4AF37] border-[#D4AF37] shadow-md scale-105'
                        : darkMode
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    {formatINR(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="space-y-3 p-4 rounded-xl bg-amber-50/80 dark:bg-zinc-800/80 border border-amber-200 dark:border-zinc-700 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-amber-900/80 dark:text-zinc-300">Your Monthly Payment</span>
                <span className="font-bold">{formatINR(selectedMonthly)} / month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-900/80 dark:text-zinc-300">Total Months You Pay (10 Months)</span>
                <span className="font-bold">{formatINR(userContribution)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Shubham Jewellers Bonus (11th Month)</span>
                <span>+ {formatINR(bonusAmount)} FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-extrabold text-sm text-[#4A0E17] dark:text-[#D4AF37]">
                <span>Total Redeemable Gold Value</span>
                <span>{formatINR(totalBenefitValue)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {!user.isLoggedIn ? (
              <button
                onClick={onOpenAuth}
                className="w-full py-3 bg-[#D4AF37] text-[#4A0E17] font-bold text-sm rounded-xl hover:bg-amber-400 shadow transition-colors flex items-center justify-center space-x-2"
              >
                <span>Sign In via OTP to Start Scheme</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleInitiatePayment}
                disabled={paying}
                className="w-full py-3 bg-[#4A0E17] text-[#D4AF37] font-bold text-sm rounded-xl hover:bg-[#6B1423] shadow transition-colors flex items-center justify-center space-x-2 border border-[#D4AF37]/40 disabled:opacity-50"
              >
                {paying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting Gateway...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>{`Pay Month 1 (${formatINR(selectedMonthly)})`}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right: Active Scheme Passbook Tracker */}
        <div
          className={`p-6 rounded-2xl border shadow-xl flex flex-col justify-between ${
            darkMode
              ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
              : 'bg-white border-amber-200 text-amber-950'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="text-lg font-bold font-serif">Your Swarna Passbook</h3>
              </div>

              {scheme && (
                <span className="text-[10px] uppercase tracking-wider font-bold bg-[#D4AF37] text-[#4A0E17] px-2.5 py-1 rounded-full shadow-sm">
                  {scheme.schemeName}
                </span>
              )}
            </div>

            {paymentSuccessMsg && (
              <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{paymentSuccessMsg}</span>
              </div>
            )}

            {!user.isLoggedIn ? (
              <div className="text-center py-12 px-4 rounded-xl border border-dashed border-amber-300 dark:border-zinc-700">
                <p className="text-xs text-amber-900/80 dark:text-zinc-400 mb-3">
                  Please sign in with your email address to view your active Gold Savings Scheme passbook and payment receipts.
                </p>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#6B1423]"
                >
                  Sign In with OTP
                </button>
              </div>
            ) : !scheme ? (
              <div className="text-center py-12">
                <p className="text-xs text-amber-900/80 dark:text-zinc-400">
                  No active savings scheme found for {user.email}. Start one using the calculator!
                </p>
              </div>
            ) : (
              <div>
                {/* Active Scheme Status Card */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#4A0E17] text-[#D4AF37] text-center text-xs mb-4 shadow-md">
                  <div>
                    <span className="text-[10px] text-amber-200 block">Total Paid</span>
                    <strong className="text-sm font-sans">{formatINR(scheme.totalPaid)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-200 block">Paid Months</span>
                    <strong className="text-sm">{scheme.monthsPaid} / 11</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-200 block">Bonus Value</span>
                    <strong className="text-sm font-sans">{formatINR(scheme.bonusDiscount)}</strong>
                  </div>
                </div>

                {/* History Table */}
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-2">
                  Installment Payment History
                </h4>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
                  {scheme.history.map((inst, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        inst.status === 'Paid'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-zinc-800 border-amber-200 dark:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {inst.status === 'Paid' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <div>
                          <strong className="block text-xs">Month {inst.month} Installment</strong>
                          <span className="text-[10px] text-amber-800/70 dark:text-zinc-400 font-mono">
                            {inst.date} {inst.transactionId ? `• Ref: ${inst.transactionId}` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <strong className="block text-xs font-sans">{formatINR(inst.amount)}</strong>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            inst.status === 'Paid'
                              ? 'bg-emerald-200 text-emerald-900'
                              : 'bg-amber-200 text-amber-900'
                          }`}
                        >
                          {inst.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {user.isLoggedIn && scheme && (
            <div className="mt-4 pt-3 border-t border-amber-200 dark:border-zinc-800">
              <button
                onClick={handleInitiatePayment}
                disabled={paying}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {paying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting Gateway...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>{`Pay Next Installment (${formatINR(scheme.monthlyInstallment)})`}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Demo Mode Payment Confirmation Modal */}
      {showDemoModal && pendingDemoOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FAF7F2] dark:bg-[#181315] text-amber-950 dark:text-amber-100 border border-[#D4AF37]/50 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center mb-2">
                <CreditCard className="w-6 h-6 text-amber-600 dark:text-[#D4AF37]" />
              </div>
              <h3 className="text-base font-bold text-[#4A0E17] dark:text-[#F3E5AB] font-serif">
                Simulated Payment Gateway (Demo Mode)
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Razorpay API keys (RAZORPAY_KEY_ID) are not configured. You can simulate a successful installment payment to test passbook records.
              </p>
            </div>

            <div className="bg-amber-100/60 dark:bg-zinc-800/80 p-3.5 rounded-xl border border-amber-200 dark:border-zinc-700 text-xs space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Customer:</span>
                <strong>{user.email}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Order ID:</span>
                <span className="font-mono text-[11px]">{pendingDemoOrder.orderId}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#4A0E17] dark:text-[#D4AF37]">
                <span>Amount:</span>
                <span>{formatINR(pendingDemoOrder.amount)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleConfirmDemoPayment}
                disabled={paying}
                className="w-full py-2.5 bg-gradient-to-r from-[#4A0E17] to-[#6B1423] text-[#D4AF37] font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 border border-[#D4AF37]/50 disabled:opacity-50"
              >
                {paying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Recording Payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Simulate Successful Payment</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDemoModal(false)}
                className="w-full py-2 text-zinc-500 hover:text-zinc-700 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

