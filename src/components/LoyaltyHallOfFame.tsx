import React, { useState } from 'react';
import { UserProfile, LoyaltyLegend, AppTheme } from '../types';
import { Trophy, Flame, Star, Award, Crown, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoyaltyHallOfFameProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  legends: LoyaltyLegend[];
  theme: AppTheme;
}

export const LoyaltyHallOfFame: React.FC<LoyaltyHallOfFameProps> = ({
  user,
  onUpdateUser,
  legends,
  theme,
}) => {
  const [checkedInToday, setCheckedInToday] = useState(false);

  const handleDailyCheckIn = () => {
    if (checkedInToday) return;
    const updated: UserProfile = {
      ...user,
      points: user.points + 50,
      dailyStreak: user.dailyStreak + 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    onUpdateUser(updated);
    setCheckedInToday(true);
    confetti({ particleCount: 60, spread: 60 });
  };

  const badges = [
    { name: 'پیشگام استودیو', desc: 'تکمیل اولین ترانه کارائوکه', unlocked: user.completedSongs >= 1, icon: '🎤' },
    { name: 'سینک طلایی', desc: 'زمان‌بندی بیش از ۳ ترانه', unlocked: user.completedSongs >= 3, icon: '⭐' },
    { name: 'زنجیره آتشین', desc: 'حداقل ۳ روز فعالیت مداوم', unlocked: user.dailyStreak >= 3, icon: '🔥' },
    { name: 'سفیر توانا سیتی', desc: 'کسب بیش از ۱۰۰۰ سکه وفاداری', unlocked: user.points >= 1000, icon: '👑' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top User Loyalty Status Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
        theme === 'luxury-gold'
          ? 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/50 border-amber-500/40 text-amber-50 shadow-amber-950/30'
          : theme === 'neon-starmaker'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/50 border-pink-500/40 text-pink-50 shadow-pink-950/40'
          : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50'
      }`}>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-500 border border-amber-500/30">
              <Crown className="w-3.5 h-3.5" />
              <span>لیگ مشاهیر و تالار وفاداران (Loyalty Legends)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              پروفایل وفاداری و رتبه شما در تالار افتخارات
            </h2>
            <p className="text-xs sm:text-sm opacity-80 max-w-xl leading-relaxed">
              هر روز با مراجعه به استودیو، زنجیره وفاداری خود را ارتقا داده و نشان‌های افتخار و جوایز نقدی دریافت کنید.
            </p>
          </div>

          {/* Daily Streak & Check-in Button */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="p-3.5 rounded-2xl bg-black/10 dark:bg-white/5 border border-current/10 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-xl">
                <Flame className="w-5 h-5 fill-amber-500 animate-pulse text-amber-500" />
                <span>{user.dailyStreak} روز</span>
              </div>
              <span className="text-[11px] opacity-75">زنجیره مداوم</span>
            </div>

            <button
              onClick={handleDailyCheckIn}
              disabled={checkedInToday}
              className={`px-5 py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95 ${
                checkedInToday
                  ? 'bg-emerald-600 text-white opacity-80 cursor-default'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-amber-500/30'
              }`}
            >
              {checkedInToday ? <CheckCircle2 className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
              <span>{checkedInToday ? 'حضور امروز ثبت شد (+۵۰)' : 'ثبت حضور روزانه (+۵۰ سکه)'}</span>
            </button>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="mt-6 pt-6 border-t border-current/10">
          <h4 className="text-xs font-bold opacity-75 mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>نشان‌های افتخار کسب‌شده شما:</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map((b, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center transition ${
                  b.unlocked
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-300'
                    : 'bg-black/5 dark:bg-white/5 border-transparent opacity-40'
                }`}
              >
                <div className="text-2xl mb-1">{b.icon}</div>
                <div className="font-black text-xs">{b.name}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{b.desc}</div>
                <div className="mt-1.5 text-[9px] font-black uppercase tracking-wider">
                  {b.unlocked ? '✓ آزاد شده' : 'قفل'}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Hall of Fame Cards Grid */}
      <div className={`p-6 rounded-3xl border ${
        theme === 'luxury-gold'
          ? 'bg-zinc-900/90 border-amber-500/30 text-amber-100'
          : theme === 'neon-starmaker'
          ? 'bg-slate-900/90 border-pink-500/30 text-pink-100'
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center justify-between pb-4 border-b border-current/10 mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-base">تالار مشاهیر و اسطوره‌های استارمیکر</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-500 font-bold">
            مشاهیر جاودان
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {legends.map((legend) => (
            <div
              key={legend.rank}
              className={`p-4 rounded-2xl border transition-all hover:-translate-y-1 ${
                legend.rank === 1
                  ? 'bg-gradient-to-br from-amber-500/20 via-zinc-900/40 to-amber-950/30 border-amber-500/60 ring-2 ring-amber-500/40'
                  : 'bg-black/5 dark:bg-white/5 border-current/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl shadow">
                    {legend.avatar}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm flex items-center gap-1">
                      <span>{legend.name}</span>
                      {legend.rank === 1 && <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    </h4>
                    <span className="text-[11px] text-amber-500 font-semibold">{legend.title}</span>
                  </div>
                </div>

                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                  legend.rank === 1 ? 'bg-amber-400 text-black' : 'bg-current/10'
                }`}>
                  #{legend.rank}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-xl bg-black/10 dark:bg-white/5 text-center text-xs">
                <div>
                  <span className="block opacity-60 text-[10px]">امتیاز کل</span>
                  <span className="font-black text-amber-500">{legend.score.toLocaleString('fa-IR')}</span>
                </div>
                <div>
                  <span className="block opacity-60 text-[10px]">زنجیره</span>
                  <span className="font-black text-rose-500">{legend.streak} روز</span>
                </div>
                <div>
                  <span className="block opacity-60 text-[10px]">ترانه‌ها</span>
                  <span className="font-black text-emerald-500">{legend.songsTimed}</span>
                </div>
              </div>

              <div className="mt-3 text-[11px] opacity-75 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>حوزه تخصصی: {legend.specialty}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
