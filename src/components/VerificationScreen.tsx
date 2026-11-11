import React, { useState, useRef } from 'react';
import { PlatformItem, PLATFORMS } from './PlatformsScreen';

interface VerificationScreenProps {
  platform: PlatformItem | null;
  onNavigateToLogin: () => void;
}

export const VerificationScreen: React.FC<VerificationScreenProps> = ({
  platform,
  onNavigateToLogin,
}) => {
  const [currentPlatform, setCurrentPlatform] = useState<PlatformItem>(
    platform || PLATFORMS[0]
  );

  const [userId, setUserId] = useState('');
  const [depositPreview, setDepositPreview] = useState<string | null>(null);
  const [promoPreview, setPromoPreview] = useState<string | null>(null);

  const depositInputRef = useRef<HTMLInputElement>(null);
  const promoInputRef = useRef<HTMLInputElement>(null);

  // Loading state & step
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('جاري التحقق...');

  // Result modal state
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ show: boolean; type: 'ok' | 'bad'; msg: string }>({
    show: false,
    type: 'ok',
    msg: '',
  });

  const showToast = (type: 'ok' | 'bad', msg: string) => {
    setToast({ show: true, type, msg });
    setTimeout(() => {
      setToast((p) => ({ ...p, show: false }));
    }, 3200);
  };

  const handleCopyPromo = () => {
    const code = currentPlatform.promoCode || 'MXG1';
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(code)
        .then(() => showToast('ok', `تم نسخ البروموكود: ${code}`))
        .catch(() => fallbackCopy(code));
    } else {
      fallbackCopy(code);
    }
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('ok', `تم نسخ البروموكود: ${text}`);
    } catch {
      showToast('bad', 'فشل النسخ، انسخه يدوياً');
    }
    document.body.removeChild(textarea);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('bad', 'ارفع صورة صحيحة');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setter(ev.target.result);
        showToast('ok', 'تم تحميل الصورة بنجاح');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUseSampleScreenshots = () => {
    // Convenient shortcut for users wanting to test without having screenshots ready
    setDepositPreview('/IMG/UploadFiles.gif');
    setPromoPreview('/IMG/UploadFiles.gif');
    if (!userId) setUserId('589230147');
    showToast('ok', 'تم وضع أسكرينات وبيانات تجريبية ✅');
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = (len: number) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `MXG1-${segment(4)}-${segment(4)}-${segment(5)}`;
  };

  const handleVerify = async () => {
    const cleanId = userId.trim();
    if (!cleanId || cleanId.length < 3) {
      showToast('bad', 'من فضلك اكتب أي ID حساب صحيح');
      return;
    }

    if (!depositPreview) {
      showToast('bad', 'ارفع اسكرين الإيداع');
      return;
    }

    if (!promoPreview) {
      showToast('bad', 'ارفع اسكرين البروموكود');
      return;
    }

    setIsLoading(true);

    try {
      setLoadingText('جاري التحقق من الحساب أنه نشط...');
      await new Promise((r) => setTimeout(r, 1400));

      setLoadingText('جاري فحص بروموكود MXG1 ومطابقة السيرفرات...');
      await new Promise((r) => setTimeout(r, 1400));

      setLoadingText('جاري التحقق من الرصيد وتوليد الكود...');
      await new Promise((r) => setTimeout(r, 1400));

      const code = generateRandomCode();
      setGeneratedCode(code);

      // Save to localStorage for auto-filling login
      localStorage.setItem('pendingAutoFillID', cleanId);
      localStorage.setItem('pendingAutoFillCode', code);
      localStorage.setItem(
        'selected_platform',
        JSON.stringify({
          name: currentPlatform.name,
          image: currentPlatform.image,
          platform_key: currentPlatform.id,
          promocode: currentPlatform.promoCode || 'MXG1',
        })
      );
    } catch {
      showToast('bad', 'فشل التحقق');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col items-center justify-start pt-16 pb-16 px-3 sm:px-4 z-10">
      {/* Verification Card */}
      <main className="relative w-full max-w-[540px] rounded-3xl border-2 border-[#00E5FF]/30 bg-black/55 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(255,49,49,0.2),0_0_35px_rgba(0,229,255,0.18)] animate-card-glow">
        {/* Brand & Logo */}
        <div className="flex flex-col items-center gap-2 mb-3 text-center">
          <img
            src="/IMG/crash_logo.png"
            alt="كراش Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover drop-shadow-[0_0_20px_rgba(0,229,255,0.7)] border border-[#00E5FF]/40"
          />
          <h1 className="text-lg sm:text-2xl font-black font-cinzel shimmer-text">
            التحقق وأخذ كود مجاني • كراش
          </h1>
        </div>

        {/* Platform Quick Tabs (تبديل سريع بين 1xBet / MELBET / spinbetter) */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {PLATFORMS.map((p) => {
            const isPActive = currentPlatform.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setCurrentPlatform(p)}
                className={`py-2 px-2 rounded-xl text-xs font-orbitron font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  isPActive
                    ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <img src={p.image} alt={p.name} className="w-4 h-4 object-contain rounded" />
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* WORK ON Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-[#FF3131]/35 shadow-[0_0_20px_rgba(255,49,49,0.12)] mb-3 [direction:ltr]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs text-white/90">WORK ON</span>
            <img
              src={currentPlatform.image}
              alt={currentPlatform.name}
              className="w-6 h-6 object-contain rounded-lg border border-[#00E5FF]/30 p-0.5 bg-white/5"
            />
            <span className="font-orbitron font-bold text-xs text-white">{currentPlatform.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-white/80">PROMOCODE :</span>
            <span className="text-[#00E5FF] font-black font-orbitron text-sm px-2.5 py-0.5 rounded-lg bg-[#00E5FF]/15 border border-[#00E5FF]/40 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
              {currentPlatform.promoCode || 'MXG1'}
            </span>
            <button
              onClick={handleCopyPromo}
              title="نسخ البروموكود"
              className="text-[#FF3131] hover:scale-125 transition-transform text-sm cursor-pointer drop-shadow-[0_0_8px_rgba(255,49,49,0.7)] p-1"
            >
              <i className="fas fa-copy" />
            </button>
          </div>
        </div>

        {/* Note */}
        <div className="text-center text-xs text-white/80 mb-3 leading-relaxed">
          لن يتم إعطاء الكود إلا بعد تنفيذ الخطوات والتحقق منها ⬇️
        </div>

        {/* Numbered Steps with MXG1 */}
        <div className="p-3.5 rounded-2xl bg-black/35 border border-[#FF3131]/25 shadow-inner mb-3">
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-white/90 leading-relaxed">
            <li>
              هتحمل منصة <b className="text-[#00E5FF] font-black font-orbitron">{currentPlatform.name}</b>
            </li>
            <li>
              هتعمل حساب جديد باستخدام البروموكود المعتمد (
              <span className="text-[#00E5FF] font-black font-orbitron px-1.5 py-0.5 rounded bg-[#00E5FF]/15 border border-[#00E5FF]/40 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
                {currentPlatform.promoCode || 'MXG1'}
              </span>
              )
            </li>
            <li>
              قم بإيداع <b className="text-[#00E5FF] font-black">10 دولار</b> في حسابك أو{' '}
              <b className="text-[#00E5FF] font-black">5 دولار</b> بحد أدنى
            </li>
            <li>أدخل أي ID حساب وضع الأسكرينات المطلوبة</li>
            <li>أضغط بدء التحقق لكي تأخذ كود التفعيل المجاني</li>
          </ol>
        </div>

        {/* Download Platform Button */}
        <a
          href="https://reffpa.com/L?tag=d_4400094m_97c_&site=4400094&ad=97&r=registration"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 mb-4 rounded-2xl bg-[#FF3131]/15 border border-[#FF3131]/40 hover:bg-[#FF3131]/25 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(255,49,49,0.25)] transition-all"
        >
          <i className="fas fa-download text-sm" />
          <span>تحميل منصة {currentPlatform.name}</span>
        </a>

        {/* User ID Field */}
        <div className="flex flex-col gap-1 mb-3">
          <label className="text-xs text-white/80 pr-1">معرف الحساب (أدخل أي ID عادي):</label>
          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-black/40 border border-[#00E5FF]/30 focus-within:border-[#FF3131] focus-within:bg-[#FF3131]/[0.06] shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-white font-black text-xs font-orbitron flex-shrink-0">
              ID
            </div>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="اكتب أي ID حساب عادي (مثال: 589230147)"
              className="w-full bg-transparent border-0 outline-none text-white text-xs sm:text-sm py-1 [direction:ltr] font-orbitron placeholder:font-almarai placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Upload Boxes Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Deposit Screenshot Box */}
          <div className="flex flex-col gap-1.5 p-2.5 rounded-2xl bg-black/35 border border-[#FF3131]/20">
            <label className="text-[11px] font-bold text-white/90">اسكرين الإيداع</label>
            <div
              onClick={() => depositInputRef.current?.click()}
              className={`relative w-full h-32 rounded-xl border-2 flex items-center justify-center overflow-hidden cursor-pointer transition-all ${
                depositPreview
                  ? 'border-solid border-[#FF3131]/70 shadow-[0_0_15px_rgba(255,49,49,0.3)]'
                  : 'border-dashed border-[#FF3131]/40 bg-black/20 hover:border-[#FF3131]'
              }`}
              style={
                depositPreview
                  ? {
                      backgroundImage: `url(${depositPreview})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : {}
              }
            >
              {!depositPreview && (
                <img
                  src="/IMG/UploadFiles.gif"
                  alt="Upload"
                  className="w-16 h-16 object-contain opacity-50 pointer-events-none"
                />
              )}
              <small className="absolute bottom-2 left-2 bg-black/60 border border-[#FF3131]/30 px-2 py-0.5 rounded-full text-[10px] text-white backdrop-blur-sm [direction:ltr]">
                Deposit
              </small>
            </div>
            <input
              ref={depositInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, setDepositPreview)}
            />
          </div>

          {/* Promocode Screenshot Box */}
          <div className="flex flex-col gap-1.5 p-2.5 rounded-2xl bg-black/35 border border-[#FF3131]/20">
            <label className="text-[11px] font-bold text-white/90">اسكرين البروموكود</label>
            <div
              onClick={() => promoInputRef.current?.click()}
              className={`relative w-full h-32 rounded-xl border-2 flex items-center justify-center overflow-hidden cursor-pointer transition-all ${
                promoPreview
                  ? 'border-solid border-[#FF3131]/70 shadow-[0_0_15px_rgba(255,49,49,0.3)]'
                  : 'border-dashed border-[#FF3131]/40 bg-black/20 hover:border-[#FF3131]'
              }`}
              style={
                promoPreview
                  ? {
                      backgroundImage: `url(${promoPreview})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : {}
              }
            >
              {!promoPreview && (
                <img
                  src="/IMG/UploadFiles.gif"
                  alt="Upload"
                  className="w-16 h-16 object-contain opacity-50 pointer-events-none"
                />
              )}
              <small className="absolute bottom-2 left-2 bg-black/60 border border-[#FF3131]/30 px-2 py-0.5 rounded-full text-[10px] text-white backdrop-blur-sm [direction:ltr]">
                MXG1
              </small>
            </div>
            <input
              ref={promoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, setPromoPreview)}
            />
          </div>
        </div>

        {/* Quick Demo Screens button */}
        <div className="text-center mb-3">
          <button
            type="button"
            onClick={handleUseSampleScreenshots}
            className="text-[11px] text-white/50 hover:text-[#00E5FF] transition-colors underline decoration-dotted"
          >
            تعبئة أسكرينات تجريبية وبيانات سريعة للتجربة
          </button>
        </div>

        {/* Start Verification Button (عريض ومكبر) */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base text-white tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF3131] via-[#00E5FF] to-[#C62828] shadow-[0_10px_30px_rgba(255,49,49,0.4),0_0_25px_rgba(0,229,255,0.3)] hover:scale-[1.01] hover:brightness-110 btn-sweep cursor-pointer font-cinzel"
        >
          <i className="fas fa-check-circle" />
          <span>بدء التحقق وأخذ كود التفعيل</span>
        </button>
      </main>

      {/* Loading Modal Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
          <div className="w-[min(92vw,360px)] rounded-2xl p-5 bg-black/90 border border-[#FF3131]/40 shadow-[0_0_35px_rgba(255,49,49,0.3)] flex items-center gap-3">
            <div className="w-7 h-7 rounded-full border-3 border-white/20 border-t-[#00E5FF] animate-spin flex-shrink-0" />
            <div className="text-xs sm:text-sm text-white/95 font-bold leading-relaxed">
              {loadingText}
            </div>
          </div>
        </div>
      )}

      {/* Verification Success Modal */}
      {generatedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="w-[min(92vw,440px)] rounded-3xl bg-black/95 border border-[#00E5FF]/50 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_45px_rgba(0,229,255,0.4)] p-6 sm:p-7 text-center animate-card-glow">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#00E5FF]/20 border border-[#00E5FF]/50 flex items-center justify-center text-[#00E5FF] text-2xl shadow-[0_0_25px_rgba(0,229,255,0.5)]">
              ✓
            </div>
            <h3 className="text-lg font-black text-[#00E5FF] mb-1 font-cinzel">
              ✅ تم التحقق بنجاح
            </h3>
            <p className="text-xs sm:text-sm text-white/70 mb-3">
              كود تفعيل سكريبت كراش الخاص بك هو:
            </p>
            <div className="inline-block py-3 px-5 rounded-2xl bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] font-orbitron font-black text-sm sm:text-base tracking-widest [direction:ltr] shadow-[0_0_20px_rgba(0,229,255,0.3)] select-all mb-5">
              {generatedCode}
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF3131] to-[#00E5FF] text-white font-black text-sm shadow-xl hover:brightness-110 transition-all font-cinzel uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2"
              >
                <span>الذهاب لتسجيل الدخول تلقائياً</span>
                <i className="fas fa-arrow-left" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,420px)] px-4 py-3 rounded-2xl bg-black/90 border border-[#00E5FF]/40 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 animate-bounce">
          <span className="text-xs sm:text-sm text-white">{toast.msg}</span>
          <span
            className={`font-orbitron font-bold text-xs [direction:ltr] ${
              toast.type === 'ok' ? 'text-[#00E5FF]' : 'text-[#FF3131]'
            }`}
          >
            {toast.type === 'ok' ? 'OK' : 'ERR'}
          </span>
        </div>
      )}
    </div>
  );
};
