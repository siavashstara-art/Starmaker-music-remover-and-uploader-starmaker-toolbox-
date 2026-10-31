import React, { useState } from 'react';
import { AppTheme } from '../types';
import { FileCode, Copy, Check, Download, Smartphone, Terminal, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AndroidGradleBundleProps {
  theme: AppTheme;
}

export const AndroidGradleBundle: React.FC<AndroidGradleBundleProps> = ({ theme }) => {
  const [activeFile, setActiveFile] = useState<'app_gradle' | 'root_gradle' | 'manifest' | 'termux_script' | 'keystore'>('app_gradle');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const APP_BUILD_GRADLE = `apply plugin: 'com.android.application'

android {
    namespace "com.tawanacity.starmakersync"
    compileSdk 34

    defaultConfig {
        applicationId "com.tawanacity.starmakersync"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        manifestPlaceholders = [
            bazaarAppId: "com.tawanacity.starmakersync",
            myketAppId: "com.tawanacity.starmakersync"
        ]
    }

    signingConfigs {
        release {
            storeFile file("keystore/release.jks")
            storePassword System.getenv("STORE_PASS") ?: "tawanacity_pass_2026"
            keyAlias "starmakersync"
            keyPassword System.getenv("KEY_PASS") ?: "tawanacity_pass_2026"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            applicationIdSuffix ".debug"
            debuggable true
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.coordinatorlayout:coordinatorlayout:1.2.0'
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'com.google.android.material:material:1.11.0'
    // Capacitor / Webview runtime
    implementation project(':capacitor-android')
}`;

  const ROOT_BUILD_GRADLE = `// Top-level build file for Tawana City Android Apps
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.1'
        classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.22'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        // Iranian mirrors (if needed)
        maven { url "https://maven.myket.ir" }
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}`;

  const ANDROID_MANIFEST = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Audio & Network Permissions for StarMaker Karaoke -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="استارمیکر هلپر"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name=".MainActivity"
            android:label="استارمیکر هلپر"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Custom Scheme for Referral Invites -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="starmakersync" android:host="ref" />
            </intent-filter>
        </activity>

    </application>
</manifest>`;

  const TERMUX_BUILD_SCRIPT = `#!/bin/bash
# ==============================================================================
# اسکریپت ساخت اتوماتیک APK و AAB در محیط Termux بر روی گوشی ردمی نوت ۸
# سازنده: آقای اکبر علی‌میری (سیاوش) - اکوسیستم توانا سیتی
# ==============================================================================

set -e
echo "🚀 شروع آماده‌سازی بسته اندروید استارمیکر هلپر در Termux..."

# ۱. نصب پکیج‌های پایه‌ای در Termux
pkg update -y && pkg install -y openjdk-17 nodejs git

# ۲. نصب Capacitor و ابزارهای بیلد
npm install -g @capacitor/cli @capacitor/core @capacitor/android

# ۳. بیلد پروژه وب
echo "📦 بیلد نسخه وب و PWA..."
npm run build

# ۴. سینک با پروژه اندروید
echo "🔄 سینک با دایرکتوری اندروید..."
npx cap sync android

# ۵. ساخت فایل APK ریلیز برای مایکت و کافه بازار
cd android
chmod +x gradlew
echo "🔨 کامپایل APK نهایی..."
./gradlew assembleRelease

# ۶. ساخت فایل AAB (اختیاری برای استورها)
echo "📦 کامپایل AAB باندل..."
./gradlew bundleRelease

echo "✅ ساخت موفقیت‌آمیز انجام شد!"
echo "📍 مسیر فایل APK: android/app/build/outputs/apk/release/app-release.apk"
echo "📍 مسیر فایل AAB: android/app/build/outputs/bundle/release/app-release.aab"
`;

  const KEYSTORE_COMMAND = `# دستور ساخت کلید امضا (Keystore) جهت انتشار رسمی در مایکت و کافه بازار
# در محیط Termux یا سیستم عامل اجرا کنید:

keytool -genkey -v \\
  -keystore release.jks \\
  -keyalg RSA \\
  -keysize 2048 \\
  -validity 10000 \\
  -alias starmakersync \\
  -dname "CN=Akbar AliMiri, OU=TawanaCity, O=NewMeta, L=Tehran, ST=Tehran, C=IR" \\
  -storepass tawana2026pass \\
  -keypass tawana2026pass

# برای امضای APK با apksigner:
apksigner sign --ks release.jks --ks-key-alias starmakersync --out app-signed.apk app-release-unsigned.apk
`;

  const fileMap = {
    app_gradle: { title: 'android/app/build.gradle', content: APP_BUILD_GRADLE },
    root_gradle: { title: 'android/build.gradle', content: ROOT_BUILD_GRADLE },
    manifest: { title: 'AndroidManifest.xml', content: ANDROID_MANIFEST },
    termux_script: { title: 'build_apk_termux.sh (ترموکس)', content: TERMUX_BUILD_SCRIPT },
    keystore: { title: 'دستور Keystore و امضای مایکت/بازار', content: KEYSTORE_COMMAND },
  };

  const downloadCurrentFile = () => {
    const cur = fileMap[activeFile];
    const blob = new Blob([cur.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cur.title.split('/').pop() || 'file.txt';
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 40, spread: 50 });
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
        theme === 'luxury-gold'
          ? 'bg-zinc-950 border-amber-500/40 text-amber-50'
          : theme === 'neon-starmaker'
          ? 'bg-slate-950 border-pink-500/40 text-pink-50'
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
              <Smartphone className="w-3.5 h-3.5" />
              <span>آماده‌سازی خودکار پکیج اندروید برای مایکت و کافه بازار</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              تنظیمات Gradle، مانیفست و اسکریپت ترموکس (Termux Build)
            </h2>
            <p className="text-xs sm:text-sm opacity-80 max-w-2xl leading-relaxed">
              طراحی شده متناسب با شرایط کاری توسعه‌دهنده (آقای علی‌میری) روی گوشی ردمی نوت ۸ با Termux و Acode؛ بدون نیاز به کامپیوتر یا ابزارهای سنگین دسکتاپ.
            </p>
          </div>

          <button
            onClick={() => copyText('all', fileMap[activeFile].content)}
            className="px-5 py-3 rounded-2xl font-black text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-black shadow-lg flex items-center gap-2 active:scale-95 transition shrink-0"
          >
            {copiedKey === 'all' ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
            <span>کپی محتوای فایل فعال</span>
          </button>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(Object.keys(fileMap) as Array<keyof typeof fileMap>).map((key) => {
          const item = fileMap[key];
          const isActive = activeFile === key;
          return (
            <button
              key={key}
              onClick={() => setActiveFile(key)}
              className={`p-3 rounded-2xl border text-xs font-bold transition text-right flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500 text-black border-amber-500 shadow-md font-black'
                  : 'bg-black/5 dark:bg-white/5 border-current/10 opacity-75 hover:opacity-100'
              }`}
            >
              <FileCode className="w-4 h-4 mb-1" />
              <span className="truncate">{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Editor / Code View Box */}
      <div className={`p-4 sm:p-6 rounded-3xl border ${
        theme === 'luxury-gold'
          ? 'bg-zinc-900 border-amber-500/30 text-amber-100'
          : theme === 'neon-starmaker'
          ? 'bg-slate-900 border-pink-500/30 text-pink-100'
          : 'bg-slate-900 text-slate-100 border-slate-700'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold text-amber-400">
              {fileMap[activeFile].title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyText(activeFile, fileMap[activeFile].content)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 active:scale-95 transition"
            >
              {copiedKey === activeFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === activeFile ? 'کپی شد' : 'کپی'}</span>
            </button>
            <button
              onClick={downloadCurrentFile}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1 active:scale-95 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود فایل</span>
            </button>
          </div>
        </div>

        <pre
          dir="ltr"
          className="p-4 rounded-2xl bg-black/60 overflow-x-auto text-xs font-mono leading-relaxed max-h-[450px] select-all"
        >
          {fileMap[activeFile].content}
        </pre>
      </div>

      {/* Cafe Bazaar and Myket Requirements Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-5 rounded-2xl border ${
          theme === 'luxury-gold' ? 'bg-zinc-950 border-amber-500/20' : 'bg-white border-slate-200'
        }`}>
          <h4 className="font-black text-sm text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
            <span>🛡️ الزامات انتشار در کافه بازار:</span>
          </h4>
          <ul className="text-xs space-y-1.5 opacity-80 list-disc list-inside leading-relaxed">
            <li>تنظیم `targetSdkVersion` روی نسخه ۳۴ یا بالاتر مطابق قوانین جدید بازار.</li>
            <li>عدم استفاده از دسترسی‌های غیرضروری و درج توضیح شفاف برای میکروفون.</li>
            <li>پشتیبانی کامل از زبان فارسی و راست‌چین (RTL).</li>
            <li>تست امضای V2/V3 از طریق apksigner با Keystore اختصاصی.</li>
          </ul>
        </div>

        <div className={`p-5 rounded-2xl border ${
          theme === 'luxury-gold' ? 'bg-zinc-950 border-amber-500/20' : 'bg-white border-slate-200'
        }`}>
          <h4 className="font-black text-sm text-amber-500 mb-2 flex items-center gap-1.5">
            <span>⚡ الزامات انتشار در مایکت:</span>
          </h4>
          <ul className="text-xs space-y-1.5 opacity-80 list-disc list-inside leading-relaxed">
            <li>امضای با کلید معتبر ۲۵۶ بیتی (حداقل اعتبار ۱۰,۰۰۰ روز).</li>
            <li>پشتیبانی از صفحات نمایش گوناگون موبایل و تبلت با رزولوشن‌های مختلف.</li>
            <li>تأییدیه حفظ حریم خصوصی کاربران (Privacy Policy) در بخش ورود.</li>
            <li>تطابق کامل بسته APK با معماری‌های arm64-v8a و armeabi-v7a.</li>
          </ul>
        </div>
      </div>

    </div>
  );
};
