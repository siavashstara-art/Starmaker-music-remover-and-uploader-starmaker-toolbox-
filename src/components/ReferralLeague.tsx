import React, { useState } from 'react';
import { UserProfile, ReferralUser, AppTheme } from '../types';
import { Share2, Copy, Check, Gift, Users, Award, Trophy, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReferralLeagueProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  referrals: ReferralUser[];
  onUpdateReferrals: (list: ReferralUser[]) => void;
  theme: AppTheme;
}

export const ReferralLeague: React.FC<ReferralLeagueProps> = ({
  user,
  onUpdateUser,
  referrals,
  onUpdateReferrals,
  theme,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviterCodeInput, setInviterCodeInput] = useState('');
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  const inviteLink = `${window.location.origin}/?ref=${user.referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleClaimInviterCode = () => {
    const clean = inviterCodeInput.trim().toUpperCase();
    if (!clean) {
      setClaimMessage('لطفاً کد معرف معتبر وارد نمایید.');
      return;
    }
    if (clean === user.referralCode) {
      setClaimMessage('نمی‌توانید از کد معرف خودتان استفاده کنید!');
      return;
    }
    if (user.referredBy) {
      setClaimMessage(`شما قبلاً کد معرف ${user.referredBy} را ثبت نموده‌اید.`);
      return;
    }

    // Success claim: +500 points
    const updatedUser: UserProfile = {
      ...user,
      points: user.points + 500,
      referredBy: clean,
    };
    onUpdateUser(updatedUser);

    // Update referral ranking if found or add
    const updatedList = referrals.map((r) => {
      if (r.name.includes(clean) || r.id === clean) {
        return { ...r, invitesCount: r.invitesCount + 1, pointsEarned: r.pointsEarned + 500 };
      }
      return r;
    });
    onUpdateReferrals(updatedList);

    confetti({ particleCount: 80, spread: 70 });
    setClaimMessage('کد معرف با موفقیت ثبت شد! ۵۰۰ سکه طلایی به حساب شما واریز گردید.');
    setInviterCodeInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all relative overflow-hidden ${
        theme === 'luxury-gold'
          ? 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/40 border-amber-500/40 text-amber-50 shadow-amber-950/30'
          : theme === 'neon-starmaker'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-pink-950/40 border-pink-500/40 text-pink-50 shadow-pink-950/40'
          : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50'
      }`}>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-500 border border-amber-500/30">
              <Share2 className="w-3.5 h-3.5" />
              <span>لیگ رسمی معرفان و سفیران توانا سیتی</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              دوستانتان را به استارمیکر دعوت کنید، سکه و تندیس طلایی بگیرید!
            </h2>
            <p className="text-xs sm:text-sm opacity-80 max-w-xl leading-relaxed">
              با هر دعوتی که انجام می‌دهید، ۵۰۰ سکه طلایی دریافت کرده و در جدول برترین معرفان ماه برای جوایز نقدی و دسترسی ویژه استودیو رقابت می‌کنید.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/10 dark:bg-white/5 border border-current/10 text-center shrink-0 w-full md:w-auto">
            <span className="text-xs opacity-75 block mb-1">کد معرف اختصاصی شما:</span>
            <div className="text-xl sm:text-2xl font-mono font-black text-amber-500 tracking-wider mb-2">
              {user.referralCode}
            </div>
            <div className="flex items-center gap-2 justify-center">
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-current/20 hover:bg-black/5 flex items-center gap-1 active:scale-95 transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'کپی شد!' : 'کپی کد'}</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black flex items-center gap-1 active:scale-95 transition"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-black" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'کپی شد!' : 'کپی لینک دعوت'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Input section: Claim Inviter Code */}
      <div className={`p-4 sm:p-6 rounded-3xl border ${
        theme === 'luxury-gold'
          ? 'bg-zinc-900/80 border-amber-500/30 text-amber-100'
          : theme === 'neon-starmaker'
          ? 'bg-slate-900/80 border-pink-500/30 text-pink-100'
          : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-2 mb-2 font-black text-sm">
          <Gift className="w-4 h-4 text-amber-500" />
          <span>کد معرف دوستان را دارید؟ ثبت کنید و ۵۰۰ سکه رایگان بگیرید</span>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 max-w-md">
          <input
            type="text"
            dir="ltr"
            value={inviterCodeInput}
            onChange={(e) => setInviterCodeInput(e.target.value)}
            disabled={!!user.referredBy}
            placeholder={user.referredBy ? `ثبت شده: ${user.referredBy}` : 'مثال: SMK-772'}
            className="w-full sm:flex-1 px-3 py-2 text-xs font-mono font-bold rounded-xl border border-current/20 bg-transparent disabled:opacity-50"
          />
          <button
            onClick={handleClaimInviterCode}
            disabled={!!user.referredBy}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow transition active:scale-95 disabled:opacity-50 shrink-0"
          >
            {user.referredBy ? 'قبلاً دریافت شده' : 'ثبت و دریافت پاداش'}
          </button>
        </div>

        {claimMessage && (
          <p className="mt-2 text-xs font-bold text-amber-500 animate-fadeIn">
            {claimMessage}
          </p>
        )}
      </div>

      {/* Leaderboard Table of Top Recruiters */}
      <div className={`p-6 rounded-3xl border ${
        theme === 'luxury-gold'
          ? 'bg-zinc-900/90 border-amber-500/30 text-amber-100'
          : theme === 'neon-starmaker'
          ? 'bg-slate-900/90 border-pink-500/30 text-pink-100'
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center justify-between pb-4 border-b border-current/10 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-base">جدول رده‌بندی برترین معرفان ماه (لیگ سفیران)</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-500 font-bold">
            به‌روزرسانی هفتگی
          </span>
        </div>

        <div className="space-y-2.5">
          {referrals.map((item, idx) => {
            const isTop1 = idx === 0;
            const isTop2 = idx === 1;
            const isTop3 = idx === 2;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition ${
                  isTop1
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                    : isTop2
                    ? 'bg-slate-300/10 border-slate-400/40'
                    : isTop3
                    ? 'bg-amber-700/10 border-amber-700/30'
                    : 'bg-black/5 dark:bg-white/5 border-transparent'
                }`}
              >
                {/* Right: Rank & User */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                    isTop1
                      ? 'bg-amber-400 text-black'
                      : isTop2
                      ? 'bg-slate-300 text-black'
                      : isTop3
                      ? 'bg-amber-700 text-white'
                      : 'bg-current/10'
                  }`}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs sm:text-sm">{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300">
                        {item.badge}
                      </span>
                    </div>
                    <span className="text-[11px] opacity-70">
                      تعداد دعوت‌های موفق: <strong className="text-amber-500">{item.invitesCount}</strong> نفر
                    </span>
                  </div>
                </div>

                {/* Left: Points & Prize */}
                <div className="text-left font-black">
                  <span className="text-xs sm:text-sm text-amber-500">
                    +{item.pointsEarned.toLocaleString('fa-IR')} 🪙
                  </span>
                  <div className="text-[10px] opacity-60">پاداش واریزی</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
