import React, { useEffect, useState } from 'react';

export const TopBar: React.FC = () => {
  const [usersCount, setUsersCount] = useState<number>(() => {
    const saved = localStorage.getItem('onlineUserCount');
    const parsed = saved ? parseInt(saved, 10) : 2486;
    return Number.isFinite(parsed) && parsed >= 100 ? parsed : 2486;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setUsersCount((prev) => {
        const next = prev + 1;
        localStorage.setItem('onlineUserCount', String(next));
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-2 sm:top-3 left-0 right-0 px-3 z-40 flex justify-between items-center gap-2 pointer-events-auto [direction:ltr]">
      {/* Users Online Pill */}
      <div className="pill-border flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-white select-none">
        <span className="w-3 h-3 rounded-full bg-[#00E5FF] shadow-[0_0_14px_#00E5FF] animate-pulse-dot flex-shrink-0" />
        <span className="font-black tracking-wide">Users Online:</span>
        <span className="text-[#00E5FF] font-black font-orbitron min-w-[42px] text-right drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]">
          {usersCount}
        </span>
      </div>

      {/* Version Pill */}
      <div className="pill-border flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-white select-none">
        <span className="font-black text-white/80 tracking-wide">version:</span>
        <span className="tracking-wide font-orbitron font-black text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
          1.0.0
        </span>
      </div>
    </header>
  );
};
