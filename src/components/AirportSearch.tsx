// AirportSearch.tsx
// Searchable single-select dropdown for the From/To fields.
// - Opens a popover with a search input (city / airport / IATA / country).
// - Debounced, case-insensitive, ranked results via airportSearch service.
// - Picking a result closes the dropdown and shows a "PNQ - Pune" label;
//   picking another airport simply replaces the previous selection.
// - Airports already picked in the opposite field are disabled (From ≠ To).
// - Full keyboard navigation (↑/↓/Enter/Escape).
import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import type { Airport } from '../data/airports';
import { searchAirports } from '../services/airportSearch';
import { useThemeStore } from '../store/themeStore';
import { AirportResult } from './AirportResult';

interface AirportSearchProps {
  /** "From" or "To" */
  label: string;
  /** The single selected airport, rendered as "PNQ - Pune". */
  selected: Airport;
  /** Called when a result is picked — replaces the previous selection. */
  onSelect: (a: Airport) => void;
  /** IATA code chosen in the opposite field — cannot be picked here. */
  disabledIata?: string;
  /** Which side to anchor the popover to (keeps it inside the viewport). */
  align?: 'left' | 'right';
}

export const AirportSearch = ({
  label,
  selected,
  onSelect,
  disabledIata,
  align = 'left',
}: AirportSearchProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const reqRef = useRef(0);

  const openPanel = () => {
    setClosing(false);
    setQuery('');
    setResults([]);
    setActiveIdx(0);
    setOpen(true);
  };
  const closePanel = () => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 150);
  };

  // Debounced search with stale-response guarding (future API ready).
  useEffect(() => {
    if (!open) return;
    if (!query.trim()) {
      setResults([]);
      setActiveIdx(0);
      return;
    }
    const requestId = ++reqRef.current;
    const timer = window.setTimeout(async () => {
      const list = await searchAirports(query);
      if (reqRef.current === requestId) {
        setResults(list);
        setActiveIdx(0);
      }
    }, 120);
    return () => window.clearTimeout(timer);
  }, [query, open]);

  const choose = (a: Airport) => {
    if (a.iataCode === disabledIata) return; // already used in the other field
    onSelect(a);
    setQuery('');
    setResults([]);
    setActiveIdx(0);
    closePanel(); // close the dropdown after selecting
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePanel();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      const target = results[activeIdx];
      if (target) {
        e.preventDefault();
        choose(target);
      }
    } else if (e.key === 'Tab') {
      closePanel();
    }
  };

  return (
    <div
      className={`relative flex min-w-0 flex-1 items-center border-l px-3 py-1 sm:px-5 sm:py-1.5 transition-colors duration-300 ${isLight ? 'border-l-[#E5E7EB]' : 'border-l-white/10'}`}
    >
      {/* Trigger – shows the label and selected chips */}
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label} airports`}
        onClick={() => (open ? closePanel() : openPanel())}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (open) closePanel();
            else openPanel();
          }
        }}
        className={`min-w-0 flex-1 cursor-pointer rounded-lg py-0.5 transition-colors duration-200 ${open ? (isLight ? 'bg-[#F3F7FD]' : 'bg-white/5') : isLight ? 'hover:bg-[#F9FAFB]' : 'hover:bg-white/5'}`}
      >
        <div className={`text-[10px] font-semibold tracking-[0.12em] transition-all duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#7CC0FF]'}`}>
          {label}
        </div>
        <div className="mt-0.5">
          {selected.iataCode ? (
            /* `PNQ - Pune` style label, matching the original field typography */
            <div className={`truncate text-[12.5px] font-bold transition-all duration-300 sm:text-[14px] ${isLight ? 'text-[#111827]' : 'text-white'}`}>
              <span className="font-extrabold">{selected.iataCode}</span>
              {` - ${selected.city}`}
            </div>
          ) : (
            <div className={`truncate text-[12.5px] font-semibold transition-all duration-300 sm:text-[14px] ${isLight ? 'text-[#9CA3AF]' : 'text-white/40'}`}>
              {label === 'From' ? 'Select departure' : 'Select arrival'}
            </div>
          )}
        </div>
      </div>

      {/* Popover */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={closePanel} />
          <div
            role="listbox"
            aria-label={`${label.toLowerCase()} airport search`}
            aria-expanded="true"
            className={`popover-${closing ? 'out' : 'in'} absolute top-full z-50 mt-1 w-[320px] max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border text-left ${align === 'right' ? 'left-auto right-0' : 'left-0 right-auto'} ${isLight ? 'bg-white border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.12)]' : 'bg-[#0F1B3A] border-[rgba(124,192,255,0.22)] shadow-[0_10px_30px_rgba(0,0,0,0.45)]'}`}
          >
            {/* Search input */}
            <div className={`flex items-center gap-2 border-b px-3 ${isLight ? 'border-[#E5E7EB]' : 'border-white/10'}`}>
              <Search className={`h-4 w-4 shrink-0 ${isLight ? 'text-[#6B7280]' : 'text-white/40'}`} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-expanded="true"
                aria-controls={`${label.toLowerCase()}-results`}
                placeholder="City, airport, IATA or country…"
                className={`w-full bg-transparent py-2.5 text-[13px] font-medium outline-none placeholder:font-normal ${isLight ? 'text-[#111827] placeholder:text-[#9CA3AF]' : 'text-white placeholder:text-white/40'}`}
              />
            </div>

            {/* Results */}
            <ul
              id={`${label.toLowerCase()}-results`}
              className={`max-h-[280px] overflow-y-auto p-1.5 ${isLight ? 'bg-white' : 'bg-transparent'}`}
            >
              {results.length === 0 ? (
                <li className={`px-3 py-4 text-center text-[12px] font-medium ${isLight ? 'text-[#6B7280]' : 'text-white/50'}`}>
                  {query.trim() ? 'No airports found' : 'Start typing to search airports'}
                </li>
              ) : (
                results.map((a, i) => (
                  <li key={a.iataCode} role="option" aria-selected={i === activeIdx}>
                    <AirportResult
                      airport={a}
                      active={i === activeIdx && a.iataCode !== disabledIata}
                      disabled={a.iataCode === disabledIata}
                      onSelect={choose}
                      onHover={() => setActiveIdx(i)}
                    />
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};