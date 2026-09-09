// SkeletonCard.tsx
// A shimmer placeholder card shown while flight data is loading.
import type { CSSProperties } from 'react';
import { useThemeStore } from '../store/themeStore';

export const SkeletonCard = ({ index }: { index: number }) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  return (
    <div
      className={`card-shimmer relative flex min-h-[104px] animate-pulse flex-col overflow-hidden rounded-[12px] border p-2 pt-6 lg:flex-row transition-colors duration-300 ${isLight ? 'bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'bg-[#0f172a] border-[#214b7e]'}`}
    style={{ '--shimmer-delay': `${index * 180}ms`, animationDelay: `${index * 180}ms` } as CSSProperties}
  >
    {/* Badge placeholder */}
    <div className={`absolute left-[22px] top-[12px] h-[20px] w-[96px] rounded-full transition-colors duration-300 ${isLight ? 'bg-[#EFF6FF]' : 'bg-[#16304f]'}`} />
    {/* Left column */}
    <div className="min-w-0 flex-1 pr-0 lg:pr-6">
      {/* Airline row */}
      <div className="flex items-center gap-3.5">
        <div className="flex flex-col items-center">
          <div className={`h-[40px] w-[40px] rounded-full transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#16324f]'}`} />
          <div className={`mt-1 h-[10px] w-[36px] rounded transition-colors duration-300 ${isLight ? 'bg-[#F3F4F6]' : 'bg-[#122844]'}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className={`h-[13px] w-[80px] rounded transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#1c3a5f]'}`} />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className={`h-[10px] w-[50px] rounded transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#122844]'}`} />
            <div className={`h-[12px] w-px transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#315073]'}`} />
            <div className={`h-[10px] w-[46px] rounded transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#122844]'}`} />
            <div className="h-[12px] w-px bg-[#315073]" />
            <div className={`h-[10px] w-[70px] rounded transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#122844]'}`} />
          </div>
        </div>
      </div>
      {/* Times row */}
      <div className="mt-3 flex items-center">
        <div className="w-[92px] sm:w-[120px]">
          <div className={`h-[16px] w-[70px] rounded transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#1d3f69]'}`} />
          <div className={`mt-1.5 h-[10px] w-[88px] rounded transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#122844]'}`} />
        </div>
        <div className="relative mx-2 h-8 min-w-[56px] flex-1 sm:min-w-[80px]">
          <div className="absolute inset-x-0 top-1/2 border-t border-dotted border-[#8295ad]/40" />
        </div>
        <div className="w-[92px] text-right sm:w-[120px]">
          <div className={`ml-auto h-[16px] w-[70px] rounded transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#1d3f69]'}`} />
          <div className={`ml-auto mt-1.5 h-[10px] w-[88px] rounded transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#122844]'}`} />
        </div>
      </div>
    </div>
    {/* Right column */}
    <div className={`flex w-full shrink-0 flex-col items-center border-t border-dotted pt-3 lg:w-[210px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 transition-colors duration-300 ${isLight ? 'border-[#E5E7EB]' : 'border-[#73869e]'}`}>
      <div className={`mt-1 h-[10px] w-[48px] rounded transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#122844]'}`} />
      <div className={`mt-1.5 h-[18px] w-[70px] rounded transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#1c3a5f]'}`} />
      <div className={`mt-2 h-[10px] w-[56px] rounded transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#122844]'}`} />
      <div className={`mt-3 h-[28px] w-full rounded-[10px] lg:mt-auto transition-colors duration-300 ${isLight ? 'bg-[#2563EB]' : 'bg-[#1b4aa0]'}`} />
    </div>
  </div>
  );
};