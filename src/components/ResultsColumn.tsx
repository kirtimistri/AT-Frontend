import type { Flight, SortKey } from '../store/flightStore';
import { useThemeStore } from '../store/themeStore';
import { sortFlights } from '../lib/format';
import { FlightCard } from './FlightCard';

const SortTabs = ({ active, onChange, isLight }: { active: SortKey; onChange: (k: SortKey) => void; isLight?: boolean }) => (
  <div className="flex items-center gap-1">
    {(['price', 'fastest', 'departure'] as SortKey[]).map((k) => (
      <button
        key={k}
        onClick={() => onChange(k)}
        className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-semibold capitalize transition-colors duration-200 ${isLight ? (active === k ? 'bg-[#2563EB] text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]' : 'bg-transparent text-[#6B7280] hover:bg-[#EFF6FF] hover:text-[#2563EB]') : (active === k ? 'bg-[#2593fc] text-white shadow-[0_2px_8px_rgba(37,147,252,0.4)]' : 'bg-transparent text-[#7CC0FF] hover:bg-[rgba(37,147,252,0.14)]')}`}
      >
        {k}
      </button>
    ))}
  </div>
);

type ResultsColumnProps = {
  title: string;
  flights: Flight[];
  dayDelta: number;
  selected: Flight | null;
  onSelect: (f: Flight) => void;
  fromLabel: (f: Flight) => string;
  toLabel: (f: Flight) => string;
  sort: SortKey;
  onSort: (k: SortKey) => void;
};

export const ResultsColumn = ({ title, flights, dayDelta, selected, onSelect, fromLabel, toLabel, sort, onSort }: ResultsColumnProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  return (
    <section className={`min-w-0 transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>
      <div className="flex items-baseline justify-between gap-3">
        <span className={`text-[15px] font-bold transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{title}</span>
        <span className={`text-[12px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>{flights.length} Flights Available</span>
      </div>
      <div className={`mt-2 flex items-center gap-1 border-b pb-2 transition-colors duration-300 ${isLight ? 'border-[#E5E7EB]' : 'border-white/10'}`}>
        <SortTabs active={sort} onChange={onSort} isLight={isLight} />
        <span className={`ml-auto text-[11px] transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#7CC0FF]'}`}>Smart</span>
      </div>
      <div className="space-y-5 pt-4">
        {sortFlights(flights, sort).map((f, i) => (
          <FlightCard
            key={f.code}
            f={f}
            dayDelta={dayDelta}
            selected={selected?.code === f.code}
            onSelect={() => onSelect(f)}
            fromLabel={fromLabel(f)}
            toLabel={toLabel(f)}
            expandable={false}
            compact
            index={i}
          />
        ))}
      </div>
    </section>
  );
};
