export interface LyricLine {
  id: string;
  text: string;
  timestamp: number | null; // time in seconds, or null if untimed
  words?: { text: string; offset: number }[]; // optional word-level split
}

export interface SongMetadata {
  title: string;
  artist: string;
  album: string;
  creator: string;
  offset: number; // in milliseconds
}

export type AppTheme = 'vibrant-light' | 'luxury-gold' | 'neon-starmaker';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  authType: 'mobile' | 'email' | 'google';
  identifier: string; // phone, email, etc.
  referralCode: string;
  referredBy?: string;
  points: number;
  completedSongs: number;
  dailyStreak: number;
  lastActiveDate: string;
  badge: 'برنزی' | 'نقره‌ای' | 'طلایی' | 'الماس' | 'افسانه‌ای';
}

export interface ReferralUser {
  id: string;
  name: string;
  avatar: string;
  invitesCount: number;
  pointsEarned: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface LoyaltyLegend {
  rank: number;
  name: string;
  avatar: string;
  title: string;
  score: number;
  streak: number;
  songsTimed: number;
  specialty: string;
}
