// SidebarFilters.tsx – Combined sidebar (FiltersSidebar reference design) with golden
// selection/glow effects, responsive light/dark themes. Keeps the app's store wiring:
// visibility (filtersOpen) and Clear All (clearFilters) come from the flight store.
import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useFlightStore } from '../../store/flightStore';
import {
  PlaneTakeoff,
  Clock,
  Route,
  Info,
  Hourglass,
  Building2,
  Plane,
  MapPin,
  Tag,
  ListFilter,
  PlaneLanding,
  ChevronDown,
  Check,
  Sun,
  Moon,
  Sunrise,
  Sunset,
} from 'lucide-react';

/* ── Shared transition curve ──────────────────────────────────────────── */
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/* ── FilterSection (Accordion) ────────────────────────────────────────── */

type FilterSectionProps = {
  icon: ReactNode;
  title: string;
  defaultOpen?: boolean;
  info?: boolean;
  badge?: number;
  children: ReactNode;
};

const FilterSection = ({ icon, title, defaultOpen = false, info, badge, children }: FilterSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const [mounted, setMounted] = useState(defaultOpen);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);
  const innerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const measure = useCallback(() => {
    const el = innerRef.current;
    if (el) setHeight(el.scrollHeight);
  }, []);

  useEffect(() => {
    if (open) measure();
  }, [open, measure, children]);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  const toggle = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (!open) {
      setMounted(true);
      requestAnimationFrame(() => {
        measure();
        setOpen(true);
      });
    } else {
      measure();
      setOpen(false);
      requestAnimationFrame(() => setHeight(0));
      closeTimer.current = window.setTimeout(() => {
        setMounted(false);
        closeTimer.current = null;
      }, 320);
    }
  };

  const borderCls = isLight ? 'border-[#E5E7EB]' : 'border-white/[0.06]';
  const titleCls = isLight ? 'text-[#111827]' : 'text-white';
  const mutedCls = isLight ? 'text-[#9CA3AF]' : 'text-white/60';

  // Icon badge: red core with golden ring/glow when open (both themes)
  const iconBg = `bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_6px_rgba(220,38,38,0.35)] transition-all duration-300 ${
    open
      ? 'ring-2 ring-[#f0c265]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_14px_rgba(240,194,101,0.55)]'
      : ''
  }`;

  const headerBg = open
    ? isLight
      ? 'bg-amber-50/80'
      : 'bg-[rgba(212,175,55,0.06)]'
    : '';

  const hoverHeader = isLight
    ? 'hover:bg-[#F3F4F6]'
    : 'hover:bg-[rgba(255,255,255,0.03)]';

  return (
    <div
      data-open={open}
      className={`sidebar-section group/section relative border-b transition-colors duration-300 ${borderCls} ${headerBg} ${
        !open ? hoverHeader : ''
      }`}
    >
      {/* Left accent bar: Golden when open. */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 h-full w-[3px] rounded-r-full bg-gradient-to-b from-[#f0c265] to-[#d4af37] transition-all duration-300 ${
          open ? 'opacity-100 shadow-[0_0_10px_rgba(240,194,101,0.6)]' : 'opacity-0'
        }`}
      />

      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className="flex w-full items-center gap-3 px-3 py-3 text-left sm:px-4 sm:py-3.5"
      >
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
          {icon}
        </span>
        <span className={`flex-1 truncate text-[13.5px] font-semibold tracking-tight ${titleCls}`}>{title}</span>

        {typeof badge === 'number' && badge > 0 && (
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(220,38,38,0.5)]">
            {badge}
          </span>
        )}

        {info && <Info className={`h-3.5 w-3.5 shrink-0 ${mutedCls}`} />}

        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-300 ${mutedCls} ${
            open ? 'rotate-180 text-[#f0c265]' : ''
          }`}
        />
      </button>

      <div
        className="overflow-hidden transition-[max-height] duration-300"
        style={{
          maxHeight: height !== undefined ? height : 'none',
          visibility: mounted ? 'visible' : 'hidden',
          transitionTimingFunction: EASE,
        }}
      >
        <div ref={innerRef} className="px-3 pb-4 pt-0 sm:px-4">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ── Stops Selector (Exactly like the image) ─────────────────────────── */

type StopsSelectorProps = {
  value: string;
  onChange: (v: string) => void;
};

const StopsSelector = ({ value, onChange }: StopsSelectorProps) => {
  const options = [
    { label: '0', val: 'Non-stop' },
    { label: '1', val: '1 Stop' },
    { label: '2', val: '2+ Stops' },
  ];

  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const active = value === opt.val;
        return (
          <button
            key={opt.val}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.val)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 transition-all duration-200 ${
              active
                ? 'border-[#f0c265]/60 bg-[rgba(212,175,55,0.15)] shadow-[0_0_12px_rgba(240,194,101,0.4)]'
                : isLight
                  ? 'border-[#E5E7EB] bg-white hover:border-[#d4af37]/50 hover:bg-[#F9FAFB]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
            }`}
          >
            {/* Custom checkbox square */}
            <span
              className={`flex h-[14px] w-[14px] items-center justify-center rounded-[3px] border transition-all duration-200 ${
                active
                  ? 'border-blue-500 bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]'
                  : isLight
                    ? 'border-[#D1D5DB] bg-white'
                    : 'border-gray-500 bg-white'
              }`}
            >
              {active && <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />}
            </span>
            <span
              className={`text-[13px] font-medium ${
                active
                  ? 'text-[#111827]'
                  : isLight
                    ? 'text-[#4B5563]'
                    : 'text-white/70'
              }`}
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
    ? 'border-[#f0c265]/60 bg-[rgba(212,175,55,0.15)] text-[#111827] shadow-[0_0_14px_rgba(240,194,101,0.35)]'
    : isLight
      ? 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#d4af37]/50 hover:bg-[#F9FAFB] hover:text-[#111827]'
      : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06] hover:text-white';

  const iconCls = selected ? 'text-[#f0c265]' : isLight ? 'text-[#9CA3AF]' : 'text-white/50';

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border py-3 text-center transition-all duration-200 ${btnCls}`}
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

  // Golden glow for checked state
  const checkboxCls = checked
    ? 'border-[#f0c265] bg-[#d4af37] text-[#0E1833] shadow-[0_0_0_3px_rgba(240,194,101,0.2),0_2px_6px_rgba(240,194,101,0.45)] scale-105'
    : isLight
      ? 'border-[#D1D5DB] bg-white group-hover/row:border-[#d4af37]/60 group-hover/row:bg-[#FDFBF7]'
      : 'border-white/25 bg-white/[0.04] group-hover/row:border-[#f0c265]/70 group-hover/row:bg-white/[0.06]';

  const labelCls = checked
    ? isLight ? 'text-[#111827] font-semibold' : 'text-white font-semibold'
    : isLight
      ? 'text-[#4B5563]'
      : 'text-white/80';

  const rowCls = checked
    ? isLight
      ? 'bg-amber-50/80 border-[#d4af37]/50 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.12)]'
      : 'bg-[rgba(212,175,55,0.10)] border-[rgba(212,175,55,0.35)] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.08)]'
    : isLight
      ? 'border-transparent hover:bg-[#F9FAFB]'
      : 'border-transparent hover:bg-white/[0.04]';

  return (
    <label
      className={`group/row relative flex cursor-pointer items-center justify-between gap-2 rounded-[8px] border px-2.5 py-2 transition-all duration-200 ${rowCls}`}
      style={{ transitionTimingFunction: EASE }}
    >
      {checked && (
        <span className="absolute left-0 top-1/2 h-4 -translate-y-1/2 w-[2px] rounded-r bg-[#f0c265] shadow-[0_0_6px_rgba(240,194,101,0.7)]" />
      )}

      <span className="flex min-w-0 items-center gap-2.5">
        <span
          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-all duration-200 ${checkboxCls}`}
        >
          {checked && <Check className="h-3 w-3" strokeWidth={3.5} />}
        </span>
        <span className={`truncate text-[13px] font-medium ${labelCls}`}>{label}</span>
      </span>

      {sublabel && (
        <span
          className={`shrink-0 text-[12px] font-semibold tabular-nums ${
            checked
              ? isLight ? 'text-[#b8962e]' : 'text-[#f0c265]'
              : isLight ? 'text-[#9CA3AF]' : 'text-white/55'
          }`}
          style={{ transitionTimingFunction: EASE }}
        >
          {sublabel}
        </span>
      )}
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
    </label>
  );
};

/* ── RangeSlider (Now with Golden Glow) ───────────────────────────────── */

type RangeSliderProps = {
  fromPct?: number;
  toPct?: number;
  label: string;
};

const RangeSliderGolden = ({ fromPct = 5, toPct = 55, label }: RangeSliderProps) => {
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

  const trackBg = isLight ? 'bg-[#E5E7EB]' : 'bg-white/10';
  const labelCls = isLight ? 'text-[#6B7280]' : 'text-white/75';
  const thumbBorder = isLight ? 'border-[#111827]' : 'border-[#0E1833]';

  // Golden thumb
  const thumbCls =
    `absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 ${thumbBorder} bg-gradient-to-b from-[#f0c265] to-[#d4af37] shadow-[0_0_0_3px_rgba(240,194,101,0.25),0_2px_6px_rgba(0,0,0,0.4)] outline-none transition-transform duration-200 hover:scale-110 active:cursor-grabbing active:scale-110 focus-visible:ring-2 focus-visible:ring-[#f0c265]/60`;

  return (
    <div>
      <span className={`text-[11.5px] font-medium tracking-wide ${labelCls}`}>{label}</span>
      <div className="mt-3 cursor-pointer px-0.5 py-1">
        <div
          ref={trackRef}
          className={`relative h-1.5 rounded-full ${trackBg} shadow-sm`}
          onPointerDown={onTrackPointerDown}
          onPointerMove={(e) => applyDrag(e.clientX)}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {/* Golden range fill */}
          <div
            className="absolute top-0 h-full rounded-full bg-gradient-to-r from-[#f0c265] to-[#d4af37] shadow-[0_0_10px_rgba(240,194,101,0.45)]"
            style={{ left: `${range.from}%`, width: `${range.to - range.from}%` }}
          />
          <div
            role="slider"
            aria-label="Minimum"
            aria-valuemin={0}
            aria-valuemax={100}
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
            aria-valuemin={0}
            aria-valuemax={100}
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

/* ── PillInput (Flight Merger) ────────────────────────────────────────── */

type PillInputProps = {
  value: string;
  onChange: (v: string) => void;
};

const PillInput = ({ value, onChange }: PillInputProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const inputCls = isLight
    ? 'text-[#111827] placeholder:text-[#9CA3AF]'
    : 'text-white placeholder:text-white/50';
  const boxCls = isLight
    ? 'border-[#d4af37]/40 bg-[#d4af37]/8 focus-within:border-[#f0c265] focus-within:bg-[#d4af37]/12 focus-within:shadow-[0_0_0_3px_rgba(240,194,101,0.15)] hover:border-[#d4af37]/60'
    : 'border-[#d4af37]/40 bg-[#d4af37]/[0.08] focus-within:border-[#f0c265] focus-within:bg-[#d4af37]/[0.12] focus-within:shadow-[0_0_0_3px_rgba(240,194,101,0.18)]';

  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-200 ${boxCls}`}>
      <input
        type="text"
        aria-label="Flight merger flight numbers"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 bg-transparent text-[13px] font-medium tracking-wide outline-none ${inputCls}`}
      />
    </div>
  );
};

/* ═════════════════════════════════════════════════════════════════════════
   SidebarFilters – Main Export (combined SidebarFilters + FiltersSidebar)
   ═════════════════════════════════════════════════════════════════════════ */

export const SidebarFilters = () => {
  const filtersOpen = useFlightStore((s) => s.filtersOpen);
  const clearStoredFilters = useFlightStore((s) => s.clearFilters);
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  /* ── local state for every filter ─────────────────────────────────── */
  const [stops, setStops] = useState('1 Stop');
  const [depTimes, setDepTimes] = useState<string[]>([]);
  const [retTimes, setRetTimes] = useState<string[]>([]);
  const [mergerIds, setMergerIds] = useState('4, 10, 152, 314');

  const toggleTime = (set: React.Dispatch<React.SetStateAction<string[]>>, val: string) =>
    set((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));

  const [providers, setProviders] = useState<Record<string, boolean>>({
    GALILEO: true,
    AMADEUS: false,
    SABRE: false,
  });
  const [airlines, setAirlines] = useState<Record<string, boolean>>({
    Indigo: true,
    'Air India': false,
    Vistara: false,
    'Akasa Air': false,
    SpiceJet: false,
  });
  const [layovers, setLayovers] = useState<{ id: number; name: string; checked: boolean }[]>([
    { id: 0, name: 'Doha (DOH)', checked: true },
    { id: 1, name: 'Doha (DOH)', checked: false },
    { id: 2, name: 'Bishkek (FRU)', checked: false },
  ]);
  const [fareTypes, setFareTypes] = useState<Record<string, boolean>>({
    'Corporate Fares': true,
    Regular: false,
  });
  const [layoverAirports, setLayoverAirports] = useState<Record<string, boolean>>({
    'Terminal 3 (DEL)': false,
  });
  const [onwardAirports, setOnwardAirports] = useState<Record<string, boolean>>({
    'Indira Gandhi Intl (DEL)': false,
  });

  const toggle = (set: React.Dispatch<React.SetStateAction<Record<string, boolean>>>, key: string) =>
    set((prev) => ({ ...prev, [key]: !prev[key] }));

  const [resetKey, setResetKey] = useState(0);

  const clearAll = () => {
    setStops('1 Stop');
    setDepTimes([]);
    setRetTimes([]);
    setMergerIds('4, 10, 152, 314');
    setProviders({ GALILEO: false, AMADEUS: false, SABRE: false });
    setAirlines({ Indigo: false, 'Air India': false, Vistara: false, 'Akasa Air': false, SpiceJet: false });
    setLayovers([
      { id: 0, name: 'Doha (DOH)', checked: false },
      { id: 1, name: 'Doha (DOH)', checked: false },
      { id: 2, name: 'Bishkek (FRU)', checked: false },
    ]);
    setFareTypes({ 'Corporate Fares': false, Regular: false });
    setLayoverAirports({ 'Terminal 3 (DEL)': false });
    setOnwardAirports({ 'Indira Gandhi Intl (DEL)': false });
    setResetKey((k) => k + 1);
    clearStoredFilters();
  };

  // Updated Time Slots matching the image
  const timeSlots = [
    { key: '05:00-12:00', label: '05 AM - 12 PM', icon: 'sunrise' as const },
    { key: '12:00-18:00', label: '12 PM - 06 PM', icon: 'sun' as const },
    { key: '18:00-00:00', label: '06 PM - 12 AM', icon: 'sunset' as const },
    { key: '00:00-05:00', label: '12 AM - 05 AM', icon: 'moon' as const },
  ];

  const countTrue = (obj: Record<string, boolean>) => Object.values(obj).filter(Boolean).length;

  /* ── theme-derived classes ────────────────────────────────────────── */
  const sidebarBg = isLight
    ? 'bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7]'
    : 'bg-gradient-to-b from-[#0E1833] to-[#0A1228]';
  const sidebarBorder = isLight ? 'border-[#E5E7EB]' : 'border-[rgba(212,175,55,0.18)]';
  const headerBorder = isLight ? 'border-[#E5E7EB]' : 'border-white/[0.08]';
  const headerTitle = isLight ? 'text-[#111827]' : 'text-white';
  const headerSub = isLight ? 'text-[#6B7280]' : 'text-white/50';
  const clearBtn = isLight
    ? 'text-[#6B7280] hover:text-[#d4af37] hover:bg-amber-50'
    : 'text-white/70 hover:text-[#f0c265] hover:bg-white/[0.05]';
  const priceInputBorder = isLight
    ? 'border-[#E5E7EB] bg-white hover:border-[#d4af37]/50 hover:bg-[#FDFBF7]'
    : 'border-white/15 bg-white/[0.05]';
  const priceInputText = isLight ? 'text-[#111827]' : 'text-white';
  const priceInputLabel = isLight ? 'text-[#9CA3AF]' : 'text-white/55';
  const priceInputSymbol = isLight ? 'text-[#9CA3AF]' : 'text-[#f0c265]';
  const showMoreCls = isLight
    ? 'text-[#b8962e] hover:text-[#d4af37] hover:underline'
    : 'text-[#f0c265] hover:text-[#ffdf8a]';

  /* ── render ───────────────────────────────────────────────────────── */
  return (
    <aside
      aria-label="Flight filters"
      className={`${filtersOpen ? 'flex' : 'hidden'} h-full w-full shrink-0 flex-col border-r md:w-[240px] lg:w-[260px] md:flex transition-colors duration-300 ${sidebarBg} ${sidebarBorder}`}
    >
      {/* Header */}
      <div
        className={`flex shrink-0 items-center justify-between border-b px-4 py-4 transition-colors duration-300 ${headerBorder}`}
      >
        <div className="flex flex-col">
          <h2 className={`text-[15px] font-bold tracking-tight transition-colors duration-300 ${headerTitle}`}>
            Filters
          </h2>
          <span className={`text-[10.5px] font-medium tracking-wide ${headerSub}`}>
            Refine your search
          </span>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className={`rounded-md px-2 py-1 text-[11.5px] font-semibold transition-all duration-200 ${clearBtn}`}
        >
          Clear All
        </button>
      </div>

      {/* Scrollable sections */}
      <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto">
        <div key={resetKey}>
          <FilterSection
            icon={<PlaneTakeoff className="h-4 w-4" />}
            title="Stops"
            defaultOpen={resetKey === 0}
            badge={stops !== '1 Stop' ? 1 : 0}
          >
            <StopsSelector value={stops} onChange={setStops} />
          </FilterSection>

           <FilterSection
            icon={<Plane className="h-4 w-4" />}
            title="Preferred Airline"
            badge={countTrue(airlines)}
          >
            <div className="flex flex-col gap-0.5">
              {Object.entries(airlines).map(([name, checked]) => (
                <FilterCheckbox
                  key={name}
                  label={name}
                  sublabel="₹5430"
                  checked={checked}
                  onChange={() => toggle(setAirlines, name)}
                />
              ))}
            </div>
            <button
              type="button"
              className={`mt-2.5 text-[12px] font-semibold transition-colors ${showMoreCls}`}
            >
              Show More
            </button>
          </FilterSection>

          <FilterSection icon={<Clock className="h-4 w-4" />} title="Departure Time" badge={depTimes.length}>
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

          <FilterSection icon={<Clock className="h-4 w-4" />} title="Return Time" badge={retTimes.length}>
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
           <FilterSection icon={<Tag className="h-4 w-4" />} title="Price">
            <RangeSliderGolden label="₹8,237 - ₹30,130" />
            <div className="mt-3 flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${priceInputLabel}`}>
                  Min
                </span>
                <div className={`flex items-center rounded-lg border px-2.5 py-1.5 transition-colors duration-300 ${priceInputBorder}`}>
                  <span className={`text-[12px] ${priceInputSymbol}`}>₹</span>
                  <input
                    type="text"
                    aria-label="Minimum price"
                    defaultValue="8,237"
                    className={`ml-1 w-full bg-transparent text-[13px] font-semibold outline-none ${priceInputText}`}
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${priceInputLabel}`}>
                  Max
                </span>
                <div className={`flex items-center rounded-lg border px-2.5 py-1.5 transition-colors duration-300 ${priceInputBorder}`}>
                  <span className={`text-[12px] ${priceInputSymbol}`}>₹</span>
                  <input
                    type="text"
                    aria-label="Maximum price"
                    defaultValue="30,130"
                    className={`ml-1 w-full bg-transparent text-[13px] font-semibold outline-none ${priceInputText}`}
                  />
                </div>
              </div>
            </div>
          </FilterSection>

          <FilterSection icon={<Clock className="h-4 w-4" />} title="Departure Duration">
            <RangeSliderGolden label="0hr - 1hr 45min" />
          </FilterSection>

          <FilterSection icon={<Clock className="h-4 w-4" />} title="Return Duration">
            <RangeSliderGolden label="0hr - 1hr 45min" />
          </FilterSection>

         

          <FilterSection icon={<Route className="h-4 w-4" />} title="Flight Merger" info>
            <PillInput value={mergerIds} onChange={setMergerIds} />
          </FilterSection>

          <FilterSection icon={<Hourglass className="h-4 w-4" />} title="Layover Duration">
            <RangeSliderGolden label="0hr - 1hr 45min" />
          </FilterSection>

          <FilterSection
            icon={<Building2 className="h-4 w-4" />}
            title="Provider"
            badge={countTrue(providers)}
          >
            <div className="flex flex-col gap-0.5">
              {Object.entries(providers).map(([name, checked]) => (
                <FilterCheckbox
                  key={name}
                  label={name}
                  sublabel="₹20459"
                  checked={checked}
                  onChange={() => toggle(setProviders, name)}
                />
              ))}
            </div>
          </FilterSection>

          
          <FilterSection
            icon={<MapPin className="h-4 w-4" />}
            title="Layover"
            badge={layovers.filter((l) => l.checked).length}
          >
            <div className="flex flex-col gap-0.5">
              {layovers.map((item) => (
                <FilterCheckbox
                  key={item.id}
                  label={item.name}
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

          <FilterSection
            icon={<Tag className="h-4 w-4" />}
            title="Fare Type"
            badge={countTrue(fareTypes)}
          >
            <div className="flex flex-col gap-0.5">
              {Object.entries(fareTypes).map(([name, checked]) => (
                <FilterCheckbox
                  key={name}
                  label={name}
                  checked={checked}
                  onChange={() => toggle(setFareTypes, name)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection
            icon={<ListFilter className="h-4 w-4" />}
            title="Layover Airport Filter"
            badge={countTrue(layoverAirports)}
          >
            <div className="flex flex-col gap-0.5">
              {Object.entries(layoverAirports).map(([name, checked]) => (
                <FilterCheckbox
                  key={name}
                  label={name}
                  checked={checked}
                  onChange={() => toggle(setLayoverAirports, name)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection
            icon={<PlaneLanding className="h-4 w-4" />}
            title="Onward / Departure Airport"
            badge={countTrue(onwardAirports)}
          >
            <div className="flex flex-col gap-0.5">
              {Object.entries(onwardAirports).map(([name, checked]) => (
                <FilterCheckbox
                  key={name}
                  label={name}
                  checked={checked}
                  onChange={() => toggle(setOnwardAirports, name)}
                />
              ))}
            </div>
          </FilterSection>
        </div>
      </div>
    </aside>
  );
};