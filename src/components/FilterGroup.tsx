// FilterGroup.tsx – Reusable filter group component that expands to show a range slider.
import type { ReactNode } from 'react';
import { useThemeStore } from '../store/themeStore';
import { RangeSlider, type SliderSpec } from './RangeSlider';
import { ChevronDown, ChevronRight } from './icons';

/* Props for the FilterGroup component. */
export type FilterGroupProps = {
  icon: ReactNode;
  label: string;
  value: string;
  chevron?: 'right' | 'down';
  slider?: SliderSpec;
  active: boolean;
  onToggle: () => void;
};

// Main FilterGroup component.
export const FilterGroup = ({ icon, label, value, chevron, slider, active, onToggle }: FilterGroupProps) => {
  // Get current theme to adjust styling.
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  return (
    // Main clickable container for the filter group.
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
      className={`group relative -mx-4 flex min-h-0 flex-1 cursor-pointer select-none flex-col justify-center border-b px-4 py-1 transition-all duration-300 last:border-b-0 ${isLight ? 'border-[#E5E7EB]' : 'border-[rgba(124,192,255,0.16)]'} ${active ? (isLight ? 'bg-[#EFF6FF]' : 'bg-gradient-to-r from-[rgba(212,175,55,0.38)] via-[rgba(212,175,55,0.24)] to-[rgba(212,175,55,0.14)]') : (isLight ? 'hover:bg-[#F9FAFB]' : 'hover:bg-gradient-to-r hover:from-[#f0c265] hover:via-[#d4af37] hover:to-[#a8842a]')}`}
    >
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ring-1 transition-all duration-300 group-hover:scale-[1.06] group-active:scale-[1.06] ${isLight ? (active ? 'bg-[#DC2626] text-white ring-[#DC2626] group-hover:bg-[#B91C1C] group-hover:ring-[#B91C1C]' : 'bg-[#EF4444] text-white ring-[#EF4444] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] group-hover:bg-[#DC2626] group-hover:ring-[#DC2626] group-active:bg-[#DC2626] group-active:ring-[#DC2626]') : (active ? 'bg-[#DC2626] text-white ring-[#DC2626]/70 group-hover:bg-[#B91C1C]' : 'bg-[#EF4444] text-white ring-[#EF4444]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] group-hover:bg-[#DC2626] group-active:bg-[#DC2626]')}`}
          >
            <span className="flex items-center justify-center transition-all duration-300">
              {icon}
            </span>
          </span>
          <span
            className={`text-[13.5px] font-semibold transition-colors duration-300 ${isLight ? (active ? 'text-[#2563EB]' : 'text-[#111827]') : (active ? 'text-[#f5d67b]' : 'text-white group-hover:text-[#0E1833] group-active:text-[#f5d67b]')}`}
          >
            {label}
          </span>
        </div>
        {/* Show a chevron icon on the right side if needed. */}
        {chevron === 'down' ? (
          <ChevronDown className={`h-3 w-3 transition-colors duration-300 ${active ? 'text-[#f5d67b]' : 'text-white group-hover:text-[#0E1833] group-active:text-[#f5d67b]'}`} />
        ) : chevron === 'right' ? (
          <ChevronRight className={`h-3 w-3 transition-colors duration-300 ${active ? 'text-[#f5d67b]' : 'text-white group-hover:text-[#0E1833] group-active:text-[#f5d67b]'}`} />
        ) : null}
      </div>
      {/* Display the current filter value below the header row. */}
      <p className={`relative mt-1 pl-[44px] text-[12px] leading-snug transition-colors duration-300 ${isLight ? (active ? 'text-[#2563EB]' : 'text-[#111827] group-hover:text-[#2563EB] group-active:text-[#2563EB]') : (active ? 'text-[rgba(240,194,101,0.95)]' : 'text-white/85 group-hover:text-[#2a2208]/90 group-active:text-[rgba(240,194,101,0.95)]')}`}>{value}</p>
      {/* Render the range slider if one was provided. */}
      {slider && (
        <div className="relative pl-[44px]" onClick={(e) => e.stopPropagation()}>
          <RangeSlider {...slider} lit={active} />
        </div>
      )}
    </div>
  );
};