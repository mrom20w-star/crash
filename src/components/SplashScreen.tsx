import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isPopping, setIsPopping] = useState(false);

  useEffect(() => {
    const totalTime = 10000; // 10 seconds
    const stepTime = 100; // 100ms
    const step = 100 / (totalTime / stepTime);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }

        setIsPopping(true);
        setTimeout(() => setIsPopping(false), 80);

        return next;
      });
    }, stepTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center select-none overflow-hidden z-10">
      {/* Centered Glowing Animated Logo */}
      <div className="animate-ambient-pulse flex flex-col items-center justify-center">
        <div className="relative">
          <img
            src="/IMG/crash_logo.png"
            alt="كراش Logo"
            className="w-[min(260px,58vw)] rounded-3xl object-contain drop-shadow-[0_0_35px_rgba(0,229,255,0.75)] drop-shadow-[0_0_65px_rgba(255,49,49,0.55)] animate-glitch"
          />
        </div>
        <div className="mt-3 text-center">
          <span className="text-xl sm:text-2xl font-black font-cinzel tracking-widest shimmer-text">
            كراش • CRASH
          </span>
        </div>
      </div>

      {/* Loading Percentage & Glowing Bar */}
      <div className="absolute bottom-[10%] sm:bottom-[12%] left-1/2 -translate-x-1/2 w-[88%] max-w-[360px] flex flex-col items-center gap-3">
        {/* Percentage Counter */}
        <div
          className={`font-orbitron font-extrabold text-lg text-white transition-transform duration-75 drop-shadow-[0_0_15px_rgba(255,49,49,0.95)] drop-shadow-[0_0_30px_rgba(0,229,255,0.8)] [direction:ltr] ${
            isPopping ? 'scale-125' : 'scale-100'
          }`}
        >
          {Math.floor(progress)}%
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-4 bg-[#141414]/80 rounded-full border border-[#00E5FF]/40 shadow-[0_0_35px_rgba(255,49,49,0.35),0_0_20px_rgba(0,229,255,0.25)] p-[3px] backdrop-blur-md overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF3131] via-[#00E5FF] to-[#FF3131] animate-shimmer shadow-[0_0_20px_rgba(0,229,255,0.7),0_0_30px_rgba(255,49,49,0.6)] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Quick Skip button */}
        <button
          onClick={onComplete}
          className="mt-2 text-[11px] text-white/50 hover:text-[#00E5FF] transition-colors underline decoration-dotted"
        >
          تخطي التحميل السريع
        </button>
      </div>
    </div>
  );
};
