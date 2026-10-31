import React, { useState, useRef, useEffect } from 'react';
import { LyricLine, SongMetadata, AppTheme, UserProfile } from '../types';
import { formatTimeLRC, formatDisplayTime } from '../utils/lrcParser';
import { generateKaraokeBackingTrackWav } from '../utils/audioSynth';
import { SAMPLE_SONGS } from '../utils/storage';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Volume2,
  Clock,
  Mic,
  Music,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Download,
  Sparkles,
  ChevronRight,
  Eye,
  CheckCircle,
  Wand2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TimingStudioProps {
  lines: LyricLine[];
  setLines: React.Dispatch<React.SetStateAction<LyricLine[]>>;
  metadata: SongMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<SongMetadata>>;
  theme: AppTheme;
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  onOpenExport: () => void;
  onOpenStage: () => void;
}

export const TimingStudio: React.FC<TimingStudioProps> = ({
  lines,
  setLines,
  metadata,
  setMetadata,
  theme,
  user,
  onUpdateUser,
  onOpenExport,
  onOpenStage,
}) => {
  // Audio playback state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string>('قطعه آماده توانا سیتی (سینتی‌سایزر)');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isGeneratingTrack, setIsGeneratingTrack] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Active line being timed
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [rawTextModalOpen, setRawTextModalOpen] = useState(false);
  const [rawTextInput, setRawTextInput] = useState('');
  const [manualOffset, setManualOffset] = useState<number>(0);

  // Auto-scroll the list to active line
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Generate an initial synth backing track if no audio loaded
  useEffect(() => {
    let isMounted = true;
    async function loadDefaultBacking() {
      try {
        setIsGeneratingTrack(true);
        const url = await generateKaraokeBackingTrackWav(45);
        if (isMounted) {
          setAudioSrc(url);
          setAudioFileName('موزیک پیش‌فرض کارائوکه (پاپ سنت سایزر ۴۵ ثانیه‌ای)');
        }
      } catch (e) {
        console.error('Synth track error', e);
      } finally {
        if (isMounted) setIsGeneratingTrack(false);
      }
    }

    if (!audioSrc) {
      loadDefaultBacking();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync audio time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioSrc) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => console.error(e));
    }
  };

  const seekRelative = (deltaSeconds: number) => {
    if (!audioRef.current) return;
    const target = Math.max(0, Math.min(duration, audioRef.current.currentTime + deltaSeconds));
    audioRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const setSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Upload custom audio file
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (audioSrc && audioSrc.startsWith('blob:')) {
      URL.revokeObjectURL(audioSrc);
    }
    const newUrl = URL.createObjectURL(file);
    setAudioSrc(newUrl);
    setAudioFileName(file.name);
    setIsPlaying(false);
    setCurrentTime(0);

    // Auto set title if empty
    if (!metadata.title) {
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
      setMetadata((prev) => ({ ...prev, title: cleanTitle }));
    }
  };

  // Mic Recording (Voice / Karaoke)
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recordedChunksRef.current = [];
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioSrc(url);
          setAudioFileName(`صدای ضبط شده شما (${new Date().toLocaleTimeString('fa-IR')})`);
          setIsPlaying(false);
          setCurrentTime(0);
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        setIsRecording(true);
      } catch (err) {
        alert('دسترسی به میکروفون داده نشد یا میکروفون در دسترس نیست.');
      }
    }
  };

  // Re-generate Synth Track
  const handleGenerateSynthTrack = async () => {
    try {
      setIsGeneratingTrack(true);
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      const url = await generateKaraokeBackingTrackWav(60);
      setAudioSrc(url);
      setAudioFileName('موزیک ملودیک اختصاصی توانا سیتی (۶۰ ثانیه)');
      setCurrentTime(0);
      confetti({ particleCount: 30, spread: 50 });
    } finally {
      setIsGeneratingTrack(false);
    }
  };

  // The Magic Tap Action: Stamp Current Active Line
  const handleTapTimestamp = () => {
    if (!audioRef.current) return;

    // Start playing if paused
    if (!isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true));
    }

    const stampTime = Number(audioRef.current.currentTime.toFixed(2));

    if (activeLineIndex < lines.length) {
      const updatedLines = [...lines];
      updatedLines[activeLineIndex] = {
        ...updatedLines[activeLineIndex],
        timestamp: stampTime,
      };
      setLines(updatedLines);

      // Move to next line
      if (activeLineIndex + 1 < lines.length) {
        setActiveLineIndex((prev) => prev + 1);
      } else {
        // Finished all lines! Reward points!
        confetti({ particleCount: 80, spread: 80 });
        onUpdateUser({
          ...user,
          points: user.points + 50,
          completedSongs: user.completedSongs + 1,
        });
      }
    }
  };

  // Keyboard shortcut listener (Space = Tap, Shift+Space = Pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTapTimestamp();
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seekRelative(-2);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seekRelative(2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, activeLineIndex, lines]);

  // Micro adjustments
  const adjustLineTime = (index: number, delta: number) => {
    const updated = [...lines];
    const current = updated[index].timestamp ?? currentTime;
    const newTime = Math.max(0, Number((current + delta).toFixed(2)));
    updated[index] = { ...updated[index], timestamp: newTime };
    setLines(updated);
  };

  const clearLineTime = (index: number) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], timestamp: null };
    setLines(updated);
  };

  const jumpToLine = (time: number | null) => {
    if (time !== null && audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Batch shift
  const handleBatchShift = (delta: number) => {
    const updated = lines.map((l) => ({
      ...l,
      timestamp: l.timestamp !== null ? Math.max(0, Number((l.timestamp + delta).toFixed(2))) : null,
    }));
    setLines(updated);
  };

  // Replace lyrics from text
  const handleApplyRawText = () => {
    if (!rawTextInput.trim()) return;
    const splitLines = rawTextInput
      .split(/\r?\n/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((text, idx) => ({
        id: `line-${Date.now()}-${idx}`,
        text,
        timestamp: null,
      }));

    if (splitLines.length > 0) {
      setLines(splitLines);
      setActiveLineIndex(0);
      setRawTextModalOpen(false);
      setRawTextInput('');
    }
  };

  // Load sample song
  const handleLoadSample = (sample: typeof SAMPLE_SONGS[0]) => {
    setMetadata((prev) => ({
      ...prev,
      title: sample.title,
      artist: sample.artist,
    }));
    const newLines = sample.lyrics
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((text, idx) => ({
        id: `line-${idx + 1}`,
        text,
        timestamp: idx === 0 ? 0.0 : idx === 1 ? 3.5 : null,
      }));
    setLines(newLines);
    setActiveLineIndex(0);
    confetti({ particleCount: 30, spread: 50 });
  };

  const timedCount = lines.filter((l) => l.timestamp !== null).length;
  const progressPercent = lines.length > 0 ? Math.round((timedCount / lines.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Hidden Audio Element */}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Main Studio Card */}
      <div className={`p-4 sm:p-6 rounded-3xl border shadow-xl transition-all ${
        theme === 'luxury-gold'
          ? 'bg-zinc-900/90 border-amber-500/40 text-amber-50 shadow-amber-950/30'
          : theme === 'neon-starmaker'
          ? 'bg-slate-900/90 border-pink-500/40 text-pink-50 shadow-pink-950/40'
          : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50'
      }`}>
        
        {/* Title Bar & Quick Song Selector */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-current/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black text-sm">
                🎙️ استودیو
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  زمان‌بندی حرفه‌ای و سینک ترانه استارمیکر
                </h2>
                <p className="text-xs opacity-75">
                  تپ لمسی همگام با ریتم موزیک، بدون نیاز به دانش پیچیده، خروجی استاندارد .lrc
                </p>
              </div>
            </div>
          </div>

          {/* Quick presets & action buttons */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            <button
              onClick={() => setRawTextModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-current/20 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5 transition active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-500" />
              <span>ورود/ویرایش متن شعر</span>
            </button>

            <button
              onClick={onOpenStage}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition active:scale-95 ${
                theme === 'luxury-gold'
                  ? 'bg-amber-400 text-black hover:bg-amber-300'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>پیش‌نمایش زنده استیج</span>
            </button>

            <button
              onClick={onOpenExport}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow flex items-center gap-1.5 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دریافت فایل LRC</span>
            </button>
          </div>
        </div>

        {/* Song Info Bar (Editable Inline) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-4 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-xs">
          <div>
            <label className="block opacity-70 font-semibold mb-1">نام ترانه:</label>
            <input
              type="text"
              value={metadata.title}
              onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-current/20 bg-transparent font-bold"
              placeholder="مثال: جان مریم"
            />
          </div>
          <div>
            <label className="block opacity-70 font-semibold mb-1">خواننده / هنرمند:</label>
            <input
              type="text"
              value={metadata.artist}
              onChange={(e) => setMetadata({ ...metadata, artist: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-current/20 bg-transparent font-bold"
              placeholder="مثال: محمد نوری"
            />
          </div>
          <div>
            <label className="block opacity-70 font-semibold mb-1">قطعات پیشنهادی آماده:</label>
            <select
              onChange={(e) => {
                const s = SAMPLE_SONGS.find((x) => x.title === e.target.value);
                if (s) handleLoadSample(s);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-current/20 bg-transparent font-bold cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled className="text-black">انتخاب ترانه نمونه...</option>
              {SAMPLE_SONGS.map((s, idx) => (
                <option key={idx} value={s.title} className="text-black">
                  {s.title} - {s.artist}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block opacity-70 font-semibold mb-1">وضعیت پیشرفت سینک:</label>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-current/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-black text-amber-500 shrink-0">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Audio Source Bar (File Upload, Synth, Mic) */}
        <div className={`p-4 rounded-2xl border mb-6 flex flex-col md:flex-row items-center justify-between gap-4 ${
          theme === 'luxury-gold'
            ? 'bg-zinc-950/60 border-amber-500/20'
            : theme === 'neon-starmaker'
            ? 'bg-slate-950/60 border-pink-500/20'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Music className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs sm:text-sm truncate max-w-xs">{audioFileName}</span>
                {isGeneratingTrack && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full animate-pulse">
                    تولید موسیقی...
                  </span>
                )}
              </div>
              <p className="text-[11px] opacity-70">
                مدت زمان: {formatDisplayTime(duration)} | موقعیت فعلی: {formatDisplayTime(currentTime)}
              </p>
            </div>
          </div>

          {/* Audio action buttons */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
            {/* Custom file upload */}
            <label className="px-3 py-1.5 rounded-xl text-xs font-bold border border-current/20 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex items-center gap-1.5 transition active:scale-95">
              <Upload className="w-3.5 h-3.5 text-amber-500" />
              <span>انتخاب موزیک از گوشی (MP3)</span>
              <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
            </label>

            {/* In-browser synth track */}
            <button
              onClick={handleGenerateSynthTrack}
              disabled={isGeneratingTrack}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-current/20 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
              title="تولید بکینگ‌ترک پاپ ریتمیک با وب‌آدیو"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>تولید موزیک سینت</span>
            </button>

            {/* Mic recording */}
            <button
              onClick={toggleRecording}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'border border-current/20 hover:bg-black/5 dark:hover:bg-white/5 text-rose-500'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isRecording ? 'در حال ضبط (توقف)' : 'ضبط با میکروفون'}</span>
            </button>
          </div>
        </div>

        {/* Audio Player Controls */}
        <div className="space-y-3 mb-6">
          {/* Progress scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold w-12 text-center text-amber-500">
              {formatDisplayTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.05}
              value={currentTime}
              onChange={(e) => {
                const target = parseFloat(e.target.value);
                setCurrentTime(target);
                if (audioRef.current) audioRef.current.currentTime = target;
              }}
              className="flex-1 accent-amber-500 h-2 bg-current/20 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono opacity-70 w-12 text-center">
              {formatDisplayTime(duration)}
            </span>
          </div>

          {/* Buttons: Play, Rewind, FastForward, Speed, Volume */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={() => seekRelative(-3)}
                className="p-2.5 rounded-2xl border border-current/20 hover:bg-black/5 dark:hover:bg-white/5 transition active:scale-95"
                title="۳ ثانیه عقب‌تر"
              >
                <Rewind className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className={`px-6 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition active:scale-95 ${
                  theme === 'luxury-gold'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-amber-500/30'
                    : theme === 'neon-starmaker'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-pink-500/40'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                <span>{isPlaying ? 'توقف پخش (P)' : 'پخش موسیقی (P)'}</span>
              </button>

              <button
                onClick={() => seekRelative(3)}
                className="p-2.5 rounded-2xl border border-current/20 hover:bg-black/5 dark:hover:bg-white/5 transition active:scale-95"
                title="۳ ثانیه جلوتر"
              >
                <FastForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    setCurrentTime(0);
                  }
                }}
                className="p-2.5 rounded-2xl border border-current/20 hover:bg-black/5 dark:hover:bg-white/5 transition active:scale-95"
                title="شروع مجدد از اول"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Playback speed selector */}
            <div className="flex items-center gap-1 text-xs">
              <span className="opacity-70 font-semibold ml-1">سرعت:</span>
              {[0.5, 0.75, 1.0, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSpeed(speed)}
                  className={`px-2 py-1 rounded-lg font-bold transition ${
                    playbackRate === speed
                      ? 'bg-amber-500 text-black font-black'
                      : 'border border-current/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BIG MASSIVE MOBILE TAP BUTTON (TOUCH & ADHD OPTIMIZED)        */}
        {/* ============================================================ */}
        <div className="my-6">
          <div className="text-center mb-2">
            <span className="text-xs font-bold text-amber-500 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              مصرع در حال زمان‌بندی: شماره {activeLineIndex + 1} از {lines.length}
            </span>
            <div className="text-base sm:text-xl font-black mt-1 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 min-h-[50px] flex items-center justify-center">
              « {lines[activeLineIndex]?.text || 'پایان اشعار'} »
            </div>
          </div>

          <button
            onClick={handleTapTimestamp}
            className={`w-full py-5 sm:py-7 rounded-3xl font-black text-lg sm:text-2xl flex flex-col items-center justify-center gap-1.5 shadow-2xl transition active:scale-98 select-none ${
              theme === 'luxury-gold'
                ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-zinc-950 ring-4 ring-amber-500/50 hover:brightness-105'
                : theme === 'neon-starmaker'
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white ring-4 ring-pink-500/50 hover:brightness-105'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white ring-4 ring-amber-400/50 hover:brightness-105'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">⏱️</span>
              <span>تپ برای ثبت زمان این مصرع</span>
            </div>
            <span className="text-xs sm:text-sm font-semibold opacity-85">
              (یا فشردن کلید Space روی کیبورد موبایل/کامپیوتر)
            </span>
          </button>
        </div>

        {/* Global Batch Controls */}
        <div className="flex items-center justify-between gap-2 flex-wrap py-2 border-y border-current/10 mb-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="opacity-70">شیفت زمانی کل اشعار:</span>
            <button
              onClick={() => handleBatchShift(-0.2)}
              className="px-2 py-1 rounded-lg border border-current/20 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
            >
              -۰.۲ ثانیه
            </button>
            <button
              onClick={() => handleBatchShift(0.2)}
              className="px-2 py-1 rounded-lg border border-current/20 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
            >
              +۰.۲ ثانیه
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (confirm('آیا مایلید تمام زمان‌های ثبت شده پاک شوند؟')) {
                  const updated = lines.map((l) => ({ ...l, timestamp: null }));
                  setLines(updated);
                  setActiveLineIndex(0);
                }
              }}
              className="px-2.5 py-1 rounded-lg border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 active:scale-95"
            >
              پاکسازی کل زمان‌ها
            </button>
          </div>
        </div>

        {/* Synchronized Lines List */}
        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
          {lines.map((line, idx) => {
            const isCurrentActive = idx === activeLineIndex;
            const isTimed = line.timestamp !== null;

            return (
              <div
                key={line.id}
                ref={isCurrentActive ? activeLineRef : null}
                className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 ${
                  isCurrentActive
                    ? theme === 'luxury-gold'
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/40'
                      : theme === 'neon-starmaker'
                      ? 'bg-pink-500/20 border-pink-400 text-pink-200 ring-2 ring-pink-400/40'
                      : 'bg-amber-100/70 border-amber-500 text-amber-950 ring-2 ring-amber-400'
                    : isTimed
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-black/5 dark:bg-white/5 border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                {/* Right: Index & Text */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    isCurrentActive
                      ? 'bg-amber-500 text-slate-950'
                      : isTimed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-current/10'
                  }`}>
                    {idx + 1}
                  </span>

                  <span className={`text-xs sm:text-sm font-bold truncate ${
                    isCurrentActive ? 'text-amber-500 dark:text-amber-300 font-black' : ''
                  }`}>
                    {line.text}
                  </span>
                </div>

                {/* Left: Timestamp pill & Micro adjustments */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  {/* Timestamp Display */}
                  <span
                    onClick={() => jumpToLine(line.timestamp)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black cursor-pointer border transition active:scale-95 ${
                      isTimed
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-current/5 border-current/20 opacity-50'
                    }`}
                    title="کلیک برای پرش موزیک به این زمان"
                  >
                    {isTimed ? formatTimeLRC(line.timestamp!) : '[--:--.--]'}
                  </span>

                  {/* Micro adjust +/- 0.1s */}
                  {isTimed && (
                    <>
                      <button
                        onClick={() => adjustLineTime(idx, -0.1)}
                        className="px-2 py-0.5 rounded-lg border border-current/20 text-[10px] font-bold hover:bg-black/5 dark:hover:bg-white/5"
                        title="-۰.۱ ثانیه"
                      >
                        -۰.۱
                      </button>
                      <button
                        onClick={() => adjustLineTime(idx, 0.1)}
                        className="px-2 py-0.5 rounded-lg border border-current/20 text-[10px] font-bold hover:bg-black/5 dark:hover:bg-white/5"
                        title="+۰.۱ ثانیه"
                      >
                        +۰.۱
                      </button>
                      <button
                        onClick={() => clearLineTime(idx)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10"
                        title="حذف زمان این مصرع"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {/* Set as active target */}
                  <button
                    onClick={() => setActiveLineIndex(idx)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition active:scale-95 ${
                      isCurrentActive
                        ? 'bg-amber-500 text-slate-950'
                        : 'border border-current/20 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {isCurrentActive ? 'هدف فعال' : 'انتخاب'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Modal for Raw Lyrics Input/Edit */}
      {rawTextModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl border transition-all ${
            theme === 'luxury-gold'
              ? 'bg-zinc-950 border-amber-500/40 text-amber-100'
              : theme === 'neon-starmaker'
              ? 'bg-slate-950 border-pink-500/40 text-pink-100'
              : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <h3 className="font-black text-base mb-2">ورود یا جایگزینی متن شعر</h3>
            <p className="text-xs opacity-75 mb-3 leading-relaxed">
              متن شعر را سطر به سطر پیست کنید. خطوط خالی به صورت خودکار حذف می‌شوند.
            </p>

            <textarea
              rows={10}
              value={rawTextInput}
              onChange={(e) => setRawTextInput(e.target.value)}
              placeholder={`جان مریم چشماتو وا کن\nمنو صدا کن\nشد هوا سفید، در اومد خورشید...`}
              className="w-full p-3 rounded-2xl border border-current/20 bg-transparent text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500 leading-relaxed"
            />

            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => setRawTextModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-current/20 hover:bg-black/5"
              >
                انصراف
              </button>
              <button
                onClick={handleApplyRawText}
                className="px-5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-black shadow transition active:scale-95"
              >
                اعمال متن شعر در استودیو
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
