// Sidebar panel with filter groups (stops, airline, times, price, etc.) and a save-search button.
import type { ReactElement } from 'react';
import { useFlightStore } from '../../store/flightStore';
import { useThemeStore } from '../../store/themeStore';
import { FilterGroup } from './FilterGroup';
import { GitFork, PlaneTakeoff, ClockArrowUp, ClockArrowDown, Rupee, Timer, ShoppingBag, RotateCcw, Bookmark, ChevronDown, SlidersHorizontal, SunIcon, SunsetIcon, MoonIcon } from '../icons';

export const SidebarFilters = () => {
  // Theme and filter state read from the global store
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const filtersOpen = useFlightStore((s) => s.filtersOpen);
  const openFilters = useFlightStore((s) => s.openFilters);
  const toggleFilterGroup = useFlightStore((s) => s.toggleFilterGroup);
  const clearFilters = useFlightStore((s) => s.clearFilters);
  const departureTimes = useFlightStore((s) => s.departureTimes);
  const toggleDepartureTime = useFlightStore((s) => s.toggleDepartureTime);

  // Number of filter groups currently expanded (used for the header badge).
  const activeCount = openFilters.filter(Boolean).length;

  // Map time-of-day icons for the departure filter options
  const timeIcons: Record<string, ReactElement> = {
    'early-morning': <MoonIcon className="h-3.5 w-3.5" />,
    'morning': <SunIcon className="h-3.5 w-3.5" />,
    'afternoon': <SunIcon className="h-3.5 w-3.5 text-[#f59e0b]" />,
    'evening': <SunsetIcon className="h-3.5 w-3.5" />,
  };

  // Check if any departure time is selected for the value display
  const selectedDepartureTimes = departureTimes.filter((t) => t.selected);
  const departureTimeValue = selectedDepartureTimes.length > 0
    ? selectedDepartureTimes.map((t) => t.label).join(', ')
    : 'All times';

  // Convert departureTimes to FilterOption format for FilterGroup
  const departureOptions = departureTimes.map((t) => ({
    icon: timeIcons[t.id] || <SunIcon className="h-3.5 w-3.5" />,
    label: t.label,
    timeRange: t.timeRange,
    selected: t.selected,
  }));

  // Sidebar container: visible only when filters are open (on mobile) or always on desktop
  return (
    <aside className={`group/sidebar ${filtersOpen ? 'flex' : 'hidden'} w-full shrink-0 flex-col border-r p-3 md:flex md:w-[280px] lg:w-[300px] transition-colors duration-300 ${isLight ? 'bg-[#F7F9FC] border-r-[#E5E7EB]' : 'bg-[#0E1833] border-[rgba(212,175,55,0.25)]'}`}>
      {/* Header row: sliders glyph + title + count badge, with clear-all on the right. */}
      <div className="flex shrink-0 items-center justify-between gap-2 pb-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <SlidersHorizontal className={`h-3.5 w-3.5 shrink-0 transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#7CC0FF]'}`} />
          <span className={`truncate text-[10.5px] font-bold tracking-[0.14em] transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>REFINE RESULTS</span>
          {activeCount > 0 && (
            <span className={`flex h-[16px] min-w-[16px] shrink-0 items-center justify-center rounded-full px-1 text-[9.5px] font-bold leading-none text-white transition-colors duration-300 ${isLight ? 'bg-[#2563EB]' : 'bg-[#d4af37] text-[#0E1833]'}`}>
              {activeCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={clearFilters}
          className={`flex shrink-0 cursor-pointer items-center gap-1 border-none bg-transparent text-[11px] font-medium transition duration-200 ${isLight ? 'text-[#6B7280] hover:text-[#2563EB]' : 'text-white/60 hover:text-[#f5d67b] hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.7)]'}`}
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Filter cards: always allow vertical scroll — the pretty-scroll styled
          scrollbar only appears when expanded filter content exceeds the
          available height. Collapsed cards share space equally (flex-1);
          expanded cards grow to their natural size (flex-none). */}
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto hide-scrollbar pb-1">
        <FilterGroup icon={<GitFork className="h-4 w-4" />} label="Stops" value="Non-stop, 1 stop" active={openFilters[0]} onToggle={() => toggleFilterGroup(0)} />
        <FilterGroup icon={<PlaneTakeoff className="h-4 w-4" />} label="Airline" value="All airlines" active={openFilters[1]} onToggle={() => toggleFilterGroup(1)} />
        <FilterGroup
          icon={<ClockArrowUp className="h-4 w-4" />}
          label="Departure Time"
          value={departureTimeValue}
          options={departureOptions}
          active={openFilters[2]}
          onToggle={() => toggleFilterGroup(2)}
          onOptionToggle={toggleDepartureTime}
        />
        <FilterGroup
          icon={<ClockArrowDown className="h-4 w-4" />}
          label="Arrival"
          value="07:00 – 23:59"
          slider={{ from: 14, to: 64 }}
          active={openFilters[3]}
          onToggle={() => toggleFilterGroup(3)}
        />
        <FilterGroup
          icon={<Rupee className="text-[15px]" />}
          label="Price"
          value="₹3,000 – ₹12,000"
          slider={{ from: 5, to: 95 }}
          active={openFilters[4]}
          onToggle={() => toggleFilterGroup(4)}
        />
        <FilterGroup icon={<Timer className="h-4 w-4" />} label="Duration" value="0h – 8h" active={openFilters[5]} onToggle={() => toggleFilterGroup(5)} />
        <FilterGroup icon={<ShoppingBag className="h-4 w-4" />} label="Baggage" value="15 kg or more" active={openFilters[6]} onToggle={() => toggleFilterGroup(6)} />
        <FilterGroup icon={<RotateCcw className="h-4 w-4" />} label="Refundability" value="Flexible options" active={openFilters[7]} onToggle={() => toggleFilterGroup(7)} />
      </div>

      {/* Save Search — standalone card button pinned at the bottom. */}
      <div className="shrink-0 pt-1.5">
        <button
          type="button"
          className={`group relative flex w-full shrink-0 cursor-pointer items-center gap-2.5 overflow-hidden rounded-[14px] border px-3 py-2 text-left transition duration-300 ${isLight ? 'bg-white border-[#E5E7EB] text-[#111827] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:border-[#BFDBFE] hover:bg-[#EFF6FF] hover:text-[#2563EB] active:bg-[#EFF6FF]' : 'bg-[#0F1B3A] border-[rgba(124,192,255,0.22)] hover:border-[rgba(212,175,55,0.45)] hover:bg-[rgba(212,175,55,0.12)] active:bg-[rgba(212,175,55,0.18)]'}`}
        >
          <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[#EF4444] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition duration-300 group-hover:bg-[#DC2626] group-hover:scale-[1.06] group-active:bg-[#DC2626] group-active:scale-[1.06]">
            <Bookmark className="h-3.5 w-3.5" />
          </span>
          <span
            className={`relative text-[12.5px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#111827] group-hover:text-[#2563EB]' : 'text-white group-hover:text-[#f5d67b]'}`}
          >
            Save Search
          </span>
          <ChevronDown
            className={`relative -rotate-90 ml-auto h-3.5 w-3.5 transition-colors duration-300 ${isLight ? 'text-[#9CA3AF] group-hover:text-[#2563EB]' : 'text-white/40 group-hover:text-[#f0c265]'}`}
          />
        </button>
      </div>
    </aside>
  );
};
