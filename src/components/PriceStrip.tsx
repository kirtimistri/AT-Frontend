// Horizontal strip of selectable date cards showing prices, with prev/next week arrows.
import type { StripDay } from '../store/flightStore';
import { useThemeStore } from '../store/themeStore';
import { stripInr } from '../lib/format';
import { iconProps } from '../lib/iconProps';

// Props that let the parent control the dates shown and handle user choices
type PriceStripProps = {
  dates: StripDay[];
  selected: number;
  onPick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export const PriceStrip = ({ dates, selected, onPick, onPrev, onNext, canPrev, canNext }: PriceStripProps) => {
  // Theme determines the light or dark styling
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  return (
    <div className={`flex items-stretch overflow-hidden rounded-[14px] border transition-colors duration-300 ${isLight ? 'bg-white border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.08)]' : 'bg-[#0F1B3A] border-[rgba(124,192,255,0.22)] shadow-[0_8px_24px_rgba(0,0,0,0.3)]'}`}>
    {/* Left arrow */}
    <button
      onClick={onPrev}
      disabled={!canPrev}
      aria-label="Previous week"
      className={`group relative flex w-[34px] shrink-0 cursor-pointer items-center justify-center border-r bg-transparent transition-all duration-300 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent ${isLight ? 'border-r-[#E5E7EB] text-[#2563EB] hover:bg-[#F9FAFB] disabled:hover:bg-transparent' : 'border-white/10 text-[#7CC0FF] hover:bg-[rgba(212,175,55,0.16)]'}`}
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_28px_rgba(212,175,55,0.5)] transition-opacity duration-300 group-hover:opacity-100" />
      <svg {...iconProps('h-4 w-4 transition-colors duration-300 group-hover:text-[#f0c265]')}><path d="m15 18-6-6 6-6" /></svg>
    </button>

    {/* Date cards — one button per day with its label and price */}
    <div className={`relative flex min-w-0 flex-1 overflow-x-auto transition-colors duration-300 ${isLight ? 'divide-[#E5E7EB]' : 'divide-white/10'}`}>
      {dates.map((d, i) => {
        const isSel = i === selected;
        return (
          <button
            key={d.label}
            onClick={() => onPick(i)}
            aria-pressed={isSel}
            className={`group relative flex min-w-[64px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-1.5 transition-colors duration-300 sm:min-w-0 ${isSel ? (isLight ? 'bg-[#EFF6FF]' : 'bg-[#121E3C]') : (isLight ? 'bg-transparent hover:bg-[#F9FAFB]' : 'bg-transparent hover:bg-[#131c33]')}`}
          >
            <span className={`hidden max-w-full truncate text-[10.5px] leading-none transition-colors duration-300 sm:block ${isSel ? (isLight ? 'font-semibold text-[#111827]' : 'font-semibold text-[#7CC0FF]') : (isLight ? 'text-[#6B7280] group-hover:text-[#2563EB]' : 'text-[#9baec7] group-hover:text-[#e8c86a]')}`}>{d.label}</span>
            <span className={`block max-w-full truncate text-[10.5px] leading-none transition-colors duration-300 sm:hidden ${isSel ? (isLight ? 'font-semibold text-[#111827]' : 'font-semibold text-[#7CC0FF]') : (isLight ? 'text-[#6B7280] group-hover:text-[#2563EB]' : 'text-[#9baec7] group-hover:text-[#e8c86a]')}`}>{d.label.split(', ')[1]}</span>
            <span className={`max-w-full truncate px-0.5 text-[11px] font-bold leading-none transition-colors duration-300 sm:text-[12.5px] ${isSel ? (isLight ? 'text-[#2563EB]' : 'text-[#3B9CFF]') : (isLight ? 'text-[#111827] group-hover:text-[#2563EB]' : 'text-white group-hover:text-[#d4af37]')}`}>{stripInr(d.price)}</span>
            {/* Golden glow ring for the hovered cell only */}
            <span className={`pointer-events-none absolute inset-[2px] rounded-[10px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${isLight ? 'shadow-[inset_0_0_14px_rgba(37,99,235,0.15),0_0_16px_rgba(37,99,235,0.2)] ring-1 ring-inset ring-[#2563EB]/50' : 'shadow-[inset_0_0_14px_rgba(212,175,55,0.35),0_0_16px_rgba(212,175,55,0.45)] ring-1 ring-inset ring-[#d4af37]/80'}`} />
          </button>
        );
      })}
      {/* Thin highlighted bar that slides under the currently selected date */}
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-0 h-[3px] rounded-full transition-[left] duration-300 ease-out ${isLight ? 'bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'bg-[#3B9CFF] shadow-[0_0_10px_rgba(59,156,255,0.75)]'}`}
        style={{ left: `${(selected * 100) / dates.length}%`, width: `${100 / dates.length}%` }}
      />
    </div>

    {/* Right arrow */}
    <button
      onClick={onNext}
      disabled={!canNext}
      aria-label="Next week"
      className={`group relative flex w-[34px] shrink-0 cursor-pointer items-center justify-center border-l bg-transparent transition-all duration-300 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent ${isLight ? 'border-l-[#E5E7EB] text-[#2563EB] hover:bg-[#F9FAFB] disabled:hover:bg-transparent' : 'border-white/10 text-[#7CC0FF] hover:bg-[rgba(212,175,55,0.16)]'}`}
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_28px_rgba(212,175,55,0.5)] transition-opacity duration-300 group-hover:opacity-100" />
      <svg {...iconProps('h-4 w-4 transition-colors duration-300 group-hover:text-[#f0c265]')}><path d="m9 18 6-6-6-6" /></svg>
    </button>
  </div>
  );
};