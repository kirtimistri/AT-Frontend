import { useEffect } from 'react';
import { useFlightStore, STRIP_WINDOW, STRIP_DEFAULT_START, STRIP_DEFAULT_SEL } from '../store/flightStore';
import { useThemeStore } from '../store/themeStore';
import { Header } from '../components/Header';
import { SidebarFilters } from '../components/SidebarFilters';
import { ResultsColumn } from '../components/ResultsColumn';
import { PriceStrip } from '../components/PriceStrip';
import { SkeletonCard } from '../components/SkeletonCard';
import { SummaryBar } from '../components/SummaryBar';
import { FlightCard } from '../components/FlightCard';
import { PlaneTakeoff } from '../components/icons';
import { readSearchSnapshot, clearSearchSnapshot } from '../lib/openReview';

const SearchPage = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const flights = useFlightStore((s) => s.flights);
  const returnFlights = useFlightStore((s) => s.returnFlights);
  const datePool = useFlightStore((s) => s.datePool);
  const fromCity = useFlightStore((s) => s.fromCity);
  const toCity = useFlightStore((s) => s.toCity);
  const searching = useFlightStore((s) => s.searching);
  const searched = useFlightStore((s) => s.searched);
  const selectedOnward = useFlightStore((s) => s.selectedOnward);
  const selectedReturn = useFlightStore((s) => s.selectedReturn);
  const onwardSort = useFlightStore((s) => s.onwardSort);
  const returnSort = useFlightStore((s) => s.returnSort);
  const stripStart = useFlightStore((s) => s.stripStart);
  const stripSel = useFlightStore((s) => s.stripSel);
  const returnDate = useFlightStore((s) => s.returnDate);
  const setSelectedOnward = useFlightStore((s) => s.setSelectedOnward);
  const setSelectedReturn = useFlightStore((s) => s.setSelectedReturn);
  const setOnwardSort = useFlightStore((s) => s.setOnwardSort);
  const setReturnSort = useFlightStore((s) => s.setReturnSort);
  const setStripSel = useFlightStore((s) => s.setStripSel);
  const shiftStrip = useFlightStore((s) => s.shiftStrip);
  const restoreSearch = useFlightStore((s) => s.restoreSearch);

  useEffect(() => {
    const snapshot = readSearchSnapshot();
    if (snapshot) {
      restoreSearch(snapshot);
      clearSearchSnapshot();
    }
  }, [restoreSearch]);

  const stripDates = datePool.slice(stripStart, stripStart + STRIP_WINDOW);
  const stripDay = datePool[stripStart + stripSel];
  const baseStripDay = datePool[STRIP_DEFAULT_START + STRIP_DEFAULT_SEL];
  const dayDelta = stripDay.price - baseStripDay.price;

  const fromCode = fromCity.split(' - ')[0];
  const toCode = toCity.split(' - ')[0];
  const relabel = (airport: string, code: string) => `${code}${airport.replace(/^[A-Z]{3}/, '')}`;
  const barVisible = searched && (!!selectedOnward || !!selectedReturn);

  return (
    <div className={`flex min-h-[100dvh] flex-col overflow-x-hidden lg:h-[100dvh] lg:overflow-hidden font-sans ${isLight ? 'light-theme bg-white text-[#111827]' : 'bg-[#0B132B] text-white'}`}>
      <Header />

      <div className="flex min-h-0 flex-1 flex-col items-stretch overflow-hidden md:flex-row">
        <SidebarFilters />

        {/* ---- Results ---- */}
        <main className={`pretty-scroll min-w-0 flex-1 overflow-x-hidden overflow-y-scroll p-3 sm:p-6 ${barVisible ? 'pb-[128px] md:pb-[124px]' : ''}`}>
          {!searched ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full border transition-colors duration-300 ${isLight ? 'bg-white border-[#E5E7EB] text-[#2563EB] shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'bg-[#0F1B3A] border-[rgba(124,192,255,0.4)] text-[#7CC0FF]'}`}>
                <PlaneTakeoff className="h-7 w-7" />
              </div>
              <p className={`mt-5 text-[16px] font-bold transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>Search flights to see results</p>
              <p className={`mt-1.5 max-w-sm text-[13px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-white/50'}`}>
                Enter your route and press the Search button to load available flights for {fromCity} → {toCity}.
              </p>
            </div>
          ) : searching ? (
            <div className="pt-1">
              {/* Date & price strip skeleton */}
              <div className={`card-shimmer h-[52px] animate-pulse overflow-hidden rounded-[14px] border transition-colors duration-300 ${isLight ? 'bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'bg-[#0F1B3A] border-[rgba(124,192,255,0.22)]'}`} />

              {returnDate ? (
                /* Round trip: two columns of skeleton cards */
                <div className="grid grid-cols-1 items-start gap-6 pt-5 xl:grid-cols-2">
                  {[0, 1].map((col) => (
                    <div key={col}>
                      <div className="flex animate-pulse items-baseline justify-between gap-3">
                        <div className={`h-[15px] w-[96px] rounded transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#1c3a5f]'}`} />
                        <div className={`h-[12px] w-[128px] rounded transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#122844]'}`} />
                      </div>
                      <div className={`mt-2 flex items-center gap-2 border-b pb-2 transition-colors duration-300 ${isLight ? 'border-[#E5E7EB]' : 'border-white/10'}`}>
                        {[0, 1, 2].map((p) => (
                          <div key={p} className={`h-[24px] w-[58px] animate-pulse rounded-full transition-colors duration-300 ${isLight ? 'bg-[#F3F4F6]' : 'bg-[#16304f]'}`} />
                        ))}
                      </div>
                      <div className="space-y-5 pt-4">
                        {[0, 1, 2].map((i) => (
                          <SkeletonCard key={i} index={i} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* One way: single column of skeleton cards */
                <div className="space-y-6 pt-5">
                  {[0, 1, 2].map((i) => (
                    <SkeletonCard key={i} index={i} />
                  ))}
                </div>
              )}
            </div>
          ) : returnDate ? (
            <div className="pt-1">
              {/* Date & price strip */}
              <PriceStrip
                dates={stripDates}
                selected={stripSel}
                onPick={setStripSel}
                onPrev={() => shiftStrip(-1)}
                onNext={() => shiftStrip(1)}
                canPrev={stripStart > 0}
                canNext={stripStart < datePool.length - STRIP_WINDOW}
              />

              {/* Round trip: onward (left) + return (right) columns */}
              <div className="grid grid-cols-1 items-start gap-6 pt-5 xl:grid-cols-2">
                <ResultsColumn
                  title={`${fromCode} - ${toCode}`}
                  flights={flights}
                  dayDelta={dayDelta}
                  selected={selectedOnward}
                  onSelect={setSelectedOnward}
                  fromLabel={(f) => relabel(f.departure.airport, fromCode)}
                  toLabel={(f) => relabel(f.arrival.airport, toCode)}
                  sort={onwardSort}
                  onSort={setOnwardSort}
                />
                <ResultsColumn
                  title={`${toCode} - ${fromCode}`}
                  flights={returnFlights}
                  dayDelta={dayDelta}
                  selected={selectedReturn}
                  onSelect={setSelectedReturn}
                  fromLabel={(f) => relabel(f.departure.airport, toCode)}
                  toLabel={(f) => relabel(f.arrival.airport, fromCode)}
                  sort={returnSort}
                  onSort={setReturnSort}
                />
              </div>
            </div>
          ) : (
            <div className="pt-1">
              {/* Date & price strip */}
              <PriceStrip
                dates={stripDates}
                selected={stripSel}
                onPick={setStripSel}
                onPrev={() => shiftStrip(-1)}
                onNext={() => shiftStrip(1)}
                canPrev={stripStart > 0}
                canNext={stripStart < datePool.length - STRIP_WINDOW}
              />

              <div className="space-y-6 pt-5">
                {flights.map((f, i) => (
                  <FlightCard
                    key={i}
                    f={f}
                    dayDelta={dayDelta}
                    index={i}
                    selected={selectedOnward?.code === f.code}
                    onSelect={() => setSelectedOnward(f)}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Sticky bottom summary bar (round-trip selection) */}
      {barVisible && (
        <SummaryBar onward={selectedOnward} ret={selectedReturn} dayDelta={dayDelta} />
      )}
    </div>
  );
};

export default SearchPage;