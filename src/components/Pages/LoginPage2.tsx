import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import bg2 from '../../assets/Backgoundimages/bg2.png';
import lightBg from '../../assets/Backgoundimages/backgroundlight.jpeg';
import logo from '../../assets/logo.jpeg';
import logoSvg from '../../assets/Backgoundimages/logo1.webp';
import recaptchaLogo from '../../assets/Backgoundimages/RecaptchaLogo.svg';
import { useThemeStore } from '../../store/themeStore';



// Geometry of the earth limb (horizon) in bg2.png (1672x941).
const BG_W = 1672;
const BG_H = 941;
const PLANET = { cx: 929, cy: 1575, r: 1413 };

/* ---------- Theme Toggle Button ---------- */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="relative z-[60] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[rgba(124,192,255,0.3)] bg-[rgba(30,60,120,0.4)] text-[#7CC0FF] transition-all duration-300 hover:border-[#d4af37]/70 hover:text-[#f0c265] hover:shadow-[0_0_12px_rgba(212,175,55,0.4)]"
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
};

const HorizonGlow = ({ imgRef }: { imgRef: React.RefObject<HTMLImageElement | null> }) => {
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = img.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const scale = Math.max(rect.width / BG_W, rect.height / BG_H);
      const cw = BG_W * scale;
      const ch = BG_H * scale;
      const pos = getComputedStyle(img).objectPosition.match(/-?[\d.]+%/g) ?? [];
      const px = pos.length > 0 ? parseFloat(pos[0] as string) / 100 : 0;
      const py = pos.length > 1 ? parseFloat(pos[1] as string) / 100 : 0.5;
      setBox({
        left: rect.left + (rect.width - cw) * px,
        top: rect.top + (rect.height - ch) * py,
        width: cw,
        height: ch,
      });
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };

    schedule();
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(img);
    return () => {
      window.removeEventListener('resize', schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [imgRef]);

  if (!box) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none"
      style={{ position: 'fixed', left: box.left, top: box.top, width: box.width, height: box.height, zIndex: 2 }}
      viewBox={`0 0 ${BG_W} ${BG_H}`}
    >
      <defs>
        <linearGradient id="horizonFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.22" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.78" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="horizonMask">
          <rect width={BG_W} height={BG_H} fill="url(#horizonFade)" />
        </mask>
        <filter id="glowHalo" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="55" />
        </filter>
        <filter id="glowOuter" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
        <filter id="glowMid" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="glowRim" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <g mask="url(#horizonMask)">
        <circle cx={PLANET.cx} cy={PLANET.cy} r={PLANET.r} fill="none" stroke="rgba(70,150,255,0.30)" strokeWidth="360" filter="url(#glowHalo)" />
        <circle cx={PLANET.cx} cy={PLANET.cy} r={PLANET.r} fill="none" stroke="rgba(110,185,255,0.55)" strokeWidth="150" filter="url(#glowOuter)" />
        <circle cx={PLANET.cx} cy={PLANET.cy} r={PLANET.r} fill="none" stroke="rgba(160,215,255,0.80)" strokeWidth="50" filter="url(#glowMid)" />
        <circle cx={PLANET.cx} cy={PLANET.cy} r={PLANET.r} fill="none" stroke="rgba(232,246,255,0.95)" strokeWidth="11" filter="url(#glowRim)" />
      </g>
    </svg>
  );
};

const LoginPage2 = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRobotChecked, setIsRobotChecked] = useState(false);
  const bgRef = React.useRef<HTMLImageElement>(null);

  // Tagline animation — continuous loop
  const taglineWords = ['Smart', 'journeys.', 'Seamless', 'experiences.', 'Every', 'time.'];
  const [visibleWords, setVisibleWords] = useState(0);
  const [fadePhase, setFadePhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    let active = true;
    const runCycle = () => {
      if (!active) return;
      setVisibleWords(0);
      setFadePhase('in');
      const timers: ReturnType<typeof setTimeout>[] = [];
      // Reveal words one by one
      taglineWords.forEach((_, i) => {
        timers.push(setTimeout(() => { if (active) setVisibleWords(i + 1); }, (i + 1) * 300));
      });
      // Hold, then fade out, then restart
      const totalReveal = taglineWords.length * 300 + 800;
      timers.push(setTimeout(() => { if (active) setFadePhase('out'); }, totalReveal));
      timers.push(setTimeout(() => { if (active) runCycle(); }, totalReveal + 600));
      return timers;
    };
    const timers = runCycle();
    return () => { active = false; timers?.forEach(clearTimeout); };
  }, []);



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/search');
  };

  const isLight = theme === 'light';

  const goldenDots = [
    { left: '14%', bottom: '32%', size: 2, delay: '0s', dur: '2.2s' },
    { left: '16%', bottom: '34%', size: 2, delay: '0.3s', dur: '2.5s' },
    { left: '13%', bottom: '33%', size: 2, delay: '0.6s', dur: '2.3s' },
    { left: '18%', bottom: '32%', size: 2, delay: '0.9s', dur: '2.7s' },
    { left: '15%', bottom: '35%', size: 2, delay: '1.2s', dur: '2.1s' },
    { left: '17%', bottom: '31%', size: 2, delay: '0.2s', dur: '2.6s' },
    { left: '12%', bottom: '34%', size: 2, delay: '1.5s', dur: '2.4s' },
    { left: '19%', bottom: '33%', size: 2, delay: '0.4s', dur: '2.8s' },
    { left: '20%', bottom: '35%', size: 2, delay: '0.7s', dur: '2.2s' },
    { left: '11%', bottom: '32%', size: 2, delay: '1.1s', dur: '2.5s' },
    { left: '29%', bottom: '24%', size: 2, delay: '0.8s', dur: '2.4s' },
    { left: '30%', bottom: '22%', size: 2, delay: '0.1s', dur: '2.7s' },
    { left: '28%', bottom: '23%', size: 2, delay: '1.4s', dur: '2.3s' },
    { left: '31%', bottom: '25%', size: 2, delay: '0.5s', dur: '2.6s' },
    { left: '27%', bottom: '21%', size: 2, delay: '1.0s', dur: '2.2s' },
    { left: '32%', bottom: '23%', size: 2, delay: '0.3s', dur: '2.5s' },
    { left: '41%', bottom: '32%', size: 2, delay: '0.2s', dur: '2.3s' },
    { left: '43%', bottom: '31%', size: 2, delay: '0.6s', dur: '2.6s' },
    { left: '40%', bottom: '33%', size: 2, delay: '1.1s', dur: '2.4s' },
    { left: '44%', bottom: '32%', size: 2, delay: '0.4s', dur: '2.7s' },
    { left: '42%', bottom: '30%', size: 2, delay: '0.8s', dur: '2.2s' },
    { left: '45%', bottom: '33%', size: 2, delay: '1.3s', dur: '2.5s' },
    { left: '39%', bottom: '31%', size: 2, delay: '0.7s', dur: '2.8s' },
    { left: '44%', bottom: '34%', size: 2, delay: '1.0s', dur: '2.3s' },
    { left: '43%', bottom: '25%', size: 2, delay: '0.5s', dur: '2.5s' },
    { left: '44%', bottom: '23%', size: 2, delay: '0.9s', dur: '2.3s' },
    { left: '42%', bottom: '24%', size: 2, delay: '1.3s', dur: '2.6s' },
    { left: '45%', bottom: '22%', size: 2, delay: '0.2s', dur: '2.4s' },
    { left: '41%', bottom: '26%', size: 2, delay: '0.7s', dur: '2.2s' },
    { left: '48%', bottom: '28%', size: 2, delay: '0.4s', dur: '2.7s' },
    { left: '49%', bottom: '27%', size: 2, delay: '1.2s', dur: '2.3s' },
    { left: '47%', bottom: '29%', size: 2, delay: '0.8s', dur: '2.5s' },
    { left: '54%', bottom: '24%', size: 2, delay: '0.1s', dur: '2.4s' },
    { left: '55%', bottom: '22%', size: 2, delay: '1.5s', dur: '2.6s' },
    { left: '53%', bottom: '23%', size: 2, delay: '0.6s', dur: '2.3s' },
    { left: '56%', bottom: '21%', size: 2, delay: '1.1s', dur: '2.5s' },
    { left: '52%', bottom: '25%', size: 2, delay: '0.3s', dur: '2.7s' },
    { left: '61%', bottom: '28%', size: 2, delay: '0.5s', dur: '2.2s' },
    { left: '63%', bottom: '27%', size: 2, delay: '0.9s', dur: '2.6s' },
    { left: '60%', bottom: '29%', size: 2, delay: '1.3s', dur: '2.4s' },
    { left: '64%', bottom: '28%', size: 2, delay: '0.2s', dur: '2.7s' },
    { left: '62%', bottom: '26%', size: 2, delay: '0.7s', dur: '2.3s' },
    { left: '65%', bottom: '29%', size: 2, delay: '1.0s', dur: '2.5s' },
    { left: '59%', bottom: '27%', size: 2, delay: '0.4s', dur: '2.8s' },
    { left: '66%', bottom: '28%', size: 2, delay: '1.4s', dur: '2.2s' },
    { left: '67%', bottom: '24%', size: 2, delay: '0.3s', dur: '2.5s' },
    { left: '68%', bottom: '23%', size: 2, delay: '1.6s', dur: '2.7s' },
    { left: '66%', bottom: '25%', size: 2, delay: '0.8s', dur: '2.3s' },
    { left: '71%', bottom: '21%', size: 2, delay: '0.4s', dur: '2.6s' },
    { left: '72%', bottom: '20%', size: 2, delay: '1.0s', dur: '2.4s' },
    { left: '70%', bottom: '22%', size: 2, delay: '1.5s', dur: '2.2s' },
    { left: '22%', bottom: '36%', size: 2, delay: '0.5s', dur: '2.5s' },
    { left: '35%', bottom: '27%', size: 2, delay: '1.3s', dur: '2.8s' },
    { left: '48%', bottom: '30%', size: 2, delay: '0.8s', dur: '2.3s' },
    { left: '53%', bottom: '26%', size: 2, delay: '0.2s', dur: '2.6s' },
    { left: '59%', bottom: '25%', size: 2, delay: '1.5s', dur: '2.4s' },
    { left: '38%', bottom: '26%', size: 2, delay: '0.9s', dur: '2.7s' },
    { left: '46%', bottom: '27%', size: 2, delay: '1.7s', dur: '2.2s' },
  ];

  return (
    <>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes goldenSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        .input-golden-wrapper {
          position: relative;
          border-radius: 10px;
          padding: 1.5px;
          overflow: hidden;
          background: rgba(80, 130, 200, 0.18);
          transition: box-shadow 0.3s ease;
        }
        .input-golden-wrapper:focus-within {
          background: rgba(80, 150, 240, 0.35);
          box-shadow: 0 0 0 3px rgba(50, 120, 220, 0.1);
        }
        .input-golden-inner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          height: 40px;
          background: #0c1630;
          border-radius: 9px;
          padding: 0 14px;
        }
        .light-theme .input-golden-inner {
          background: #f1f5f9;
        }
        .light-theme .input-golden-wrapper {
          background: rgba(37, 99, 235, 0.10);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .card-golden-wrapper {
          position: relative;
          border-radius: 18px;
          padding: 1.5px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 6px rgba(218,165,32,0.30), 0 0 16px rgba(218,165,32,0.16), 0 0 32px rgba(218,165,32,0.06);
        }
        .card-golden-wrapper::before {
          content: '';
          position: absolute;
          inset: -50%;
          z-index: 0;
          background: conic-gradient(from 0deg, transparent 0deg, transparent 55deg, #b8860b 75deg, #d4af37 95deg, #ffd700 120deg, #fff1a8 145deg, #ffd700 165deg, #d4af37 190deg, #b8860b 210deg, #8b6914 230deg, transparent 250deg, transparent 360deg);
          animation: goldenSpin 4s linear infinite;
          pointer-events: none;
        }
        .card-golden-inner {
          position: relative;
          z-index: 1;
          border-radius: 17px;
          background: rgba(10, 20, 45, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: inset 0 0 6px rgba(218,165,32,0.20), inset 0 0 14px rgba(218,165,32,0.10);
        }
        .light-theme .card-golden-inner {
          background: rgba(255, 255, 255, 0.97);
          box-shadow: inset 0 0 6px rgba(218,165,32,0.10), inset 0 0 14px rgba(218,165,32,0.05);
        }
        .light-theme .card-golden-wrapper {
          box-shadow: 0 20px 60px rgba(0,0,0,0.10), 0 0 6px rgba(218,165,32,0.20), 0 0 16px rgba(218,165,32,0.10);
        }

        .earth-dot {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: dotPulse var(--dur, 3s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }
        .light-theme .earth-dot { opacity: 0.3; }

        @media (prefers-reduced-motion: reduce) {
          .card-golden-wrapper::before { animation: none; }
          .earth-dot { animation: none; opacity: 0.5; }
        }
      `}</style>

      <div className={`relative flex flex-col lg:flex-row h-auto min-h-screen lg:h-screen w-full overflow-y-auto lg:overflow-hidden font-[Segoe_UI,Roboto,Helvetica_Neue,Arial,sans-serif] ${isLight ? 'bg-transparent' : 'bg-[#060d1a]'}`}>

        {/* ---- Background images ---- */}
        <img ref={bgRef} src={bg2} alt="" className={`pointer-events-none fixed inset-0 z-0 h-[100dvh] min-h-full w-full object-cover object-center lg:object-left ${isLight ? 'hidden' : ''}`} />
        <img src={lightBg} alt="" className={`pointer-events-none fixed inset-0 z-0 h-[100dvh] min-h-full w-full object-cover object-center lg:object-left ${isLight ? '' : 'hidden'}`} />

        {/* Earth horizon atmosphere glow (dark only) */}
        {!isLight && <HorizonGlow imgRef={bgRef} />}

        {/* Golden dots (dark only) */}
        {!isLight && (
          <div className="pointer-events-none absolute inset-0 z-[3]">
            {goldenDots.map((d, i) => (
              <div key={i} className="earth-dot" style={{ left: d.left, bottom: d.bottom, width: `${d.size}px`, height: `${d.size}px`, background: `radial-gradient(circle, rgba(255,223,100,1) 0%, rgba(255,200,50,0.9) 25%, rgba(255,180,0,0.5) 55%, transparent 80%)`, boxShadow: `0 0 ${d.size + 2}px rgba(255,223,100,0.9), 0 0 ${d.size + 6}px rgba(255,200,50,0.6), 0 0 ${d.size + 10}px rgba(255,180,0,0.3)`, '--delay': d.delay, '--dur': d.dur } as React.CSSProperties} />
            ))}
          </div>
        )}

        {/* ---- Theme toggle (top right) ---- */}
        <div className="absolute right-4 top-4 z-[60]">
          <ThemeToggle />
        </div>

        {/* ---- LEFT PANEL ---- */}
        <div className={`relative z-[5] flex min-h-[auto] lg:min-h-screen flex-1 flex-col justify-between px-6 lg:px-[50px] pb-10 lg:pb-[50px] pt-8 lg:pt-10 `}>

          {/* Logo — top */}
          <div className="relative z-10">
            <img src={logoSvg} alt="Akbar Bizvoy" className="h-[50px] lg:h-[65px] w-auto" />
          </div>

          {/* Tagline — lower center (flex-1 pushes it down) */}
          <div className="relative z-10 flex-1 flex flex-col justify-end max-w-[520px] pb-18 pl-2">
            <div className="flex items-center gap-1.5 mb-3">
              <span className={`h-[3px] w-6 rounded-full ${isLight ? 'bg-[#2563eb]' : 'bg-[#3b9cff]'}`} />
              <span className={`h-[3px] w-3 rounded-full ${isLight ? 'bg-[#f59e0b]' : 'bg-[#f0c265]'}`} />
            </div>
            <h2 className={`m-0 text-[28px] lg:text-[40px] font-bold leading-[1.2] ${isLight ? 'text-[#1e293b]' : 'text-white'}`}>  
              {taglineWords.map((word, i) => {
                const isBlue = word === 'Seamless';
                const isLast = word === 'time.';
                return (
                  <span key={i}>
                    <span
                      style={{
                        opacity: fadePhase === 'out' ? 0 : (i < visibleWords ? 1 : 0),
                        transition: `opacity ${fadePhase === 'out' ? 0.5 : 0.3}s ease-in-out`,
                        color: isBlue ? '#2563eb' : undefined,
                      }}
                    >{word}</span>
                    {word === 'Seamless' && <br />}
                    {i < taglineWords.length - 1 && word !== 'Seamless' && ' '}

                  </span>
                );
              })}
            </h2>
          </div>

          {/* Feature icons — bottom */}
          <div className="relative z-10 flex flex-wrap gap-4 lg:gap-9 pb-2 mt-2">
            {[
              { icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></>, title: 'Trusted', sub: 'Since 1987', bgColor: isLight ? 'bg-[#e0edff]' : 'bg-[rgba(50,120,220,0.15)]', iconColor: isLight ? 'text-[#2563eb]' : 'text-[#4aa3ff]' },
              { icon: <><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><line x1="2" y1="12" x2="22" y2="12" /></>, title: 'Global', sub: 'Presence', bgColor: isLight ? 'bg-[#e0edff]' : 'bg-[rgba(50,120,220,0.15)]', iconColor: isLight ? 'text-[#2563eb]' : 'text-[#4aa3ff]' },
              { icon: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>, title: 'Seamless', sub: 'Journeys', bgColor: isLight ? 'bg-[#fff3e0]' : 'bg-[rgba(212,175,55,0.15)]', iconColor: isLight ? 'text-[#f59e0b]' : 'text-[#f0c265]' },
              { icon: <><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></>, title: '24/7', sub: 'Support', bgColor: isLight ? 'bg-[#fff3e0]' : 'bg-[rgba(212,175,55,0.15)]', iconColor: isLight ? 'text-[#f59e0b]' : 'text-[#f0c265]' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex items-center gap-[3.5px] rounded-[12px] border ${isLight ? 'border-[rgba(0,0,0,0.06)]' : 'border-[rgba(50,120,220,0.12)]'} ${f.bgColor}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`m-[10px] h-[22px] w-[22px] ${f.iconColor}`}>{f.icon}</svg>
                </div>
                <div className="flex flex-col">
                  <span className={`text-[13px] font-semibold leading-[1.2] ${isLight ? 'text-[#1e293b]' : 'text-white'}`}>{f.title}</span>
                  <span className={`text-[12px] leading-[1.3] ${isLight ? 'text-[#64748b]' : 'text-[rgba(170,195,225,0.5)]'}`}>{f.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- RIGHT PANEL ---- */}
        <div className="relative z-10 flex w-full lg:w-[500px] min-w-0 lg:min-w-[440px] translate-x-0 lg:-translate-x-10 items-center justify-center px-6 lg:px-11 py-8 lg:py-10">
          <div className="card-golden-wrapper relative w-full max-w-[400px]">
            <div className="card-golden-inner px-5 lg:px-8 py-[22px] pb-[18px] text-center">
              <div className="mb-3 flex justify-center">
                <img src={logoSvg} alt="Akbar Bizvoy Logo" className="h-[70px] w-auto" />
              </div>


              <h1 className={`m-0 mb-1 text-[26px] font-bold ${isLight ? 'text-[#1e293b]' : 'text-white'}`}>Welcome <span className="text-[#2563eb]">back.</span></h1>
              <p className={`m-0 mb-5 text-[13px] ${isLight ? 'text-[#64748b]' : 'text-[rgba(170,195,225,0.55)]'}`}>Sign in to continue to your account.</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
                <div>
                  <label className={`mb-1 block text-[12px] font-medium ${isLight ? 'text-[#475569]' : 'text-[rgba(200,215,235,0.7)]'}`}>Email address</label>
                  <div className="input-golden-wrapper">
                    <div className="input-golden-inner">
                      <svg className={`golden-icon mr-3 h-[18px] w-[18px] shrink-0 ${isLight ? 'text-[#94a3b8]' : 'text-[rgba(140,170,210,0.45)]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className={`h-full flex-1 bg-transparent text-[14px] font-inherit leading-[40px] outline-none ${isLight ? 'text-[#1e293b] placeholder:text-[#94a3b8]' : 'text-[#dde6f0] placeholder:text-[rgba(140,170,210,0.4)]'}`} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`mb-1 block text-[12px] font-medium ${isLight ? 'text-[#475569]' : 'text-[rgba(200,215,235,0.7)]'}`}>Password</label>
                  <div className="input-golden-wrapper">
                    <div className="input-golden-inner relative">
                      <svg className={`golden-icon mr-3 h-[18px] w-[18px] shrink-0 ${isLight ? 'text-[#94a3b8]' : 'text-[rgba(140,170,210,0.45)]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required className={`h-full flex-1 bg-transparent text-[14px] font-inherit leading-[40px] outline-none ${isLight ? 'text-[#1e293b] placeholder:text-[#94a3b8]' : 'text-[#dde6f0] placeholder:text-[rgba(140,170,210,0.4)]'}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-1 transition-colors duration-200 ${isLight ? 'text-[#94a3b8] hover:text-[#475569]' : 'text-[rgba(140,170,210,0.45)] hover:text-[rgba(170,200,240,0.8)]'}`} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                          {showPassword ? (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>) : (<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>)}
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-[-3px] text-right">
                  <a href="#" className={`text-[12.5px] font-medium no-underline transition-colors duration-200 hover:underline ${isLight ? 'text-[#2563eb] hover:text-[#1d4ed8]' : 'text-[#3b9cff] hover:text-[#6bb3ff]'}`}>Forgot password?</a>
                </div>

                <div className={`mt-0 flex items-center justify-between rounded-[4px] border px-3.5 py-2.5 ${isLight ? 'border-[rgba(0,0,0,0.1)] bg-[#f8fafc]' : 'border-[rgba(180,180,180,0.12)] bg-[rgba(240,240,240,0.04)]'}`}>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setIsRobotChecked(!isRobotChecked)} className={`flex h-[28px] w-[28px] min-w-[28px] cursor-pointer items-center justify-center rounded-[3px] border-2 p-0 transition-colors duration-200 hover:border-[rgba(180,180,180,0.5)] ${isLight ? 'bg-[#f1f5f9]' : 'bg-[rgba(25,35,55,0.6)]'} ${isRobotChecked ? 'border-[rgba(66,133,244,0.5)]' : isLight ? 'border-[rgba(0,0,0,0.2)]' : 'border-[rgba(180,180,180,0.35)]'}`}>
                      {isRobotChecked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                    </button>
                    <span className={`font-[Roboto,Segoe_UI,sans-serif] text-[13px] ${isLight ? 'text-[#475569]' : 'text-[rgba(210,215,225,0.75)]'}`}>I'm not a robot</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src={recaptchaLogo} alt="reCAPTCHA" className="h-[40px] w-auto" />
                  </div>
                </div>

                <button type="submit" className="mt-0.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none bg-gradient-to-br from-[#1565e0] via-[#1d7bf5] to-[#2b8df8] py-[11px] text-[15px] font-semibold tracking-[0.3px] font-inherit text-white shadow-[0_4px_20px_rgba(25,100,230,0.3),0_1px_3px_rgba(25,100,230,0.2)] transition-all duration-250 hover:-translate-y-px hover:from-[#1d75f0] hover:via-[#2588ff] hover:to-[#3598ff] hover:shadow-[0_6px_28px_rgba(25,100,230,0.4),0_2px_6px_rgba(25,100,230,0.25)] active:translate-y-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[16px] w-[16px]"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
                  Sign In
                </button>

                <p className={`m-0 mt-1.5 text-center text-[13px] ${isLight ? 'text-[#64748b]' : 'text-[rgba(170,195,225,0.5)]'}`}>
                  Don't have an account? <a href="#" className={`font-semibold no-underline transition-colors duration-200 hover:underline ${isLight ? 'text-[#2563eb] hover:text-[#1d4ed8]' : 'text-[#3b9cff] hover:text-[#6bb3ff]'}`}>Create account</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage2;
