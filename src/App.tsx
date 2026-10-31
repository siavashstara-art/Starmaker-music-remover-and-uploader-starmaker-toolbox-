import React, { useState, useEffect } from 'react';
import { LyricLine, SongMetadata, AppTheme, UserProfile, ReferralUser, LoyaltyLegend } from './types';
import {
  getStoredLyrics,
  saveStoredLyrics,
  getStoredMeta,
  saveStoredMeta,
  getStoredUserProfile,
  saveStoredUserProfile,
  getStoredReferrals,
  saveStoredReferrals,
  getStoredLoyaltyLegends,
} from './utils/storage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TimingStudio } from './components/TimingStudio';
import { KaraokeStage } from './components/KaraokeStage';
import { ExportModal } from './components/ExportModal';
import { DualAuthModal } from './components/DualAuthModal';
import { ReferralLeague } from './components/ReferralLeague';
import { LoyaltyHallOfFame } from './components/LoyaltyHallOfFame';
import { AndroidGradleBundle } from './components/AndroidGradleBundle';
import { PromoVideoPlayer } from './components/PromoVideoPlayer';
import { KhadamatJooGuide } from './components/KhadamatJooGuide';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('starmaker_app_theme') as AppTheme) || 'luxury-gold';
  });

  // User state
  const [user, setUser] = useState<UserProfile>(() => getStoredUserProfile());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<string>('timing');

  // Song lyrics and metadata
  const [lines, setLines] = useState<LyricLine[]>(() => getStoredLyrics());
  const [metadata, setMetadata] = useState<SongMetadata>(() => getStoredMeta());

  // Referrals & Legends
  const [referrals, setReferrals] = useState<ReferralUser[]>(() => getStoredReferrals());
  const [legends, setLegends] = useState<LoyaltyLegend[]>(() => getStoredLoyaltyLegends());

  // Modals & Stage
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);

  // PWA install state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Sync state changes to storage
  useEffect(() => {
    localStorage.setItem('starmaker_app_theme', theme);
  }, [theme]);

  useEffect(() => {
    saveStoredLyrics(lines);
  }, [lines]);

  useEffect(() => {
    saveStoredMeta(metadata);
  }, [metadata]);

  useEffect(() => {
    saveStoredUserProfile(user);
  }, [user]);

  useEffect(() => {
    saveStoredReferrals(referrals);
  }, [referrals]);

  // Handle URL referral param e.g. ?ref=SMK-772
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode && !user.referredBy && refCode !== user.referralCode) {
      setUser((prev) => ({
        ...prev,
        referredBy: refCode,
        points: prev.points + 500,
      }));
    }
  }, []);

  // PWA install event listener
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleImportLines = (newLines: LyricLine[], newMeta: SongMetadata) => {
    setLines(newLines);
    setMetadata(newMeta);
  };

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col transition-colors duration-300 font-sans selection:bg-amber-400 selection:text-black ${
        theme === 'luxury-gold'
          ? 'bg-zinc-950 text-amber-50'
          : theme === 'neon-starmaker'
          ? 'bg-slate-950 text-pink-50'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Global Header */}
      <Header
        theme={theme}
        setTheme={setTheme}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isInstallable={isInstallable}
        onInstall={handleInstallClick}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        
        {/* Active Tab View */}
        {activeTab === 'timing' && (
          <TimingStudio
            lines={lines}
            setLines={setLines}
            metadata={metadata}
            setMetadata={setMetadata}
            theme={theme}
            user={user}
            onUpdateUser={setUser}
            onOpenExport={() => setExportModalOpen(true)}
            onOpenStage={() => setStageOpen(true)}
          />
        )}

        {activeTab === 'karaoke' && (
          <KaraokeStage
            lines={lines}
            metadata={metadata}
            theme={theme}
            onClose={() => setActiveTab('timing')}
          />
        )}

        {activeTab === 'referral' && (
          <ReferralLeague
            user={user}
            onUpdateUser={setUser}
            referrals={referrals}
            onUpdateReferrals={setReferrals}
            theme={theme}
          />
        )}

        {activeTab === 'loyalty' && (
          <LoyaltyHallOfFame
            user={user}
            onUpdateUser={setUser}
            legends={legends}
            theme={theme}
          />
        )}

        {activeTab === 'android' && (
          <AndroidGradleBundle theme={theme} />
        )}

        {activeTab === 'promo' && (
          <PromoVideoPlayer theme={theme} />
        )}

        {activeTab === 'methodology' && (
          <KhadamatJooGuide theme={theme} />
        )}

      </main>

      {/* Floating Karaoke Stage Modal if triggered from studio */}
      {stageOpen && (
        <KaraokeStage
          lines={lines}
          metadata={metadata}
          theme={theme}
          onClose={() => setStageOpen(false)}
        />
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        lines={lines}
        metadata={metadata}
        onImportLines={handleImportLines}
        theme={theme}
      />

      {/* Dual Auth Modal */}
      <DualAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        onUpdateUser={setUser}
        theme={theme}
      />

      {/* Official Footer */}
      <Footer theme={theme} />
    </div>
  );
}
