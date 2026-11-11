import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlatformItem } from './PlatformsScreen';

interface CrashRadarScreenProps {
  userId: string;
  platform: PlatformItem | null;
  onLogout: () => void;
}

export const CrashRadarScreen: React.FC<CrashRadarScreenProps> = ({
  userId,
  platform,
  onLogout,
}) => {
  const currentPlatform = platform || {
    id: '1Xbet',
    name: '1XBET',
    status: 'active',
    image: '/IMG/platform/1XBET.JPG',
    promoCode: 'MXG1',
  };

  const [crashValue, setCrashValue] = useState('1.25x');
  const [hasErrored, setHasErrored] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLiveRunning, setIsLiveRunning] = useState(true);
  const [roundNumber, setRoundNumber] = useState(1);

  // History ribbon of previous rounds
  const [history, setHistory] = useState<string[]>([
    '1.18x',
    '1.24x',
    '1.12x',
    '1.45x',
    '1.20x',
    '2.65x',
    '1.15x',
  ]);

  // Time left in seconds (e.g. 59 minutes 48 seconds)
  const [secondsLeft, setSecondsLeft] = useState(3588);

  const modalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const predictionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const consecutiveLowRoundsRef = useRef(3);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatHHMMSS = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = Math.floor(totalSec % 60);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  /**
   * التوزيع الرياضي الدقيق لتوقعات كراش وفقاً لطلب المستخدم:
   * "تكون 1، 1.20، 1.25، اللي هي ما تطلعش عن الواحد وحاجة، يعني ما تطلعش عن الاتنين.
   * وفين وفين بعد كذا دور يجيب مثلا الـ 3 والـ 2.5"
   */
  const generateWeightedPrediction = useCallback(() => {
    const count = consecutiveLowRoundsRef.current;

    // وفين وفين: احتمال ظهور مضاعف فوق الـ 2.00x فقط بعد عدة أدوار متتالية
    const shouldSpike = count >= 4 && Math.random() < 0.35;

    if (shouldSpike) {
      // جولة مرتفعة نادرة (2.40x إلى 3.50x)
      consecutiveLowRoundsRef.current = 0;
      const spikeOptions = [2.35, 2.50, 2.78, 3.10, 3.25, 3.60];
      const val = spikeOptions[Math.floor(Math.random() * spikeOptions.length)];
      return val.toFixed(2) + 'x';
    } else {
      // 85% من الأدوار تكون في نطاق 1.05x إلى 1.85x (ما تطلعش عن الـ 2)
      consecutiveLowRoundsRef.current = count + 1;
      const typicalOptions = [
        1.10, 1.15, 1.18, 1.20, 1.22, 1.25, 1.28, 1.32, 1.35, 1.42, 1.48, 1.55, 1.62, 1.74, 1.85
      ];
      // نزيد فرصة الـ 1.20 والـ 1.25 والـ 1.15
      const val = typicalOptions[Math.floor(Math.random() * typicalOptions.length)];
      return val.toFixed(2) + 'x';
    }
  }, []);

  const triggerErrorPhase = useCallback(() => {
    if (predictionIntervalRef.current) {
      clearInterval(predictionIntervalRef.current);
      predictionIntervalRef.current = null;
    }
    setCrashValue('EROR');
    setHasErrored(true);
    setIsLiveRunning(false);
    setShowErrorModal(true);
  }, []);

  const startRadarCycle = useCallback(() => {
    if (predictionIntervalRef.current) clearInterval(predictionIntervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (modalTimerRef.current) clearTimeout(modalTimerRef.current);

    setHasErrored(false);
    setShowErrorModal(false);
    setIsLiveRunning(true);

    const initialVal = generateWeightedPrediction();
    setCrashValue(initialVal);
    setHistory((prev) => [initialVal, ...prev.slice(0, 8)]);
    setRoundNumber((r) => r + 1);

    // Live flicker simulation for 10 seconds: keeps switching between 1.15 - 1.30
    predictionIntervalRef.current = setInterval(() => {
      setCrashValue(generateWeightedPrediction());
    }, 180);

    // After 10s of predictions, triggers EROR
    timeoutRef.current = setTimeout(() => {
      triggerErrorPhase();
    }, 10000);
  }, [generateWeightedPrediction, triggerErrorPhase]);

  useEffect(() => {
    startRadarCycle();
    return () => {
      if (predictionIntervalRef.current) clearInterval(predictionIntervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
    };
  }, [startRadarCycle]);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
    modalTimerRef.current = setTimeout(() => {
      if (hasErrored) {
        setShowErrorModal(true);
      }
    }, 8000);
  };

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center pt-16 pb-14 px-4 z-10 select-none">
      {/* Radar Main Container (عريض، سميك، وبارز بتأثيرات سايبر قوية) */}
      <div className="w-full max-w-[520px] flex flex-col items-center gap-3.5">
        {/* Brand header pill (سميك وبارز) */}
        <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-black/70 border-2 border-[#00E5FF]/45 backdrop-blur-xl shadow-lg">
          <img
            src="/IMG/crash_logo.png"
            alt="كراش"
            className="w-7 h-7 rounded-lg object-cover border border-[#00E5FF]/50"
          />
          <span className="font-cinzel font-black text-xs sm:text-sm text-white tracking-wider">
            رادار كراش • CRASH PREDICTOR
          </span>
          <span className="text-white/40">•</span>
          <span className="font-orbitron font-black text-xs text-[#00E5FF]">
            جولة #{roundNumber}
          </span>
        </div>

        {/* History Bar (شريط تاريخ الجولات السابقة كما في منصات الكراش الحقيقية) */}
        <div className="w-full flex items-center justify-center gap-1.5 overflow-x-auto py-1 px-2 no-scrollbar [direction:ltr]">
          <span className="text-[10px] font-black text-white/50 mr-1 font-orbitron">LAST:</span>
          {history.map((val, idx) => {
            const num = parseFloat(val);
            const isHigh = num >= 2.0;
            return (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded-xl text-xs font-orbitron font-black border-2 transition-transform shadow-md ${
                  isHigh
                    ? 'border-[#FF3131] bg-[#FF3131]/25 text-white drop-shadow-[0_0_8px_#FF3131] scale-105'
                    : 'border-[#00E5FF]/50 bg-[#00E5FF]/15 text-[#00E5FF]'
                }`}
              >
                {val}
              </span>
            );
          })}
        </div>

        {/* Radar Circular Display (حواف سميكة، ليزر قوي، ودوائر واضحة) */}
        <div className="relative w-[min(82vw,390px)] aspect-square flex items-center justify-center rounded-full bg-gradient-to-br from-black/80 via-[#0a0a0a]/90 to-black backdrop-blur-2xl border-3 border-[#FF3131]/60 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_60px_rgba(255,49,49,0.35),0_0_45px_rgba(0,229,255,0.25)] overflow-hidden">
          {/* Radar Grid (أكثر سماكة ووضوحاً) */}
          <div
            className="absolute inset-0 rounded-full opacity-45 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255, 49, 49, 0.35) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255, 49, 49, 0.35) 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
              maskImage: 'radial-gradient(circle, black 50%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 80%)',
            }}
          />

          {/* Radar Concentric Rings (حلقات سميكة وقوية) */}
          <div className="absolute inset-0 rounded-full border-2 border-[#00E5FF]/40 pointer-events-none" />
          <div className="absolute inset-5 rounded-full border-2 border-dashed border-[#FF3131]/45 pointer-events-none" />
          <div className="absolute inset-10 rounded-full border-2 border-[#00E5FF]/30 pointer-events-none" />
          <div className="absolute inset-16 rounded-full border border-dashed border-white/20 pointer-events-none" />

          {/* Scanning Lasers (أشعة ليزر سميكة وساطعة) */}
          <div className="laser-line-x !h-[2px] !opacity-90 shadow-[0_0_15px_#00E5FF]" />
          <div className="laser-line-y !w-[2px] !opacity-90 shadow-[0_0_15px_#FF3131]" />

          {/* Central Multiplier readout (سميك وبارز جداً) */}
          <div
            id="crashValue"
            className={`relative z-10 font-orbitron text-[clamp(48px,13vw,84px)] font-black tracking-wider px-8 py-3 rounded-3xl bg-black/75 backdrop-blur-xl border-2 border-white/15 transition-all drop-shadow-[0_0_30px_rgba(0,229,255,0.5)] drop-shadow-[0_0_55px_rgba(255,49,49,0.35)] [direction:ltr] ${
              hasErrored
                ? 'glitch-text text-[#FF3131]'
                : 'text-white font-black text-[#00E5FF]'
            }`}
          >
            {crashValue}
          </div>
        </div>

        {/* Stack of Information Cards (سميكة، واضحة، وبحدود 2px متينة) */}
        <div className="flex flex-col items-center gap-3 w-full mt-1">
          {/* ID Card */}
          <div className="px-6 py-2.5 rounded-2xl bg-black/60 border-2 border-[#00E5FF]/40 backdrop-blur-xl shadow-lg flex items-center gap-3.5 [direction:ltr]">
            <span className="text-xs sm:text-sm text-white/80 font-black">ACCOUNT ID :</span>
            <span className="text-sm sm:text-base font-black font-orbitron text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]">
              {userId || '748291034'}
            </span>
          </div>

          {/* Platform & Status Card */}
          <div className="px-6 py-2.5 rounded-2xl bg-black/60 border-2 border-[#00E5FF]/40 backdrop-blur-xl shadow-lg flex items-center gap-4 [direction:ltr]">
            <span className="text-xs sm:text-sm font-black text-white font-orbitron tracking-wider">
              {currentPlatform.name}
            </span>
            <img
              src={currentPlatform.image}
              alt={currentPlatform.name}
              className="w-6 h-6 rounded-lg object-contain border-2 border-[#00E5FF]/40 p-0.5 bg-white/10"
            />
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#FF3131]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF3131] shadow-[0_0_12px_#FF3131] animate-pulse" />
              <span>{isLiveRunning ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
          </div>

          {/* Countdown Timer Card */}
          <div className="px-8 py-3 rounded-2xl bg-black/60 border-2 border-[#00E5FF]/40 backdrop-blur-xl shadow-lg flex flex-col items-center gap-1 text-center">
            <span className="text-xs font-black text-white/85">الوقت المتبقي من الكود</span>
            <span className="text-base sm:text-lg font-black font-orbitron text-[#00E5FF] tracking-widest [direction:ltr] drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]">
              {formatHHMMSS(secondsLeft)}
            </span>
          </div>

          {/* Radar Control Actions (أزرار سميكة ومريحة للنقر) */}
          <div className="flex items-center gap-3.5 mt-2">
            <button
              onClick={startRadarCycle}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00E5FF]/20 to-[#00E5FF]/35 border-2 border-[#00E5FF]/60 text-[#00E5FF] text-xs sm:text-sm font-black hover:bg-[#00E5FF]/40 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-105"
            >
              <i className="fas fa-play text-sm" />
              <span>جولة جديدة / تشغيل الرادار</span>
            </button>

            <button
              onClick={onLogout}
              className="px-6 py-3 rounded-2xl bg-[#FF3131]/20 border-2 border-[#FF3131]/50 text-[#FF3131] text-xs sm:text-sm font-black hover:bg-[#FF3131]/30 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <i className="fas fa-sign-out-alt text-sm" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Repeating Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
          <div className="w-[min(92vw,420px)] rounded-3xl bg-black/95 border-2 border-[#FF3131]/70 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(255,49,49,0.4)] p-7 text-center animate-card-glow">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#FF3131]/25 border-2 border-[#FF3131]/60 flex items-center justify-center text-[#FF3131] text-2xl shadow-[0_0_25px_rgba(255,49,49,0.6)]">
              ✕
            </div>
            <h3 className="text-xl font-black text-[#FF3131] font-orbitron mb-2 tracking-wider">
              EROR
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-6 font-almarai font-bold">
              هناك خطأ علي خوادم الاسكريبت حاول مجددا بعد ساعه
            </p>
            <button
              onClick={handleCloseErrorModal}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF3131]/30 to-[#FF3131]/50 border-2 border-[#FF3131]/70 text-[#FF3131] hover:text-white hover:bg-[#FF3131]/60 font-black text-sm transition-all cursor-pointer font-cinzel tracking-wider uppercase shadow-lg"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
