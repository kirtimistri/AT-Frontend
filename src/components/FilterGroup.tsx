import type { ReactNode } from 'react';
import { RangeSlider, type SliderSpec } from './RangeSlider';
import { ChevronDown, ChevronRight } from './icons';

export type FilterGroupProps = {
  icon: ReactNode;
  label: string;
  value: string;
  chevron?: 'right' | 'down';
  slider?: SliderSpec;
  active: boolean;
  onToggle: () => void;
};

export const FilterGroup = ({ icon, label, value, chevron, slider, active, onToggle }: FilterGroupProps) => {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={active}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`group relative -mx-4 cursor-pointer select-none border-b border-[rgba(124,192,255,0.16)] px-4 py-2.5 transition-all duration-300 last:border-b-0 ${
        active
          ? 'bg-gradient-to-r from-[rgba(212,175,55,0.38)] via-[rgba(212,175,55,0.24)] to-[rgba(212,175,55,0.14)]'
          : 'hover:bg-gradient-to-r hover:from-[#f0c265] hover:via-[#d4af37] hover:to-[#a8842a]'
      }`}
    >
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br ring-1 transition-all duration-300 ${
              active
                ? 'scale-[1.06] from-[rgba(212,175,55,0.45)] via-[rgba(212,175,55,0.28)] to-[rgba(212,175,55,0.12)] text-[#f0c265] ring-[rgba(240,197,101,0.8)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'
                : 'from-[rgba(59,156,255,0.32)] via-[rgba(37,147,252,0.16)] to-[rgba(124,192,255,0.08)] text-[#7CC0FF] ring-[rgba(124,192,255,0.35)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] group-hover:scale-[1.06] group-hover:from-[#f0c265] group-hover:via-[#d4af37] group-hover:to-[#a8842a] group-hover:text-[#0E1833] group-hover:ring-[#f0c265] group-hover:shadow-[0_0_14px_rgba(212,175,55,0.45),inset_0_1px_0_rgba(255,255,255,0.2)] group-active:scale-[1.06] group-active:from-[rgba(212,175,55,0.45)] group-active:via-[rgba(212,175,55,0.28)] group-active:to-[rgba(212,175,55,0.12)] group-active:text-[#f5d67b] group-active:ring-[rgba(240,197,101,0.8)] group-active:shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'
            }`}
          >
            <span className="flex items-center justify-center transition-all duration-300">
              {icon}
            </span>
          </span>
          <span
            className={`text-[13px] font-semibold transition-colors duration-300 ${
              active ? 'text-[#f5d67b]' : 'text-[#9CC6FF] group-hover:text-[#0E1833] group-active:text-[#f5d67b]'
            }`}
          >
            {label}
          </span>
        </div>
        {chevron === 'down' ? (
          <ChevronDown className={`h-3 w-3 transition-colors duration-300 ${active ? 'text-[#f5d67b]' : 'text-[#7CC0FF] group-hover:text-[#0E1833] group-active:text-[#f5d67b]'}`} />
        ) : chevron === 'right' ? (
          <ChevronRight className={`h-3 w-3 transition-colors duration-300 ${active ? 'text-[#f5d67b]' : 'text-[#7CC0FF] group-hover:text-[#0E1833] group-active:text-[#f5d67b]'}`} />
        ) : null}
      </div>
      <p className={`relative mt-[3px] pl-[42px] text-[11.5px] leading-tight transition-colors duration-300 ${active ? 'text-[rgba(240,194,101,0.95)]' : 'text-[#9CC6FF]/85 group-hover:text-[#2a2208]/90 group-active:text-[rgba(240,194,101,0.95)]'}`}>{value}</p>
      {slider && (
        <div className="relative pl-[42px]" onClick={(e) => e.stopPropagation()}>
          <RangeSlider {...slider} lit={active} />
        </div>
      )}
    </div>
  );
};