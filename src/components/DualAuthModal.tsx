import React, { useState } from 'react';
import { UserProfile, AppTheme } from '../types';
import { X, Smartphone, Mail, Globe, CheckCircle2, Award, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DualAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  theme: AppTheme;
}

export const DualAuthModal: React.FC<DualAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  theme,
}) => {
  const [authMode, setAuthMode] = useState<'mobile' | 'email' | 'google'>('mobile');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [email, setEmail] = useState('');
  const [name, setName] = useState(user.name);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setMessage('لطفاً شماره موبایل معتبر ۱۱ رقمی وارد نمایید.');
      return;
    }
    setOtpSent(true);
    setOtpCountdown(60);
    setMessage('کد ۴ رقمی ورود پیامک شد. (کد نمونه: ۱۲۳۴)');

    const timer = setInterval(() => {
      setOtpCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (!otpCode || otpCode.length < 4) {
      setMessage('لطفاً کد تأیید ۴ رقمی را وارد کنید.');
      return;
    }
    // Success login
    const updated: UserProfile = {
      ...user,
      name: name || `کاربر ${phoneNumber.slice(-4)}`,
      identifier: phoneNumber,
      authType: 'mobile',
      points: user.points + 100, // login bonus
    };
    onUpdateUser(updated);
    confetti({ particleCount: 50, spread: 60 });
    setMessage('ورود با موفقیت انجام شد! ۱۰۰ سکه هدیه دریافت کردید.');
    setTimeout(() => {
      onClose();
      setMessage(null);
    }, 1200);
  };

  const handleEmailLogin = () => {
    if (!email || !email.includes('@')) {
      setMessage('لطفاً یک آدرس ایمیل معتبر وارد کنید.');
      return;
    }
    const updated: UserProfile = {
      ...user,
      name: name || email.split('@')[0],
      identifier: email,
      authType: 'email',
      points: user.points + 100,
    };
    onUpdateUser(updated);
    confetti({ particleCount: 50, spread: 60 });
    setMessage('ورود با ایمیل با موفقیت انجام شد!');
    setTimeout(() => {
      onClose();
      setMessage(null);
    }, 1200);
  };

  const handleGoogleLogin = () => {
    // Foreign user Google Sign-In simulation with real profile sync
    const updated: UserProfile = {
      ...user,
      name: name || 'Google Artist User',
      identifier: 'artist.user@gmail.com',
      authType: 'google',
      avatar: '🌐',
      points: user.points + 200,
    };
    onUpdateUser(updated);
    confetti({ particleCount: 60, spread: 70 });
    setMessage('ورود با حساب گوگل با موفقیت انجام شد!');
    setTimeout(() => {
      onClose();
      setMessage(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-all ${
        theme === 'luxury-gold'
          ? 'bg-zinc-950 border-amber-500/40 text-amber-100'
          : theme === 'neon-starmaker'
          ? 'bg-slate-950 border-pink-500/40 text-pink-100'
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base">احراز هویت جامع (Dual Authentication)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status banner */}
        <div className={`p-3 rounded-xl mb-4 border flex items-center justify-between text-xs ${
          theme === 'luxury-gold'
            ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
            : theme === 'neon-starmaker'
            ? 'bg-pink-950/30 border-pink-500/30 text-pink-200'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div>
            <span className="font-bold">حساب فعال: </span>
            <span>{user.name}</span>
            <span className="block text-[11px] opacity-75">{user.identifier} ({user.authType})</span>
          </div>
          <div className="text-left font-black text-amber-500">
            <div>{user.points} 🪙 سکه</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">سطح: {user.badge}</div>
          </div>
        </div>

        {/* Tabs for Dual Auth */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 mb-4 text-xs font-bold">
          <button
            onClick={() => setAuthMode('mobile')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1 transition ${
              authMode === 'mobile'
                ? theme === 'luxury-gold'
                  ? 'bg-amber-500 text-black shadow'
                  : 'bg-amber-500 text-white shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>کاربران ایرانی</span>
          </button>

          <button
            onClick={() => setAuthMode('email')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1 transition ${
              authMode === 'email'
                ? theme === 'luxury-gold'
                  ? 'bg-amber-500 text-black shadow'
                  : 'bg-amber-500 text-white shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>ایمیل</span>
          </button>

          <button
            onClick={() => setAuthMode('google')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1 transition ${
              authMode === 'google'
                ? theme === 'luxury-gold'
                  ? 'bg-amber-500 text-black shadow'
                  : 'bg-amber-500 text-white shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Google Sign-In</span>
          </button>
        </div>

        {message && (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-600 dark:text-amber-300">
            {message}
          </div>
        )}

        {/* Forms */}
        {authMode === 'mobile' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1 opacity-80">نام یا لقب هنری:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: سیاوش خواننده"
                className="w-full px-3 py-2 text-xs rounded-xl border border-current/20 bg-transparent focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 opacity-80">شماره موبایل (ایران):</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  dir="ltr"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="09123456789"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-current/20 bg-transparent focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  disabled={otpSent && otpCountdown > 0}
                  onClick={handleSendOtp}
                  className="px-3 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-black disabled:opacity-50 transition active:scale-95 shrink-0"
                >
                  {otpSent && otpCountdown > 0 ? `${otpCountdown} ثانیه` : 'ارسال کد SMS'}
                </button>
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="block text-xs font-bold mb-1 opacity-80">کد ۴ رقمی ارسال شده:</label>
                <input
                  type="text"
                  dir="ltr"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="1234"
                  className="w-full px-3 py-2 text-center text-sm tracking-widest font-black rounded-xl border border-current/20 bg-transparent focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full mt-3 py-2.5 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition active:scale-95"
                >
                  تأیید و ورود به استودیو
                </button>
              </div>
            )}
          </div>
        )}

        {authMode === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1 opacity-80">نام هنری:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام شما"
                className="w-full px-3 py-2 text-xs rounded-xl border border-current/20 bg-transparent focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 opacity-80">آدرس ایمیل:</label>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-current/20 bg-transparent focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              type="button"
              onClick={handleEmailLogin}
              className="w-full mt-2 py-2.5 rounded-xl font-black text-xs bg-amber-500 hover:bg-amber-600 text-black shadow-md transition active:scale-95"
            >
              ورود با ایمیل
            </button>
          </div>
        )}

        {authMode === 'google' && (
          <div className="text-center py-4 space-y-4">
            <p className="text-xs opacity-80 leading-relaxed">
              ویژه کاربران بین‌المللی و ایرانیان خارج از کشور جهت همگام‌سازی ابری لیریکس‌های استارمیکر و ذخیره رتبه در لیگ معرفان
            </p>
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-current/20 hover:bg-black/5 dark:hover:bg-white/5 transition active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>ورود فوری با گوگل (Google Sign-In)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
