// FlightLoader.tsx
// Letters fade in one by one and the plane leads on the same clock.
// The COMPLETE text is guaranteed to appear before the animation deadline.
// Animation duration is synchronized with the expected response time (loopMs).

import { useEffect, useMemo, useRef, useState } from 'react';
import planeImg from '../assets/Backgoundimages/flight.png';
import { useThemeStore } from '../store/themeStore';
import { AIRPLANE_RUN_MS } from '../store/globalLoader';

export type FlightLoaderProps = {
  isLoading: boolean;
  primary: string;
  accent: string;
  secondary: string;

  /** Expected response time in milliseconds. */
  loopMs?: number;

  /**
   * Speed multiplier.
   * 1 = exact response timing.
   * >1 = faster.
   * <1 = slower.
   */
  speedMultiplier?: number;

  /** Minimum complete animation duration. */
  minLoopMs?: number;

  /** Maximum complete animation duration. */
  maxLoopMs?: number;

  /**
   * Desired minimum stagger between letters.
   * Treated as a preferred value — never allowed to push the reveal
   * past the response deadline.
   */
  minLetterMs?: number;
};

export const FlightLoader = ({
  isLoading,
  primary,
  accent,
  secondary,

  loopMs = AIRPLANE_RUN_MS,

  // 1 = animation follows response time exactly.
  // Raise slightly (1.15–1.3) if you want a small lead over the response.
  speedMultiplier = 1.15,

  minLoopMs = 700,
  maxLoopMs = 3500,

  minLetterMs = 45,
}: FlightLoaderProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // ------------------------------------------------------------
  // BUILD CHARACTER ARRAY
  // ------------------------------------------------------------

  const chars = useMemo(() => {
    const out: { ch: string; accent: boolean }[] = [];

    [primary, accent, secondary].forEach((segment, si) => {
      if (si > 0) {
        out.push({ ch: ' ', accent: false });
      }
      for (const ch of segment) {
        out.push({ ch, accent: si === 1 });
      }
    });

    return out;
  }, [primary, accent, secondary]);

  const total = chars.length;

  // ------------------------------------------------------------
  // RESPONSE-SYNCHRONIZED TIMING
  // ------------------------------------------------------------

  const clampedLoop = Math.min(
    Math.max(loopMs, minLoopMs),
    maxLoopMs,
  );

  /**
   * The reveal MUST complete inside this window.
   * speedMultiplier compresses the window; 1.15 = 15% faster than response.
   */
  const deadlineMs = clampedLoop / Math.max(speedMultiplier, 0.1);

  // ------------------------------------------------------------
  // FADE DURATION
  // ------------------------------------------------------------

  const preferredFadeMs = Math.min(
    Math.max(minLetterMs * 1.4, 60),
    220,
  );

  const fadeMs =
    total <= 1
      ? Math.min(preferredFadeMs, deadlineMs)
      : Math.min(
          preferredFadeMs,
          Math.max(deadlineMs * 0.25, 40),
        );

  // ------------------------------------------------------------
  // LETTER STAGGER — the core of response sync
  // ------------------------------------------------------------

  /**
   * Every letter lives inside deadlineMs. The stagger is DERIVED from
   * the deadline so a faster response = faster stagger, automatically.
   *
   *   stagger = (deadline − fade) / (total − 1)
   *
   * - Longer text   → smaller stagger → same deadline.
   * - Faster search → smaller deadline → smaller stagger.
   * - Slower search → larger deadline → larger stagger.
   */
  const availableStaggerTime = Math.max(deadlineMs - fadeMs, 0);

  const actualStaggerMs =
    total > 1 ? availableStaggerTime / (total - 1) : 0;

  // ------------------------------------------------------------
  // FINAL LETTER TIMING
  // ------------------------------------------------------------

  const lastLetterStartMs = actualStaggerMs * Math.max(total - 1, 0);
  const lastLetterEndMs = lastLetterStartMs + fadeMs; // === deadlineMs

  const safetyMarginMs = 20;
  const animationDeadlineMs = Math.min(
    lastLetterEndMs + safetyMarginMs,
    deadlineMs + safetyMarginMs,
  );

  // ------------------------------------------------------------
  // PLANE TIMING — rides the same clock
  // ------------------------------------------------------------

  const planeHopMs = Math.min(
    Math.max(actualStaggerMs * 0.8, 40),
    110,
  );

  // ------------------------------------------------------------
  // RUN KEY
  // ------------------------------------------------------------

  const runKey = [
    primary,
    accent,
    secondary,
    Math.round(deadlineMs),
    total,
  ].join('__');

  // ------------------------------------------------------------
  // STATE
  // ------------------------------------------------------------

  const [planeX, setPlaneX] = useState(0);
  const [forceReveal, setForceReveal] = useState(false);

  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lastFiredIndex = useRef(0);

  // ------------------------------------------------------------
  // REDUCED MOTION
  // ------------------------------------------------------------

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // ------------------------------------------------------------
  // PLANE FOLLOWING LETTERS
  // ------------------------------------------------------------

  useEffect(() => {
    if (!isLoading) return;

    if (reducedMotion) {
      const lastEl = charRefs.current[total - 1];
      if (lastEl) {
        setPlaneX(lastEl.offsetLeft + lastEl.offsetWidth);
      }
      lastFiredIndex.current = Math.max(total - 1, 0);
      return;
    }

    setPlaneX(0);
    lastFiredIndex.current = 0;

    const timers: number[] = [];

    for (let i = 0; i < total; i++) {
      const delay = i * actualStaggerMs;

      const timer = window.setTimeout(() => {
        const el = charRefs.current[i];
        if (el) {
          setPlaneX(el.offsetLeft + el.offsetWidth);
        }
        lastFiredIndex.current = i;
      }, delay);

      timers.push(timer);
    }

    return () => {
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, runKey, total, actualStaggerMs, reducedMotion]);

  // ------------------------------------------------------------
  // GUARANTEE COMPLETE TEXT VISIBILITY
  // ------------------------------------------------------------

  useEffect(() => {
    if (!isLoading) return;

    setForceReveal(false);

    const timer = window.setTimeout(() => {
      setForceReveal(true);
    }, animationDeadlineMs);

    return () => {
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, runKey, animationDeadlineMs]);

  // ------------------------------------------------------------
  // RE-ANCHOR PLANE ON RESIZE
  // ------------------------------------------------------------

  useEffect(() => {
    const onResize = () => {
      const index = lastFiredIndex.current;
      const el = charRefs.current[index];
      if (el) {
        setPlaneX(el.offsetLeft + el.offsetWidth);
      }
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // ------------------------------------------------------------
  // DON'T RENDER WHEN NOT LOADING
  // ------------------------------------------------------------

  if (!isLoading) {
    return null;
  }

  // ------------------------------------------------------------
  // THEME
  // ------------------------------------------------------------

  const accentColor = isLight ? '#DC2626' : '#F87171';
  const textColor = isLight ? '#DC2626' : '#F87171';

  // ------------------------------------------------------------
  // RESPONSIVE TEXT SIZE
  // ------------------------------------------------------------

  const sizeClass =
    chars.length <= 16
      ? 'text-[26px] tracking-tight sm:text-[32px] lg:text-[38px]'
      : chars.length <= 24
        ? 'text-[22px] tracking-tight sm:text-[26px] lg:text-[30px]'
        : chars.length <= 36
          ? 'text-[18px] tracking-tight sm:text-[21px] lg:text-[24px]'
          : 'text-[14px] tracking-[0.06em] sm:text-[16px] lg:text-[19px]';

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <>
      <style>{`
        @keyframes fl-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes fl-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .fl-plane-lead { transition: none !important; }
          .fl-char {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <div
        key={runKey}
        className="relative flex w-[min(880px,94vw)] items-center"
      >
        {/* TEXT */}
        <p
          aria-hidden="true"
          className={`
            relative z-0 w-full
            whitespace-nowrap
            text-left
            font-extrabold
            uppercase
            leading-none
            ${sizeClass}
          `}
          style={{
            fontFamily: "'Inter Variable', 'Inter', 'Segoe UI', system-ui, sans-serif",
            color: textColor,
          }}
        >
          {chars.map((c, i) => (
            <span
              key={i}
              ref={(el) => {
                charRefs.current[i] = el;
              }}
              className="fl-char inline-block"
              style={{
                opacity: forceReveal ? 1 : 0,
                animation: forceReveal
                  ? 'none'
                  : `fl-fade-in ${fadeMs}ms ease-out ${
                      i * actualStaggerMs
                    }ms both`,
                ...(c.accent ? { color: accentColor } : null),
              }}
            >
              {c.ch === ' ' ? '\u00A0' : c.ch}
            </span>
          ))}
        </p>

        {/* PLANE */}
        <div
          className="
            fl-plane-lead
            pointer-events-none
            absolute
            left-0
            top-1/2
            z-10
          "
          style={{
            transform: `translate3d(${planeX}px, -50%, 0)`,
            transition: `transform ${planeHopMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        >
          <div style={{ animation: 'fl-bob 1.6s ease-in-out infinite' }}>
            <img
              src={planeImg}
              alt=""
              draggable={false}
              className={`
                h-24 w-auto select-none sm:h-28 lg:h-36
                ${
                  isLight
                    ? 'drop-shadow-[0_6px_12px_rgba(10,40,90,0.30)]'
                    : 'drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)]'
                }
              `}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightLoader;