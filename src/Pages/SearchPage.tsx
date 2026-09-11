// Search results page: shows available flights (one-way or round-trip),
// lets the user pick flights, and shows a price summary bar.
import { useEffect } from 'react';
import { useFlightStore, STRIP_WINDOW, STRIP_DEFAULT_START, STRIP_DEFAULT_SEL } from '../store/flightStore';
import { useThemeStore } from '../store/themeStore';
import { Header } from '../components/Header';
import { SidebarFilters } from '../components/SidebarFilters';
import { ResultsColumn } from '../components/ResultsColumn';
import { PriceStrip } from '../components/PriceStrip';
import { FlightSearchLoading } from '../components/FlightSearchLoading';
import { SummaryBar } from '../components/SummaryBar';
import { FlightCard } from '../components/FlightCard';
import { PlaneTakeoff } from '../components/icons';
import { readSearchSnapshot, clearSearchSnapshot } from '../lib/openReview';

const SearchPage = () => {
  // Theme: picks light vs dark colors.
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Read flight data and actions from the global store.
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

  // On mount: if a saved search exists (e.g. from "open review" flow), restore it.
  useEffect(() => {
    const snapshot = readSearchSnapshot();
    if (snapshot) {
      restoreSearch(snapshot);
      clearSearchSnapshot();
    }
  }, [restoreSearch]);

  // Derived data: the date strip window and price difference from the base date.
  const stripDates = datePool.slice(stripStart, stripStart + STRIP_WINDOW);
  const stripDay = datePool[stripStart + stripSel];
  const baseStripDay = datePool[STRIP_DEFAULT_START + STRIP_DEFAULT_SEL];
  const dayDelta = stripDay.price - baseStripDay.price;

  // Derived data: short city codes and helpers used for labels.
  const fromCode = fromCity.split(' - ')[0];
  const toCode = toCity.split(' - ')[0];
  const relabel = (airport: string, code: string) => `${code}${airport.replace(/^[A-Z]{3}/, '')}`;
  // Show the sticky price summary bar only after searching and picking a flight.
  const barVisible = searched && (!!selectedOnward || !!selectedReturn);

  return (
    <div className={`flex min-h-[100dvh] flex-col overflow-x-hidden lg:h-[100dvh] lg:overflow-hidden font-sans ${isLight ? 'light-theme bg-white text-[#111827]' : 'bg-[#0B132B] text-white'}`}>
      <Header />

      <div className="flex min-h-0 flex-1 flex-col items-stretch overflow-hidden md:flex-row">
        <SidebarFilters />

        {/* ---- Results ---- */}
        <main className={`pretty-scroll min-w-0 flex-1 overflow-x-hidden overflow-y-scroll p-3 pt-1 sm:p-4 sm:pt-2 ${barVisible ? 'pb-[128px] md:pb-[124px]' : ''}`}>
          {/* Before a search: show a friendly "search flights" message. */}
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
            <div className="pt-0">
              {/* While searching: cinematic flight-search loading animation. */}
              {/* Date & price strip skeleton */}
              <div className={`card-shimmer h-[52px] animate-pulse overflow-hidden rounded-[14px] border transition-colors duration-300 ${isLight ? 'bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'bg-[#0F1B3A] border-[rgba(124,192,255,0.22)]'}`} />

              {/* The cinematic loader shows the animated route between the two cities */}
              <div className="pt-4">
                <FlightSearchLoading
                  source={fromCity}
                  destination={toCity}
                  sourceCode={fromCode}
                  destinationCode={toCode}
                />
              </div>
            </div>
          ) : returnDate ? (
            <div className="pt-0">
              {/* After search, round trip: date strip + onward and return columns. */}
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
              <div className="grid grid-cols-1 items-start gap-6 pt-2 xl:grid-cols-2">
                <ResultsColumn
                  title={`${fromCode} - ${toCode}`}
                  scope="onward"
                  flights={flights}
                  dayDelta={dayDelta}
                  selected={selectedOnward}
                  onSelect={(f) => setSelectedOnward(selectedOnward?.code === f.code ? null : f)}
                  fromLabel={(f) => relabel(f.departure.airport, fromCode)}
                  toLabel={(f) => relabel(f.arrival.airport, toCode)}
                  sort={onwardSort}
                  onSort={setOnwardSort}
                />
                <ResultsColumn
                  title={`${toCode} - ${fromCode}`}
                  scope="return"
                  flights={returnFlights}
                  dayDelta={dayDelta}
                  selected={selectedReturn}
                  onSelect={(f) => setSelectedReturn(selectedReturn?.code === f.code ? null : f)}
                  fromLabel={(f) => relabel(f.departure.airport, toCode)}
                  toLabel={(f) => relabel(f.arrival.airport, fromCode)}
                  sort={returnSort}
                  onSort={setReturnSort}
                />
              </div>
            </div>
          ) : (
            <div className="pt-0">
              {/* After search, one way: date strip + single list of flight cards. */}
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

              <div className="space-y-3 pt-2">
                {flights.map((f, i) => (
                  <FlightCard
                    key={i}
                    f={f}
                    dayDelta={dayDelta}
                    index={i}
                    selected={selectedOnward?.code === f.code}
                    onSelect={() => setSelectedOnward(selectedOnward?.code === f.code ? null : f)}
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