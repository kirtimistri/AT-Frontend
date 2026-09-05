import type { StripDay } from '../store/flightStore';
import { stripInr } from '../lib/format';
import { iconProps } from '../lib/iconProps';

type PriceStripProps = {
  dates: StripDay[];
  selected: number;
  onPick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export const PriceStrip = ({ dates, selected, onPick, onPrev, onNext, canPrev, canNext }: PriceStripProps) => (
  <div className="flex items-stretch overflow-hidden rounded-[14px] border border-[rgba(124,192,255,0.22)] bg-[#0F1B3A] shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
    {/* Left arrow */}
    <button
      onClick={onPrev}
      disabled={!canPrev}
      aria-label="Previous week"
      className="group relative flex w-[44px] shrink-0 cursor-pointer items-center justify-center border-r border-white/10 bg-transparent text-[#7CC0FF] transition-all duration-300 hover:bg-[rgba(212,175,55,0.16)] disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_28px_rgba(212,175,55,0.5)] transition-opacity duration-300 group-hover:opacity-100" />
      <svg {...iconProps('h-4 w-4 transition-colors duration-300 group-hover:text-[#f0c265]')}><path d="m15 18-6-6 6-6" /></svg>
    </button>

    {/* Date cards */}
    <div className="relative flex min-w-0 flex-1 divide-x divide-white/10 overflow-x-auto">
      {dates.map((d, i) => {
        const isSel = i === selected;
        return (
          <button
            key={d.label}
            onClick={() => onPick(i)}
            aria-pressed={isSel}
            className={`group relative flex min-w-[72px] flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-2.5 transition-colors duration-300 sm:min-w-0 ${isSel ? 'bg-[#121E3C]' : 'bg-transparent hover:bg-[#131c33]'}`}
          >
            <span className={`hidden max-w-full truncate text-[11px] leading-none transition-colors duration-300 sm:block ${isSel ? 'font-semibold text-[#7CC0FF]' : 'text-[#9baec7] group-hover:text-[#e8c86a]'}`}>{d.label}</span>
            <span className={`block max-w-full truncate text-[11px] leading-none transition-colors duration-300 sm:hidden ${isSel ? 'font-semibold text-[#7CC0FF]' : 'text-[#9baec7] group-hover:text-[#e8c86a]'}`}>{d.label.split(', ')[1]}</span>
            <span className={`max-w-full truncate px-0.5 text-[12px] font-bold leading-none transition-colors duration-300 sm:text-[13.5px] ${isSel ? 'text-[#3B9CFF]' : 'text-white group-hover:text-[#d4af37]'}`}>{stripInr(d.price)}</span>
            {/* Golden glow ring for the hovered cell only */}
            <span className="pointer-events-none absolute inset-[2px] rounded-[10px] opacity-0 shadow-[inset_0_0_14px_rgba(212,175,55,0.35),0_0_16px_rgba(212,175,55,0.45)] ring-1 ring-inset ring-[#d4af37]/80 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        );
      })}
      {/* Sliding selection indicator */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 h-[3px] rounded-full bg-[#3B9CFF] shadow-[0_0_10px_rgba(59,156,255,0.75)] transition-[left] duration-300 ease-out"
        style={{ left: `${(selected * 100) / dates.length}%`, width: `${100 / dates.length}%` }}
      />
    </div>

    {/* Right arrow */}
    <button
      onClick={onNext}
      disabled={!canNext}
      aria-label="Next week"
      className="group relative flex w-[44px] shrink-0 cursor-pointer items-center justify-center border-l border-white/10 bg-transparent text-[#7CC0FF] transition-all duration-300 hover:bg-[rgba(212,175,55,0.16)] disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_28px_rgba(212,175,55,0.5)] transition-opacity duration-300 group-hover:opacity-100" />
      <svg {...iconProps('h-4 w-4 transition-colors duration-300 group-hover:text-[#f0c265]')}><path d="m9 18 6-6-6-6" /></svg>
    </button>
  </div>
);