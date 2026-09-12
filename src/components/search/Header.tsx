// Main app header: logo, search bar, city swap, return date picker, and theme toggle.
import { useState } from 'react';
import { useFlightStore } from '../../store/flightStore';
import { travellersLabel } from '../../store/flightStore';
import { useThemeStore } from '../../store/themeStore';
import { ReturnCalendar } from './ReturnCalendar';
import { AirportSearch } from '../AirportSearch';
import { ChevronDown, ChevronRight, ArrowLeftRight } from '../icons';
import { iconProps } from '../../lib/iconProps';
import { BrandLogo } from '../BrandLogo';
import { ThemeToggle } from '../ThemeToggle';

export const Header = () => {
  // Local state for swap animation, travellers popover, and return date calendar
  const [swapSpin, setSwapSpin] = useState(0);
  const [cabin, setCabin] = useState('Economy');
  const [paxOpen, setPaxOpen] = useState(false);
  const [paxClosing, setPaxClosing] = useState(false);

  // Flight store values needed for the search bar and return calendar
  const fromAirport = useFlightStore((s) => s.fromAirport);
  const toAirport = useFlightStore((s) => s.toAirport);
  const setFromAirport = useFlightStore((s) => s.setFromAirport);
  const setToAirport = useFlightStore((s) => s.setToAirport);
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
  const departDate = useFlightStore((s) => s.departDate);
  const departOpen = useFlightStore((s) => s.departOpen);
  const departMonthOffset = useFlightStore((s) => s.departMonthOffset);
  const setDepartOpen = useFlightStore((s) => s.setDepartOpen);
  const shiftDepartMonth = useFlightStore((s) => s.shiftDepartMonth);
  const pickDepartDate = useFlightStore((s) => s.pickDepartDate);
  const swapCities = useFlightStore((s) => s.swapCities);
  const doSearch = useFlightStore((s) => s.doSearch);
  const travellers = useFlightStore((s) => s.travellers);
  const setTravellers = useFlightStore((s) => s.setTravellers);

  // Theme for light/dark mode styling
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Current departure day based on the selected date strip position
  const stripDay = datePool[stripStart + stripSel];

  // Swap the from/to cities and trigger a small rotation animation
  const handleSwap = () => {
    swapCities();
    setSwapSpin((s) => s + 1);
  };

  // Travellers popover open/close (close plays an exit animation first)
  const openPax = () => {
    setPaxClosing(false);
    setPaxOpen(true);
  };
  const closePax = () => {
    setPaxClosing(true);
    window.setTimeout(() => {
      setPaxOpen(false);
      setPaxClosing(false);
    }, 150);
  };

  // Increment/decrement a traveller category; clamping rules live in the store.
  const changePax = (key: 'adults' | 'children' | 'infants', delta: number) => {
    setTravellers({ ...travellers, [key]: travellers[key] + delta });
  };

  // Shared styling for the −/+ stepper buttons.
  const stepperCls = (disabled: boolean) =>
    `flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[14px] font-bold leading-none transition-all duration-200 active:scale-90 ${
      disabled
        ? 'cursor-not-allowed border-current/30 text-current opacity-40'
        : `cursor-pointer ${isLight ? 'border-[#D1D5DB] text-[#2563EB] hover:border-[#2563EB] hover:bg-[#EFF6FF]' : 'border-[rgba(124,192,255,0.4)] text-[#7CC0FF] hover:border-[#7CC0FF] hover:bg-white/5'}`
    }`;

  // Left section: just the app logo
  const leftSection = (
    <div className="flex min-w-0 items-center gap-2 sm:gap-5">
      <BrandLogo size="md" />
    </div>
  );

  // Right section: filters toggle, avatar badge, and theme toggle
  const rightSection = (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">
        <button
          type="button"
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-label="Toggle filters"
          aria-expanded={filtersOpen}
          className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 md:hidden ${isLight ? 'bg-white border-[#E5E7EB] text-[#2563EB] hover:bg-[#F3F4F6]' : 'bg-transparent border-[rgba(212,175,55,0.35)] text-[#f0c265] hover:border-[#d4af37]/70 hover:text-[#f5d67b]'}`}
        >
          <svg {...iconProps('h-3.5 w-3.5')}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
        </button>
        <div
          role="button"
          tabIndex={0}
          aria-label="Account"
          className={`flex h-7 w-7 cursor-pointer select-none items-center justify-center rounded-full text-[11px] font-bold ring-1 transition-all duration-300 hover:scale-[1.06] ${isLight ? 'bg-[#EFF6FF] text-[#2563EB] ring-[#2563EB]/30 shadow-[0_2px_8px_rgba(37,99,235,0.18)] hover:shadow-[0_4px_14px_rgba(37,99,235,0.28)]' : 'bg-[#2B5BFF] text-white ring-[#7CC0FF]/40 shadow-[0_2px_10px_rgba(43,91,255,0.4)] hover:shadow-[0_4px_16px_rgba(43,91,255,0.55)]'}`}
        >
          AS
        </div>
        <ThemeToggle className="shrink-0" size="sm" />
    </div>
  );

  // Search bar: From/To cities, dates, travellers, and the Search button
  const searchBar = (
    <div className={`group relative mt-1.5 flex flex-wrap items-stretch rounded-[26px] border transition-all duration-300 sm:rounded-l-[16px] sm:rounded-r-[26px] lg:mt-0 ${isLight ? 'bg-white border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-[#2563EB]/50' : 'bg-[#0F1B3A] border-[rgba(124,192,255,0.22)] shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:border-[#d4af37]/70 hover:shadow-[0_0_18px_rgba(212,175,55,0.3),0_0_50px_rgba(212,175,55,0.14)]'}`}>
      {/* From + To (swap button overlaps the divider) */}
      <div className="relative flex w-full min-w-0 border-b border-white/10 sm:w-auto sm:flex-1 sm:border-b-0">
        <AirportSearch
          label="From"
          selected={fromAirport}
          onSelect={setFromAirport}
          disabledIata={toAirport.iataCode}
        />

        {/* Swap button — reverses From and To */}
        <button
          type="button"
          onClick={handleSwap}
          aria-label="Swap From and To"
          title="Swap From and To"
          className={`swap-glow-hover swap-glow-click absolute left-1/2 top-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border transition-colors duration-300 ${isLight ? 'bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]' : 'bg-[#0E1833] border-[rgba(124,192,255,0.45)] shadow-[0_3px_10px_rgba(0,0,0,0.45)]'}`}
        >
          <span key={swapSpin} className="spin-swap">
            <ArrowLeftRight className={`h-3.5 w-3.5 transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#7CC0FF]'}`} />
          </span>
        </button>

        <AirportSearch
          label="To"
          selected={toAirport}
          onSelect={setToAirport}
          disabledIata={fromAirport.iataCode}
          align="right"
        />
      </div>

      {/* Departure — opens the departure date calendar, same as Return */}
      <button
        type="button"
        onClick={() => {
          setReturnOpen(false);
          setDepartOpen(!departOpen);
        }}
        className={`relative flex w-1/2 shrink-0 cursor-pointer items-center border-b border-l px-3 py-1 text-left transition-colors duration-200 sm:w-[150px] sm:border-b-0 sm:px-5 sm:py-1.5 ${isLight ? 'bg-white border-[#E5E7EB] hover:bg-[#F9FAFB]' : 'bg-transparent border-white/10 hover:bg-[rgba(212,175,55,0.06)]'}`}
      >
        <div>
          <div className={`bar-text text-[10px] font-semibold tracking-[0.12em] transition-all duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#7CC0FF]'}`}>Departure</div>
          <div className={`mt-0.5 truncate text-[12.5px] font-bold transition-all duration-300 sm:text-[14px] ${isLight ? 'text-[#111827]' : 'text-white'}`}>{departDate ?? stripDay.label}</div>
          <ChevronDown className={`absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-white/40'}`} />
        </div>
      </button>

      {/* Return */}
      <button
        type="button"
        onClick={() => {
          setDepartOpen(false);
          setReturnOpen(!returnOpen);
        }}
        className={`relative flex w-1/2 shrink-0 cursor-pointer items-center border-b border-l px-3 py-1 text-left transition-colors duration-200 sm:w-[150px] sm:border-b-0 sm:px-5 sm:py-1.5 ${isLight ? 'bg-white border-[#E5E7EB] hover:bg-[#F9FAFB]' : 'bg-transparent border-white/10 hover:bg-[rgba(212,175,55,0.06)]'}`}
      >
        <div>
          <div className={`bar-text text-[10px] font-semibold tracking-[0.12em] transition-all duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#7CC0FF]'}`}>Return</div>
          <div className={`mt-0.5 truncate text-[12.5px] font-bold transition-all duration-300 sm:text-[14px] ${returnDate ? (isLight ? 'text-[#111827]' : 'text-white') : (isLight ? 'text-[#9CA3AF]' : 'text-white/40')}`}>{returnDate ?? 'Return'}</div>
          <ChevronDown className={`absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-white/40'}`} />
        </div>
      </button>

      {/* Travellers & Class — clickable, opens the travellers popover */}
      <div className="relative w-full min-w-0 sm:w-auto sm:flex-1">
        <button
          type="button"
          onClick={() => (paxOpen ? closePax() : openPax())}
          aria-expanded={paxOpen}
          aria-haspopup="dialog"
          className={`flex w-full min-w-0 cursor-pointer items-center border-l px-3 py-1 text-left transition-colors duration-300 sm:px-5 sm:py-1.5 ${isLight ? 'border-l-[#E5E7EB] hover:bg-[#F9FAFB]' : 'border-l-white/10 hover:bg-white/5'}`}
        >
          <div className="min-w-0 flex-1">
            <div className={`bar-text text-[10px] font-semibold tracking-[0.12em] transition-all duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#7CC0FF]'}`}>Travellers & Class</div>
            <div className={`bar-text-value mt-0.5 flex items-center gap-1 truncate text-[12.5px] font-bold transition-all duration-300 sm:text-[14px] ${isLight ? 'text-[#111827]' : 'text-white'}`}>
              <span className="truncate">{travellersLabel(travellers)}, {cabin}</span>
              <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${isLight ? 'text-[#6B7280]' : 'text-white/50'} ${paxOpen && !paxClosing ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </button>

        {/* Travellers popover: per-category steppers + cabin class + Done */}
        {paxOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={closePax} />
            <div
              role="dialog"
              aria-label="Select travellers and cabin class"
              className={`popover-${paxClosing ? 'out' : 'in'} absolute left-0 top-full z-50 mt-1 w-[290px] max-w-[calc(100vw-24px)] rounded-xl border p-3 ${isLight ? 'bg-white border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.12)]' : 'bg-[#0F1B3A] border-[rgba(124,192,255,0.22)] shadow-[0_10px_30px_rgba(0,0,0,0.45)]'}`}
            >
              <div className={`text-[10px] font-semibold tracking-[0.12em] ${isLight ? 'text-[#6B7280]' : 'text-[#7CC0FF]'}`}>TRAVELLERS</div>
              <div className="mt-1">
                {(['adults', 'children', 'infants'] as const).map((key) => {
                  const meta = { adults: { label: 'Adults', sub: '12+ years' }, children: { label: 'Children', sub: '2–11 years' }, infants: { label: 'Infants', sub: 'Under 2 years' } }[key];
                  const minusDisabled = key === 'adults' ? travellers.adults <= 1 : travellers[key] <= 0;
                  const plusDisabled = key === 'adults' ? travellers.adults >= 9 : key === 'children' ? travellers.children >= 8 : travellers.infants >= travellers.adults;
                  return (
                    <div key={key} className="flex items-center justify-between gap-3 py-2">
                      <div className="min-w-0">
                        <div className={`text-[12.5px] font-semibold ${isLight ? 'text-[#111827]' : 'text-white'}`}>{meta.label}</div>
                        <div className={`text-[10.5px] ${isLight ? 'text-[#9CA3AF]' : 'text-[#9baec7]'}`}>{meta.sub}</div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2.5">
                        <button type="button" aria-label={`Decrease ${meta.label}`} disabled={minusDisabled} onClick={() => changePax(key, -1)} className={stepperCls(minusDisabled)}>−</button>
                        <span className={`w-5 text-center text-[13px] font-bold tabular-nums ${isLight ? 'text-[#111827]' : 'text-white'}`}>{travellers[key]}</span>
                        <button type="button" aria-label={`Increase ${meta.label}`} disabled={plusDisabled} onClick={() => changePax(key, 1)} className={stepperCls(plusDisabled)}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cabin class */}
              <div className={`mt-1 border-t pt-2.5 ${isLight ? 'border-[#E5E7EB]' : 'border-white/10'}`}>
                <div className={`text-[10px] font-semibold tracking-[0.12em] ${isLight ? 'text-[#6B7280]' : 'text-[#7CC0FF]'}`}>CABIN CLASS</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {['Economy', 'Premium Economy', 'Business Class', 'First Class'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCabin(c)}
                      className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 active:scale-95 ${cabin === c
                        ? (isLight ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]' : 'border-[#7CC0FF]/60 bg-[#2B5BFF]/25 text-[#7CC0FF]')
                        : (isLight ? 'border-[#E5E7EB] text-[#374151] hover:border-[#2563EB]/50 hover:bg-[#F9FAFB]' : 'border-white/15 text-white/85 hover:border-[#7CC0FF]/40 hover:bg-white/5')}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Done */}
              <button
                type="button"
                onClick={closePax}
                className={`mt-3 h-9 w-full cursor-pointer rounded-lg border-none text-[13px] font-bold tracking-wide transition-all duration-200 active:scale-[0.98] ${isLight ? 'bg-[#2563EB] text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8]' : 'bg-[#2593fc] text-white shadow-[0_2px_10px_rgba(37,147,252,0.4)] hover:bg-[#1D4ED8]'}`}
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>

      {/* Search button — blue pill cap, flush with the bar's top/bottom/right edges */}
      <button
        type="button"
        onClick={() => doSearch()}
        className={`flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-b-[26px] rounded-r-[26px] border-none px-4 py-1.5 text-[13px] font-bold tracking-wide transition-all duration-300 sm:absolute sm:inset-y-0 sm:right-0 sm:z-20 sm:w-auto sm:justify-start sm:rounded-b-none sm:py-0 sm:pl-10 sm:pr-11 sm:text-[16px] ${isLight ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] group-hover:bg-[#1D4ED8] group-hover:shadow-[0_0_18px_rgba(37,99,235,0.35),0_0_45px_rgba(37,99,235,0.2)] hover:bg-[#1D4ED8]' : 'bg-[#2593fc] text-white shadow-[0_0_28px_rgba(37,147,252,0.4)] group-hover:bg-[#d4af37] group-hover:shadow-[0_0_18px_rgba(212,175,55,0.45),0_0_45px_rgba(212,175,55,0.25)]'}`}
      >
        <span>Search</span>
        <ChevronRight className="h-[18px] w-[18px]" />
      </button>
    </div>
  );

  // Render the header with logo, search bar, and controls
  return (
    <header className={`sticky top-0 z-30 shrink-0 border-b px-3 pb-0.5 pt-0.5 sm:px-6 sm:pb-1.5 sm:pt-1 transition-colors duration-300 ${isLight ? 'bg-white border-[#E5E7EB] shadow-sm' : 'bg-[#0E1833] border-white/10'}`}>
      <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
        <div className="flex shrink-0 items-center">{leftSection}</div>
        <div className="min-w-0 flex-1">{searchBar}</div>
        <div className="flex shrink-0 items-center">{rightSection}</div>
      </div>
      {/* Return date calendar dropdown shown below the header when open */}
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

      {/* Departure date calendar dropdown shown below the header when open */}
      {departOpen && (
        <div className="relative z-50 mt-2 w-full lg:absolute lg:left-1/2 lg:top-full lg:mt-2 lg:w-max lg:max-w-[94vw] lg:-translate-x-1/2">
          <div className="pointer-events-none absolute -top-[9px] left-1/2 hidden h-0 w-0 -translate-x-1/2 border-x-[10px] border-b-[10px] border-x-transparent border-b-[rgba(124,192,255,0.35)] lg:block" />
          <ReturnCalendar
            title="Select departure date"
            monthOffset={departMonthOffset}
            onShift={(dir) => shiftDepartMonth(dir)}
            selected={departDate}
            onPick={pickDepartDate}
            onClose={() => setDepartOpen(false)}
          />
        </div>
      )}
    </header>
  );
};
