/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ParticleCanvas } from './components/ParticleCanvas';
import { TopBar } from './components/TopBar';
import { SplashScreen } from './components/SplashScreen';
import { PlatformsScreen, PlatformItem } from './components/PlatformsScreen';
import { LoginScreen } from './components/LoginScreen';
import { VerificationScreen } from './components/VerificationScreen';
import { CrashRadarScreen } from './components/CrashRadarScreen';

type ScreenType = 'splash' | 'platforms' | 'login' | 'verification' | 'crash';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformItem>({
    id: '1Xbet',
    name: '1XBET',
    status: 'active',
    image: '/IMG/platform/1XBET.JPG',
    promoCode: 'MXG1',
  });
  const [userId, setUserId] = useState<string>('748291034');

  const handleSplashComplete = () => {
    setCurrentScreen('platforms');
  };

  const handlePlatformConnected = (platform: PlatformItem) => {
    setSelectedPlatform(platform);
    setCurrentScreen('login');
  };

  const handleLoginSuccess = (enteredId: string) => {
    setUserId(enteredId);
    setCurrentScreen('crash');
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-black text-white overflow-x-hidden select-none [direction:rtl]">
      {/* Background Graphic (MAFYA.GIF with fallback and overlay) */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/IMG/MAFYA.GIF'), radial-gradient(circle at center, #111 0%, #000 100%)",
        }}
      />

      {/* Cyber Ambient Gradient Overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(900px 520px at 50% 30%, rgba(0, 229, 255, 0.08), transparent 62%),
            radial-gradient(800px 450px at 20% 20%, rgba(255, 49, 49, 0.06), transparent 60%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.35))
          `,
          backdropFilter: 'blur(1px)',
        }}
      />

      {/* Rising Neon Particle System */}
      <ParticleCanvas />

      {/* Top Bar with Live Online Users & Version */}
      <TopBar />

      {/* Screen Router */}
      <main className="relative z-10 w-full min-h-[100dvh] flex flex-col justify-center">
        {currentScreen === 'splash' && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}

        {currentScreen === 'platforms' && (
          <PlatformsScreen onConnected={handlePlatformConnected} />
        )}

        {currentScreen === 'login' && (
          <LoginScreen
            platform={selectedPlatform}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToVerification={() => setCurrentScreen('verification')}
          />
        )}

        {currentScreen === 'verification' && (
          <VerificationScreen
            platform={selectedPlatform}
            onNavigateToLogin={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'crash' && (
          <CrashRadarScreen
            userId={userId}
            platform={selectedPlatform}
            onLogout={() => setCurrentScreen('login')}
          />
        )}
      </main>
    </div>
  );
}
