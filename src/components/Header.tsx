import { useState } from 'react';
import { useFlightStore } from '../store/flightStore';
import { ReturnCalendar } from './ReturnCalendar';
import { ChevronDown, ChevronRight, ArrowLeftRight } from './icons';
import { iconProps } from '../lib/iconProps';
import { ThemeToggle } from './ThemeToggle';
import logo from '../assets/logo.jpeg';

export const Header = () => {
  const [swapSpin, setSwapSpin] = useState(0);
  const fromCity = useFlightStore((s) => s.fromCity);
  const toCity = useFlightStore((s) => s.toCity);
  const datePool = useFlightStore((s) => s.datePool);
  const stripStart = useFlightStore((s) => s.stripStart);
  const stripSel = useFlightStore((s) => s.stripSel);
  const returnOpen = useFlightStore((s) => s.returnOpen);
  const filtersOpen = useFlightStore((s) => s.filtersOpen);
  const setReturnOpen = useFlightStore((s) => s.setReturnOpen);
  const setFiltersOpen = useFlightStore((s) => s.setFiltersOpen);
  const monthOffset = useFlightStore((s) => s.monthOffset);
  const returnDate = useFlightStore((s) => s.returnDate);
  const shiftMonth = useFlightStore((s) => s.shiftMonth);
  const pickReturnDate = useFlightStore((s) => s.pickReturnDate);
  const swapCities = useFlightStore((s) => s.swapCities);
  const doSearch = useFlightStore((s) => s.doSearch);
  const searching = useFlightStore((s) => s.searching);

  const stripDay = datePool[stripStart + stripSel];

  const handleSwap = () => {
    swapCities();
    setSwapSpin((s) => s + 1);
  };

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-white/10 bg-[#0E1833] px-3 pb-2 pt-2 sm:px-6 sm:pb-4 sm:pt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-5">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Akbar Bizvoy Logo" className="h-8 w-8 shrink-0 rounded-full object-cover shadow-[0_0_12px_rgba(225,29,46,0.35)] sm:h-10 sm:w-10" />
            <span className="whitespace-nowrap text-[14px] font-bold tracking-tight sm:text-[17px]">Akbar Bizvoy</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-5">
          <button className="flex cursor-pointer items-center gap-1.5 border-none bg-transparent text-[12.5px] font-medium text-white/85 sm:text-[13.5px]">
            Economy <ChevronDown className="h-3.5 w-3.5 text-white/50" />
          </button>
          <span className="hidden text-[12.5px] text-white/45 md:inline">43 options analyzed</span>
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-label="Toggle filters"
            aria-expanded={filtersOpen}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[rgba(212,175,55,0.35)] text-[#f0c265] transition-colors duration-200 hover:border-[#d4af37]/70 hover:text-[#f5d67b] md:hidden"
          >
            <svg {...iconProps('h-4 w-4')}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B5BFF] text-[12px] font-semibold text-white">
            AS
          </div>
          <ThemeToggle className="shrink-0" />
        </div>
      </div>

      {/* ---- Search widget bar ---- */}
      <div className="group relative mt-2 flex flex-wrap items-stretch overflow-hidden rounded-[26px] border border-[rgba(124,192,255,0.22)] bg-[#0F1B3A] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-[#d4af37]/70 hover:shadow-[0_0_18px_rgba(212,175,55,0.3),0_0_50px_rgba(212,175,55,0.14)] sm:mt-3 sm:rounded-l-[16px] sm:rounded-r-[26px]">
        {/* From + To (swap button overlaps the divider) */}
        <div className="relative flex w-full min-w-0 border-b border-white/10 sm:w-auto sm:flex-1 sm:border-b-0">
          <div className="relative flex min-w-0 flex-1 items-center px-3 py-2 sm:px-5 sm:py-4">
            <div className="min-w-0">
              <div className="bar-text text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF] transition-all duration-300">From</div>
              <div className="bar-text-value mt-1 truncate text-[13px] font-bold text-white transition-all duration-300 sm:text-[15px]">{fromCity}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap From and To"
            title="Swap From and To"
            className="swap-glow-hover swap-glow-click absolute left-1/2 top-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[rgba(124,192,255,0.45)] bg-[#0E1833] shadow-[0_3px_10px_rgba(0,0,0,0.45)]"
          >
            <span key={swapSpin} className="spin-swap">
              <ArrowLeftRight className="h-3.5 w-3.5 text-[#7CC0FF] transition-colors duration-300" />
            </span>
          </button>

          <div className="relative flex min-w-0 flex-1 items-center border-l border-white/10 px-3 py-2 sm:px-5 sm:py-4">
            <div className="min-w-0">
              <div className="bar-text text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF] transition-all duration-300">To</div>
              <div className="bar-text-value mt-1 truncate text-[13px] font-bold text-white transition-all duration-300 sm:text-[15px]">{toCity}</div>
            </div>
          </div>
        </div>

        {/* Departure */}
        <div className="flex w-1/2 shrink-0 items-center border-b border-l-0 border-white/10 px-3 py-2 sm:w-[150px] sm:border-b-0 sm:border-l sm:px-5 sm:py-4">
          <div>
            <div className="bar-text text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF] transition-all duration-300">Departure</div>
            <div className="bar-text-value mt-1 text-[13px] font-bold text-white transition-all duration-300 sm:text-[15px]">{stripDay.label}</div>
          </div>
        </div>

        {/* Return */}
        <button
          type="button"
          onClick={() => setReturnOpen(!returnOpen)}
          className="relative flex w-1/2 shrink-0 cursor-pointer items-center border-b border-l border-white/10 px-3 py-2 text-left transition-colors duration-200 hover:bg-[rgba(212,175,55,0.06)] sm:w-[150px] sm:border-b-0 sm:px-5 sm:py-4"
        >
          <div>
            <div className="bar-text text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF] transition-all duration-300">Return</div>
            <div className={`mt-1 truncate text-[13px] font-bold transition-all duration-300 sm:text-[15px] ${returnDate ? 'bar-text-value text-white' : 'bar-text-muted text-white/40'}`}>{returnDate ?? 'Return'}</div>
            <ChevronDown className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
          </div>
        </button>

        {/* Travellers & Class */}
        <div className="flex w-full min-w-0 items-center border-l-0 border-white/10 px-3 py-2 sm:w-auto sm:flex-1 sm:border-l sm:px-5 sm:py-4">
          <div className="min-w-0">
            <div className="bar-text text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF] transition-all duration-300">Travellers & Class</div>
            <div className="bar-text-value mt-1 truncate text-[13px] font-bold text-white transition-all duration-300 sm:text-[15px]">1 Traveller, Economy</div>
          </div>
        </div>

        {/* Search button — blue pill cap, flush with the bar's top/bottom/right edges */}
        <button
          type="button"
          onClick={() => doSearch()}
          className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-b-[26px] rounded-r-[26px] border-none bg-[#2593fc] px-4 py-2 text-[13px] font-bold tracking-wide text-white shadow-[0_0_28px_rgba(37,147,252,0.4)] transition-all duration-300 group-hover:bg-[#d4af37] group-hover:shadow-[0_0_18px_rgba(212,175,55,0.45),0_0_45px_rgba(212,175,55,0.25)] sm:absolute sm:inset-y-0 sm:right-0 sm:z-20 sm:w-auto sm:justify-start sm:rounded-b-none sm:py-0 sm:pl-10 sm:pr-11 sm:text-[16px]"
        >
          {searching ? (
            <>
              <svg className="h-[18px] w-[18px] animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span>Searching</span>
            </>
          ) : (
            <>
              <span>Search</span>
              <ChevronRight className="h-[18px] w-[18px]" />
            </>
          )}
        </button>
      </div>

      {/* Return-date calendar — dropdown floating under the search bar (page stays visible) */}
      {returnOpen && (
        <div className="relative z-50 mt-2 w-full lg:absolute lg:left-1/2 lg:top-full lg:mt-2 lg:w-max lg:max-w-[94vw] lg:-translate-x-1/2">
          <div className="pointer-events-none absolute -top-[9px] left-1/2 hidden h-0 w-0 -translate-x-1/2 border-x-[10px] border-b-[10px] border-x-transparent border-b-[rgba(124,192,255,0.35)] lg:block" />
          <ReturnCalendar
            monthOffset={monthOffset}
            onShift={(dir) => shiftMonth(dir)}
            selected={returnDate}
            onPick={pickReturnDate}
            onClose={() => setReturnOpen(false)}
          />
        </div>
      )}
    </header>
  );
};