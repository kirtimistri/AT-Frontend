// AkbarBizvoyLoader.tsx
// New worldwide branded loader: plane on the right, "WELCOME TO / AKBAR BIZVOY"
// text emits from its left edge, with grid, particles, glow, spark & vignette.
// Converted from the latest loader animation (index.html) and wired to the shared
// globalLoader store so the rest of the app handles show/hide exactly as before.
import { useEffect, useRef, useState } from 'react';

import planeImg from '../assets/airplane-loader.png';

import { useGlobalLoaderStore } from '../store/globalLoader';
import { useThemeStore } from '../store/themeStore';

const ENTER_MS = 400;
const EXIT_MS = 400;
const CYCLE_MS = 5000;

type Phase = 'enter' | 'idle' | 'exit';

const WELCOME_CHARS = ['W', 'E', 'L', 'C', 'O', 'M', 'E', '\u00A0', 'T', 'O'];
const BRAND_CHARS = ['A', 'K', 'B', 'A', 'R', '\u00A0', 'B', 'I', 'Z', 'V', 'O', 'Y'];

// Theme light/dark CSS variables (mirror the [data-theme] blocks from index.html)
const LIGHT_VARS: Record<string, string> = {
  '--bg-color': '#ffffff',
  '--red-mid': '#E31837',
  '--red-light': '#ff5252',
  '--text-line1': '#1a1a1a',
  '--text-line2': '#E31837',
  '--grid-opacity': '0.02',
  '--particle-base': '0.08',
  '--vignette-color': 'rgba(240,240,245,.3)',
  '--glow-color': 'rgba(227,24,55,.08)',
  '--shadow-color': 'rgba(227,24,55,.08)',
  '--text-shadow-color': 'rgba(227,24,55,.06)',
};

const DARK_VARS: Record<string, string> = {
  '--bg-color': '#0a0a0f',
  '--red-mid': '#E31837',
  '--red-light': '#ff5252',
  '--text-line1': '#ffffff',
  '--text-line2': '#ffffff',
  '--grid-opacity': '0.04',
  '--particle-base': '0.2',
  '--vignette-color': 'rgba(0,0,0,.6)',
  '--glow-color': 'rgba(227,24,55,.15)',
  '--shadow-color': 'rgba(227,24,55,.2)',
  '--text-shadow-color': 'rgba(227,24,55,.2)',
};

const LOADER_CSS = `
  .akbar-loading-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: var(--bg-color);
    display: flex; justify-content: center; align-items: center;
    overflow: hidden;
    font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  }
  .akbar-loading-overlay .bg-grid {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle at 1px 1px, rgba(183,28,28,var(--grid-opacity)) 1px, transparent 0);
    background-size: 40px 40px; pointer-events: none;
  }
  .akbar-loading-overlay .particles { position: absolute; inset: 0; pointer-events: none; }
  .akbar-loading-overlay .particle {
    position: absolute; width: 3px; height: 3px; border-radius: 50%;
    animation: akbarParticleFloat 6s ease-in-out infinite;
  }
  .akbar-loading-overlay .particle:nth-child(1)  { top:15%; left:10%; background:rgba(227,24,55,var(--particle-base)); animation-duration:7s; }
  .akbar-loading-overlay .particle:nth-child(2)  { top:25%; left:80%; background:rgba(227,24,55,calc(var(--particle-base) * .6)); animation-duration:5s; animation-delay:.5s; }
  .akbar-loading-overlay .particle:nth-child(3)  { top:70%; left:15%; background:rgba(255,82,82,calc(var(--particle-base) * .9)); animation-duration:8s; animation-delay:1s; }
  .akbar-loading-overlay .particle:nth-child(4)  { top:80%; left:75%; background:rgba(227,24,55,calc(var(--particle-base) * .6)); animation-duration:6s; animation-delay:1.5s; }
  .akbar-loading-overlay .particle:nth-child(5)  { top:40%; left:45%; background:rgba(255,82,82,var(--particle-base)); animation-duration:9s; animation-delay:2s; }
  .akbar-loading-overlay .particle:nth-child(6)  { top:60%; left:88%; background:rgba(183,28,28,calc(var(--particle-base) * .5)); animation-duration:7s; animation-delay:.3s; }
  @keyframes akbarParticleFloat {
    0%,100% { opacity:.2; transform:translateY(0) scale(1); }
    50%     { opacity:.6; transform:translateY(-8px) scale(1.2); }
  }
  .akbar-loading-overlay .merge-glow {
    position: absolute; top:50%; left:50%; width:200px; height:80px;
    transform: translate(-50%,-50%);
    background: radial-gradient(ellipse, var(--glow-color) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none; z-index: 3;
    animation: akbarMergeGlowPulse 5s ease-in-out infinite;
  }
  @keyframes akbarMergeGlowPulse {
    0%   { opacity:1;   transform:translate(-50%,-50%) scale(1.5); }
    15%  { opacity:.4;  transform:translate(-50%,-50%) scale(1); }
    50%  { opacity:.15; transform:translate(-50%,-50%) scale(.8); }
    85%  { opacity:0;   transform:translate(-50%,-50%) scale(.5); }
    100% { opacity:0;   transform:translate(-50%,-50%) scale(1.5); }
  }
  .akbar-loading-overlay .center-spark {
    position: absolute; top:50%; left:50%; width:5px; height:5px;
    background: var(--red-mid); border-radius:50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 10px 2px rgba(227,24,55,.35), 0 0 25px 5px rgba(255,82,82,.2);
    z-index: 8;
    animation: akbarSparkFlash 5s ease-out infinite;
  }
  @keyframes akbarSparkFlash {
    0%   { opacity:0; transform:translate(-50%,-50%) scale(0); }
    3%   { opacity:1; transform:translate(-50%,-50%) scale(2); }
    10%  { opacity:.3; transform:translate(-50%,-50%) scale(1); }
    30%  { opacity:0; transform:translate(-50%,-50%) scale(.3); }
    100% { opacity:0; transform:translate(-50%,-50%) scale(0); }
  }
  .akbar-loading-overlay .scene {
    position: absolute;
    top: 50%; left: 55%;
    transform: translate(-50%, -50%);
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .akbar-loading-overlay .airplane-wrap {
    position: relative;
    z-index: 6;
    animation: akbarPlaneGlide 5s cubic-bezier(.25,.1,.25,1) infinite;
    filter: drop-shadow(0 3px 12px var(--shadow-color));
  }
  @keyframes akbarPlaneGlide {
    0%   { transform: translateX(0); opacity: 0; }
    4%   { transform: translateX(0); opacity: 1; }
    35%  { transform: translateX(3vw); opacity: 1; }
    70%  { transform: translateX(3vw); opacity: 1; }
    88%  { transform: translateX(3vw); opacity: 0; }
    89%  { transform: translateX(0); opacity: 0; }
    100% { transform: translateX(0); opacity: 0; }
  }
  .akbar-loading-overlay .airplane-img {
    display: block;
    width: clamp(120px, 18vw, 220px);
    height: auto;
  }
  .akbar-loading-overlay .text-wrap {
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-right: -10px;
    text-align: right;
    white-space: nowrap;
  }
  .akbar-loading-overlay .text-inner {
    clip-path: inset(0 0 0 100%);
    animation: akbarTextEmit 5s cubic-bezier(.25,.1,.25,1) infinite;
  }
  @keyframes akbarTextEmit {
    0%   { clip-path: inset(0 0 0 100%); opacity: 0; }
    4%   { clip-path: inset(0 0 0 100%); opacity: 1; }
    10%  { clip-path: inset(0 0 0 90%);  opacity: 1; }
    35%  { clip-path: inset(0 0 0 0%);   opacity: 1; }
    70%  { clip-path: inset(0 0 0 0%);   opacity: 1; }
    88%  { clip-path: inset(0 0 0 100%); opacity: 0; }
    100% { clip-path: inset(0 0 0 100%); opacity: 0; }
  }
  .akbar-loading-overlay .text-line-1, .akbar-loading-overlay .text-line-2 { white-space: nowrap; }
  .akbar-loading-overlay .text-line-1 {
    font-size: clamp(.5rem, 1vw, .7rem);
    font-weight: 400; letter-spacing: .35em;
    text-transform: uppercase; color: var(--text-line1);
  }
  .akbar-loading-overlay .text-line-2 {
    font-size: clamp(.9rem, 2.2vw, 1.6rem);
    font-weight: 800; letter-spacing: .06em;
    text-transform: uppercase; color: var(--text-line2);
    margin-top: 2px;
    text-shadow: 0 0 20px var(--text-shadow-color);
  }
  [data-theme='dark'] .akbar-loading-overlay .text-line-1,
  [data-theme='dark'] .akbar-loading-overlay .text-line-2 {
    color: #ffffff !important;
  }
  [data-theme='dark'] .akbar-loading-overlay .text-line-2 {
    text-shadow: 0 0 20px rgba(227,24,55,.35);
  }
  .akbar-loading-overlay .divider {
    width: 0; height: 2px;
    background: linear-gradient(270deg, var(--red-mid), var(--red-light));
    margin: 5px 0 5px auto; border-radius: 1px;
    animation: akbarDividerGrow 5s cubic-bezier(.25,.1,.25,1) infinite;
  }
  @keyframes akbarDividerGrow {
    0%   { width:0; opacity:0; }
    5%   { width:0; opacity:0; }
    20%  { width:50%; opacity:.5; }
    35%  { width:100%; opacity:.7; }
    70%  { width:100%; opacity:.7; }
    88%  { width:0; opacity:0; }
    100% { width:0; opacity:0; }
  }
  .akbar-loading-overlay .char {
    display: inline-block;
    opacity: 0;
    transform: translateY(5px);
  }
  .akbar-loading-overlay .contrail {
    position: absolute;
    top: 50%;
    right: 100%;
    height: 1px;
    width: 0;
    background: linear-gradient(270deg, var(--red-mid), transparent);
    transform: translateY(-50%);
    opacity: 0;
    animation: akbarContrailGrow 5s cubic-bezier(.25,.1,.25,1) infinite;
    z-index: 4;
  }
  @keyframes akbarContrailGrow {
    0%   { width: 0; opacity: 0; }
    4%   { width: 0; opacity: 0; }
    10%  { width: 2vw; opacity: 0.4; }
    35%  { width: 15vw; opacity: 0.15; }
    70%  { width: 15vw; opacity: 0.15; }
    88%  { width: 0; opacity: 0; }
    100% { width: 0; opacity: 0; }
  }
  .akbar-loading-overlay .vignette {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at center, transparent 50%, var(--vignette-color) 100%);
    pointer-events: none; z-index: 10;
  }

  @keyframes akbarOverlayIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes akbarOverlayOut { from { opacity: 1; } to { opacity: 0; } }
  .akbar-overlay-enter { animation: akbarOverlayIn 0.4s ease both; }
  .akbar-overlay-exit  { animation: akbarOverlayOut 0.4s ease both; }

  @media (prefers-reduced-motion: reduce) {
    .akbar-loading-overlay .particle,
    .akbar-loading-overlay .merge-glow,
    .akbar-loading-overlay .center-spark,
    .akbar-loading-overlay .airplane-wrap,
    .akbar-loading-overlay .text-inner,
    .akbar-loading-overlay .divider,
    .akbar-loading-overlay .contrail {
      animation: none;
    }
    .akbar-loading-overlay .text-inner { clip-path: inset(0); opacity: 1; }
    .akbar-loading-overlay .airplane-wrap { opacity: 1; }
  }
`;

export const AkbarBizvoyLoader = () => {
  const counter = useGlobalLoaderStore((s) => s.counter);
  const message = useGlobalLoaderStore((s) => s.message);
  const messages = useGlobalLoaderStore((s) => s.messages);
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');

  const shownRef = useRef(false);
  const enterTimer = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const isLoading = counter > 0;

  const activeLabel =
    message ?? (messages && messages.length ? messages[0] : 'Loading');

  // Loader enter / exit
  useEffect(() => {
    if (isLoading) {
      if (exitTimer.current) {
        window.clearTimeout(exitTimer.current);
        exitTimer.current = null;
      }
      if (!shownRef.current) {
        setPhase('enter');
        setShow(true);
        shownRef.current = true;
      }
      if (enterTimer.current) {
        window.clearTimeout(enterTimer.current);
      }
      enterTimer.current = window.setTimeout(() => {
        setPhase('idle');
        enterTimer.current = null;
      }, ENTER_MS);
    } else if (shownRef.current) {
      if (enterTimer.current) {
        window.clearTimeout(enterTimer.current);
        enterTimer.current = null;
      }
      setPhase('exit');
      exitTimer.current = window.setTimeout(() => {
        setShow(false);
        setPhase('idle');
        shownRef.current = false;
        exitTimer.current = null;
      }, EXIT_MS);
    }
  }, [isLoading]);

  // Char-by-char text reveal (mirrors the requestAnimationFrame loop from index.html)
  useEffect(() => {
    if (!show) return;
    const chars = charRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (chars.length === 0) return;
    const n = chars.length;
    let raf = 0;

    const tick = (now: number) => {
      const pct = (now % CYCLE_MS) / CYCLE_MS;
      for (let i = 0; i < n; i++) {
        const start = 0.06 + (i / n) * 0.26;
        const end = start + 0.04;
        let o = 0;
        let y = 5;
        if (pct >= end && pct <= 0.7) {
          o = 1; y = 0;
        } else if (pct > start && pct < end) {
          const t = (pct - start) / (end - start);
          o = t; y = 5 * (1 - t);
        } else if (pct > 0.7 && pct <= 0.88) {
          const t2 = (pct - 0.7) / 0.18;
          o = 1 - t2;
        }
        chars[i].style.opacity = String(o);
        chars[i].style.transform = `translateY(${y}px)`;
      }
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [show]);

  // Cleanup timers
  useEffect(
    () => () => {
      if (enterTimer.current) window.clearTimeout(enterTimer.current);
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
    },
    [],
  );

  // Prevent page scroll while loading
  useEffect(() => {
    if (!show) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [show]);

  if (!show) {
    return null;
  }

  const overlayPhase =
    phase === 'enter'
      ? 'akbar-overlay-enter'
      : phase === 'exit'
        ? 'akbar-overlay-exit'
        : 'akbar-overlay-idle';

  const themeVars = isLight ? LIGHT_VARS : DARK_VARS;

  return (
    <div
      className={`akbar-loading-overlay ${overlayPhase}`}
      style={themeVars}
      role="status"
      aria-live="polite"
      aria-label={activeLabel}
    >
      <style>{LOADER_CSS}</style>

      <div className="bg-grid" />

      <div className="particles" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <div className="merge-glow" aria-hidden="true" />
      <div className="center-spark" aria-hidden="true" />

      <div className="scene">
        <div className="contrail" aria-hidden="true" />

        <div className="text-wrap">
          <div className="text-inner">
            <div className="text-line-1">
              {WELCOME_CHARS.map((c, i) => (
                <span
                  key={`w${i}`}
                  className="char"
                  ref={(el) => {
                    charRefs.current[i] = el;
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="divider" aria-hidden="true" />
            <div className="text-line-2">
              {BRAND_CHARS.map((c, i) => (
                <span
                  key={`b${i}`}
                  className="char"
                  ref={(el) => {
                    charRefs.current[WELCOME_CHARS.length + i] = el;
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="airplane-wrap">
          <img className="airplane-img" src={planeImg} alt="" draggable={false} />
        </div>
      </div>

      <div className="vignette" aria-hidden="true" />

      <span className="sr-only">{activeLabel}</span>
    </div>
  );
};

export default AkbarBizvoyLoader;