import React, { useState, useEffect } from 'react';
import { PlatformItem } from './PlatformsScreen';

interface LoginScreenProps {
  platform: PlatformItem | null;
  onLoginSuccess: (userId: string, code: string) => void;
  onNavigateToVerification: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  platform,
  onLoginSuccess,
  onNavigateToVerification,
}) => {
  const currentPlatform = platform || {
    id: '1Xbet',
    name: '1XBET',
    status: 'active',
    image: '/IMG/platform/1XBET.JPG',
    promoCode: 'MXG1',
  };

  const [userId, setUserId] = useState('');
  // Password is the promo code MXG1 by default as requested: "الباسورد كده كده هيكون بالبريمو كود"
  const [activationCode, setActivationCode] = useState('MXG1');

  // Toast
  const [toast, setToast] = useState<{ show: boolean; type: 'ok' | 'bad'; msg: string }>({
    show: false,
    type: 'ok',
    msg: '',
  });

  // Modal
  const [activeModal, setActiveModal] = useState<'balance' | 'ban' | null>(null);

  const showToast = (type: 'ok' | 'bad', msg: string) => {
    setToast({ show: true, type, msg });
    setTimeout(() => {
      setToast((p) => ({ ...p, show: false }));
    }, 3200);
  };

  // Check pending autofill from verification
  useEffect(() => {
    const pendingID = localStorage.getItem('pendingAutoFillID');
    const pendingCode = localStorage.getItem('pendingAutoFillCode');
    if (pendingID) {
      setUserId(pendingID);
    }
    if (pendingCode) {
      setActivationCode(pendingCode);
    } else {
      setActivationCode('MXG1');
    }

    if (pendingID || pendingCode) {
      localStorage.removeItem('pendingAutoFillID');
      localStorage.removeItem('pendingAutoFillCode');
      showToast('ok', 'تم ملء الحساب والبروموكود تلقائياً ✅');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = userId.trim();
    const cleanCode = activationCode.trim();

    if (!cleanId) {
      showToast('bad', 'يرجى إدخال معرف الحساب (أي ID)');
      return;
    }

    if (!cleanCode) {
      showToast('bad', 'يرجى إدخال الباسورد (البروموكود: MXG1)');
      return;
    }

    // Success login: accepts MXG1 or any valid activation code
    showToast('ok', 'تم تسجيل الدخول بنجاح! جارِ تشغيل رادار كراش...');
    setTimeout(() => {
      onLoginSuccess(cleanId, cleanCode);
    }, 600);
  };

  const handleQuickDemoFill = () => {
    setUserId('748291034');
    setActivationCode('MXG1');
    showToast('ok', 'تم إدخال ID وباسورد MXG1 جاهز ✅');
  };

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center py-16 px-4 z-10">
      {/* Login Card (تصميم عريض، سميك، وواضح بدون أي خطوط رفيعة) */}
      <div className="relative w-full max-w-[520px] rounded-3xl border-2 border-[#00E5FF]/45 bg-black/75 backdrop-blur-2xl p-6 sm:p-9 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(255,49,49,0.3),0_0_45px_rgba(0,229,255,0.3)] animate-card-glow">
        {/* Brand & Logo */}
        <div className="flex flex-col items-center gap-3 mb-6 text-center">
          <img
            src="/IMG/crash_logo.png"
            alt="كراش Logo"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover drop-shadow-[0_0_25px_rgba(0,229,255,0.8)] drop-shadow-[0_0_40px_rgba(255,49,49,0.5)] animate-float border-2 border-[#00E5FF]/50"
          />

          {/* كلمة تسجيل الدخول مكبرة وسميكة وبارزة */}
          <div className="flex flex-col items-center gap-1.5">
            <h1 className="text-2xl sm:text-4xl font-black font-cinzel tracking-wider text-white shimmer-text drop-shadow-[0_0_25px_rgba(0,229,255,0.7)]">
              تسجيل الدخول
            </h1>
            <p className="text-xs sm:text-sm text-white/85 font-extrabold">
              سكريبت كراش لتوقعات المضاعفات الحية
            </p>
          </div>

          {/* Connected Platform & Promo Info Pill (سميك وبارز) */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 border-2 border-white/20 text-xs sm:text-sm text-white [direction:ltr] shadow-lg">
            <img
              src={currentPlatform.image}
              alt={currentPlatform.name}
              className="w-6 h-6 object-contain rounded-md border border-[#00E5FF]/40"
            />
            <span className="font-orbitron font-black text-[#00E5FF] tracking-wide">
              {currentPlatform.name}
            </span>
            <span className="text-white/40">•</span>
            <span className="font-orbitron font-black text-[#FF3131] drop-shadow-[0_0_8px_rgba(255,49,49,0.8)]">
              PROMO: MXG1
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* User ID Field */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-black text-white/95 pr-1 flex items-center justify-between">
              <span>معرف الحساب (ID):</span>
              <span className="text-[11px] font-bold text-white/60">اكتب أي ID عادي</span>
            </label>
            <div className="flex items-center gap-3.5 p-2 sm:p-2.5 pl-3 rounded-2xl bg-white/[0.08] border-2 border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.12)] focus-within:border-[#FF3131] focus-within:shadow-[0_0_25px_rgba(255,49,49,0.45)] focus-within:bg-[#FF3131]/[0.1] transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#00E5FF]/20 border-2 border-[#00E5FF]/40 text-[#00E5FF] text-lg flex-shrink-0 shadow-[0_0_18px_rgba(0,229,255,0.3)]">
                <i className="fas fa-user" />
              </div>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="أدخل أي ID عادي (مثال: 748291034)"
                className="w-full bg-transparent border-0 outline-none text-white font-extrabold text-sm sm:text-base py-2 [direction:ltr] font-orbitron placeholder:font-almarai placeholder:text-white/45 placeholder:font-bold"
                required
              />
            </div>
          </div>

          {/* Password / Activation Code Field (الباسورد بالبروموكود MXG1) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-black text-white/95 pr-1 flex items-center justify-between">
              <span>كلمة المرور / الباسورد:</span>
              <span className="text-[11px] font-black text-[#00E5FF] font-orbitron px-2 py-0.5 rounded-md bg-[#00E5FF]/15 border border-[#00E5FF]/40">
                الباسورد هو البروموكود: MXG1
              </span>
            </label>
            <div className="flex items-center gap-3.5 p-2 sm:p-2.5 pl-3 rounded-2xl bg-white/[0.08] border-2 border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.12)] focus-within:border-[#FF3131] focus-within:shadow-[0_0_25px_rgba(255,49,49,0.45)] focus-within:bg-[#FF3131]/[0.1] transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#00E5FF]/20 border-2 border-[#00E5FF]/40 text-[#00E5FF] text-lg flex-shrink-0 shadow-[0_0_18px_rgba(0,229,255,0.3)]">
                <i className="fas fa-key" />
              </div>
              <input
                type="text"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                placeholder="أدخل البروموكود (MXG1)"
                className="w-full bg-transparent border-0 outline-none text-white font-black text-sm sm:text-base py-2 [direction:ltr] font-orbitron placeholder:font-almarai placeholder:text-white/45 placeholder:font-bold"
                required
              />
            </div>
          </div>

          {/* زر تسجيل الدخول مكبر وعريض وسميك بشكل بارز */}
          <button
            type="submit"
            className="w-full py-4 sm:py-5 px-6 rounded-2xl font-black text-lg sm:text-2xl text-white tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF3131] via-[#00E5FF] to-[#C62828] shadow-[0_14px_40px_rgba(255,49,49,0.55),0_0_35px_rgba(0,229,255,0.4)] hover:scale-[1.02] hover:brightness-110 btn-sweep cursor-pointer font-cinzel mt-2 border-2 border-white/20"
          >
            <i className="fas fa-sign-in-alt text-xl sm:text-2xl" />
            <span>تسجيل الدخول</span>
          </button>

          {/* Quick 1-Click Demo Fill */}
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="text-xs text-white/70 hover:text-[#00E5FF] transition-colors py-1 flex items-center justify-center gap-2 font-bold cursor-pointer underline decoration-dotted"
          >
            <i className="fas fa-magic text-[#00E5FF] text-sm" />
            <span>تعبئة تلقائية: أي ID + باسورد MXG1 بنقرة واحدة</span>
          </button>
        </form>

        {/* Action Links (سميكة ومصممة بأناقة متينة) */}
        <div className="flex flex-col gap-3 mt-6">
          <a
            href="https://t.me/Proof1x"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-black/45 border-2 border-[#00E5FF]/25 hover:border-[#FF3131]/60 hover:bg-[#FF3131]/15 text-white transition-all backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 text-xs sm:text-sm font-black">
              <i className="fab fa-telegram-plane text-[#00E5FF] text-lg" />
              <span>التواصل مع المطوّر</span>
            </div>
            <div className="px-3.5 py-1 rounded-full text-[11px] font-black font-orbitron bg-[#FF3131]/25 border-2 border-[#FF3131]/50 text-white [direction:ltr]">
              OPEN
            </div>
          </a>

          <a
            href="https://t.me/proff1x"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-black/45 border-2 border-[#00E5FF]/25 hover:border-[#FF3131]/60 hover:bg-[#FF3131]/15 text-white transition-all backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 text-xs sm:text-sm font-black">
              <i className="fab fa-telegram text-[#00E5FF] text-lg" />
              <span>قناتنا على التليجرام</span>
            </div>
            <div className="px-3.5 py-1 rounded-full text-[11px] font-black font-orbitron bg-[#FF3131]/25 border-2 border-[#FF3131]/50 text-white [direction:ltr]">
              OPEN
            </div>
          </a>

          <button
            type="button"
            onClick={onNavigateToVerification}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-black/45 border-2 border-[#00E5FF]/40 hover:border-[#00E5FF]/80 hover:bg-[#00E5FF]/15 text-white transition-all backdrop-blur-sm text-right cursor-pointer"
          >
            <div className="flex items-center gap-3 text-xs sm:text-sm font-black text-[#00E5FF]">
              <i className="fas fa-gift text-lg text-[#FF3131]" />
              <span>أخذ الكود المجاني عن طريق خطوات (بروموكود MXG1)</span>
            </div>
            <div className="px-3.5 py-1 rounded-full text-[11px] font-black font-orbitron bg-[#00E5FF]/25 border-2 border-[#00E5FF]/50 text-[#00E5FF] [direction:ltr]">
              GO
            </div>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,440px)] px-5 py-3.5 rounded-2xl bg-black/95 border-2 border-[#00E5FF]/50 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 animate-bounce">
          <span className="text-xs sm:text-sm font-black text-white">{toast.msg}</span>
          <span
            className={`font-orbitron font-black text-sm [direction:ltr] ${
              toast.type === 'ok' ? 'text-[#00E5FF]' : 'text-[#FF3131]'
            }`}
          >
            {toast.type === 'ok' ? 'OK' : 'ERR'}
          </span>
        </div>
      )}

      {/* Balance Modal */}
      {activeModal === 'balance' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-black/90 border-2 border-[#FF3131]/60 rounded-3xl p-6 text-center shadow-2xl">
            <h3 className="text-lg font-black text-[#FF3131] mb-2 font-cinzel">⚠️ رصيد الحساب غير كافي</h3>
            <p className="text-xs sm:text-sm text-white/80 mb-4 leading-relaxed font-bold">
              رصيد حسابك الحالي غير كافي. يجب شحن الحساب لكي يعمل معك السكريبت بدون أي مشاكل.
            </p>
            <div className="p-3 rounded-xl bg-[#FF3131]/20 border-2 border-[#FF3131]/50 text-sm font-orbitron font-black text-white mb-4">
              المبلغ المطلوب: 10 دولار
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="px-8 py-2.5 rounded-xl bg-[#FF3131]/25 border-2 border-[#FF3131]/50 text-[#FF3131] font-black text-sm hover:bg-[#FF3131]/35 cursor-pointer"
            >
              حسناً
            </button>
          </div>
        </div>
      )}

      {/* Ban Modal */}
      {activeModal === 'ban' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-black/90 border-2 border-[#FF3131]/60 rounded-3xl p-6 text-center shadow-2xl">
            <h3 className="text-lg font-black text-[#FF3131] mb-2 font-cinzel">🚫 هذا الحساب محظور</h3>
            <p className="text-xs sm:text-sm text-white/80 mb-4 leading-relaxed font-bold">
              هذا الحساب محظور لا يمكن استخدام الأسكريبت والحساب محظور
            </p>
            <div className="p-2.5 rounded-xl bg-[#FF3131]/20 border-2 border-[#FF3131]/50 text-sm text-white font-black mb-4">
              الحساب غير نشط
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="px-8 py-2.5 rounded-xl bg-[#FF3131]/25 border-2 border-[#FF3131]/50 text-[#FF3131] font-black text-sm hover:bg-[#FF3131]/35 cursor-pointer"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
