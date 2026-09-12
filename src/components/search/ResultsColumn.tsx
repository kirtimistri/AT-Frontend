// One column of flight results (onward or return) with sort tabs and a list of flight cards.
import type { Flight, SortKey } from '../../store/flightStore';
import { useThemeStore } from '../../store/themeStore';
import { sortFlights } from '../../lib/format';
import { FlightCard } from './FlightCard';

// Small pill buttons for sorting the flight list (by price, speed, or departure time)
const SortTabs = ({ active, onChange, isLight }: { active: SortKey; onChange: (k: SortKey) => void; isLight?: boolean }) => (
  <div className="flex items-center gap-1">
    {(['price', 'fastest', 'departure'] as SortKey[]).map((k) => (
      <button
        key={k}
        onClick={() => onChange(k)}
        className={`cursor-pointer rounded-full px-2.5 py-[2px] text-[11px] font-semibold capitalize leading-tight transition-colors duration-200 ${isLight ? (active === k ? 'bg-[#2563EB] text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]' : 'bg-transparent text-[#6B7280] hover:bg-[#EFF6FF] hover:text-[#2563EB]') : (active === k ? 'bg-[#2593fc] text-white shadow-[0_2px_8px_rgba(37,147,252,0.4)]' : 'bg-transparent text-[#7CC0FF] hover:bg-[rgba(37,147,252,0.14)]')}`}
      >
        {k}
      </button>
    ))}
  </div>
);

// Props describing what this column shows and how the parent reacts to clicks
type ResultsColumnProps = {
  title: string;
  scope?: string;
  flights: Flight[];
  dayDelta: number;
  selected: Flight | null;
  onSelect: (f: Flight) => void;
  fromLabel: (f: Flight) => string;
  toLabel: (f: Flight) => string;
  sort: SortKey;
  onSort: (k: SortKey) => void;
};

export const ResultsColumn = ({ title, scope, flights, dayDelta, selected, onSelect, fromLabel, toLabel, sort, onSort }: ResultsColumnProps) => {
  // Theme determines the light or dark styling
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Header row with title and flight count
  return (
    <section className={`min-w-0 transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>
      {/* Sort tabs (left) + route title & flight count (right) on one row */}
      <div className={`flex items-center justify-between gap-3 border-b pb-0.5 transition-colors duration-300 ${isLight ? 'border-[#E5E7EB]' : 'border-white/10'}`}>
        <SortTabs active={sort} onChange={onSort} isLight={isLight} />
        <div className="flex items-baseline gap-2">
          <span className={`text-[13px] font-bold leading-tight transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{title}</span>
          <span className={`text-[10.5px] leading-tight transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>{flights.length} Flights Available</span>
        </div>
      </div>
      {/* List of flight cards, sorted, one per available flight */}
      <div className="space-y-3 pt-1.5">
        {sortFlights(flights, sort).map((f, i) => (
          <FlightCard
            key={f.code}
            f={f}
            dayDelta={dayDelta}
            selected={selected?.code === f.code}
            onSelect={() => onSelect(f)}
            fromLabel={fromLabel(f)}
            toLabel={toLabel(f)}
            expandable
            compact
            scope={scope}
            index={i}
          />
        ))}
      </div>
    </section>
  );
};
