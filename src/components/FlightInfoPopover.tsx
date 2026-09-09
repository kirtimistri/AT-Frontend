// FlightInfoPopover.tsx
// A popover, visually matching PriceBreakdownPopover, that shows the flight code,
// departure and arrival terminals plus a per-stop layover breakdown when a plane
// icon on the flight timeline is hovered or clicked. The arrow always points at
// the exact icon that was clicked, even when the popover body is clamped to the
// viewport. While the popover is open, the plane icon animates from its tilted
// resting angle to straight flight direction.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, ReactNode } from 'react';
import { useFlightStore } from '../store/flightStore';
import { useThemeStore } from '../store/themeStore';
import { minutesToHm, twelveHToMins, minsToTwelveH, durationMinutes } from '../lib/format';

const POPOVER_WIDTH = 250;
const GAP = 10;
const EDGE_PAD = 8;
const ARROW_INSET = 16; // keep the arrow tip at least this far from the popover edges
const EST_HEIGHT = 200; // provisional height; refined once the popover is measured

type Anchor = { top: number; left: number; placeAbove: boolean; arrowLeft: number; measured: boolean };

export type StopDetail = { city: string; minutes: number };

type Props = {
  id: string;
  code: string;
  depTime: string;
  departure: string;
  arrTime: string;
  arrival: string;
  /** Total trip duration, e.g. "5h 40m"; used to derive each stop's landing time. */
  duration?: string;
  /** All intermediate stops with their layover durations, in travel order. */
  stops?: StopDetail[];
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

// Derive each stop's landing time from the departure time, cumulative flight
// durations (evenly split, layovers excluded) and the preceding layovers.
const stopArrivalTimeOf = (stops: StopDetail[], depTime: string, totalDuration: number): string[] => {
  const dep = twelveHToMins(depTime);
  const layoverTotal = stops.reduce((acc, s) => acc + s.minutes, 0);
  const flying = Math.max(totalDuration - layoverTotal, 0);
  const leg = flying / (stops.length + 1);
  const out: string[] = [];
  let t = dep;
  for (const s of stops) {
    t = Math.round(t + leg + s.minutes);
    out.push(minsToTwelveH(t));
  }
  return out;
};

// Renders a clickable timeline icon that opens a positioned popover with terminal
// and stop-by-stop layover details. The plane icon straightens while open.
export const FlightInfoPopover = ({ id, code, depTime, departure, arrTime, arrival, duration, stops, children, className = '', style }: Props) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const activeId = useFlightStore((s) => s.activePriceBreakdownId);
  const setActiveId = useFlightStore((s) => s.setActivePriceBreakdownId);

  const open = activeId === id;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const popHeightRef = useRef<number>(EST_HEIGHT);
  const pinnedRef = useRef(false);
  const closeTimer = useRef<number | null>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const stopList = stops ?? [];
  const stopTimes = stopArrivalTimeOf(stopList, depTime, duration ? durationMinutes(duration) : 0);

  const openPopover = () => {
    pinnedRef.current = false;
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActiveId(id);
  };
  const closePopover = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    pinnedRef.current = false;
    setActiveId(null);
  };

  // Compute the popover position; the arrow stays locked to the trigger's center.
  const place = (measured: boolean): Anchor | null => {
    const el = triggerRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    let left = r.left + r.width / 2 - POPOVER_WIDTH / 2;
    left = Math.max(EDGE_PAD, Math.min(left, vw - POPOVER_WIDTH - EDGE_PAD));
    const h = measured ? popHeightRef.current : EST_HEIGHT;
    const placeAbove = r.top >= h + GAP + EDGE_PAD;
    const top = placeAbove ? r.top - h - GAP : r.bottom + GAP;
    // Arrow offset from the popover's left edge to the trigger center, clamped so
    // it never slides off the card when the popover is clamped at the viewport edge.
    let arrowLeft = r.left + r.width / 2 - left;
    arrowLeft = Math.max(ARROW_INSET, Math.min(arrowLeft, POPOVER_WIDTH - ARROW_INSET));
    return { top, left, placeAbove, arrowLeft, measured };
  };

  // Position provisionally on open (estimated height); refined before paint below.
  useLayoutEffect(() => {
    if (!open) {
      setAnchor(null);
      return;
    }
    setAnchor(place(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, id]);

  // Once the popover content is mounted, measure its real height and reposition.
  useLayoutEffect(() => {
    if (!open || !anchor || anchor.measured) return;
    const pop = popRef.current;
    if (!pop) return;
    popHeightRef.current = pop.offsetHeight;
    setAnchor(place(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, anchor]);

  // Keyboard: Escape closes. Clicking outside closes.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePopover();
    };
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const el = triggerRef.current;
      const target = e.target as Node;
      if (el && el.contains(target)) return;
      closePopover();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, id]);

  // Keep the popover anchored on scroll/resize using the measured height.
  useEffect(() => {
    if (!open) return;
    const onPlace = () => setAnchor(place(true));
    window.addEventListener('resize', onPlace);
    window.addEventListener('scroll', onPlace, true);
    return () => {
      window.removeEventListener('resize', onPlace);
      window.removeEventListener('scroll', onPlace, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, id]);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    []
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Show terminal and layover details"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={(e) => {
          e.stopPropagation();
          if (open) {
            pinnedRef.current = false;
            setActiveId(null);
          } else {
            pinnedRef.current = true;
            setActiveId(id);
          }
        }}
        onMouseEnter={() => openPopover()}
        onMouseLeave={() => {
          if (pinnedRef.current) return;
          if (closeTimer.current) window.clearTimeout(closeTimer.current);
          closeTimer.current = window.setTimeout(() => {
            if (activeId === id) setActiveId(null);
          }, 120);
        }}
        style={style}
        className={`cursor-pointer outline-none transition-colors duration-300 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${open ? 'plane-open' : ''} ${className}`}
      >
        {children}
      </button>

      {open &&
        anchor &&
        createPortal(
          <div
            ref={popRef}
            role="dialog"
            aria-label="Flight details"
            className={`fixed z-[100] w-[250px] rounded-[12px] border p-4 shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur transition-colors duration-300 ${isLight ? 'border-[#E5E7EB] bg-white shadow-[0_12px_36px_rgba(0,0,0,0.14)]' : 'border-[#29466e] bg-[#0d1b2a]'}`}
            style={{ top: anchor.top, left: anchor.left }}
          >
            <div className={`text-[11px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#7CC0FF]'}`}>Terminal &amp; Layover</div>
            <div className="mt-3 space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className={`text-[11.5px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>Flight</span>
                <span className={`text-[12px] font-semibold tabular-nums transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{code}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className={`text-[11.5px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>Departs</span>
                <span className={`text-[12px] font-semibold tabular-nums transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{depTime} · {departure}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className={`text-[11.5px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>Lands</span>
                <span className={`text-[12px] font-semibold tabular-nums transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{arrTime} · {arrival}</span>
              </div>

              {/* One row per intermediate stop, in travel order */}
              {stopList.map((s, i) => (
                <div key={`${s.city}:${i}`} className={`rounded-[8px] bg-white/[0.04] px-2.5 py-1.5 transition-colors duration-300 ${isLight ? 'bg-[#F7F9FC]' : ''}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className={`shrink-0 text-[11px] font-bold uppercase tracking-wide transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#7CC0FF]'}`}>
                      Stop {i + 1}
                    </span>
                    <span className={`text-right text-[12px] font-semibold tabular-nums transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>
                      {stopTimes[i]} · {s.city}
                    </span>
                  </div>
                  <div className={`mt-0.5 flex items-baseline justify-between gap-3 transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>
                    <span className="shrink-0 text-[10.5px]">Layover</span>
                    <span className="text-[11px] font-semibold tabular-nums">{minutesToHm(s.minutes)}</span>
                  </div>
                </div>
              ))}

              {stopList.length === 0 && (
                <div className="flex items-baseline justify-between gap-3">
                  <span className={`shrink-0 text-[11.5px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>Stops</span>
                  <span className={`text-[12px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>Non-stop</span>
                </div>
              )}
            </div>

            {/* Arrow pointing at the exact plane icon that was clicked */}
            <div
              className={`absolute h-3 w-3 -translate-x-1/2 rotate-45 border transition-colors duration-300 ${
                anchor.placeAbove
                  ? `-bottom-[6px] ${isLight ? 'border-r border-b border-[#E5E7EB] bg-white' : 'border-r border-b border-[#29466e] bg-[#0d1b2a]'}`
                  : `-top-[6px] ${isLight ? 'border-l border-t border-[#E5E7EB] bg-white' : 'border-l border-t border-[#29466e] bg-[#0d1b2a]'}`
              }`}
              style={{ left: anchor.arrowLeft }}
            />
          </div>,
          document.body
        )}
    </>
  );
};
