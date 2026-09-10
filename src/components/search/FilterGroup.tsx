// FilterGroup.tsx – Reusable filter card that can embed a range slider.
import type { ReactNode } from 'react';
import { useThemeStore } from '../store/themeStore';
import { RangeSlider, type SliderSpec } from './RangeSlider';
import { ChevronDown } from './icons';

/* Props for the FilterGroup component. */
export type FilterGroupProps = {
  icon: ReactNode;
  label: string;
  value: string;
  slider?: SliderSpec;
  active: boolean;
  onToggle: () => void;
};

// Main FilterGroup component.
export const FilterGroup = ({ icon, label, value, slider, active, onToggle }: FilterGroupProps) => {
  // Get current theme to adjust styling.
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Card surface: standalone rounded card with hover lift and an active tint.
  const cardCls = isLight
    ? active
      ? 'bg-[#EFF6FF] border-[#BFDBFE] shadow-[0_4px_14px_rgba(37,99,235,0.14)]'
      : 'bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:border-[#BFDBFE] hover:shadow-[0_4px_14px_rgba(37,99,235,0.1)]'
    : active
      ? 'bg-gradient-to-r from-[rgba(212,175,55,0.16)] via-[rgba(212,175,55,0.08)] to-transparent border-[rgba(212,175,55,0.45)] shadow-[0_0_16px_rgba(212,175,55,0.12)]'
      : 'bg-[#0F1B3A] border-[rgba(124,192,255,0.22)] hover:border-[rgba(124,192,255,0.45)] hover:bg-[#12234A]';

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
      className={`group relative flex min-h-0 flex-1 cursor-pointer select-none flex-col justify-center rounded-[14px] border px-2.5 py-1 transition-all duration-300 ${cardCls}`}
    >
      {/* Header row: red icon chip (unchanged) + label/value stack + chevron. */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] ring-1 transition-all duration-300 group-hover:scale-[1.06] group-active:scale-[1.06] ${isLight ? (active ? 'bg-[#DC2626] text-white ring-[#DC2626] group-hover:bg-[#B91C1C] group-hover:ring-[#B91C1C]' : 'bg-[#EF4444] text-white ring-[#EF4444] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] group-hover:bg-[#DC2626] group-hover:ring-[#DC2626] group-active:bg-[#DC2626] group-active:ring-[#DC2626]') : (active ? 'bg-[#DC2626] text-white ring-[#DC2626]/70 group-hover:bg-[#B91C1C]' : 'bg-[#EF4444] text-white ring-[#EF4444]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] group-hover:bg-[#DC2626] group-active:bg-[#DC2626]')}`}
          >
            <span className="flex items-center justify-center transition-all duration-300">
              {icon}
            </span>
          </span>
          <div className="flex min-w-0 flex-col">
            <span
              className={`text-[12px] font-semibold leading-tight transition-colors duration-300 ${isLight ? (active ? 'text-[#2563EB]' : 'text-[#111827]') : (active ? 'text-[#f5d67b]' : 'text-white')}`}
            >
              {label}
            </span>
            <span
              className={`truncate text-[10.5px] leading-tight transition-colors duration-300 ${isLight ? (active ? 'text-[#2563EB]/80' : 'text-[#6B7280]') : (active ? 'text-[rgba(240,194,101,0.9)]' : 'text-white/55')}`}
            >
              {value}
            </span>
          </div>
        </div>
        {/* Chevron hints at the embedded slider/options. */}
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-colors duration-300 ${isLight ? (active ? 'text-[#2563EB]' : 'text-[#9CA3AF]') : (active ? 'text-[#f5d67b]' : 'text-white/40')}`}
        />
      </div>
      {/* Range slider (if provided) — stop clicks from toggling the card. */}
      {slider && (
        <div className="pl-[34px] pt-1" onClick={(e) => e.stopPropagation()}>
          <RangeSlider {...slider} />
        </div>
      )}
    </div>
  );
};
