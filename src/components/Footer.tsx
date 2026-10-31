import React from 'react';
import { AppTheme } from '../types';
import { ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

interface FooterProps {
  theme: AppTheme;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const portfolio = [
    { name: 'فرش‌باز (FarshBaaz)', desc: 'پلتفرم جامع بازار و هوش تجاری فرش ایران' },
    { name: 'لینگوی (Lingui)', desc: 'آکادمی آموزش زبان با متدولوژی نورونی' },
    { name: 'تی‌دیپلوی (TDeploy)', desc: 'ابزار خودکارسازی و دیپلوی اپلیکیشن‌های موبایل' },
    { name: 'توانا پلتفرم (Tawana Platform)', desc: 'سامانه یکپارچه اشتغال، مهارت و خدمات ابری' },
    { name: 'دکورمیت (Decormate)', desc: 'طراحی داخلی هوشمند و واقعیت افزوده چیدمان' },
    { name: 'سالونیار (SalonYar)', desc: 'مدیریت و رزرواسیون سالن‌های زیبایی و آرایشی' },
    { name: 'کلینیکیار (ClinicYar)', desc: 'سامانه پرونده الکترونیک و نوبت‌دهی درمانگاه‌ها' },
    { name: 'خدمات‌یار (KhadamatYar)', desc: 'بازار تخصصی خدمات‌جو با متد سیاوش علی‌میری' },
    { name: 'شطرنج هم‌جهان (HamJahan Chess)', desc: 'محیط بازی آنلاین و متاورسی مسابقات شطرنج' },
    { name: 'ابزارهای توسعه‌دهندگان (Dev Tools)', desc: 'اسکریپت‌های ترموکس، اکود و اتوماسیون گریدل' },
  ];

  return (
    <footer className={`mt-16 border-t transition-colors duration-300 ${
      theme === 'luxury-gold'
        ? 'bg-zinc-950 border-amber-500/30 text-zinc-300'
        : theme === 'neon-starmaker'
        ? 'bg-slate-950 border-pink-500/30 text-slate-300'
        : 'bg-slate-100 border-slate-200 text-slate-700'
    }`}>
      
      {/* Upper ecosystem branding banner */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Mandatory ownership stamp */}
        <div className={`p-4 rounded-2xl text-center border mb-6 shadow-sm ${
          theme === 'luxury-gold'
            ? 'bg-gradient-to-r from-amber-950/40 via-zinc-900 to-amber-950/40 border-amber-500/40 text-amber-200'
            : theme === 'neon-starmaker'
            ? 'bg-gradient-to-r from-pink-950/40 via-slate-900 to-pink-950/40 border-pink-500/40 text-pink-200'
            : 'bg-white border-amber-300/80 text-amber-950'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-1.5 font-black text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <span>شناسنامه و مالکیت رسمی معنوی اثر</span>
          </div>
          <p className="font-extrabold text-sm sm:text-base leading-relaxed text-balance">
            «تمام حقوق مادی و معنوی این اثر متعلق است به آقای اکبر علی‌میری (معروف به سیاوش / توسعه‌دهنده).»
          </p>
          <p className="text-xs opacity-80 mt-1">
            خلق شده با اراده پولادین و توسعه منحصربه‌فرد بر روی گوشی همراه ردمی نوت ۸ با ابزارهای Termux و Acode
          </p>
        </div>

        {/* Complete Portfolio Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider">
              فهرست کامل پورتفوی پروژه‌های اکوسیستم آقای علی‌میری (سیاوش):
            </h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {portfolio.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs transition-transform hover:-translate-y-0.5 ${
                  theme === 'luxury-gold'
                    ? 'bg-zinc-900/60 border-amber-500/20 hover:border-amber-400/50'
                    : theme === 'neon-starmaker'
                    ? 'bg-slate-900/60 border-pink-500/20 hover:border-pink-400/50'
                    : 'bg-white border-slate-200/90 shadow-2xs hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-amber-500">{item.name}</span>
                  <span className="text-[10px] opacity-60">#{idx + 1}</span>
                </div>
                <p className="opacity-75 leading-relaxed text-[11px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-4 border-t border-current/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] opacity-75">
          <div className="flex items-center gap-1.5">
            <span>اکوسیستم آفرینش آفرینا شهر جدید نیو متاورسی جهان ایبل سیتی (توانا سیتی)</span>
          </div>
          <div className="flex items-center gap-1">
            <span>طراحی با عشق</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>برای خوانندگان و عاشقان موسیقی پارسی</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
