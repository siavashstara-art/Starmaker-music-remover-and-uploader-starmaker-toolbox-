import React from 'react';
import { AppTheme } from '../types';
import { BookOpen, Sparkles, Music, ShieldCheck, Compass, Heart, Award } from 'lucide-react';

interface KhadamatJooGuideProps {
  theme: AppTheme;
}

export const KhadamatJooGuide: React.FC<KhadamatJooGuideProps> = ({ theme }) => {
  const principles = [
    {
      title: '۱. اصل کشف نیاز بنیادین خدمات‌جو (Empathetic Discovery)',
      desc: 'در متد اس‌ئی امیری (سیاوش علی‌میری)، هر کاربر یک «خدمات‌جو» با نیازهای عاطفی و احساسی است. خواننده کارائوکه نیازمند اعتمادبه‌نفس، هماهنگی ریتم و لذت بردن از لحظه اجراست؛ رابط کاربری باید هرگونه سردرگمی را خنثی کند.',
      badge: 'انسان‌محور',
    },
    {
      title: '۲. بستر مستقل همراز (Hamraz Sanctuary)',
      desc: 'بخش همراز بستری محرمانه و الهام‌بخش برای نگارش اشعار دلی، تمرین خوانندگی و اشتراک تجربیات است. کاربر در این بستر بدون قضاوت شدن، ترانه‌های اختصاصی خود را تولید و ثبت زمانی می‌کند.',
      badge: 'روانشناسی و آرامش',
    },
    {
      title: '۳. بستر مستقل آفرینش (Afarinesh Engine)',
      desc: 'موتور آفرینش در تواناسیتی، تبدیل ایده ذهنی ترانه به خروجی استاندارد فنی (.LRC و کارائوکه) را با یک تپ ساده میسر می‌سازد. حذف زواید نرم‌افزاری و جایگزینی آن با هوش بصری و ریتمیک.',
      badge: 'خلاقیت ناب',
    },
    {
      title: '۴. قانون سینک طلایی هجاها (Golden Syllable Timing)',
      desc: 'هر مصرع باید ۰.۱۵ ثانیه پیش از آغاز آواز شنیده و روشن شود تا چشم خواننده با مغز و حنجره همگام گردد. این فرمول طلایی حاصل صدها ساعت آزمایش صوتی در اکوسیستم توانا سیتی است.',
      badge: 'فرمول طلایی',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
        theme === 'luxury-gold'
          ? 'bg-zinc-950 border-amber-500/40 text-amber-50'
          : theme === 'neon-starmaker'
          ? 'bg-slate-950 border-pink-500/40 text-pink-50'
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-500 border border-amber-500/30">
            <Compass className="w-3.5 h-3.5" />
            <span>متدولوژی اختصاصی خدمات‌جو و مکتب آفرینش</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            اصول راهبردی سیاوش علی‌میری (اس‌ئی امیری) در تواناسیتی
          </h2>
          <p className="text-xs sm:text-sm opacity-80 max-w-2xl leading-relaxed">
            راهنمای جامع تعامل با ترانه، روانشناسی خوانندگی، هماهنگ‌سازی ذهنی ریتم و بسترهای مستقل همراز و آفرینش در جهان نیو متاورس ایبل سیتی.
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {principles.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl border transition-all ${
              theme === 'luxury-gold'
                ? 'bg-zinc-900/90 border-amber-500/30 text-amber-100 hover:border-amber-400/50'
                : theme === 'neon-starmaker'
                ? 'bg-slate-900/90 border-pink-500/30 text-pink-100 hover:border-pink-400/50'
                : 'bg-white border-slate-200 text-slate-800 hover:border-amber-400'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-500">
                {item.badge}
              </span>
              <span className="text-xs opacity-50 font-mono">اصل #{idx + 1}</span>
            </div>

            <h3 className="font-extrabold text-sm sm:text-base text-amber-500 dark:text-amber-400 mb-2">
              {item.title}
            </h3>

            <p className="text-xs opacity-80 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Practical Guide for StarMaker Lyricist */}
      <div className={`p-6 rounded-3xl border ${
        theme === 'luxury-gold'
          ? 'bg-zinc-950 border-amber-500/30 text-amber-200'
          : theme === 'neon-starmaker'
          ? 'bg-slate-950 border-pink-500/30 text-pink-200'
          : 'bg-amber-50 border-amber-200 text-amber-950'
      }`}>
        <h4 className="font-black text-sm mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>توصیه‌های طلایی اس‌ئی امیری برای انتشار ترانه در استارمیکر:</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs leading-relaxed">
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10">
            <strong className="block font-black mb-1">۱. پیش‌شنوایی و تنفس:</strong>
            همیشه پیش از تپ کردن، یک بار کل آهنگ را گوش دهید و محل نفس‌گیری‌های خواننده را علامت بگذارید.
          </div>
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10">
            <strong className="block font-black mb-1">۲. تپ با سرعت ۰.۷۵x:</strong>
            برای آهنگ‌های سرعتی و رپ، سرعت پخش را روی ۰.۷۵ قرار دهید تا دقت ثبت زمان‌ها به میلی‌ثانیه برسد.
          </div>
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10">
            <strong className="block font-black mb-1">۳. تست در استیج زنده:</strong>
            قبل از گرفتن خروجی، دکمه «پیش‌نمایش استیج» را بزنید و خودتان یک بار با آن همخوانی کنید.
          </div>
        </div>
      </div>

    </div>
  );
};
