import type { Flight } from '../store/flightStore';
import { AirlineLogo } from './Logos';
import { inr } from '../lib/format';

const FlightSummary = ({ label, f }: { label: 'ONWARD' | 'RETURN'; f: Flight | null }) => (
  <div className="flex min-w-0 items-center gap-2.5 px-3 py-2.5 sm:w-auto sm:flex-1 sm:gap-3.5 sm:px-6 sm:py-3">
    <span className="shrink-0 text-[10px] font-bold tracking-[0.12em] text-[#7CC0FF] sm:text-[10.5px]">{label}</span>
    {f ? (
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span className="hidden h-8 w-8 shrink-0 items-center justify-center overflow-hidden sm:flex"><AirlineLogo airline={f.airline} /></span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="truncate text-[11.5px] font-semibold text-white sm:text-[12.5px]">
            {f.airline} <span className="text-[#9baec7]">• {f.code}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#b6c3d5] sm:text-[11px]">
            <span className="min-w-0 truncate">{f.departure.time} → {f.arrival.time}</span>
            <span className="h-2.5 w-px shrink-0 bg-[#315073]" />
            <span className="shrink-0 whitespace-nowrap">{f.duration}</span>
          </div>
        </div>
      </div>
    ) : (
      <span className="truncate text-[11.5px] text-white/40 sm:text-[12.5px]">
        {label === 'ONWARD' ? 'Select an onward flight' : 'Select a return flight'}
      </span>
    )}
  </div>
);

export const SummaryBar = ({ onward, ret, dayDelta }: { onward: Flight | null; ret: Flight | null; dayDelta: number }) => {
  const total = (onward ? onward.price + dayDelta : 0) + (ret ? ret.price + dayDelta : 0);
  const both = !!onward && !!ret;
  return (
    <div className="group fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(124,192,255,0.25)] bg-[#0F1B3A]/95 shadow-[0_-10px_36px_rgba(0,0,0,0.55)] backdrop-blur transition-all duration-300 hover:border-[#d4af37]/60 hover:shadow-[0_-10px_36px_rgba(0,0,0,0.55),0_0_22px_rgba(212,175,55,0.35),0_0_60px_rgba(212,175,55,0.16)] md:left-[300px]">
    <div className="flex flex-wrap items-stretch">
      <div className="grid w-full grid-cols-2 divide-x divide-white/10 sm:w-auto sm:flex">
        <FlightSummary label="ONWARD" f={onward} />
        <FlightSummary label="RETURN" f={ret} />
      </div>
      <div className="flex w-full shrink-0 items-center justify-between gap-4 border-t border-white/10 px-4 py-2.5 sm:w-auto sm:justify-start sm:gap-5 sm:border-l sm:border-t-0 sm:px-6 sm:py-3">
          <div className="text-right">
            <div className="text-[10px] font-semibold text-[#ff8533] sm:text-[11px]">Flight Details &gt;</div>
            <div className="mt-0.5 text-[18px] font-bold leading-none text-white sm:mt-1 sm:text-[22px]">{inr(total)}</div>
            <div className={`mt-0.5 text-[10px] font-semibold sm:mt-1 sm:text-[11px] ${both ? 'text-[#34d399]' : 'text-white/40'}`}>
              {both ? 'Extra ₹697 Off' : 'Select return to combine fares'}
            </div>
          </div>
          <button className="flex h-9 shrink-0 cursor-pointer items-center rounded-[10px] bg-[#2593fc] px-4 text-[13px] font-bold text-white shadow-[0_6px_18px_rgba(37,147,252,0.45)] transition-all duration-300 hover:bg-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.7),0_0_45px_rgba(212,175,55,0.4)] active:bg-[#f0c265] active:shadow-[0_0_26px_rgba(212,175,55,0.85),0_0_55px_rgba(212,175,55,0.5)] sm:h-[44px] sm:px-8 sm:text-[14.5px]">
            Book
          </button>
        </div>
      </div>
    </div>
  );
};