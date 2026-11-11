import React, { useState, useEffect } from 'react';

export interface PlatformItem {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  image: string;
  promoCode: string;
  description?: string;
}

export const PLATFORMS: PlatformItem[] = [
  {
    id: '1Xbet',
    name: '1XBET',
    status: 'active',
    image: '/IMG/platform/1XBET.JPG',
    promoCode: 'MXG1',
    description: 'المنصة العالمية الأولى للألعاب والكراش',
  },
  {
    id: 'Melbet',
    name: 'MELBET',
    status: 'active',
    image: '/IMG/platform/MELBET.JPG',
    promoCode: 'MXG1',
    description: 'منصة ميلبيت السريعة لنتائج الكراش',
  },
  {
    id: 'Spinbetter',
    name: 'SPINBETTER',
    status: 'active',
    image: '/IMG/platform/SPINBETTER.JPG',
    promoCode: 'MXG1',
    description: 'منصة سبين بيتر الحديثة لكافة الألعاب',
  },
];

interface PlatformsScreenProps {
  onConnected: (platform: PlatformItem) => void;
}

export const PlatformsScreen: React.FC<PlatformsScreenProps> = ({ onConnected }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformItem>(PLATFORMS[0]);
  const [unsupportedModalPlatform, setUnsupportedModalPlatform] = useState<string | null>(null);

  // Connection HUD state
  const [isConnecting, setIsConnecting] = useState(false);
  const [connSeconds, setConnSeconds] = useState(10);
  const [connStatusLine, setConnStatusLine] = useState('Initializing…');
  const [connProgress, setConnProgress] = useState(0);
  const [stepsState, setStepsState] = useState({
    st1: false,
    st2: false,
    st3: false,
    st4: false,
    st5: false,
  });
  const [connFinishedText, setConnFinishedText] = useState(false);

  const handleSelect = (platform: PlatformItem) => {
    if (platform.status !== 'active') {
      setUnsupportedModalPlatform(platform.name);
      return;
    }
    setSelectedPlatform(platform);
  };

  const startConnection = () => {
    if (!selectedPlatform) return;
    setIsConnecting(true);
    setConnSeconds(10);
    setConnStatusLine('Initializing…');
    setConnProgress(0);
    setStepsState({ st1: false, st2: false, st3: false, st4: false, st5: false });
    setConnFinishedText(false);
  };

  useEffect(() => {
    if (!isConnecting) return;

    const timer = setInterval(() => {
      setConnSeconds((prev) => {
        const next = prev - 1;

        if (next === 9) {
          setStepsState((s) => ({ ...s, st1: true }));
          setConnStatusLine('Secure tunnel established…');
          setConnProgress(18);
        } else if (next === 7) {
          setStepsState((s) => ({ ...s, st2: true }));
          setConnStatusLine('Handshake verified…');
          setConnProgress(45);
        } else if (next === 5) {
          setStepsState((s) => ({ ...s, st3: true }));
          setConnStatusLine('Loading modules…');
          setConnProgress(72);
        } else if (next === 3) {
          setStepsState((s) => ({ ...s, st4: true }));
          setConnStatusLine('Integrity check…');
          setConnProgress(90);
        } else if (next === 2) {
          setStepsState((s) => ({ ...s, st5: true }));
          setConnStatusLine('Ready ✓');
          setConnProgress(100);
          setConnFinishedText(true);
        } else if (next <= 0) {
          clearInterval(timer);
          setTimeout(() => {
            if (selectedPlatform) {
              onConnected(selectedPlatform);
            }
          }, 400);
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isConnecting, selectedPlatform, onConnected]);

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col items-center justify-start pt-20 pb-16 px-4 z-10">
      {/* Script Brand Logo & Title */}
      <div className="text-center mb-6 flex flex-col items-center">
        <div className="relative mb-2">
          <img
            src="/IMG/crash_logo.png"
            alt="كراش Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover drop-shadow-[0_0_25px_rgba(0,229,255,0.6)] drop-shadow-[0_0_35px_rgba(255,49,49,0.4)] animate-float border border-[#00E5FF]/40"
          />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black font-cinzel tracking-wider text-white drop-shadow-[0_0_25px_rgba(0,229,255,0.5)]">
          سكريبت كراش • اختر المنصة
        </h1>
        <p className="text-xs sm:text-base text-white/80 mt-1 max-w-lg">
          اختر المنصة المناسبة للاتصال بسيرفر التوقعات، البروموكود المعتمد:{' '}
          <span className="text-[#00E5FF] font-black font-orbitron text-sm sm:text-base px-2 py-0.5 rounded-lg bg-[#00E5FF]/15 border border-[#00E5FF]/30 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)] [direction:ltr] inline-block">
            MXG1
          </span>
        </p>
      </div>

      {/* Expanded Platforms Selection (العرض الموسع والأكبر للمنصات الثلاثة) */}
      <div className="w-full max-w-3xl mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {PLATFORMS.map((platform) => {
            const isSelected = selectedPlatform?.id === platform.id;
            return (
              <div
                key={platform.id}
                onClick={() => handleSelect(platform)}
                className={`relative cursor-pointer flex flex-col items-center rounded-3xl overflow-hidden p-4 sm:p-5 transition-all duration-300 border-2 select-none ${
                  isSelected
                    ? 'border-[#00E5FF] bg-gradient-to-b from-[#00E5FF]/20 via-[#FF3131]/15 to-black/70 shadow-[0_0_40px_rgba(0,229,255,0.45),0_0_55px_rgba(255,49,49,0.3)] animate-selected-glow scale-[1.03]'
                    : 'border-white/15 bg-gradient-to-b from-white/[0.05] to-black/60 hover:border-[#FF3131]/60 hover:shadow-[0_0_25px_rgba(255,49,49,0.25)] hover:scale-[1.01]'
                }`}
              >
                {/* Active Online Badge & Promo tag */}
                <div className="w-full flex justify-between items-center mb-3">
                  <div className="px-3 py-1 rounded-full text-[10px] font-black font-orbitron bg-black/70 border border-white/20 backdrop-blur-md tracking-wider">
                    <span className="text-[#00E5FF] drop-shadow-[0_0_8px_#00E5FF] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                      ONLINE
                    </span>
                  </div>

                  <div className="px-2.5 py-0.5 rounded-full text-[10px] font-black font-orbitron bg-[#FF3131]/20 border border-[#FF3131]/40 text-white [direction:ltr]">
                    CODE: {platform.promoCode}
                  </div>
                </div>

                {/* Platform Logo */}
                <div className="w-full flex items-center justify-center p-3 sm:p-4 my-1">
                  <img
                    src={platform.image}
                    alt={platform.name}
                    className={`w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-2xl transition-all duration-300 ${
                      isSelected
                        ? 'drop-shadow-[0_0_25px_rgba(0,229,255,0.7)] drop-shadow-[0_0_40px_rgba(255,49,49,0.5)] scale-110'
                        : 'drop-shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    }`}
                  />
                </div>

                {/* Platform Name */}
                <div
                  className={`w-full text-center py-2 text-sm sm:text-base font-black font-orbitron tracking-wider rounded-xl mt-2 border transition-all ${
                    isSelected
                      ? 'border-[#00E5FF]/60 bg-gradient-to-r from-[#00E5FF]/30 to-[#FF3131]/30 text-[#00E5FF] drop-shadow-[0_0_12px_rgba(0,229,255,0.8)] shadow-md'
                      : 'border-white/10 bg-white/5 text-white/90'
                  }`}
                >
                  {platform.name}
                </div>

                {/* Platform Promo Indicator */}
                <div className="mt-3 text-[11px] text-white/70 text-center font-almarai flex items-center gap-1.5 [direction:rtl]">
                  <span>البروموكود:</span>
                  <span className="text-[#00E5FF] font-black font-orbitron text-xs">
                    {platform.promoCode}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Wide Connect Button (تكبير وتوسيع زر وزاوية الاتصال) */}
      <div className="w-full max-w-xl flex flex-col gap-3">
        <button
          onClick={startConnection}
          disabled={!selectedPlatform}
          className={`w-full py-4 sm:py-5 px-8 rounded-3xl font-black text-base sm:text-xl tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3 btn-sweep shadow-2xl ${
            selectedPlatform
              ? 'bg-gradient-to-r from-[#FF3131] via-[#00E5FF] to-[#C62828] text-white shadow-[0_12px_35px_rgba(255,49,49,0.5),0_0_30px_rgba(0,229,255,0.4)] hover:scale-[1.02] hover:brightness-110 cursor-pointer font-cinzel'
              : 'bg-white/10 text-white/30 border border-white/5 cursor-not-allowed'
          }`}
        >
          <i className="fas fa-plug text-lg sm:text-xl" />
          <span>
            {selectedPlatform
              ? `اتصال بسيرفر كراش • ${selectedPlatform.name}`
              : 'اختر منصة للاتصال'}
          </span>
        </button>

        <div className="text-center text-xs text-white/60">
          المنصة المحددة:{' '}
          <b className="text-[#00E5FF] font-orbitron font-bold">
            {selectedPlatform.name}
          </b>{' '}
          | كود التفعيل والبروموكود:{' '}
          <b className="text-[#00E5FF] font-orbitron font-bold">
            {selectedPlatform.promoCode}
          </b>
        </div>
      </div>

      {/* SweetAlert2 style popup for Unsupported Platforms */}
      {unsupportedModalPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#FF3131]/50 rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(255,49,49,0.35)] animate-card-glow">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#FF3131]/15 border border-[#FF3131]/40 flex items-center justify-center text-[#FF3131] text-2xl shadow-[0_0_20px_rgba(255,49,49,0.5)]">
              ✕
            </div>
            <h3 className="text-lg font-black text-white mb-2">غير مدعومة حالياً</h3>
            <p className="text-xs text-white/80 leading-relaxed mb-5">
              السكريبت لا يدعم هذه المنصة الآن:{' '}
              <b className="text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                {unsupportedModalPlatform}
              </b>
              .<br />
              <span className="opacity-75">جرّب منصة أخرى أو تابع التحديثات.</span>
            </p>
            <button
              onClick={() => setUnsupportedModalPlatform(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF3131] to-[#00E5FF] text-white font-bold text-xs shadow-lg"
            >
              تمام
            </button>
          </div>
        </div>
      )}

      {/* Connection HUD Dialog Modal (10 seconds) */}
      {isConnecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl [direction:ltr]">
          <div className="w-full max-w-lg bg-[#0a0a0a]/95 border border-[#00E5FF]/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_60px_rgba(0,229,255,0.35),0_0_60px_rgba(255,49,49,0.25)]">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#00E5FF] animate-ping" />
                <span className="font-orbitron font-bold text-base text-[#00E5FF]">
                  {selectedPlatform?.name} SERVER • CRASH
                </span>
              </div>
              <div className="font-orbitron font-extrabold text-2xl text-[#FF3131] drop-shadow-[0_0_12px_rgba(255,49,49,0.8)]">
                {connSeconds}s
              </div>
            </div>

            {/* Status Line */}
            <div className="text-xs sm:text-sm text-white/70 font-mono mb-3 flex items-center justify-between">
              <span>{connStatusLine}</span>
              <span className="text-[#00E5FF] font-bold text-sm">{connProgress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-black/60 rounded-full border border-white/10 overflow-hidden mb-5">
              <div
                className="h-full bg-gradient-to-r from-[#FF3131] via-[#00E5FF] to-[#00E5FF] transition-all duration-300"
                style={{ width: `${connProgress}%` }}
              />
            </div>

            {/* 5 Steps List */}
            <div className="flex flex-col gap-2.5 text-xs sm:text-sm font-mono [direction:rtl]">
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  stepsState.st1
                    ? 'border-[#00E5FF]/40 bg-[#00E5FF]/10 text-white shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    : 'border-white/5 bg-white/[0.02] text-white/40'
                }`}
              >
                <span>تهيئة قناة اتصال مشفّرة لسيرفر كراش</span>
                <span
                  className={`text-xs font-bold font-orbitron ${
                    stepsState.st1 ? 'text-[#00E5FF]' : 'text-white/30'
                  }`}
                >
                  {stepsState.st1 ? 'OK' : 'WAIT'}
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  stepsState.st2
                    ? 'border-[#00E5FF]/40 bg-[#00E5FF]/10 text-white shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    : 'border-white/5 bg-white/[0.02] text-white/40'
                }`}
              >
                <span>تأكيد استجابة سيرفر {selectedPlatform.name} وتثبيت الجلسة</span>
                <span
                  className={`text-xs font-bold font-orbitron ${
                    stepsState.st2 ? 'text-[#00E5FF]' : 'text-white/30'
                  }`}
                >
                  {stepsState.st2 ? 'OK' : 'WAIT'}
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  stepsState.st3
                    ? 'border-[#00E5FF]/40 bg-[#00E5FF]/10 text-white shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    : 'border-white/5 bg-white/[0.02] text-white/40'
                }`}
              >
                <span>تحميل وحدات التشغيل ورادار CRASH</span>
                <span
                  className={`text-xs font-bold font-orbitron ${
                    stepsState.st3 ? 'text-[#00E5FF]' : 'text-white/30'
                  }`}
                >
                  {stepsState.st3 ? 'OK' : 'WAIT'}
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  stepsState.st4
                    ? 'border-[#00E5FF]/40 bg-[#00E5FF]/10 text-white shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    : 'border-white/5 bg-white/[0.02] text-white/40'
                }`}
              >
                <span>فحص السلامة ومزامنة البروموكود MXG1</span>
                <span
                  className={`text-xs font-bold font-orbitron ${
                    stepsState.st4 ? 'text-[#00E5FF]' : 'text-white/30'
                  }`}
                >
                  {stepsState.st4 ? 'OK' : 'WAIT'}
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  stepsState.st5
                    ? 'border-[#00E5FF]/40 bg-[#00E5FF]/10 text-white shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    : 'border-white/5 bg-white/[0.02] text-white/40'
                }`}
              >
                <span>جاهز • مزامنة نهائية والتحويل لتسجيل الدخول</span>
                <span
                  className={`text-xs font-bold font-orbitron ${
                    stepsState.st5 ? 'text-[#00E5FF]' : 'text-white/30'
                  }`}
                >
                  {stepsState.st5 ? 'OK' : 'WAIT'}
                </span>
              </div>
            </div>

            {/* Bottom confirmation */}
            <div className="mt-5 text-center">
              {connFinishedText ? (
                <div className="text-sm font-bold text-[#00E5FF] drop-shadow-[0_0_12px_rgba(0,229,255,0.6)] [direction:rtl]">
                  تم الاتصال بسيرفر منصة <b>{selectedPlatform?.name}</b> بنجاح ✓
                </div>
              ) : (
                <div className="text-xs text-white/50 animate-pulse [direction:rtl]">
                  جارِ الإعداد والاتصال بالسيرفر...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
