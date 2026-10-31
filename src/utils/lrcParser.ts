import { LyricLine, SongMetadata } from '../types';

/**
 * Format seconds to standard LRC timestamp: [mm:ss.xx]
 */
export function formatTimeLRC(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '[00:00.00]';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const minsStr = mins.toString().padStart(2, '0');
  const secsStr = secs.toFixed(2).padStart(5, '0');
  return `[${minsStr}:${secsStr}]`;
}

/**
 * Format seconds to friendly display time: mm:ss.d
 */
export function formatDisplayTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00.0';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const dec = Math.floor((seconds % 1) * 10);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${dec}`;
}

/**
 * Parses timestamp string e.g. [01:23.45] into seconds
 */
export function parseTimestamp(timeStr: string): number | null {
  const match = timeStr.match(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/);
  if (!match) return null;
  const mins = parseInt(match[1], 10);
  const secs = parseInt(match[2], 10);
  const fracStr = match[3] || '0';
  const fraction = fracStr.length === 3 ? parseInt(fracStr, 10) / 1000 : parseInt(fracStr, 10) / 100;
  return mins * 60 + secs + fraction;
}

/**
 * Parse a raw .lrc string into LyricLine array and SongMetadata
 */
export function parseLRCContent(content: string): { lines: LyricLine[]; metadata: SongMetadata } {
  const lines: LyricLine[] = [];
  const metadata: SongMetadata = {
    title: '',
    artist: '',
    album: '',
    creator: 'توانا سیتی - استارمیکر هلپر',
    offset: 0,
  };

  const rawLines = content.split(/\r?\n/);

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line) continue;

    // Check metadata tags
    const titleMatch = line.match(/\[ti:(.*)\]/i);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
      continue;
    }
    const artistMatch = line.match(/\[ar:(.*)\]/i);
    if (artistMatch) {
      metadata.artist = artistMatch[1].trim();
      continue;
    }
    const albumMatch = line.match(/\[al:(.*)\]/i);
    if (albumMatch) {
      metadata.album = albumMatch[1].trim();
      continue;
    }
    const offsetMatch = line.match(/\[offset:([+-]?\d+)\]/i);
    if (offsetMatch) {
      metadata.offset = parseInt(offsetMatch[1], 10);
      continue;
    }

    // Check lyric lines with timestamp
    // Match line like [00:12.30]text or multiple timestamps [00:12.30][00:45.00]text
    const timestampRegex = /\[(\d{2}:\d{2}(?:\.\d{2,3})?)\]/g;
    const timestamps: number[] = [];
    let match;

    while ((match = timestampRegex.exec(line)) !== null) {
      const parsed = parseTimestamp(match[0]);
      if (parsed !== null) {
        timestamps.push(parsed);
      }
    }

    const textOnly = line.replace(/\[\d{2}:\d{2}(?:\.\d{2,3})?\]/g, '').trim();

    if (timestamps.length > 0) {
      for (const t of timestamps) {
        lines.push({
          id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          text: textOnly || '♪ (موزیک)',
          timestamp: t,
        });
      }
    } else if (textOnly) {
      // Untimed line
      lines.push({
        id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        text: textOnly,
        timestamp: null,
      });
    }
  }

  // Sort lines by timestamp if available
  lines.sort((a, b) => {
    if (a.timestamp === null && b.timestamp === null) return 0;
    if (a.timestamp === null) return 1;
    if (b.timestamp === null) return -1;
    return a.timestamp - b.timestamp;
  });

  return { lines, metadata };
}

/**
 * Generate full standard .lrc file text with metadata and timestamps
 */
export function generateLRC(lines: LyricLine[], metadata: SongMetadata): string {
  const metaHeader = [
    `[ti:${metadata.title || 'ترانه بدون عنوان'}]`,
    `[ar:${metadata.artist || 'هنرمند نامشخص'}]`,
    `[al:${metadata.album || 'تک آهنگ'}]`,
    `[by:${metadata.creator || 'اکوسیستم توانا سیتی - سیاوش علی‌میری'}]`,
    `[offset:${metadata.offset || 0}]`,
    `[re:StarMaker Karaoke Helper - Tawana City]`,
    '',
  ];

  const body = lines.map((line) => {
    const timeTag = line.timestamp !== null ? formatTimeLRC(line.timestamp) : '[00:00.00]';
    return `${timeTag}${line.text}`;
  });

  return [...metaHeader, ...body].join('\n');
}

/**
 * Generate clean StarMaker paste format (ready for StarMaker lyric submission)
 */
export function generateStarMakerFormat(lines: LyricLine[], metadata: SongMetadata): string {
  const header = `# StarMaker Karaoke Synced Lyrics\n# Artist: ${metadata.artist || 'نامشخص'}\n# Title: ${metadata.title || 'نامشخص'}\n\n`;
  const body = lines
    .filter((l) => l.text.trim())
    .map((line) => {
      const tag = line.timestamp !== null ? formatTimeLRC(line.timestamp) : '[--:--]';
      return `${tag} ${line.text}`;
    })
    .join('\n');
  return header + body;
}
