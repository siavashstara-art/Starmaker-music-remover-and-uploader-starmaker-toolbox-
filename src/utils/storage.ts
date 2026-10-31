import { LyricLine, SongMetadata, UserProfile, ReferralUser, LoyaltyLegend } from '../types';

const STORAGE_KEYS = {
  CURRENT_LYRICS: 'starmaker_current_lyrics',
  CURRENT_META: 'starmaker_current_meta',
  USER_PROFILE: 'starmaker_user_profile',
  REFERRAL_LIST: 'starmaker_referral_list',
  LOYALTY_LEGENDS: 'starmaker_loyalty_legends',
  THEME: 'starmaker_app_theme',
};

export const SAMPLE_SONGS: { title: string; artist: string; lyrics: string }[] = [
  {
    title: 'جان مریم (Jane Maryam)',
    artist: 'محمد نوری (Mohammad Nouri)',
    lyrics: `جان مریم چشماتو وا کن
منو صدا کن
شد هوا سفید، در اومد خورشید
وقت اون رسیده که بریم به صحرا
وای نازنین مریم
باز دوباره صبح شد، من هنوز بیدارم
کاش می‌خوابیدم، تو رو خواب می‌دیدم
خوشه غم توی دلم زده جوونه
دونه به دونه`,
  },
  {
    title: 'بهت قول میدم (Behet Ghol Midam)',
    artist: 'محسن یگانه (Mohsen Yeganeh)',
    lyrics: `خودت می‌خوای بری خاطره شی اما دلت می‌سوزه
تظاهر می‌کنی عاشقی این بازی هر روزه
نترس نگم برات شاید برات دلگیره این رفتن
بی‌تفاوت باش اینجوری شاید دل کندن آسونه
بهت قول می‌دم سخت نیست لااقل برای تو
راحت باش دورم از تو و دنیای تو
بهت قول می‌دم یه روزی آرامش میاد
همین جا تو دلت، تموم می‌شه این درد و غصه`,
  },
  {
    title: 'سلطان قلب‌ها (Soltane Ghalbha)',
    artist: 'عارف (Aref)',
    lyrics: `یه دل می‌گه برم برم
یه دلم می‌گه نرم نرم
طاقت نداره دلم بی تو چه کنم
پیش کی برم دلم بی تو چه کنم
تو عشق و تمنای منی
تو سلطان قلب‌های منی
امید و رویای منی
تا زنده‌ام تنها برای منی`,
  },
];

export const INITIAL_LOYALTY_LEGENDS: LoyaltyLegend[] = [
  {
    rank: 1,
    name: 'سیاوش علی‌میری (موسس توانا سیتی)',
    avatar: '👑',
    title: 'اسطوره آفرینش و متدولوژی خدمات‌جو',
    score: 18500,
    streak: 42,
    songsTimed: 128,
    specialty: 'معماری همراز و اکوسیستم',
  },
  {
    rank: 2,
    name: 'آریا گلد استودیو',
    avatar: '⭐',
    title: 'خالق تم سوپر لوکس مشکی و طلایی',
    score: 14200,
    streak: 29,
    songsTimed: 94,
    specialty: 'تنظیم فرکانس و تایمینگ استیج',
  },
  {
    rank: 3,
    name: 'علیرضا کارائوکه باز',
    avatar: '🎤',
    title: 'قهرمان برتر استارمیکر پارسی',
    score: 9800,
    streak: 19,
    songsTimed: 67,
    specialty: 'سینک میلی‌ثانیه‌ای پاپ',
  },
  {
    rank: 4,
    name: 'مریم آوایی',
    avatar: '🌸',
    title: 'سفیر ترانه‌های سنتی و ماندگار',
    score: 7900,
    streak: 15,
    songsTimed: 48,
    specialty: 'تحریرهای آوازی و کشش هجا',
  },
  {
    rank: 5,
    name: 'رضا ملودی',
    avatar: '🎵',
    title: 'تنظیم‌کننده و میکسر برگزیده',
    score: 6400,
    streak: 11,
    songsTimed: 35,
    specialty: 'ضرب‌آهنگ راک و هیپ‌هاپ',
  },
];

export const INITIAL_REFERRALS: ReferralUser[] = [
  { id: 'ref-1', name: 'اکبر علی‌میری (سیاوش)', avatar: '👑', invitesCount: 312, pointsEarned: 15600, badge: 'افسانه‌ای' },
  { id: 'ref-2', name: 'تیم پشتیبانی توانا سیتی', avatar: '🚀', invitesCount: 215, pointsEarned: 10750, badge: 'الماس' },
  { id: 'ref-3', name: 'فرش‌باز مارکتینگ', avatar: '💎', invitesCount: 142, pointsEarned: 7100, badge: 'طلایی' },
  { id: 'ref-4', name: 'لینگوی آکادمی', avatar: '🌟', invitesCount: 98, pointsEarned: 4900, badge: 'نقره‌ای' },
  { id: 'ref-5', name: 'خدمات‌یار ایران', avatar: '🛠️', invitesCount: 76, pointsEarned: 3800, badge: 'برنزی' },
];

export function getStoredUserProfile(): UserProfile {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }

  // Default guest/active user
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const defaultUser: UserProfile = {
    id: `user-${Date.now()}`,
    name: 'هنرمند استارمیکر',
    avatar: '🎙️',
    authType: 'mobile',
    identifier: '۰۹۱۲***۴۵۶۷',
    referralCode: `SMK-${randomSuffix}`,
    points: 1250,
    completedSongs: 3,
    dailyStreak: 4,
    lastActiveDate: new Date().toISOString().split('T')[0],
    badge: 'طلایی',
  };
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultUser));
  return defaultUser;
}

export function saveStoredUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

export function getStoredLyrics(): LyricLine[] {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_LYRICS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }

  // Initialize with sample "Jane Maryam"
  const defaultSong = SAMPLE_SONGS[0];
  const initialLines = defaultSong.lyrics
    .split('\n')
    .filter((l) => l.trim().length > 0)
    .map((text, idx) => ({
      id: `line-${idx + 1}`,
      text: text.trim(),
      timestamp: idx === 0 ? 0.0 : idx === 1 ? 3.5 : idx === 2 ? 6.2 : null,
    }));

  return initialLines;
}

export function saveStoredLyrics(lines: LyricLine[]): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_LYRICS, JSON.stringify(lines));
}

export function getStoredMeta(): SongMetadata {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_META);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  return {
    title: SAMPLE_SONGS[0].title,
    artist: SAMPLE_SONGS[0].artist,
    album: 'آلبوم خاطره‌ها',
    creator: 'اکوسیستم توانا سیتی - سیاوش علی‌میری',
    offset: 0,
  };
}

export function saveStoredMeta(meta: SongMetadata): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_META, JSON.stringify(meta));
}

export function getStoredReferrals(): ReferralUser[] {
  const data = localStorage.getItem(STORAGE_KEYS.REFERRAL_LIST);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  return INITIAL_REFERRALS;
}

export function saveStoredReferrals(list: ReferralUser[]): void {
  localStorage.setItem(STORAGE_KEYS.REFERRAL_LIST, JSON.stringify(list));
}

export function getStoredLoyaltyLegends(): LoyaltyLegend[] {
  const data = localStorage.getItem(STORAGE_KEYS.LOYALTY_LEGENDS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  return INITIAL_LOYALTY_LEGENDS;
}
