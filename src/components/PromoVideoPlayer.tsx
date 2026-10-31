import React, { useState, useEffect } from 'react';
import { AppTheme } from '../types';
import { Video, Play, Pause, RotateCcw, Copy, Check, Sparkles, Film, Mic } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PromoVideoPlayerProps {
  theme: AppTheme;
}

export const PromoVideoPlayer: React.FC<PromoVideoPlayerProps> = ({ theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [copiedScript, setCopiedScript] = useState(false);

  const scenes = [
    {
      time: '00:00 - 00:05',
      title: 'قلاب طلایی (Hook)',
      desc: 'کلوزآپ از صفحه گوشی استارمیکر با ترانه‌ای که لیریکس ندارد یا زمانبندی‌اش به هم ریخته است!',
      voiceover: '«تا حالا شده بخوای تو استارمیکر آهنگ بخونی، اما ببینی متنش کلاً غلطه یا با ریتم موزیک سینک نیست؟»',
      visual: '📱 نمایش گوشی همراه و خواننده‌ای که سردرگم شده است.',
      accent: 'از ۰ تا ۵ ثانیه',
    },
    {
      time: '00:05 - 00:15',
      title: 'حل معضل با جادوی استارمیکر هلپر',
      desc: 'ورود به اپلیکیشن استارمیکر هلپر با تم لوکس مشکی و طلایی و دکمه غول‌پیکر تپ-تو-سینک.',
      voiceover: '«دیگه با نرم‌افزارهای پیچیده خداحافظی کن! با استودیو استارمیکر هلپر توانا سیتی، فقط با ریتم آهنگ روی صفحه تپ کن و در چند ثانیه لیریکس میلی‌ثانیه‌ای بساز!»',
      visual: '⚡ تپ کردن کاربر روی دکمه تپ با ضرب‌آهنگ موزیک و سبز شدن برچسب‌های زمانی.',
      accent: 'از ۵ تا ۱۵ ثانیه',
    },
    {
      time: '00:15 - 00:24',
      title: 'خروجی رسمی و درآمدزایی در لیگ معرفان',
      desc: 'دانلود فایل استاندارد .LRC، پیش‌نمایش زنده استیج کارائوکه و جوایز میلیونی لیگ سفیران.',
      voiceover: '«با یک کلیک فایل استاندارد LRC رو دانلود کن، توی استارمیکر یا اسپاتیفای آپلود کن، و با دعوت دوستانت در لیگ معرفان سکه و جوایز تالار مشاهیر ببر!»',
      visual: '🏆 رقص نور استیج کارائوکه، بارش سکه‌های طلایی و نشان‌های افتخار.',
      accent: 'از ۱۵ تا ۲۴ ثانیه',
    },
    {
      time: '00:24 - 00:30',
      title: 'فراخوان اقدام نهایی (Call To Action)',
      desc: 'لوگوی اکوسیستم توانا سیتی، نام اکبر علی‌میری (سیاوش) و لینک دانلود در مایکت و کافه بازار.',
      voiceover: '«همین حالا استارمیکر هلپر رو در مایکت و کافه بازار نصب کن و ستاره صحنه باش! اکوسیستم توانا سیتی.»',
      visual: '⭐ شعله طلایی توانا سیتی، بارکد QR نصب، و لینک‌های بازار و مایکت.',
      accent: 'از ۲۴ تا ۳۰ ثانیه',
    },
  ];

  // Video preview player timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 30) {
            setIsPlaying(false);
            confetti({ particleCount: 70, spread: 80 });
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Current active scene
  const currentSceneIndex = seconds < 5 ? 0 : seconds < 15 ? 1 : seconds < 24 ? 2 : 3;
  const currentScene = scenes[currentSceneIndex];

  const handleCopyFullScript = () => {
    const fullText = `سناریوی ویدئوی ۳۰ ثانیه‌ای آپارات - مولد و زمانبندی آسان استارمیکر (اکوسیستم توانا سیتی)
توسعه‌دهنده: آقای اکبر علی‌میری (سیاوش)

` + scenes.map((s, idx) => `[صحنه ${idx + 1} - ${s.time} (${s.title})]
نریشن: ${s.voiceover}
جلوه بصری: ${s.visual}
توضیحات: ${s.desc}
----------------------------------------`).join('\n');

    navigator.clipboard.writeText(fullText);
    setCopiedScript(true);
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
        theme === 'luxury-gold'
          ? 'bg-zinc-950 border-amber-500/40 text-amber-50'
          : theme === 'neon-starmaker'
          ? 'bg-slate-950 border-pink-500/40 text-pink-50'
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-500 border border-rose-500/30">
              <Film className="w-3.5 h-3.5" />
              <span>سناریو و نریشن ویدئوی ۳۰ ثانیه‌ای مخصوص آپارات و شبکه‌های اجتماعی</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              تیزر تبلیغاتی استاندارد با قلاب درگیرکننده و نرخ تبدیل بالا
            </h2>
            <p className="text-xs sm:text-sm opacity-80 max-w-xl leading-relaxed">
              طراحی شده بر اساس متدولوژی روانشناسی تبلیغات و قلاب ۵ ثانیه‌ای جهت جذب حداکثری مخاطبان ایرانی در آپارات، روبیکا و اینستاگرام.
            </p>
          </div>

          <button
            onClick={handleCopyFullScript}
            className="px-5 py-3 rounded-2xl font-black text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-black shadow-lg flex items-center gap-2 active:scale-95 transition shrink-0"
          >
            {copiedScript ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
            <span>{copiedScript ? 'کل سناریو کپی شد!' : 'کپی متن سناریو و نریشن'}</span>
          </button>
        </div>
      </div>

      {/* Simulated 30-Second Motion Preview Screen */}
      <div className="rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl bg-zinc-950 text-white relative">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>پیش‌نمایش موشن گرافیک ۳۰ ثانیه‌ای آپارات (تایم‌لاین زنده)</span>
          </div>

          <div className="font-mono text-sm font-black text-amber-400">
            {seconds.toString().padStart(2, '0')} / 30 ثانیه
          </div>
        </div>

        {/* Video Screen Content */}
        <div className="min-h-[260px] sm:min-h-[320px] p-6 sm:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.25), transparent 70%), #09090b',
          }}
        >
          {/* Active scene badge */}
          <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black mb-3">
            صحنه {currentSceneIndex + 1} از ۴ ({currentScene.time})
          </div>

          <h3 className="text-xl sm:text-3xl font-black text-amber-400 mb-3 drop-shadow">
            {currentScene.title}
          </h3>

          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 max-w-xl text-xs sm:text-sm font-bold text-amber-200 leading-relaxed mb-4">
            {currentScene.voiceover}
          </div>

          <p className="text-xs text-white/70 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>تصویر و جلوه بصری: {currentScene.visual}</span>
          </p>

          {/* Progress bar across bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
              style={{ width: `${(seconds / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* Player controls */}
        <div className="p-4 bg-black/60 border-t border-white/10 flex items-center justify-center gap-4">
          <button
            onClick={() => {
              setSeconds(0);
              setIsPlaying(true);
            }}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
            title="پخش مجدد از ابتدا"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-8 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black shadow-lg shadow-amber-500/30 flex items-center gap-2 active:scale-95 transition"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isPlaying ? 'توقف پیش‌نمایش' : 'شروع پخش ویدئوی تیزر (۳۰ ثانیه)'}</span>
          </button>
        </div>
      </div>

      {/* Storyboard 4-Scene Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenes.map((scene, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-all ${
              idx === currentSceneIndex
                ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                : 'bg-black/5 dark:bg-white/5 border-current/10'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-sm text-amber-500">صحنه {idx + 1}: {scene.title}</span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-current/10">
                {scene.time}
              </span>
            </div>

            <div className="text-xs font-semibold p-2.5 rounded-xl bg-black/10 dark:bg-white/5 border border-current/10 mb-2 leading-relaxed">
              <strong className="block text-[11px] opacity-70 mb-0.5">🎙️ نریشن گوینده:</strong>
              {scene.voiceover}
            </div>

            <div className="text-[11px] opacity-75 leading-relaxed">
              <strong>🎬 تصویر ویدئو: </strong>
              {scene.desc}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
