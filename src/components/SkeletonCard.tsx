import type { CSSProperties } from 'react';

export const SkeletonCard = ({ index }: { index: number }) => (    <div
      className="card-shimmer relative flex min-h-[168px] animate-pulse flex-col overflow-hidden rounded-[12px] border border-[#214b7e] bg-[#0f172a] p-4 pt-8 lg:flex-row"
    style={{ '--shimmer-delay': `${index * 180}ms`, animationDelay: `${index * 180}ms` } as CSSProperties}
  >
    {/* Badge placeholder */}
    <div className="absolute left-[22px] top-[15px] h-[24px] w-[104px] rounded-full bg-[#16304f]" />
    {/* Left column */}
    <div className="min-w-0 flex-1 pr-0 lg:pr-6">
      {/* Airline row */}
      <div className="flex items-center gap-3.5">
        <div className="flex flex-col items-center">
          <div className="h-[44px] w-[44px] rounded-full bg-[#16324f]" />
          <div className="mt-1 h-[10px] w-[36px] rounded bg-[#122844]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="h-[13px] w-[80px] rounded bg-[#1c3a5f]" />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="h-[10px] w-[50px] rounded bg-[#122844]" />
            <div className="h-[12px] w-px bg-[#315073]" />
            <div className="h-[10px] w-[46px] rounded bg-[#122844]" />
            <div className="h-[12px] w-px bg-[#315073]" />
            <div className="h-[10px] w-[70px] rounded bg-[#122844]" />
          </div>
        </div>
      </div>
      {/* Times row */}
      <div className="mt-4 flex items-center">
        <div className="w-[92px] sm:w-[120px]">
          <div className="h-[16px] w-[70px] rounded bg-[#1d3f69]" />
          <div className="mt-1.5 h-[10px] w-[88px] rounded bg-[#122844]" />
        </div>
        <div className="relative mx-2 h-10 min-w-[56px] flex-1 sm:min-w-[80px]">
          <div className="absolute inset-x-0 top-1/2 border-t border-dotted border-[#8295ad]/40" />
        </div>
        <div className="w-[92px] text-right sm:w-[120px]">
          <div className="ml-auto h-[16px] w-[70px] rounded bg-[#1d3f69]" />
          <div className="ml-auto mt-1.5 h-[10px] w-[88px] rounded bg-[#122844]" />
        </div>
      </div>
    </div>
    {/* Right column */}
    <div className="flex w-full shrink-0 flex-col items-center border-t border-dotted border-[#73869e] pt-4 lg:w-[210px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
      <div className="mt-1 h-[10px] w-[48px] rounded bg-[#122844]" />
      <div className="mt-2 h-[20px] w-[70px] rounded bg-[#1c3a5f]" />
      <div className="mt-3 h-[10px] w-[56px] rounded bg-[#122844]" />
      <div className="mt-4 h-[36px] w-full rounded-[10px] bg-[#1b4aa0] lg:mt-auto" />
    </div>
  </div>
);