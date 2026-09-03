import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Mail, Lock, CheckCircle2, MapPin, User, ArrowRight, ShieldCheck, Sparkles, KeyRound, Loader2, X } from 'lucide-react';
import { safeFetchJson } from '../utils/safeFetch';
import { ImageInputSelector } from './ImageInputSelector';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  onLogout?: () => void;
  mandatory?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  setUser,
  onLogout,
  mandatory = false,
}) => {
  const [step, setStep] = useState<'email' | 'otp' | 'profile'>(user.isLoggedIn ? 'profile' : 'email');
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [receivedOtp, setReceivedOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [name, setName] = useState(user.name || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [street, setStreet] = useState(user.address?.street || '');
  const [city, setCity] = useState(user.address?.city || '');
  const [state, setState] = useState(user.address?.state || '');
  const [pincode, setPincode] = useState(user.address?.pincode || '');

  // FIXED: Sync step every time the modal opens so it always reflects the real login state.
  useEffect(() => {
    if (isOpen) {
      setStep(user.isLoggedIn ? 'profile' : 'email');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user.isLoggedIn]);

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
      const data = await safeFetchJson<{ success?: boolean; message?: string; otp?: string; provider?: string; code?: string }>('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      setLoading(false);

      if (data?.success) {
        if (data.otp) {
          setReceivedOtp(data.otp);
        }
        setSuccessMsg(`Verification code dispatched for ${cleanEmail}`);
        setStep('otp');
      } else if (data?.code === 'EMAIL_NOT_FOUND') {
        setErrorMsg(data.message || 'No email found for this address. Please check for typos and try again.');
      } else {
        setErrorMsg(data?.message || 'Unable to dispatch verification code. Please check email and try again.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('Failed to connect to authentication server. Please check your connection and retry.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otpInput || otpInput.length < 4) {
      setErrorMsg('Please enter the 4-digit verification code.');
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
        setErrorMsg(data?.message || 'Invalid verification code. Please check and try again.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('Unable to verify OTP right now. Please check your connection and try again.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserProfile = {
      email,
      name,
      avatar,
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
    onLogout?.();
    setStep('email');
    setEmail('');
    setOtpInput('');
    setReceivedOtp(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FAF7F2] dark:bg-[#140F11] text-amber-950 dark:text-amber-100 border border-[#D4AF37]/40 rounded-2xl max-w-sm sm:max-w-md w-full overflow-hidden shadow-2xl relative my-auto">
        {/* Header Banner - Compact Royal Red & Gold */}
        <div className="bg-gradient-to-r from-[#380810] via-[#52101B] to-[#2B050D] p-4 sm:p-5 text-center text-[#D4AF37] relative border-b border-[#D4AF37]/40">
          {!mandatory && (
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 text-[#F3E5AB] hover:text-white p-1 rounded-full text-base font-bold transition-colors active:scale-90"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="w-9 h-9 mx-auto rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 flex items-center justify-center mb-1.5 shadow-sm">
            <Mail className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <h2 className="text-base sm:text-lg font-bold font-cinzel tracking-wider text-[#F3E5AB]">SHUBHAM JEWELLERS</h2>
          <p className="text-[11px] text-amber-200/90 font-light mt-0.5">
            Instant OTP Authentication & VIP Member Access
          </p>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-2.5 bg-rose-100 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && step === 'otp' && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 rounded-xl text-xs font-semibold flex items-center shadow-xs">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                {successMsg}
              </span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <div className="text-center">
                <p className="text-xs text-zinc-700 dark:text-amber-200/90 font-medium">
                  Enter your email address to log in or register instantly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. customer@gmail.com"
                    className="w-full pl-3.5 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium focus:border-[#4A0E17] dark:focus:border-[#D4AF37] focus:outline-none transition-all placeholder:text-zinc-400"
                    required
                  />
                  <Mail className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#4A0E17] dark:text-[#D4AF37]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#4A0E17] to-[#6B1423] text-[#D4AF37] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 border border-[#D4AF37]/50 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Verification Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-zinc-600 dark:text-amber-300/80 flex items-center justify-center space-x-1 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>100% Secure OTP Authentication</span>
              </div>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="text-center">
                <p className="text-xs text-zinc-700 dark:text-amber-200">
                  Verifying <strong className="text-[#4A0E17] dark:text-[#D4AF37]">{email}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-[11px] text-[#4A0E17] dark:text-[#D4AF37] underline font-semibold mt-0.5"
                >
                  Change Email Address
                </button>
              </div>

              {/* Instant Verification Code Card with 1-Tap Auto Fill */}
              {receivedOtp && (
                <div className="p-3 bg-gradient-to-r from-amber-500/15 via-[#D4AF37]/20 to-amber-500/15 border border-[#D4AF37]/70 rounded-xl flex items-center justify-between shadow-xs animate-fade-in">
                  <div>
                    <span className="text-[10px] block font-semibold text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                      Instant Verification Code:
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#4A0E17] dark:text-[#D4AF37]" />
                      <span className="font-mono text-base font-extrabold tracking-widest text-[#4A0E17] dark:text-[#F3E5AB]">
                        {receivedOtp}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpInput(receivedOtp)}
                    className="px-3 py-1.5 bg-gradient-to-r from-[#4A0E17] to-[#6B1423] text-[#D4AF37] font-bold text-[11px] rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all border border-[#D4AF37]/40 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>Auto-Fill</span>
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37] mb-1">
                  Enter 4-Digit OTP Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="****"
                    className="w-full py-2.5 text-center text-xl font-bold tracking-widest rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-[#4A0E17] dark:focus:border-[#D4AF37] focus:outline-none transition-all placeholder:text-zinc-300"
                    required
                  />
                  <Lock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#4A0E17] dark:text-[#D4AF37]" />
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 text-center">
                  Check your inbox / spam folder or tap Auto-Fill above.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#4A0E17] to-[#6B1423] text-[#D4AF37] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 border border-[#D4AF37]/50 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: User Profile & Address */}
          {step === 'profile' && user.isLoggedIn && (
            <form onSubmit={handleSaveProfile} className="space-y-2.5">
              <div className="bg-amber-100/60 dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 p-2.5 rounded-xl text-xs text-amber-950 dark:text-amber-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="truncate">
                  <strong>Verified:</strong> {user.email}
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
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#4A0E17]/30 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-amber-950 dark:text-white focus:border-[#4A0E17] dark:focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                  <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4A0E17] dark:text-[#D4AF37]" />
                </div>
              </div>

              {/* Profile Photo Selection */}
              <div className="pt-0.5">
                <ImageInputSelector
                  label="Profile Picture / Avatar"
                  value={avatar}
                  onChange={setAvatar}
                  placeholder="Paste profile photo URL..."
                  helpText="Choose a profile picture from your gallery or paste an image link."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37] mb-1">
                  Delivery Address
                </label>
                <div className="relative mb-1.5">
                  <input
                    type="text"
                    placeholder="House / Flat / Street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#4A0E17]/30 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-amber-950 dark:text-white focus:border-[#4A0E17] dark:focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                  <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4A0E17] dark:text-[#D4AF37]" />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-xl border border-[#4A0E17]/30 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-amber-950 dark:text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-xl border border-[#4A0E17]/30 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-amber-950 dark:text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-xl border border-[#4A0E17]/30 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-amber-950 dark:text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-[#4A0E17] to-[#6B1423] text-[#D4AF37] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all border border-[#D4AF37]/40"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-2 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-300 font-bold text-xs rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
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