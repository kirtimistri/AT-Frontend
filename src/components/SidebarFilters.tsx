// Sidebar panel with filter groups (stops, airline, times, price, etc.) and a save-search button.
import { useFlightStore } from '../store/flightStore';
import { useThemeStore } from '../store/themeStore';
import { FilterGroup } from './FilterGroup';
import { GitFork, PlaneTakeoff, ClockArrowUp, ClockArrowDown, Rupee, Timer, ShoppingBag, RotateCcw, Bookmark, ChevronRight } from './icons';

export const SidebarFilters = () => {
  // Theme and filter state read from the global store
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const filtersOpen = useFlightStore((s) => s.filtersOpen);
  const openFilters = useFlightStore((s) => s.openFilters);
  const toggleFilterGroup = useFlightStore((s) => s.toggleFilterGroup);
  const clearFilters = useFlightStore((s) => s.clearFilters);

  // Sidebar container: visible only when filters are open (on mobile) or always on desktop
  return (
    <aside className={`group/sidebar ${filtersOpen ? 'flex' : 'hidden'} max-h-[72dvh] w-full shrink-0 flex-col overflow-hidden border-b p-3 md:max-h-none md:flex md:w-[300px] md:border-r md:border-b-0 transition-colors duration-300 ${isLight ? 'bg-[#F7F9FC] border-[#E5E7EB]' : 'bg-[#0E1833] border-[rgba(212,175,55,0.25)]'}`}>
      {/* Header row with the title and "clear all" button */}
      <div className="flex items-center justify-between pb-1.5">
        <span className={`text-[11.5px] font-bold tracking-[0.14em] transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>REFINE RESULTS</span>
        <button
          type="button"
          onClick={clearFilters}
          className={`cursor-pointer border-none bg-transparent text-[12px] font-medium transition-all duration-200 hover:text-[#d4af37] hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.7)] ${isLight ? 'text-[#111827] hover:text-[#2563EB]' : 'text-white/85 hover:text-[#f5d67b]'}`}
        >
          clear all
        </button>
      </div>

      {/* Filter groups: fills the sidebar height exactly — all options visible, no scrollbar */}
      {/* Filter groups: fills the sidebar height exactly — rows flex to fit, all options visible, no scrollbar */}
      <div className={`pretty-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain rounded-[14px] border px-3 py-1 md:overflow-hidden ${isLight ? 'bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'bg-[#0F1B3A] border-[rgba(124,192,255,0.35)] shadow-[inset_0_1px_0_rgba(255,255,255,0.02),0_0_18px_rgba(59,156,255,0.12)]'}`}>
        <FilterGroup icon={<GitFork className="h-4 w-4" />} label="Stops" value="Non-stop, 1 stop" chevron="right" active={openFilters[0]} onToggle={() => toggleFilterGroup(0)} />
        <FilterGroup icon={<PlaneTakeoff className="h-4 w-4" />} label="Airline" value="All airlines" chevron="right" active={openFilters[1]} onToggle={() => toggleFilterGroup(1)} />
        <FilterGroup
          icon={<ClockArrowUp className="h-4 w-4" />}
          label="Departure"
          value="05:00 AM – 11:59 PM"
          slider={{ from: 10, to: 60 }}
          active={openFilters[2]}
          onToggle={() => toggleFilterGroup(2)}
        />
        <FilterGroup
          icon={<ClockArrowDown className="h-4 w-4" />}
          label="Arrival"
          value="07:00 AM – 11:59 PM"
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
        <FilterGroup icon={<Timer className="h-4 w-4" />} label="Duration" value="0h – 8h" chevron="down" active={openFilters[5]} onToggle={() => toggleFilterGroup(5)} />
        <FilterGroup icon={<ShoppingBag className="h-4 w-4" />} label="Baggage" value="15 kg or more" chevron="down" active={openFilters[6]} onToggle={() => toggleFilterGroup(6)} />
        <FilterGroup icon={<RotateCcw className="h-4 w-4" />} label="Refundability" value="Flexible options" chevron="down" active={openFilters[7]} onToggle={() => toggleFilterGroup(7)} />
      </div>

      {/* Save Search — matching bordered option at the bottom of the sidebar */}
      <div className="pt-2">
        <button className={`group relative flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-[14px] border px-3 py-1.5 text-left transition-all duration-300 hover:bg-[#EFF6FF] active:bg-[#EFF6FF] ${isLight ? 'bg-white border-[#E5E7EB] text-[#111827] hover:border-[#2563EB] hover:text-[#2563EB]' : 'bg-[#0F1B3A] border-[rgba(124,192,255,0.35)] hover:bg-[rgba(212,175,55,0.12)] active:bg-[rgba(212,175,55,0.18)]'}`}>
          <span className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[#EF4444] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 group-hover:bg-[#DC2626] group-hover:scale-[1.06] group-active:bg-[#DC2626] group-active:scale-[1.06]`}>
            <Bookmark className="h-3.5 w-3.5" />
          </span>
          <span className={`relative text-[12.5px] font-semibold transition-colors duration-300 group-hover:text-[#d4af37] group-active:text-[#d4af37] ${isLight ? 'text-[#111827] group-hover:text-[#2563EB]' : 'text-white'}`}>Save Search</span>
          <ChevronRight className={`relative ml-auto h-3.5 w-3.5 transition-colors duration-200 group-hover:text-[#f0c265] group-active:text-[#f0c265] ${isLight ? 'text-[#2563EB] group-hover:text-[#2563EB]' : 'text-[#7CC0FF]'}`} />
        </button>
      </div>
    </aside>
  );
};
