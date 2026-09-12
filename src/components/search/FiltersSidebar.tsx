// FiltersSidebar.tsx – Card-based filter sidebar with blue accent theme.
import { useState, useRef } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useFlightStore } from '../../store/flightStore';
import {
  Check,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  X,
} from 'lucide-react';

/* ── Shared transition curve ──────────────────────────────────────────── */
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/* ── FilterSection (Standalone card, always expanded) ─────────────────── */

type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
};

const FilterSection = ({ title, children }: FilterSectionProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const cardCls = isLight
    ? 'border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
    : 'border-white/[0.08] bg-[#0D1830] shadow-[0_1px_3px_rgba(0,0,0,0.3)]';
  const titleCls = isLight ? 'text-[#111827]' : 'text-white';

  return (
    <section className={`rounded-xl border transition-colors duration-300 ${cardCls}`}>
      <h3 className={`px-3 pt-3 pb-2 text-[13px] font-semibold tracking-tight ${titleCls}`}>
        {title}
      </h3>
      <div className="px-3 pb-3">{children}</div>
    </section>
  );
};

/* ── Stops Selector ───────────────────────────────────────────────────── */

type StopsSelectorProps = {
  value: string;
  onChange: (v: string) => void;
};

const StopsSelector = ({ value, onChange }: StopsSelectorProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const options = [
    { label: '0', val: 'Non-stop' },
    { label: '1', val: '1 Stop' },
    { label: '2', val: '2+ Stops' },
  ];

  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const active = value === opt.val;
        const pillCls = active
          ? isLight
            ? 'border-[#2563EB]/60 bg-[#EFF6FF]'
            : 'border-[#3B82F6]/60 bg-[rgba(59,130,246,0.12)] shadow-[0_0_12px_rgba(59,130,246,0.3)]'
          : isLight
            ? 'border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#D1D5DB] hover:bg-[#F3F4F6]'
            : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]';
        return (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(opt.val)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 transition duration-200 ${pillCls}`}
            style={{ transitionTimingFunction: EASE }}
          >
            {/* Custom checkbox square */}
            <span
              className={`flex h-[14px] w-[14px] items-center justify-center rounded-[3px] border transition duration-200 ${
                active
                  ? 'border-blue-500 bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]'
                  : isLight
                    ? 'border-[#D1D5DB] bg-white'
                    : 'border-white/40 bg-white'
              }`}
            >
              {active && <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />}
            </span>
            <span
              className={`text-[13px] font-medium ${active ? 'text-white' : isLight ? 'text-[#4B5563]' : 'text-white/70'}`}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

/* ── TimeGridButton (with Sun/Moon icons) ────────────────────────────── */

type TimeGridButtonProps = {
  range: string;
  iconType: 'sunrise' | 'sun' | 'sunset' | 'moon';
  selected: boolean;
  onClick: () => void;
};

const TimeGridButton = ({ range, iconType, selected, onClick }: TimeGridButtonProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const icons = {
    sunrise: <Sunrise className="h-4 w-4" />,
    sun: <Sun className="h-4 w-4" />,
    sunset: <Sunset className="h-4 w-4" />,
    moon: <Moon className="h-4 w-4" />,
  };

  const btnCls = selected
    ? isLight
      ? 'border-[#2563EB]/60 bg-[#EFF6FF] text-[#111827] shadow-[0_0_12px_rgba(37,99,235,0.2)]'
      : 'border-[#3B82F6]/60 bg-[rgba(59,130,246,0.12)] text-white shadow-[0_0_12px_rgba(59,130,246,0.25)]'
    : isLight
      ? 'border-[#E5E7EB] bg-[#F9FAFB] text-[#4B5563] hover:border-[#D1D5DB] hover:bg-[#F3F4F6] hover:text-[#111827]'
      : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06] hover:text-white';

  const iconCls = selected ? (isLight ? 'text-[#2563EB]' : 'text-[#60A5FA]') : isLight ? 'text-[#9CA3AF]' : 'text-white/50';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border py-3 text-center transition duration-200 ${btnCls}`}
      style={{ transitionTimingFunction: EASE }}
    >
      <span className={iconCls}>{icons[iconType]}</span>
      <span className="text-[11.5px] font-semibold leading-tight tracking-wide">{range}</span>
    </button>
  );
};

/* ── FilterCheckbox ───────────────────────────────────────────────────── */

type FilterCheckboxProps = {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: () => void;
};

const FilterCheckbox = ({ label, sublabel, checked, onChange }: FilterCheckboxProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Blue glow for checked state
  const checkboxCls = checked
    ? 'border-blue-500 bg-blue-500 text-white shadow-[0_0_0_3px_rgba(59,130,246,0.18),0_2px_6px_rgba(59,130,246,0.4)] scale-105'
    : isLight
      ? 'border-[#D1D5DB] bg-white group-hover/row:border-blue-400'
      : 'border-white/25 bg-white/[0.06] group-hover/row:border-blue-400/70 group-hover/row:bg-white/[0.08]';

  const labelCls = checked
    ? isLight
      ? 'text-[#111827] font-semibold'
      : 'text-white font-semibold'
    : isLight
      ? 'text-[#4B5563]'
      : 'text-white/80';

  const rowCls = checked
    ? isLight
      ? 'bg-blue-50 border-blue-200/70'
      : 'bg-[rgba(59,130,246,0.10)] border-[rgba(59,130,246,0.35)] shadow-[inset_0_0_0_1px_rgba(59,130,246,0.08)]'
    : isLight
      ? 'border-transparent hover:bg-slate-100/70'
      : 'border-transparent hover:bg-white/[0.04]';

  return (
    <label
      className={`group/row relative flex cursor-pointer items-center justify-between gap-2 rounded-[8px] border px-2.5 py-2 transition duration-200 ${rowCls}`}
      style={{ transitionTimingFunction: EASE }}
    >
      {checked && (
        <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.7)]" />
      )}

      <span className="flex min-w-0 items-center gap-2.5">
        <span
          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition duration-200 ${checkboxCls}`}
        >
          {checked && <Check className="h-3 w-3" strokeWidth={3.5} />}
        </span>
        <span className={`truncate text-[13px] font-medium ${labelCls}`}>{label}</span>
      </span>

      {sublabel && (
        <span
          className={`shrink-0 text-[12px] font-semibold tabular-nums ${
            checked ? (isLight ? 'text-[#2563EB]' : 'text-[#60A5FA]') : isLight ? 'text-[#9CA3AF]' : 'text-white/55'
          }`}
        >
          {sublabel}
        </span>
      )}
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
    </label>
  );
};

/* ── RangeSlider (Blue accent) ────────────────────────────────────────── */

type RangeSliderBlueProps = {
  fromPct?: number;
  toPct?: number;
  label: string;
};

const RangeSliderBlue = ({ fromPct = 5, toPct = 55, label }: RangeSliderBlueProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState({ from: fromPct, to: toPct });
  const dragRef = useRef<'from' | 'to' | null>(null);
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const pctFromEvent = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  };

  const applyDrag = (clientX: number) => {
    const which = dragRef.current;
    if (!which) return;
    const pct = pctFromEvent(clientX);
    setRange((r) =>
      which === 'from' ? { ...r, from: Math.min(pct, r.to) } : { ...r, to: Math.max(pct, r.from) },
    );
  };

  const startDrag = (which: 'from' | 'to') => (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dragRef.current = which;
    trackRef.current?.setPointerCapture(e.pointerId);
    applyDrag(e.clientX);
  };

  const onTrackPointerDown = (e: React.PointerEvent) => {
    if (dragRef.current) return;
    const pct = pctFromEvent(e.clientX);
    const which: 'from' | 'to' =
      Math.abs(pct - range.from) <= Math.abs(pct - range.to) ? 'from' : 'to';
    dragRef.current = which;
    trackRef.current?.setPointerCapture(e.pointerId);
    applyDrag(e.clientX);
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  // Blue thumb
  const thumbCls = isLight
    ? 'absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 border-white bg-[#2563EB] shadow-[0_0_0_3px_rgba(37,99,235,0.2),0_2px_6px_rgba(0,0,0,0.25)] outline-none transition-transform duration-200 hover:scale-110 active:cursor-grabbing active:scale-110 focus-visible:ring-2 focus-visible:ring-[#2563EB]/60'
    : 'absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 border-[#0A1228] bg-[#3B82F6] shadow-[0_0_0_3px_rgba(59,130,246,0.25),0_2px_6px_rgba(0,0,0,0.4)] outline-none transition-transform duration-200 hover:scale-110 active:cursor-grabbing active:scale-110 focus-visible:ring-2 focus-visible:ring-[#3B82F6]/60';

  const trackBg = isLight ? 'bg-[#E5E7EB]' : 'bg-white/10';
  const fillCls = isLight
    ? 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6]'
    : 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] shadow-[0_0_10px_rgba(59,130,246,0.45)]';
  const labelCls = isLight ? 'text-[#6B7280]' : 'text-white/75';

  return (
    <div>
      <span className={`text-[11.5px] font-medium tracking-wide ${labelCls}`}>{label}</span>
      <div className="mt-3 cursor-pointer px-0.5 py-1">
        <div
          ref={trackRef}
          className={`relative h-1.5 rounded-full ${trackBg}`}
          onPointerDown={onTrackPointerDown}
          onPointerMove={(e) => applyDrag(e.clientX)}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {/* Blue range fill */}
          <div
            className={`absolute top-0 h-full rounded-full ${fillCls}`}
            style={{ left: `${range.from}%`, width: `${range.to - range.from}%` }}
          />
          <div
            role="slider"
            aria-label="Minimum"
            aria-valuenow={Math.round(range.from)}
            tabIndex={0}
            onPointerDown={startDrag('from')}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const d = e.key === 'ArrowRight' ? 2 : -2;
                setRange((r) => ({ ...r, from: Math.min(Math.max(0, r.from + d), r.to) }));
              }
            }}
            className={thumbCls}
            style={{ left: `calc(${range.from}% - 8px)` }}
          />
          <div
            role="slider"
            aria-label="Maximum"
            aria-valuenow={Math.round(range.to)}
            tabIndex={0}
            onPointerDown={startDrag('to')}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const d = e.key === 'ArrowRight' ? 2 : -2;
                setRange((r) => ({ ...r, to: Math.max(Math.min(100, r.to + d), r.from) }));
              }
            }}
            className={thumbCls}
            style={{ left: `calc(${range.to}% - 8px)` }}
          />
        </div>
      </div>
    </div>
  );
};

/* ── FlightNumberInput (input + GO button) ────────────────────────────── */

const FlightNumberInput = () => {
  const [value, setValue] = useState('');
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const inputCls = isLight
    ? 'text-[#111827] placeholder:text-[#9CA3AF]'
    : 'text-white placeholder:text-white/40';
  const boxCls = isLight
    ? 'border-[#E5E7EB] bg-white focus-within:border-[#2563EB] focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]'
    : 'border-white/15 bg-white/[0.05] focus-within:border-[#3B82F6] focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]';

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className={`flex min-w-0 flex-1 items-center rounded-lg border px-3 py-2 transition duration-200 ${boxCls}`}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 1523, 234"
          className={`w-full min-w-0 flex-1 bg-transparent text-[13px] font-medium tracking-wide outline-none ${inputCls}`}
        />
      </div>
      <button
        type="button"
        className="flex h-[34px] shrink-0 items-center justify-center rounded-lg bg-blue-600 px-3 text-[12px] font-bold tracking-wide text-white shadow-[0_0_10px_rgba(59,130,246,0.45)] transition duration-200 hover:bg-blue-500 active:scale-95"
      >
        GO
      </button>
    </div>
  );
};

/* ── Airline price sublabels ──────────────────────────────────────────── */
const AIRLINE_PRICES: Record<string, string> = {
  IndiGo: '₹18,241',
  'Air India': '₹19,241',
  Vistara: '₹21,301',
  'Akasa Air': '₹24,194',
  SpiceJet: '₹27,824',
};

/* ═════════════════════════════════════════════════════════════════════════
   FiltersSidebar – Main Export
   ═════════════════════════════════════════════════════════════════════════ */

export const FiltersSidebar = () => {
  const filtersOpen = useFlightStore((s) => s.filtersOpen);
  const setFiltersOpen = useFlightStore((s) => s.setFiltersOpen);
  const clearStoredFilters = useFlightStore((s) => s.clearFilters);
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  /* ── local state for every filter ─────────────────────────────────── */
  const [stops, setStops] = useState<string | null>('Non-stop');
  const [depTimes, setDepTimes] = useState<string[]>([]);
  const [retTimes, setRetTimes] = useState<string[]>([]);

  const toggleTime = (set: React.Dispatch<React.SetStateAction<string[]>>, val: string) =>
    set((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));

  const [providers, setProviders] = useState<Record<string, boolean>>({
    'SABRE-VX03B': true,
    AMADEUS: false,
    INDIGO: false,
  });
  const [airlines, setAirlines] = useState<Record<string, boolean>>({
    IndiGo: true,
    'Air India': false,
    Vistara: false,
    'Akasa Air': false,
    SpiceJet: false,
  });
  const [layovers, setLayovers] = useState<{ id: number; name: string; price: string; checked: boolean }[]>([
    { id: 0, name: 'Doha (DXB)', price: '₹12,491', checked: false },
    { id: 1, name: 'Doha (DOH)', price: '₹13,241', checked: false },
    { id: 2, name: 'Singapore (SIN)', price: '₹15,501', checked: false },
  ]);

  const toggle = (set: React.Dispatch<React.SetStateAction<Record<string, boolean>>>, key: string) =>
    set((prev) => ({ ...prev, [key]: !prev[key] }));

  const [resetKey, setResetKey] = useState(0);

  const clearAll = () => {
    setStops(null);
    setDepTimes([]);
    setRetTimes([]);
    setProviders({ 'SABRE-VX03B': false, AMADEUS: false, INDIGO: false });
    setAirlines({ IndiGo: false, 'Air India': false, Vistara: false, 'Akasa Air': false, SpiceJet: false });
    setLayovers([
      { id: 0, name: 'Doha (DXB)', price: '₹12,491', checked: false },
      { id: 1, name: 'Doha (DOH)', price: '₹13,241', checked: false },
      { id: 2, name: 'Singapore (SIN)', price: '₹15,501', checked: false },
    ]);
    setResetKey((k) => k + 1);
    clearStoredFilters();
  };

  // Updated Time Slots matching the design
  const timeSlots = [
    { key: '05:00-12:00', label: '05 AM - 12 PM', icon: 'sunrise' as const },
    { key: '12:00-18:00', label: '12 PM - 06 PM', icon: 'sun' as const },
    { key: '18:00-00:00', label: '06 PM - 12 AM', icon: 'sunset' as const },
    { key: '00:00-05:00', label: '12 AM - 05 AM', icon: 'moon' as const },
  ];

  /* ── theme-derived classes ────────────────────────────────────────── */
  const sidebarBg = isLight
    ? 'bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7]'
    : 'bg-gradient-to-b from-[#0A1228] to-[#081020]';
  const sidebarBorder = isLight ? 'border-[#E5E7EB]' : 'border-white/[0.06]';
  const showMoreCls = isLight
    ? 'text-[#2563EB] hover:text-[#1D4ED8]'
    : 'text-[#3B82F6] hover:text-[#60A5FA]';
  const drawerHeaderBorder = isLight ? 'border-[#E5E7EB]' : 'border-white/[0.08]';
  const drawerTitleCls = isLight ? 'text-[#111827]' : 'text-white';
  const drawerCloseCls = isLight
    ? 'bg-white border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]'
    : 'bg-white/[0.06] border-white/15 text-white/70 hover:bg-white/[0.12] hover:text-white';
  const clearBtnCls = isLight
    ? 'text-[#6B7280] hover:text-[#2563EB] hover:bg-blue-50'
    : 'text-white/70 hover:text-[#60A5FA] hover:bg-white/[0.05]';

  /* ── render ───────────────────────────────────────────────────────── */
  return (
    <>
      {/* Mobile backdrop: closes the drawer on tap. */}
      {filtersOpen && (
        <div
          aria-hidden="true"
          onClick={() => setFiltersOpen(false)}
          className={`fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] md:hidden`}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[86%] max-w-[320px] shrink-0 flex-col border-r transition-[transform,background-color,border-color] duration-300 md:static md:z-auto md:w-[240px] md:max-w-none md:translate-x-0 md:shadow-none lg:w-[260px] ${
          filtersOpen ? 'translate-x-0 shadow-[0_0_40px_rgba(0,0,0,0.5)]' : '-translate-x-full'
        } ${sidebarBg} ${sidebarBorder}`}
        aria-label="Flight filters"
      >
        {/* Mobile-only drawer header with close button */}
        <div className={`flex shrink-0 items-center justify-between border-b px-4 py-3 md:hidden ${drawerHeaderBorder}`}>
          <span className={`text-[14px] font-bold tracking-tight ${drawerTitleCls}`}>Filters</span>
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
            className={`flex h-7 w-7 items-center justify-center rounded-full border transition duration-200 ${drawerCloseCls}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Sticky heading + Clear Filters row (visible at every width) */}
        <div className={`flex shrink-0 items-center justify-between border-b px-3 py-2.5 transition-colors duration-300 ${drawerHeaderBorder}`}>
          <h2 className={`hidden text-[15px] font-bold tracking-tight transition-colors duration-300 md:block ${drawerTitleCls}`}>
            Filters
          </h2>
          <span className={`text-[13px] font-semibold tracking-tight md:hidden ${drawerTitleCls}`}>
            Refine results
          </span>
          <button
            type="button"
            onClick={clearAll}
            className={`rounded-md px-2 py-1 text-[11.5px] font-semibold transition duration-200 ${clearBtnCls}`}
          >
            Clear Filters
          </button>
        </div>

        {/* Scrollable filter cards */}
      <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto">
        <div key={resetKey} className="flex flex-col gap-2.5 p-2.5">
          <FilterSection title="Stops">
            <StopsSelector value={stops ?? ''} onChange={setStops} />
          </FilterSection>

          <FilterSection title="Preferred Airline">
            <div className="flex flex-col gap-0.5">
              {Object.entries(airlines).map(([name, checked]) => (
                <FilterCheckbox
                  key={name}
                  label={name}
                  sublabel={AIRLINE_PRICES[name] ?? '₹5,430'}
                  checked={checked}
                  onChange={() => toggle(setAirlines, name)}
                />
              ))}
            </div>
            <button
              type="button"
              className={`mt-2.5 text-[12px] font-semibold transition-colors ${showMoreCls}`}
            >
              Show More...
            </button>
          </FilterSection>

          <FilterSection title="Departure Time">
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <TimeGridButton
                  key={slot.key}
                  range={slot.label}
                  iconType={slot.icon}
                  selected={depTimes.includes(slot.key)}
                  onClick={() => toggleTime(setDepTimes, slot.key)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Return Time">
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <TimeGridButton
                  key={slot.key}
                  range={slot.label}
                  iconType={slot.icon}
                  selected={retTimes.includes(slot.key)}
                  onClick={() => toggleTime(setRetTimes, slot.key)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Price">
            <RangeSliderBlue fromPct={0} toPct={78} label="INR 257,487.00" />
          </FilterSection>

          <FilterSection title="Flight Number">
            <FlightNumberInput />
          </FilterSection>

          <FilterSection title="Layover Duration">
            <RangeSliderBlue fromPct={0} toPct={45} label="0Hr 00m - 12Hr 00m" />
          </FilterSection>

          <FilterSection title="Provider">
            <div className="flex flex-col gap-0.5">
              {Object.entries(providers).map(([name, checked]) => (
                <FilterCheckbox
                  key={name}
                  label={name}
                  sublabel="₹20,459"
                  checked={checked}
                  onChange={() => toggle(setProviders, name)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Layover">
            <div className="flex flex-col gap-0.5">
              {layovers.map((item) => (
                <FilterCheckbox
                  key={item.id}
                  label={item.name}
                  sublabel={item.price}
                  checked={item.checked}
                  onChange={() =>
                    setLayovers((prev) =>
                      prev.map((l) => (l.id === item.id ? { ...l, checked: !l.checked } : l)),
                    )
                  }
                />
              ))}
            </div>
          </FilterSection>
        </div>
      </div>
      </aside>
    </>
  );
};
