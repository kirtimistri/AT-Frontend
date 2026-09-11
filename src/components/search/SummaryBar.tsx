import type { Flight } from '../../store/flightStore';
import { useFlightStore } from '../../store/flightStore';
import { AirlineLogo } from '../Logos';
import { inr, to24H } from '../../lib/format';
import { useThemeStore } from '../../store/themeStore';
import { prepareReview } from '../../lib/openReview';

const FlightSummary = ({ label, f, isLight }: { label: 'ONWARD' | 'RETURN'; f: Flight | null; isLight?: boolean }) => (
  <div className={`flex min-w-0 items-center gap-2.5 px-3 py-1.5 sm:w-auto sm:flex-1 sm:gap-3.5 sm:px-6 sm:py-1.5 transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white/90'}`}>
    <span className={`shrink-0 text-[10px] font-bold tracking-[0.12em] transition-colors duration-300 sm:text-[10.5px] ${isLight ? 'text-[#2563EB]' : 'text-[#7CC0FF]'}`}>{label}</span>
    {f ? (
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span className="hidden h-8 w-8 shrink-0 items-center justify-center overflow-hidden sm:flex"><AirlineLogo airline={f.airline} /></span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className={`truncate text-[11.5px] font-semibold sm:text-[12.5px] transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>
            {f.airline} <span className={`transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>• {f.code}</span>
          </div>
          <div className={`mt-0.5 flex items-center gap-1.5 text-[10px] sm:text-[11px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`}>
            <span className="min-w-0 truncate">{to24H(f.departure.time)} → {to24H(f.arrival.time)}</span>
            <span className={`h-2.5 w-px shrink-0 transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#315073]'}`} />
            <span className="shrink-0 whitespace-nowrap">{f.duration}</span>
          </div>
        </div>
      </div>
    ) : (
      <span className={`truncate text-[11.5px] sm:text-[12.5px] transition-colors duration-300 ${isLight ? 'text-[#9CA3AF]' : 'text-white/40'}`}>
        {label === 'ONWARD' ? 'Select an onward flight' : 'Select a return flight'}
      </span>
    )}
  </div>
);

export const SummaryBar = ({ onward, ret, dayDelta }: { onward: Flight | null; ret: Flight | null; dayDelta: number }) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const datePool = useFlightStore((s) => s.datePool);
  const stripStart = useFlightStore((s) => s.stripStart);
  const stripSel = useFlightStore((s) => s.stripSel);
  const fromCity = useFlightStore((s) => s.fromCity);
  const toCity = useFlightStore((s) => s.toCity);
  const date = datePool[stripStart + stripSel]?.label ?? '';
  const fromCode = fromCity.split(' - ')[0];
  const toCode = toCity.split(' - ')[0];
  const total = (onward ? onward.price + dayDelta : 0) + (ret ? ret.price + dayDelta : 0);
  const both = !!onward && !!ret;
  const any = !!onward || !!ret;
  return (
    <div className={`group fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur transition duration-300 md:left-[230px] lg:left-[250px] ${isLight ? 'bg-white/95 border-[#E5E7EB] shadow-[0_-10px_36px_rgba(0,0,0,0.08)] hover:border-[#2563EB]/50 hover:shadow-[0_-10px_36px_rgba(0,0,0,0.08),0_0_22px_rgba(37,99,235,0.15),0_0_60px_rgba(37,99,235,0.08)]' : 'bg-[#0F1B3A]/95 border-[rgba(124,192,255,0.25)] shadow-[0_-10px_36px_rgba(0,0,0,0.55)] hover:border-[#d4af37]/60 hover:shadow-[0_-10px_36px_rgba(0,0,0,0.55),0_0_22px_rgba(212,175,55,0.35),0_0_60px_rgba(212,175,55,0.16)]'}`}>
      <div className="flex flex-wrap items-stretch">
        <div className={`grid w-full grid-cols-2 divide-x ${isLight ? 'divide-[#E5E7EB]' : 'divide-white/10'} sm:w-auto sm:flex`}>
          <FlightSummary label="ONWARD" f={onward} isLight={isLight} />
          <FlightSummary label="RETURN" f={ret} isLight={isLight} />
        </div>
        <div className={`flex w-full shrink-0 items-center justify-between gap-4 px-4 py-1.5 sm:ml-auto sm:w-auto sm:justify-start sm:gap-5 sm:border-l sm:px-6 sm:py-1.5 ${isLight ? 'border-t border-[#E5E7EB]' : 'border-t border-white/10'}`}>
          <div className="text-right">
            <div className={`text-[10px] font-semibold sm:text-[11px] transition-colors duration-300 ${isLight ? 'text-[#F59E0B]' : 'text-[#ff8533]'}`}>Flight Details &gt;</div>
            <div className={`mt-0.5 text-[15px] font-bold leading-none sm:mt-1 sm:text-[17px] transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{inr(total)}</div>
            <div className={`mt-0.5 text-[10px] font-semibold sm:mt-1 sm:text-[11px] transition-colors duration-300 ${any ? (isLight ? 'text-[#16A34A]' : 'text-[#34d399]') : (isLight ? 'text-[#9CA3AF]' : 'text-white/40')}`}>
              {both ? 'Extra ₹697 Off' : (ret ? 'Select onward to combine fares' : 'Select return for round-trip')}
            </div>
          </div>
          <button
            onClick={() => {
              if (any) {
                prepareReview({
                  onward,
                  returnFlight: ret,
                  date,
                  fromCode,
                  toCode,
                });
                window.open('/review-trip?bookingId=TRV-2024-8894X', '_blank');
              }
            }}
            disabled={!any}
            className={`flex h-7 shrink-0 cursor-pointer items-center rounded-[10px] px-4 text-[13px] font-bold text-white transition duration-300 sm:h-8 sm:px-6 sm:text-[14px] ${isLight ? 'bg-[#2563EB] shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:bg-[#1D4ED8] active:shadow-[0_0_26px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:cursor-not-allowed' : 'bg-[#2593fc] shadow-[0_6px_18px_rgba(37,147,252,0.45)] hover:bg-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.7),0_0_45px_rgba(212,175,55,0.4)] active:bg-[#f0c265] active:shadow-[0_0_26px_rgba(212,175,55,0.85),0_0_55px_rgba(212,175,55,0.5)] disabled:opacity-50 disabled:cursor-not-allowed'}`}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};