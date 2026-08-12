import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Mail, Lock, CheckCircle2, MapPin, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { safeFetchJson } from '../utils/safeFetch';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  mandatory?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  setUser,
  mandatory = false,
}) => {
  const [step, setStep] = useState<'email' | 'otp' | 'profile'>(user.isLoggedIn ? 'profile' : 'email');
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [name, setName] = useState(user.name || '');
  const [street, setStreet] = useState(user.address?.street || '');
  const [city, setCity] = useState(user.address?.city || '');
  const [state, setState] = useState(user.address?.state || '');
  const [pincode, setPincode] = useState(user.address?.pincode || '');

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      const msg = 'Please enter a valid email address (e.g. name@gmail.com).';
      setErrorMsg(msg);
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const data = await safeFetchJson<{ success?: boolean; message?: string }>('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      setLoading(false);

      if (data?.success) {
        setSuccessMsg(`📩 Verification code sent via Email to ${cleanEmail}`);
        setStep('otp');
      } else {
        setErrorMsg(data?.message || 'Authentication service is currently unavailable. Please try again later.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('Authentication service is currently unavailable. Please check your connection and try again.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpInput || otpInput.length < 4) {
      setErrorMsg('Please enter the 4-digit verification code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const data = await safeFetchJson<{ success?: boolean; profile?: UserProfile; message?: string }>('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          otp: otpInput.trim(),
          name,
          address: { street, city, state, pincode },
        }),
      });
      setLoading(false);

      if (data?.success && data.profile) {
        setUser(data.profile);
        setStep('profile');
        if (!mandatory) {
          onClose();
        }
      } else {
        setErrorMsg(data?.message || 'Invalid verification code or service unavailable. Please try again.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('Verification service is currently unavailable. Please check your connection and try again.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserProfile = {
      email,
      name,
      address: { street, city, state, pincode },
      isLoggedIn: true,
    };
    setUser(updatedUser);
    onClose();
  };

  const handleLogout = () => {
    setUser({
      email: '',
      name: '',
      address: { street: '', city: '', state: '', pincode: '' },
      isLoggedIn: false,
    });
    setStep('email');
    setEmail('');
    setOtpInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-black text-amber-950 dark:text-amber-100 border border-[#4A0E17]/30 dark:border-[#4A0E17]/60 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative">
        {/* Header Banner - Royal Red & Gold Header */}
        <div className="bg-gradient-to-r from-[#4A0E17] via-[#6B1423] to-[#4A0E17] p-6 text-center text-[#D4AF37] relative border-b border-[#D4AF37]/30">
          {!mandatory && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#D4AF37] hover:text-white p-1 rounded-full text-base font-bold transition-colors"
            >
              ✕
            </button>
          )}
          <div className="w-11 h-11 mx-auto rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mb-2.5">
            <Mail className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <h2 className="text-xl font-bold font-serif tracking-tight">SHUBHAM JEWELLERS</h2>
          <p className="text-xs text-amber-200/90 font-light mt-0.5">
            Gmail OTP Authentication
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-100 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && step === 'otp' && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 rounded-xl text-xs font-semibold flex items-center shadow-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                {successMsg}
              </span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-zinc-700 dark:text-amber-200/90 font-medium">
                  Enter your email address to log in or register instantly with OTP.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. customer@gmail.com"
                    className="w-full pl-3.5 pr-10 py-3 text-sm rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium focus:border-[#4A0E17] dark:focus:border-[#D4AF37] focus:outline-none transition-all placeholder:text-zinc-400"
                    required
                  />
                  <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4A0E17] dark:text-[#D4AF37]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#4A0E17] text-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#4A0E17] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 transition-all flex items-center justify-center space-x-2 border border-[#D4AF37]/40"
              >
                {loading ? (
                  <span>Sending Email OTP...</span>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-zinc-600 dark:text-amber-300/80 flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>100% Secure Gmail OTP Authentication</span>
              </div>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-zinc-700 dark:text-amber-200">
                  Code sent to <strong className="text-[#4A0E17] dark:text-[#D4AF37]">{email}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-[11px] text-[#4A0E17] dark:text-[#D4AF37] underline font-semibold mt-1"
                >
                  Change Email Address
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37] mb-1.5">
                  Enter 4-Digit OTP Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="••••"
                    className="w-full py-3 text-center text-xl font-bold tracking-widest rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-[#4A0E17] dark:focus:border-[#D4AF37] focus:outline-none transition-all placeholder:text-zinc-300"
                    required
                  />
                  <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4A0E17] dark:text-[#D4AF37]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#4A0E17] text-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#4A0E17] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 transition-all flex items-center justify-center space-x-2 border border-[#D4AF37]/40"
              >
                {loading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: User Profile & Address */}
          {step === 'profile' && user.isLoggedIn && (
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="bg-amber-50 dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 p-3 rounded-xl text-xs text-amber-950 dark:text-amber-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <strong>Verified Email:</strong> {user.email}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#4A0E17]/30 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-amber-950 dark:text-white focus:border-[#4A0E17] dark:focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A0E17] dark:text-[#D4AF37]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37] mb-1">
                  Delivery Address
                </label>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="House / Flat / Street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#4A0E17]/30 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-amber-950 dark:text-white focus:border-[#4A0E17] dark:focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A0E17] dark:text-[#D4AF37]" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#4A0E17]/30 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-amber-950 dark:text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#4A0E17]/30 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-amber-950 dark:text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#4A0E17]/30 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-amber-950 dark:text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4A0E17] text-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#4A0E17] font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:brightness-110 transition-all border border-[#D4AF37]/40"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-2.5 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-300 font-bold text-xs rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
