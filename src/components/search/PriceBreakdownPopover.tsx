// PriceBreakdownPopover.tsx
// A popover that shows a detailed price breakdown (base fare, taxes, fees) when the price is clicked.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { useFlightStore } from '../../store/flightStore';
import { useThemeStore } from '../../store/themeStore';
import { inr, type PriceBreakdown } from '../../lib/format';

const POPOVER_WIDTH = 240;
const POPOVER_HEIGHT = 196;
const GAP = 10;

type Props = {
  id: string;
  breakdown: PriceBreakdown;
  children: ReactNode;
  className?: string;
};

// Renders a clickable price that opens a positioned popover with the full cost breakdown.
export const PriceBreakdownPopover = ({ id, breakdown, children, className = '' }: Props) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const activeId = useFlightStore((s) => s.activePriceBreakdownId);
  const setActiveId = useFlightStore((s) => s.setActivePriceBreakdownId);

  const open = activeId === id;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pinnedRef = useRef(false);
  const closeTimer = useRef<number | null>(null);
  const [anchor, setAnchor] = useState<{ top: number; left: number; placeAbove: boolean } | null>(null);

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

  // Position the popover above the price (below if no room above).
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      let left = r.left + r.width / 2 - POPOVER_WIDTH / 2;
      left = Math.max(8, Math.min(left, vw - POPOVER_WIDTH - 8));
      const placeAbove = r.top >= POPOVER_HEIGHT + GAP + 8;
      const top = placeAbove ? r.top - POPOVER_HEIGHT - GAP : r.bottom + GAP;
      setAnchor({ top, left, placeAbove });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, id]);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    []
  );

  const rows: { label: string; value: number }[] = [
    { label: 'Base Fare', value: breakdown.baseFare },
    { label: 'Taxes', value: breakdown.taxes },
    { label: 'Service Fee', value: breakdown.serviceFee },
    { label: 'Service Fee GST', value: breakdown.serviceFeeGst },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Show price breakdown"
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
        className={`cursor-pointer border-0 bg-transparent p-0 text-left outline-none transition-colors duration-300 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:rounded-[6px] ${className}`}
      >
        {children}
      </button>

      {open &&
        anchor &&
        createPortal(
          <div
            role="dialog"
            aria-label="Price Breakdown"
            className={`pointer-events-none fixed z-[100] w-[240px] rounded-[12px] border p-4 shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur transition-colors duration-300 ${isLight ? 'border-[#E5E7EB] bg-white shadow-[0_12px_36px_rgba(0,0,0,0.14)]' : 'border-[#29466e] bg-[#0d1b2a]'}`}
            style={{ top: anchor.top, left: anchor.left }}
          >
            <div className={`text-[11px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#7CC0FF]'}`}>Price Breakdown</div>
            <div className="mt-3 space-y-2">
              {rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-3">
                  <span className={`text-[11.5px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>{row.label}</span>
                  <span className={`text-[12px] font-semibold tabular-nums transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{inr(row.value)}</span>
                </div>
              ))}
            </div>
            <div className={`my-3 border-t transition-colors duration-300 ${isLight ? 'border-[#E5E7EB]' : 'border-[#29466e]'}`} />
            <div className="flex items-baseline justify-between gap-3">
              <span className={`text-[12.5px] font-bold tracking-wide transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>Total Amount</span>
              <span className={`text-[15px] font-bold tabular-nums transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#3B9CFF]'}`}>{inr(breakdown.totalAmount)}</span>
            </div>

            {/* Arrow pointing toward the price */}
            <div
              className={`absolute h-3 w-3 rotate-45 border transition-colors duration-300 ${
                anchor.placeAbove
                  ? `-bottom-[6px] left-1/2 -translate-x-1/2 ${isLight ? 'border-r border-b border-[#E5E7EB] bg-white' : 'border-r border-b border-[#29466e] bg-[#0d1b2a]'}`
                  : `-top-[6px] left-1/2 -translate-x-1/2 ${isLight ? 'border-l border-t border-[#E5E7EB] bg-white' : 'border-l border-t border-[#29466e] bg-[#0d1b2a]'}`
              }`}
            />
          </div>,
          document.body
        )}
    </>
  );
};