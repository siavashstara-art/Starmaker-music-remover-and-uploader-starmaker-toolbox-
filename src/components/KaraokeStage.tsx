import React, { useState, useEffect, useRef } from 'react';
import { LyricLine, SongMetadata, AppTheme } from '../types';
import { formatDisplayTime } from '../utils/lrcParser';
import { Play, Pause, RotateCcw, Mic, Volume2, Sparkles, X, Fullscreen } from 'lucide-react';

interface KaraokeStageProps {
  lines: LyricLine[];
  metadata: SongMetadata;
  theme: AppTheme;
  onClose: () => void;
}

export const KaraokeStage: React.FC<KaraokeStageProps> = ({
  lines,
  metadata,
  theme,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stageTime, setStageTime] = useState(0);
  const [activeLineIdx, setActiveLineIdx] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLineElementRef = useRef<HTMLDivElement | null>(null);

  // Filter only lines that have timestamps
  const timedLines = lines
    .filter((l) => l.timestamp !== null)
    .sort((a, b) => a.timestamp! - b.timestamp!);

  const maxTime = timedLines.length > 0 ? (timedLines[timedLines.length - 1].timestamp || 0) + 10 : 30;

  // Real-time animation loop
  useEffect(() => {
    let animId: number;
    let lastStamp = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastStamp) / 1000;
      lastStamp = time;

      if (isPlaying) {
        setStageTime((prev) => {
          const next = prev + delta;
          if (next >= maxTime) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, maxTime]);

  // Determine which line is currently active
  useEffect(() => {
    if (timedLines.length === 0) return;

    let currentIdx = 0;
    for (let i = 0; i < timedLines.length; i++) {
      if (stageTime >= timedLines[i].timestamp!) {
        currentIdx = i;
      } else {
        break;
      }
    }
    setActiveLineIdx(currentIdx);

    // Auto-scroll active line into center
    if (activeLineElementRef.current && scrollContainerRef.current) {
      activeLineElementRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [stageTime, timedLines]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-white overflow-hidden select-none">
      
      {/* Stage Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-black text-xl shadow-lg">
            ⭐
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-amber-300">
              استیج زنده کارائوکه استارمیکر (StarMaker Stage)
            </h3>
            <p className="text-xs text-white/60">
              {metadata.title || 'ترانه کارائوکه'} - {metadata.artist || 'هنرمند'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/10 font-mono text-xs font-black text-amber-400">
            {formatDisplayTime(stageTime)}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Animated Stage Display */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-20 flex flex-col items-center justify-start relative scroll-smooth"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.15), transparent 70%), #09090b',
        }}
      >
        <div className="max-w-xl w-full text-center space-y-8 my-auto">
          {timedLines.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-white/70">
              هنوز زمانی برای این ترانه ثبت نشده است! لطفاً در تب استودیو ابتدا دکمه تپ را بزنید.
            </div>
          ) : (
            timedLines.map((line, idx) => {
              const isActive = idx === activeLineIdx;
              const isPast = idx < activeLineIdx;

              return (
                <div
                  key={line.id}
                  ref={isActive ? activeLineElementRef : null}
                  className={`transition-all duration-300 transform ${
                    isActive
                      ? 'scale-110 sm:scale-125 font-black text-xl sm:text-3xl text-amber-300 drop-shadow-[0_0_25px_rgba(251,191,36,0.8)] py-4'
                      : isPast
                      ? 'opacity-40 text-sm sm:text-base text-white/60'
                      : 'opacity-20 text-sm sm:text-base text-white/40'
                  }`}
                >
                  {/* Bouncing ball indicator on active line */}
                  {isActive && (
                    <div className="flex items-center justify-center gap-1.5 mb-2 animate-bounce text-amber-400">
                      <span>🎤</span>
                      <span className="text-xs uppercase tracking-widest font-black">هم‌اکنون بخوانید</span>
                    </div>
                  )}

                  <p className="leading-relaxed px-4">{line.text}</p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Stage Bottom Controls */}
      <div className="p-4 border-t border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-center gap-4">
        <button
          onClick={() => {
            setStageTime(0);
            setIsPlaying(true);
          }}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
          title="شروع مجدد استیج"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-8 py-3 rounded-2xl font-black text-base bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-xl shadow-amber-500/30 flex items-center gap-2 transition active:scale-95"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          <span>{isPlaying ? 'توقف استیج' : 'شروع کارائوکه زنده'}</span>
        </button>
      </div>

    </div>
  );
};
