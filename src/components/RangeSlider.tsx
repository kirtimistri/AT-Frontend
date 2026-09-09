import { useRef, useState } from 'react';
import { useThemeStore } from '../store/themeStore';
export type SliderSpec = { from: number; to: number };
export const RangeSlider = ({ from, to }: SliderSpec) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  // Editable copy of the from/to bounds, initialised from props.
  const [range, setRange] = useState({ from, to });
  const trackRef = useRef<HTMLDivElement>(null);
  // Which thumb is being dragged (null = not dragging).
  const dragRef = useRef<'from' | 'to' | null>(null);

  // Convert a pointer x position to a 0-100 percentage clamped to the track.
  const pctFromEvent = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  };

  // Move the currently dragged thumb, keeping from <= to.
  const applyDrag = (clientX: number) => {
    const which = dragRef.current;
    if (!which) return;
    const pct = pctFromEvent(clientX);
    setRange((r) => (which === 'from' ? { ...r, from: Math.min(pct, r.to) } : { ...r, to: Math.max(pct, r.from) }));
  };

  // Begin dragging a specific thumb; capture the pointer so moves outside the track still register.
  const startDrag = (which: 'from' | 'to') => (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dragRef.current = which;
    trackRef.current?.setPointerCapture(e.pointerId);
    applyDrag(e.clientX);
  };

  // Clicking the track jumps the nearest thumb to the click position.
  const onTrackPointerDown = (e: React.PointerEvent) => {
    if (dragRef.current) return;
    const pct = pctFromEvent(e.clientX);
    const which: 'from' | 'to' = Math.abs(pct - range.from) <= Math.abs(pct - range.to) ? 'from' : 'to';
    dragRef.current = which;
    trackRef.current?.setPointerCapture(e.pointerId);
    applyDrag(e.clientX);
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  // Nudge a thumb by 2% with the arrow keys.
  const onThumbKeyDown = (which: 'from' | 'to') => (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    e.stopPropagation();
    const delta = e.key === 'ArrowRight' ? 2 : -2;
    setRange((r) => {
      const v = Math.min(100, Math.max(0, (which === 'from' ? r.from : r.to) + delta));
      return which === 'from' ? { ...r, from: Math.min(v, r.to) } : { ...r, to: Math.max(v, r.from) };
    });
  };

  // Thumb style: white core with a blue ring and soft shadow; glows on hover/drag.
  const thumbCls = `absolute top-1/2 h-[14px] w-[14px] -translate-y-1/2 cursor-grab touch-none rounded-full border-2 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#d4af37]/70 hover:scale-110 hover:shadow-[0_0_0_5px_rgba(59,156,255,0.18)] active:cursor-grabbing active:scale-110 ${isLight ? 'border-[#2563EB] bg-white shadow-[0_1px_4px_rgba(37,99,235,0.35)]' : 'border-[#3B9CFF] bg-[#0F1B3A] shadow-[0_1px_4px_rgba(0,0,0,0.45)]'}`;

  return (
    <div className="mt-0.5 cursor-pointer px-0.5 py-1">
      <div
        ref={trackRef}
        className={`relative h-[4px] rounded-full transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-white/12'}`}
        onPointerDown={onTrackPointerDown}
        onPointerMove={(e) => applyDrag(e.clientX)}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className={`absolute top-0 h-full rounded-full ${isLight ? 'bg-gradient-to-r from-[#60A5FA] to-[#2563EB]' : 'bg-gradient-to-r from-[#3B9CFF] to-[#7CC0FF]'}`}
          style={{ left: `${range.from}%`, width: `${range.to - range.from}%` }}
        />
        <div
          role="slider"
          aria-label="Minimum value"
          aria-valuenow={Math.round(range.from)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onPointerDown={startDrag('from')}
          onKeyDown={onThumbKeyDown('from')}
          className={thumbCls}
          style={{ left: `calc(${range.from}% - 7px)` }}
        />
        <div
          role="slider"
          aria-label="Maximum value"
          aria-valuenow={Math.round(range.to)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onPointerDown={startDrag('to')}
          onKeyDown={onThumbKeyDown('to')}
          className={thumbCls}
          style={{ left: `calc(${range.to}% - 7px)` }}
        />
      </div>
    </div>
  );
};
