import { useFlightStore } from '../store/flightStore';
import { FilterGroup } from './FilterGroup';
import { GitFork, PlaneTakeoff, ClockArrowUp, ClockArrowDown, Rupee, Timer, ShoppingBag, RotateCcw, Bookmark, ChevronRight } from './icons';

export const SidebarFilters = () => {
  const filtersOpen = useFlightStore((s) => s.filtersOpen);
  const openFilters = useFlightStore((s) => s.openFilters);
  const toggleFilterGroup = useFlightStore((s) => s.toggleFilterGroup);
  const clearFilters = useFlightStore((s) => s.clearFilters);

  return (
    <aside className={`group/sidebar ${filtersOpen ? 'flex' : 'hidden'} w-full shrink-0 flex-col border-r border-[rgba(212,175,55,0.25)] bg-[#0E1833] p-4 md:flex md:w-[300px]`}>
      <div className="flex items-center justify-between pb-2">
        <span className="text-[11px] font-bold tracking-[0.14em] text-[#7CC0FF] transition-all duration-300">REFINE RESULTS</span>
        <button
          type="button"
          onClick={clearFilters}
          className="cursor-pointer border-none bg-transparent text-[11.5px] font-medium text-[#9CC6FF]/85 transition-all duration-200 hover:text-[#f5d67b] hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.7)]"
        >
          clear all
        </button>
      </div>

      <div className="pretty-scroll min-h-0 max-h-[50vh] flex-1 overflow-x-hidden overflow-y-scroll rounded-[16px] border border-[rgba(124,192,255,0.35)] bg-[#0F1B3A] px-4 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02),0_0_18px_rgba(59,156,255,0.12)] md:max-h-none">
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
        <button className="group relative flex w-full cursor-pointer items-center gap-2.5 overflow-hidden rounded-[16px] border border-[rgba(124,192,255,0.35)] bg-[#0F1B3A] px-4 py-2.5 text-left transition-all duration-300 hover:bg-[rgba(212,175,55,0.12)] active:bg-[rgba(212,175,55,0.18)]">
          <span className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_30px_rgba(212,175,55,0.4),0_0_14px_rgba(212,175,55,0.3)] transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100" />
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-[rgba(59,156,255,0.32)] via-[rgba(37,147,252,0.16)] to-[rgba(124,192,255,0.08)] text-[#7CC0FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] ring-1 ring-[rgba(124,192,255,0.35)] transition-all duration-300 group-hover:scale-[1.06] group-hover:from-[rgba(212,175,55,0.45)] group-hover:via-[rgba(212,175,55,0.28)] group-hover:to-[rgba(212,175,55,0.12)] group-hover:ring-[rgba(240,197,101,0.8)] group-hover:text-[#f0c265] group-hover:shadow-[0_0_18px_rgba(212,175,55,0.55),0_0_34px_rgba(212,175,55,0.3),inset_0_1px_0_rgba(255,255,255,0.14)] group-active:scale-[1.06] group-active:from-[rgba(212,175,55,0.45)] group-active:via-[rgba(212,175,55,0.28)] group-active:to-[rgba(212,175,55,0.12)] group-active:ring-[rgba(240,197,101,0.8)] group-active:text-[#f0c265] group-active:shadow-[0_0_18px_rgba(212,175,55,0.55),0_0_34px_rgba(212,175,55,0.3),inset_0_1px_0_rgba(255,255,255,0.14)]">
            <Bookmark className="h-4 w-4" />
          </span>
          <span className="relative text-[13.5px] font-semibold text-[#9CC6FF] transition-colors duration-300 group-hover:text-[#f0c265] group-active:text-[#f0c265]">Save Search</span>
          <ChevronRight className="relative ml-auto h-3.5 w-3.5 text-[#7CC0FF] transition-colors duration-200 group-hover:text-[#f0c265] group-active:text-[#f0c265]" />
        </button>
      </div>
    </aside>
  );
};