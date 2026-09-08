import type { ReactNode } from 'react';
import { useThemeStore } from '../store/themeStore';
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
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
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
      className={`group relative -mx-4 cursor-pointer select-none border-b px-4 py-2.5 transition-all duration-300 last:border-b-0 ${isLight ? 'border-[#E5E7EB]' : 'border-[rgba(124,192,255,0.16)]'} ${active ? (isLight ? 'bg-[#EFF6FF]' : 'bg-gradient-to-r from-[rgba(212,175,55,0.38)] via-[rgba(212,175,55,0.24)] to-[rgba(212,175,55,0.14)]') : (isLight ? 'hover:bg-[#F9FAFB]' : 'hover:bg-gradient-to-r hover:from-[#f0c265] hover:via-[#d4af37] hover:to-[#a8842a]')}`}
    >
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ring-1 transition-all duration-300 group-hover:scale-[1.06] group-active:scale-[1.06] ${isLight ? (active ? 'bg-[#FCE7F3] text-[#DB2777] ring-[#DB2777]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] group-hover:bg-[#DB2777] group-hover:text-white group-hover:ring-[#BE185D]/50' : 'bg-[#FDF2F8] text-[#EC4899] ring-[#EC4899]/30 group-hover:bg-[#FCE7F3] group-hover:text-[#DB2777] group-hover:ring-[#DB2777]/40') : (active ? 'scale-[1.06] from-[rgba(236,72,153,0.45)] via-[rgba(236,72,153,0.28)] to-[rgba(236,72,153,0.12)] text-[#F472B6] ring-[rgba(244,114,182,0.8)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]' : 'from-[rgba(236,72,153,0.32)] via-[rgba(236,72,153,0.16)] to-[rgba(244,114,182,0.08)] text-[#F472B6] ring-[rgba(244,114,182,0.35)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] group-hover:from-[#EC4899] group-hover:via-[#DB2777] group-hover:to-[#BE185D] group-hover:text-white group-hover:ring-[#EC4899] group-hover:shadow-[0_0_14px_rgba(236,72,153,0.45),inset_0_1px_0_rgba(255,255,255,0.2)] group-active:from-[rgba(236,72,153,0.45)] group-active:via-[rgba(236,72,153,0.28)] group-active:to-[rgba(236,72,153,0.12)] group-active:text-[#F472B6] group-active:ring-[rgba(244,114,182,0.8)] group-active:shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]')}`}
          >
            <span className="flex items-center justify-center transition-all duration-300">
              {icon}
            </span>
          </span>
          <span
            className={`text-[13px] font-semibold transition-colors duration-300 ${isLight ? (active ? 'text-[#2563EB]' : 'text-[#111827]') : (active ? 'text-[#f5d67b]' : 'text-[#9CC6FF] group-hover:text-[#0E1833] group-active:text-[#f5d67b]')}`}
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
      <p className={`relative mt-[3px] pl-[42px] text-[11.5px] leading-tight transition-colors duration-300 ${isLight ? (active ? 'text-[#2563EB]' : 'text-[#6B7280] group-hover:text-[#2563EB] group-active:text-[#2563EB]') : (active ? 'text-[rgba(240,194,101,0.95)]' : 'text-[#9CC6FF]/85 group-hover:text-[#2a2208]/90 group-active:text-[rgba(240,194,101,0.95)]')}`}>{value}</p>
      {slider && (
        <div className="relative pl-[42px]" onClick={(e) => e.stopPropagation()}>
          <RangeSlider {...slider} lit={active} />
        </div>
      )}
    </div>
  );
};