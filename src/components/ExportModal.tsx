import React, { useState } from 'react';
import { LyricLine, SongMetadata, AppTheme } from '../types';
import { generateLRC, generateStarMakerFormat, parseLRCContent } from '../utils/lrcParser';
import { X, Copy, Check, Download, Upload, FileText, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lines: LyricLine[];
  metadata: SongMetadata;
  onImportLines: (lines: LyricLine[], meta: SongMetadata) => void;
  theme: AppTheme;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  lines,
  metadata,
  onImportLines,
  theme,
}) => {
  const [copied, setCopied] = useState(false);
  const [formatType, setFormatType] = useState<'lrc' | 'starmaker'>('lrc');
  const [importText, setImportText] = useState('');
  const [importTab, setImportTab] = useState(false);

  if (!isOpen) return null;

  const lrcText = generateLRC(lines, metadata);
  const starmakerText = generateStarMakerFormat(lines, metadata);
  const currentOutput = formatType === 'lrc' ? lrcText : starmakerText;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentOutput);
    setCopied(true);
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${metadata.title ? metadata.title.replace(/\s+/g, '_') : 'karaoke_lyrics'}.${formatType === 'lrc' ? 'lrc' : 'txt'}`;
    const blob = new Blob([currentOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseLRCContent(text);
        onImportLines(parsed.lines, parsed.metadata);
        onClose();
        confetti({ particleCount: 60, spread: 60 });
      }
    };
    reader.readAsText(file);
  };

  const handleImportPaste = () => {
    if (!importText.trim()) return;
    const parsed = parseLRCContent(importText);
    onImportLines(parsed.lines, parsed.metadata);
    onClose();
    confetti({ particleCount: 60, spread: 60 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className={`w-full max-w-2xl rounded-3xl p-6 shadow-2xl border transition-all ${
        theme === 'luxury-gold'
          ? 'bg-zinc-950 border-amber-500/40 text-amber-100'
          : theme === 'neon-starmaker'
          ? 'bg-slate-950 border-pink-500/40 text-pink-100'
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-base">استخراج و دریافت فایل استاندارد استارمیکر و LRC</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher: Export vs Import */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-bold">
            <button
              onClick={() => setImportTab(false)}
              className={`px-3 py-1.5 rounded-lg transition ${
                !importTab ? 'bg-amber-500 text-black shadow' : 'opacity-70'
              }`}
            >
              خروجی و دانلود
            </button>
            <button
              onClick={() => setImportTab(true)}
              className={`px-3 py-1.5 rounded-lg transition ${
                importTab ? 'bg-amber-500 text-black shadow' : 'opacity-70'
              }`}
            >
              وارد کردن فایل LRC موجود
            </button>
          </div>

          {!importTab && (
            <div className="flex gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-bold">
              <button
                onClick={() => setFormatType('lrc')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  formatType === 'lrc' ? 'bg-amber-500 text-black' : 'opacity-70'
                }`}
              >
                فرمت .LRC استاندارد
              </button>
              <button
                onClick={() => setFormatType('starmaker')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  formatType === 'starmaker' ? 'bg-amber-500 text-black' : 'opacity-70'
                }`}
              >
                فرمت استارمیکر
              </button>
            </div>
          )}
        </div>

        {!importTab ? (
          <div>
            {/* Output code box */}
            <div className="relative mb-4">
              <textarea
                readOnly
                dir="ltr"
                rows={12}
                value={currentOutput}
                className="w-full p-3 font-mono text-xs rounded-2xl border border-current/20 bg-black/20 focus:outline-hidden leading-relaxed select-all"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs opacity-75">
                تعداد خطوط زمان‌بندی شده: {lines.filter((l) => l.timestamp !== null).length} از {lines.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-current/20 hover:bg-black/5 flex items-center gap-1.5 active:scale-95 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'کپی شد!' : 'کپی کل متن'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-black shadow-lg flex items-center gap-1.5 active:scale-95 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>دانلود فایل {formatType === 'lrc' ? '.LRC' : '.TXT'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Import Tab */
          <div className="space-y-4">
            <p className="text-xs opacity-80 leading-relaxed">
              اگر قبلاً فایل .lrc دارید، می‌توانید آن را انتخاب یا متن آن را در زیر قرار دهید تا در استودیو بارگذاری شود و زمان‌های آن را به دلخواه جابجا و ویرایش کنید.
            </p>

            <label className="p-4 rounded-2xl border-2 border-dashed border-current/20 hover:border-amber-500 cursor-pointer flex flex-col items-center justify-center gap-2 transition text-xs font-bold">
              <Upload className="w-6 h-6 text-amber-500" />
              <span>انتخاب فایل .lrc از حافظه گوشی یا کامپیوتر</span>
              <input type="file" accept=".lrc,.txt" onChange={handleImportFile} className="hidden" />
            </label>

            <div>
              <label className="block text-xs font-bold mb-1 opacity-70">یا پیست کردن محتوای LRC:</label>
              <textarea
                rows={6}
                dir="ltr"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="[00:12.30]جان مریم چشماتو وا کن..."
                className="w-full p-2.5 rounded-xl border border-current/20 bg-black/20 text-xs font-mono"
              />
            </div>

            <button
              onClick={handleImportPaste}
              className="w-full py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow transition active:scale-95"
            >
              پردازش و باز کردن در استودیو
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
