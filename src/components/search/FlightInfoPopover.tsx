// FlightInfoPopover.tsx
// A popover, visually matching PriceBreakdownPopover, that shows a compact
// leg-by-leg itinerary when a plane icon on the flight timeline is hovered or
// clicked: per-leg flight number, city times with terminals and duration.
// The arrow always points at
// the exact icon that was clicked, even when the popover body is clamped to the
// viewport. While the popover is open, the plane icon animates from its tilted
// resting angle to straight flight direction.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, ReactNode } from 'react';
import { useFlightStore } from '../../store/flightStore';
import { useThemeStore } from '../../store/themeStore';
import { minutesToHm, twelveHToMins, minsTo24H, durationMinutes, cityNameOf } from '../../lib/format';

const POPOVER_WIDTH = 250;
const GAP = 10;
const EDGE_PAD = 8;
const ARROW_INSET = 16; // keep the arrow tip at least this far from the popover edges
const EST_HEIGHT = 300; // provisional height; refined once the popover is measured

type Anchor = { top: number; left: number; placeAbove: boolean; arrowLeft: number; measured: boolean };

export type StopDetail = { city: string; minutes: number };

type Leg = { dep: string; arr: string; mins: number };

type Props = {
  id: string;
  code: string;
  depTime: string;
  departure: string;
  arrTime: string;
  arrival: string;
  /** Total trip duration, e.g. "5h 40m"; used to derive each leg's times. */
  duration?: string;
  /** All intermediate stops with their layover durations, in travel order. */
  stops?: StopDetail[];
  /** Per-leg flight codes (length = stops + 1), e.g. ["6E 2169", "6E 6598"]. */
  legCodes?: string[];
  /** When set, only the leg at this index is shown in the popover. */
  onlyLeg?: number;
  /** Departure/arrival city names, e.g. "Delhi". */
  depCity?: string;
  arrCity?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

// Build the leg-by-leg schedule: splits the total duration evenly across legs
// (layovers excluded) and adds each stop's layover before the next departure.
const itineraryOf = (stops: StopDetail[], depTime: string, totalDuration: number): Leg[] => {
  const dep = twelveHToMins(depTime);
  const layoverTotal = stops.reduce((acc, s) => acc + s.minutes, 0);
  const flying = Math.max(totalDuration - layoverTotal, 0);
  const legMins = flying / (stops.length + 1);
  const legs: Leg[] = [];
  let t = dep;
  for (let i = 0; i <= stops.length; i++) {
    const depT = minsTo24H(t);
    t = Math.round(t + legMins);
    const arrT = minsTo24H(t);
    legs.push({ dep: depT, arr: arrT, mins: Math.round(legMins) });
    if (i < stops.length) t += stops[i].minutes;
  }
  return legs;
};

// Deterministic terminal number for intermediate stops.
const terminalFor = (city: string, code: string) => `Terminal ${((city.charCodeAt(0) + code.length) % 3) + 1}`;

// Renders a clickable timeline icon that opens a positioned popover with the
// leg-by-leg itinerary. The plane icon straightens while open.
export const FlightInfoPopover = ({
  id,
  code,
  depTime,
  departure,
  arrival,
  duration,
  stops,
  legCodes,
  onlyLeg,
  depCity,
  arrCity,
  children,
  className = '',
  style,
}: Props) => {
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
  const legs = itineraryOf(stopList, depTime, duration ? durationMinutes(duration) : 0);

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
        aria-label="Show flight itinerary details"
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
            className={`fixed z-[100] w-[250px] rounded-[12px] border p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur transition-colors duration-300 ${isLight ? 'border-[#E5E7EB] bg-white shadow-[0_12px_36px_rgba(0,0,0,0.14)]' : 'border-[#29466e] bg-[#0d1b2a]'}`}
            style={{ top: anchor.top, left: anchor.left }}
          >
            <div className={`text-[10.5px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#7CC0FF]'}`}>Flight itinerary</div>

            <div className="mt-2 space-y-3.5">
              {legs.map((leg, i) => {
                if (onlyLeg !== undefined && i !== onlyLeg) return null;
                const legCode = legCodes?.[i] ?? code;
                const m = legCode.match(/^(\D+)\s*(\d+)$/);
                const alCode = (m?.[1] ?? legCode).trim();
                const legNo = m?.[2] ?? '';
                const stop = i < stopList.length ? stopList[i] : null;
                const prevStop = i > 0 ? stopList[i - 1] : null;
                const depCityI = i === 0 ? depCity ?? departure : cityNameOf(prevStop!.city);
                const arrCityI = stop ? cityNameOf(stop.city) : arrCity ?? arrival;
                const depTermI = i === 0 ? departure : terminalFor(prevStop!.city, code);
                const arrTermI = stop ? terminalFor(stop.city, code) : arrival;
                return (
                  <div key={`${legCode}:${i}`}>
                    {/* Change-of-planes layover pill between legs */}
                    {prevStop && (
                      <div
                        className={`my-2.5 rounded-[7px] border px-2 py-1 text-[10px] font-semibold leading-snug transition-colors duration-300 ${isLight ? 'border-[#FCA5A5] bg-[#FEF2F2] text-[#DC2626]' : 'border-[#ef4444]/40 bg-[#ef4444]/10 text-[#f87171]'}`}
                      >
                        Change of planes · {minutesToHm(prevStop.minutes)} layover in {cityNameOf(prevStop.city)}
                      </div>
                    )}

                    {/* Leg header: flight number + cabin */}
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11.5px] font-bold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>
                        {alCode}
                        {legNo && <span className={`font-semibold transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}> | {legNo}</span>}
                      </span>
                      <span className={`ml-auto text-[9.5px] font-semibold leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>Economy</span>
                    </div>

                    {/* Route visualization: departure/arrival dots joined by a dotted line, rows beside it */}
                    <div className="mt-1.5 flex items-stretch gap-2">
                      <div className="flex w-1.5 shrink-0 flex-col items-center pb-[3px] pt-[3px]">
                        <span className={`h-[5px] w-[5px] shrink-0 rounded-full transition-colors duration-300 ${isLight ? 'bg-[#2563EB]' : 'bg-[#7CC0FF]'}`} />
                        <span className={`w-0 flex-1 border-l border-dotted transition-colors duration-300 ${isLight ? 'border-[#94A3B8]' : 'border-[#5a7ea8]'}`} />
                        <span className={`h-[5px] w-[5px] shrink-0 rounded-full transition-colors duration-300 ${isLight ? 'bg-[#2563EB]' : 'bg-[#7CC0FF]'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        {/* Departure city + time (left) + terminal (right) */}
                        <div className="flex items-center gap-1.5">
                          <span className={`min-w-0 truncate text-[11px] leading-none transition-colors duration-300 ${isLight ? 'text-[#374151]' : 'text-[#c4d2e5]'}`}>
                            {depCityI} <span className={`font-bold transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{leg.dep}</span>
                          </span>
                          <span className={`ml-auto shrink-0 text-[9.5px] leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>{depTermI}</span>
                        </div>

                        {/* Leg duration (centered) */}
                        <div className={`flex items-center justify-center text-[9.5px] leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>
                          <span className="tabular-nums">{minutesToHm(leg.mins)}</span>
                        </div>

                        {/* Arrival city + time (left) + terminal (right) */}
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`min-w-0 truncate text-[11px] leading-none transition-colors duration-300 ${isLight ? 'text-[#374151]' : 'text-[#c4d2e5]'}`}>
                            {arrCityI} <span className={`font-bold transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{leg.arr}</span>
                          </span>
                          <span className={`ml-auto shrink-0 text-[9.5px] leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>{arrTermI}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
