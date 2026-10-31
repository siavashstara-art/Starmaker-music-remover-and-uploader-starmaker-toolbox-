import React from 'react';
import { AppTheme, UserProfile } from '../types';
import {
  Sparkles,
  User,
  Smartphone,
  Share2,
  Trophy,
  Crown,
  BookOpen,
  FileCode,
  Video,
  Menu,
  X,
  Palette
} from 'lucide-react';

interface HeaderProps {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isInstallable: boolean;
  onInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  setTheme,
  user,
  onOpenAuth,
  activeTab,
  setActiveTab,
  isInstallable,
  onInstall,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'timing', label: 'استودیوی زمان‌بندی', icon: Sparkles },
    { id: 'karaoke', label: 'استیج کارائوکه زنده', icon: Crown },
    { id: 'referral', label: 'لیگ معرفان', icon: Share2 },
    { id: 'loyalty', label: 'لیگ مشاهیر وفاداران', icon: Trophy },
    { id: 'android', label: 'خروجی اندروید و گریدل', icon: FileCode },
    { id: 'promo', label: 'ویدئوی ۳۰ ثانیه‌ای آپارات', icon: Video },
    { id: 'methodology', label: 'متدولوژی خدمات‌جو', icon: BookOpen },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 border-b ${
      theme === 'luxury-gold'
        ? 'bg-zinc-950/95 border-amber-500/30 text-amber-100 shadow-lg shadow-amber-950/20'
        : theme === 'neon-starmaker'
        ? 'bg-slate-950/95 border-pink-500/30 text-pink-50 shadow-lg shadow-pink-950/30'
        : 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
    } backdrop-blur-md`}>
      
      {/* Top Universal Ecosystem Stamp Banner */}
      <div className={`py-1.5 px-3 text-center text-[11px] sm:text-xs font-semibold tracking-wide border-b ${
        theme === 'luxury-gold'
          ? 'bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 text-amber-300 border-amber-500/20'
          : theme === 'neon-starmaker'
          ? 'bg-gradient-to-r from-purple-950 via-pink-950 to-purple-950 text-pink-300 border-pink-500/20'
          : 'bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 text-amber-900 border-amber-200/60'
      }`}>
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className="inline-block animate-pulse">🌟</span>
          <span>اکوسیستم آفرینش آفرینا شهر جدید نیو متاورسی جهان ایبل سیتی (توانا سیتی) - FB NewMeta [مولد و زمانبندی آسان استارمیکر]</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        
        {/* Right side: Brand & Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-current/20 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition"
            aria-label="منوی گزینه‌ها"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-md ${
              theme === 'luxury-gold'
                ? 'bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 text-zinc-950 ring-2 ring-amber-400/50'
                : theme === 'neon-starmaker'
                ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white ring-2 ring-pink-400/50'
                : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
            }`}>
              🎤
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight">استارمیکر هلپر</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                  نسخه ۳.۸
                </span>
              </div>
              <p className="text-[10px] sm:text-xs opacity-70 hidden xs:block">
                تولید لیریکس و زمانبندی میلی‌ثانیه‌ای کارائوکه (.lrc)
              </p>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? theme === 'luxury-gold'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm'
                      : theme === 'neon-starmaker'
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40 shadow-sm'
                      : 'bg-amber-500 text-white shadow-sm'
                    : 'opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Left side: Themes, PWA, User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Theme Switcher Button */}
          <div className="relative group">
            <button
              onClick={() => {
                if (theme === 'vibrant-light') setTheme('luxury-gold');
                else if (theme === 'luxury-gold') setTheme('neon-starmaker');
                else setTheme('vibrant-light');
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition active:scale-95 ${
                theme === 'luxury-gold'
                  ? 'bg-zinc-900 border-amber-500/40 text-amber-300 hover:bg-zinc-800'
                  : theme === 'neon-starmaker'
                  ? 'bg-slate-900 border-pink-500/40 text-pink-300 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
              title="تغییر پوسته بصری"
            >
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">
                {theme === 'vibrant-light' ? 'روشن شاد' : theme === 'luxury-gold' ? 'طلایی لوکس' : 'نئون استیج'}
              </span>
            </button>
          </div>

          {/* PWA Install Button */}
          {isInstallable && (
            <button
              onClick={onInstall}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">نصب اپ</span>
            </button>
          )}

          {/* User Profile Pill / Dual Auth */}
          <button
            onClick={onOpenAuth}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition active:scale-95 ${
              theme === 'luxury-gold'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-200'
                : theme === 'neon-starmaker'
                ? 'bg-pink-500/10 border-pink-500/30 text-pink-200'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center text-xs">
              {user.avatar || <User className="w-3 h-3 text-amber-500" />}
            </div>
            <span className="hidden md:inline font-bold truncate max-w-[90px]">{user.name}</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500 text-slate-950 font-black">
              {user.points} 🪙
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t px-4 py-3 transition-all ${
          theme === 'luxury-gold'
            ? 'bg-zinc-950 border-amber-500/20 text-amber-100'
            : theme === 'neon-starmaker'
            ? 'bg-slate-950 border-pink-500/20 text-pink-100'
            : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-right transition ${
                    isActive
                      ? theme === 'luxury-gold'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : theme === 'neon-starmaker'
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40'
                        : 'bg-amber-500 text-white'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Theme Quick Switcher in Drawer */}
          <div className="pt-2 border-t border-current/10 flex items-center justify-between text-xs">
            <span className="opacity-70 font-semibold">پوسته بصری:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setTheme('vibrant-light')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                  theme === 'vibrant-light' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                روشن شاد
              </button>
              <button
                onClick={() => setTheme('luxury-gold')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                  theme === 'luxury-gold' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-amber-200'
                }`}
              >
                سوپر لوکس طلایی
              </button>
              <button
                onClick={() => setTheme('neon-starmaker')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                  theme === 'neon-starmaker' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-pink-200'
                }`}
              >
                نئون استیج
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
