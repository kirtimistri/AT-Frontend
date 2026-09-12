// FlightLoader.tsx
// Unified flight-strip loader used on every page. One bold uppercase headline
// whose letters FLASH in one by one while the airplane makes a SINGLE slow
// pass right → left across the strip. Character delays are staggered across
// exactly one plane pass (--fl-ms, default AIRPLANE_RUN_MS), so the text
// finishes flashing just as the plane parks at the left end — then the strip
// holds, fully readable, until the loader hides.
//
// Rendering relies on the .fl-* classes in index.css. The component only
// supplies the staggered letter delays, the accent (red) middle word, and the
// plane SVG inside .fl-plane-run / .fl-plane-bob.
import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import { PlaneFill } from './icons';
import { useThemeStore } from '../store/themeStore';
import { AIRPLANE_RUN_MS } from '../store/globalLoader';

export type FlightLoaderProps = {
  isLoading: boolean;

  /** First headline word ("LIMA", a route origin, ...). */
  primary: string;
  /** Middle word, rendered in the brand accent red ("OSCAR", "TO", ...). */
  accent: string;
  /** Remaining headline, joined after the accent ("ALPHA DELTA ..."). */
  secondary: string;

  /** Duration of one full plane pass / full letter reveal. */
  runMs?: number;
};

// Matches .fl-char's `fl-char-flash` animation length in index.css.
const FLASH_MS = 320;

export const FlightLoader = ({
  isLoading,
  primary,
  accent,
  secondary,
  runMs = AIRPLANE_RUN_MS,
}: FlightLoaderProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const chars = useMemo(() => {
    const out: { ch: string; accent: boolean }[] = [];
    [primary, accent, secondary].forEach((segment, si) => {
      if (si > 0) out.push({ ch: ' ', accent: false });
      for (const ch of segment) out.push({ ch, accent: si === 1 });
    });
    return out;
  }, [primary, accent, secondary]);

  if (!isLoading) return null;

  const total = chars.length;
  // Stagger the letters so the last one finishes flashing exactly when the
  // plane parks (i * stagger + FLASH_MS <= runMs).
  const stagger = total > 1 ? Math.max(runMs - FLASH_MS, 0) / (total - 1) : 0;

  const accentColor = isLight ? '#DC2626' : '#F87171';
  const textColor = isLight ? '#111827' : '#F1F5F9';

  // Heading starts big for short headlines and shrinks as the NATO-phonetic
  // route string grows, so the strip never overflows its 880px max width.
  const sizeClass =
    total <= 16
      ? 'text-[26px] tracking-tight sm:text-[32px] lg:text-[38px]'
      : total <= 24
        ? 'text-[22px] tracking-tight sm:text-[26px] lg:text-[30px]'
        : total <= 36
          ? 'text-[18px] tracking-tight sm:text-[21px] lg:text-[24px]'
          : 'text-[14px] tracking-[0.06em] sm:text-[16px] lg:text-[19px]';

  return (
    <div
      className="fl-strip relative w-[min(880px,94vw)] overflow-hidden"
      style={{ '--fl-ms': `${runMs}ms` } as CSSProperties}
    >
      {/* Headline — letters flash in one by one across a single plane pass. */}
      <p
        aria-hidden="true"
        className={`relative z-0 w-full whitespace-nowrap text-left font-extrabold uppercase leading-none ${sizeClass}`}
        style={{
          fontFamily: "'Inter Variable', 'Inter', 'Segoe UI', system-ui, sans-serif",
          color: textColor,
        }}
      >
        {chars.map((c, i) => (
          <span
            key={i}
            className="fl-char inline-block"
            style={{
              animationDelay: `${i * stagger}ms`,
              ...(c.accent ? { color: accentColor } : null),
            }}
          >
            {c.ch === ' ' ? '\u00A0' : c.ch}
          </span>
        ))}
      </p>

      {/* Plane: ONE slow pass, off the right edge → parked at the left end. */}
      <div className="fl-plane-run pointer-events-none z-10">
        <div className="fl-plane-bob">
          <PlaneFill
            className={`w-16 select-none sm:w-20 lg:w-24 ${
              isLight
                ? 'text-[#DC2626] drop-shadow-[0_6px_12px_rgba(10,40,90,0.30)]'
                : 'text-[#F8FAFC] drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)]'
            }`}
          />
        </div>
        <span className="fl-contrail" />
      </div>
    </div>
  );
};

export default FlightLoader;