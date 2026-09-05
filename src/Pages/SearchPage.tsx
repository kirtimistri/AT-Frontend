import { useState, type CSSProperties, type ReactNode, type SVGProps } from 'react';
import { STRIP_WINDOW, STRIP_DEFAULT_START, STRIP_DEFAULT_SEL, WEEKDAYS, priceFor, priceColor, HOLIDAYS, holidayForDate, useFlightStore, type Flight, type SortKey, type StripDay } from '../store/flightStore';
import { AirlineLogo } from '../components/Logos';
import logo from '../assets/logo.jpeg';

/* ---------- Shared icon components (lucide-style) ---------- */

const iconProps = (className?: string): SVGProps<SVGSVGElement> => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className,
});

const ChevronDown = ({ className }: { className?: string }) => (
  <svg {...iconProps(className)}><path d="m6 9 6 6 6-6" /></svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg {...iconProps(className)}><path d="m9 18 6-6-6-6" /></svg>
);

const ArrowLeftRight = ({ className }: { className?: string }) => (
  <svg {...iconProps(className)}>
    <path d="M8 3 4 7l4 4" />
    <path d="M4 7h16" />
    <path d="m16 21 4-4-4-4" />
    <path d="M20 17H4" />
  </svg>
);

const PlaneFill = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className ?? 'h-4 w-4'} fill="currentColor">
    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" />
  </svg>
);

const PlaneTakeoff = ({ className }: { className?: string }) => (
  <svg {...iconProps(className)}>
    <path d="M2 22h20" />
    <path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z" />
  </svg>
);

const ClockArrowUp = ({ className }: { className?: string }) => (
  <svg {...iconProps(className)}>
    <path d="M13.228 21.925A10 10 0 1 1 21.994 12.338" />
    <path d="M12 6v6l4 2" />
    <path d="m14 21 4-4 4 4" />
    <path d="M18 13v8" />
  </svg>
);

const ClockArrowDown = ({ className }: { className?: string }) => (
  <svg {...iconProps(className)}>
    <path d="M12.338 21.994A10 10 0 1 1 2.006 12.338" />
    <path d="M12 6v6l4 2" />
    <path d="m14 18 4 4 4-4" />
    <path d="M18 14v8" />
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg {...iconProps(className)}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const Timer = ({ className }: { className?: string }) => (
  <svg {...iconProps(className)}>
    <line x1="10" x2="14" y1="2" y2="2" />
    <line x1="12" x2="15" y1="14" y2="11" />
    <circle cx="12" cy="14" r="8" />
  </svg>
);

const ShoppingBag = ({ className }: { className?: string }) => (
  <svg {...iconProps(className)}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const RotateCcw = ({ className }: { className?: string }) => (
  <svg {...iconProps(className)}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const Bookmark = ({ className }: { className?: string }) => (
  <svg {...iconProps(className)}>
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const GitFork = ({ className }: { className?: string }) => (
  <svg {...iconProps(className)}>
    <circle cx="12" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="6" r="3" />
    <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
    <path d="M12 12v3" />
  </svg>
);

const Rupee = ({ className }: { className?: string }) => (
  <span className={`font-bold transition-all duration-300 ${className ?? ''}`}>₹</span>
);



/* ---------- Range slider ---------- */

type SliderSpec = { from: number; to: number; lit?: boolean };

const RangeSlider = ({ from, to, lit = false }: SliderSpec) => {
  const [active, setActive] = useState(false);
  const on = active || lit;

  return (
    <div
      className={`mt-1 cursor-pointer px-0.5 transition-all duration-300 ${on ? 'opacity-100' : ''}`}
      onPointerDown={() => setActive(true)}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      role="slider"
      aria-label="Range slider"
    >
      <div className="relative h-[3px] rounded-full bg-white/10">
        <div
          className={`absolute top-0 h-full rounded-full transition-colors duration-300 ${on ? 'bg-[#d4af37]' : 'bg-[#3B9CFF] group-hover:bg-[#d4af37] group-active:bg-[#d4af37]'}`}
          style={{ left: `${from}%`, width: `${to - from}%` }}
        />
        <div
          className={`absolute top-1/2 h-[14px] w-[14px] -translate-y-1/2 rounded-full border-2 transition-all duration-300 ${on ? 'border-[#f5d67b] bg-[#2a2208]' : 'border-[#7CC0FF] bg-[#121E3C] group-hover:border-[#f5d67b] group-hover:bg-[#2a2208]'}`}
          style={{ left: `calc(${from}% - 7px)` }}
        />
        <div
          className={`absolute top-1/2 h-[14px] w-[14px] -translate-y-1/2 rounded-full border-2 transition-all duration-300 ${on ? 'border-[#f5d67b] bg-[#2a2208]' : 'border-[#7CC0FF] bg-[#121E3C] group-hover:border-[#f5d67b] group-hover:bg-[#2a2208]'}`}
          style={{ left: `calc(${to}% - 7px)` }}
        />
      </div>
    </div>
  );
};

/* ---------- Filter group ---------- */

type FilterGroupProps = {
  icon: ReactNode;
  label: string;
  value: string;
  chevron?: 'right' | 'down';
  slider?: SliderSpec;
  active: boolean;
  onToggle: () => void;
};

const FilterGroup = ({ icon, label, value, chevron, slider, active, onToggle }: FilterGroupProps) => {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={active}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`group relative -mx-4 cursor-pointer select-none border-b border-[rgba(124,192,255,0.16)] px-4 py-2.5 transition-all duration-300 last:border-b-0 ${
        active
          ? 'bg-gradient-to-r from-[rgba(212,175,55,0.38)] via-[rgba(212,175,55,0.24)] to-[rgba(212,175,55,0.14)]'
          : 'hover:bg-gradient-to-r hover:from-[#f0c265] hover:via-[#d4af37] hover:to-[#a8842a]'
      }`}
    >
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br ring-1 transition-all duration-300 ${
              active
                ? 'scale-[1.06] from-[rgba(212,175,55,0.45)] via-[rgba(212,175,55,0.28)] to-[rgba(212,175,55,0.12)] text-[#f0c265] ring-[rgba(240,197,101,0.8)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'
                : 'from-[rgba(59,156,255,0.32)] via-[rgba(37,147,252,0.16)] to-[rgba(124,192,255,0.08)] text-[#7CC0FF] ring-[rgba(124,192,255,0.35)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] group-hover:scale-[1.06] group-hover:from-[#f0c265] group-hover:via-[#d4af37] group-hover:to-[#a8842a] group-hover:text-[#0E1833] group-hover:ring-[#f0c265] group-hover:shadow-[0_0_14px_rgba(212,175,55,0.45),inset_0_1px_0_rgba(255,255,255,0.2)] group-active:scale-[1.06] group-active:from-[rgba(212,175,55,0.45)] group-active:via-[rgba(212,175,55,0.28)] group-active:to-[rgba(212,175,55,0.12)] group-active:text-[#f5d67b] group-active:ring-[rgba(240,197,101,0.8)] group-active:shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'
            }`}
          >
            <span className="flex items-center justify-center transition-all duration-300">
              {icon}
            </span>
          </span>
          <span
            className={`text-[13px] font-semibold transition-colors duration-300 ${
              active ? 'text-[#f5d67b]' : 'text-[#9CC6FF] group-hover:text-[#0E1833] group-active:text-[#f5d67b]'
            }`}
          >
            {label}
          </span>
        </div>
        {chevron === 'down' ? (
          <ChevronDown className={`h-3 w-3 transition-colors duration-300 ${active ? 'text-[#f5d67b]' : 'text-[#7CC0FF] group-hover:text-[#0E1833] group-active:text-[#f5d67b]'}`} />
        ) : chevron === 'right' ? (
          <ChevronRight className={`h-3 w-3 transition-colors duration-300 ${active ? 'text-[#f5d67b]' : 'text-[#7CC0FF] group-hover:text-[#0E1833] group-active:text-[#f5d67b]'}`} />
        ) : null}
      </div>
      <p className={`relative mt-[3px] pl-[42px] text-[11.5px] leading-tight transition-colors duration-300 ${active ? 'text-[rgba(240,194,101,0.95)]' : 'text-[#9CC6FF]/85 group-hover:text-[#2a2208]/90 group-active:text-[rgba(240,194,101,0.95)]'}`}>{value}</p>
      {slider && (
        <div className="relative pl-[42px]" onClick={(e) => e.stopPropagation()}>
          <RangeSlider {...slider} lit={active} />
        </div>
      )}
    </div>
  );
};

/* ---------- Flight card ---------- */

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

/* ---------- Fare option tiers (expandable card details) ---------- */

const airportCodeOf = (airport: string) => airport.split(' ')[0];
const terminalOf = (airport: string) => airport.match(/Terminal (\d+)/)?.[1] ?? '1';

type FareRow = { label: string; sub: string; kind: 'text' | 'no' | 'yes'; value?: string };

const fareTiers = (price: number): { name: string; tagline: string; rows: FareRow[] }[] => [
  {
    name: 'SAVER',
    tagline: 'Great for light packers',
    rows: [
      { label: '₹ Price', sub: 'per person', kind: 'text', value: inr(price - 730) },
      { label: 'Bag check in', sub: 'Baggage', kind: 'text', value: '15 kg' },
      { label: 'Cancellation', sub: 'Refund', kind: 'no' },
      { label: 'Date Change', sub: 'Before departure', kind: 'no' },
      { label: 'Seat', sub: 'Selection', kind: 'text', value: '₹ 300-600' },
    ],
  },
  {
    name: 'FLEX',
    tagline: 'More flexibility included',
    rows: [
      { label: '₹ Price', sub: 'per person', kind: 'text', value: inr(price + 370) },
      { label: 'Bag check in', sub: 'Baggage', kind: 'text', value: '20 kg' },
      { label: 'Cancellation', sub: 'Refund', kind: 'text', value: '₹ 1,500' },
      { label: 'Date Change', sub: 'Before departure', kind: 'text', value: '₹ 1,000' },
      { label: 'Seat', sub: 'Selection', kind: 'yes', value: 'Included' },
    ],
  },
  {
    name: 'PREMIUM',
    tagline: 'Maximum flexibility',
    rows: [
      { label: '₹ Price', sub: 'per person', kind: 'text', value: inr(price + 2370) },
      { label: 'Bag check in', sub: 'Baggage', kind: 'text', value: '25 kg' },
      { label: 'Cancellation', sub: 'Refund', kind: 'yes', value: 'Refund' },
      { label: 'Date Change', sub: 'Before departure', kind: 'yes', value: 'Free' },
      { label: 'Seat', sub: 'Selection', kind: 'yes', value: 'Included' },
    ],
  },
];

const FareTierCard = ({ tier }: { tier: ReturnType<typeof fareTiers>[number] }) => (
  <div className="flex min-w-0 flex-1 flex-col rounded-[12px] border border-[#29466e] bg-[#0d1b2a] p-3">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="text-[13px] font-bold tracking-wide text-white">{tier.name}</div>
        <div className="mt-0.5 text-[10.5px] leading-tight text-[#9baec7]">{tier.tagline}</div>
      </div>
      <button className="cursor-pointer rounded-[7px] border border-[#315073] bg-transparent px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-[#7CC0FF] transition-all duration-200 hover:border-[#d4af37]/70 hover:text-[#f0c265]">
        submit
      </button>
    </div>
    <div className="mt-2.5 space-y-1.5">
      {tier.rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-2 rounded-[8px] bg-white/[0.03] px-2.5 py-1.5">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-white">{row.label}</div>
            <div className="text-[9.5px] text-[#7e93b3]">{row.sub}</div>
          </div>
          {row.kind === 'no' ? (
            <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#ef4444]/20 text-[10px] font-bold text-[#ef4444]">
              ✕
            </span>
          ) : row.kind === 'yes' ? (
            <span className="flex shrink-0 items-center gap-1 text-[10.5px] font-bold text-[#22c55e]">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#22c55e]/20 text-[10px]">✓</span>
              {row.value}
            </span>
          ) : (
            <span className="shrink-0 text-[11.5px] font-bold text-white">{row.value}</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SeatIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 18v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" />
    <path d="M5 18h14v2H5z" />
    <path d="M8 10V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" />
  </svg>
);

const stopsCount = (s: string): number => {
  const m = s.match(/(\d+)\s*Stop/i);
  return m ? parseInt(m[1], 10) : 0;
};

const viaCities = (via?: string): string[] =>
  via ? via.replace(/^via\s*/i, '').split(',').map((c) => c.trim()).filter(Boolean) : [];

const LayoverPanel = ({ f }: { f: Flight }) => {
  const location = f.via ? f.via.replace('via ', '') : airportCodeOf(f.arrival.airport);
  const seatsLeft = 2 + ((f.code.charCodeAt(0) + f.code.length) % 5);
  const rows: { icon: ReactNode; label: string; value: string }[] = [
    { icon: <MapPinIcon />, label: 'Location', value: location },
    { icon: <PlaneTakeoff className="h-3.5 w-3.5" />, label: 'Terminal', value: terminalOf(f.departure.airport) },
    { icon: <Clock className="h-3.5 w-3.5" />, label: 'Time', value: '10m' },
    { icon: <Bookmark className="h-3.5 w-3.5" />, label: 'Fare type', value: 'Economy Saver' },
    { icon: <SeatIcon />, label: 'Seats left', value: `Only ${seatsLeft} seats at this price` },
  ];
  return (
    <div className="flex w-full shrink-0 flex-col rounded-[12px] border border-[#29466e] bg-[#0d1b2a] p-3 xl:w-[210px] xl:shrink-0">
      <div className="flex items-center gap-1.5 text-[12px] font-bold text-white">
        <span className="h-[8px] w-[8px] rounded-full bg-[#22c55e]" />
        {f.via ? 'Layover Flight' : 'Non-stop Flight'}
      </div>
      <div className="mt-2.5 space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start gap-2 rounded-[8px] bg-white/[0.03] px-2.5 py-1.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#7CC0FF]">{r.icon}</span>
            <span className="shrink-0 whitespace-nowrap text-[11px] text-[#9baec7]">{r.label}:</span>
            <span className="min-w-0 flex-1 text-right text-[11px] font-semibold leading-snug text-white">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Itinerary details (per-leg breakdown inside expanded card) ---------- */

const CITY_NAMES: Record<string, string> = {
  BOM: 'Mumbai',
  DEL: 'Delhi',
  PNQ: 'Pune',
  LKO: 'Lucknow',
  BLR: 'Bengaluru',
  HYD: 'Hyderabad',
};

const cityNameOf = (code: string) => CITY_NAMES[code] ?? code;

const twelveHToMins = (t: string): number => {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  const h = (parseInt(m[1], 10) % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0);
  return h * 60 + parseInt(m[2], 10);
};

const minsToTwelveH = (m: number): string => {
  const h24 = ((m % 1440) + 1440) % 1440;
  const h = Math.floor(h24 / 60);
  const min = h24 % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, '0')} ${period}`;
};

const legFlightCode = (f: Flight, i: number): string => {
  if (i === 0) return f.code;
  const m = f.code.match(/^(\D+)\s*(\d+)$/);
  if (!m) return f.code;
  return `${m[1]} ${parseInt(m[2], 10) + 31 + i * 47}`;
};

type ItineraryLeg = {
  code: string;
  depTime: string;
  arrTime: string;
  depCode: string;
  depCity: string;
  depTerm: string;
  arrCode: string;
  arrCity: string;
  arrTerm: string;
  layoverMin?: number;
};

const itineraryLegs = (f: Flight): ItineraryLeg[] => {
  const viaList = viaCities(f.via);
  const n = viaList.length + 1;
  const depMin = twelveHToMins(f.departure.time);
  let arrMin = twelveHToMins(f.arrival.time);
  if (arrMin < depMin) arrMin += 24 * 60; // overnight arrival
  const total = arrMin - depMin;

  // Deterministic per-flight layovers so the breakdown is stable across renders
  const hash = f.code.charCodeAt(0) + f.code.length * 13;
  const layovers = viaList.map((_, i) => 10 + ((hash + i * 17) % 40));
  const flightMins = Math.max(total - layovers.reduce((a, b) => a + b, 0), 20);

  const stops = [airportCodeOf(f.departure.airport), ...viaList, airportCodeOf(f.arrival.airport)];
  const depTerm = terminalOf(f.departure.airport);
  const arrTerm = terminalOf(f.arrival.airport);

  const legs: ItineraryLeg[] = [];
  let t = depMin;
  for (let i = 0; i < n; i++) {
    const legFlight = Math.round((flightMins * (i + 1)) / n) - Math.round((flightMins * i) / n);
    const arr = t + legFlight;
    legs.push({
      code: legFlightCode(f, i),
      depTime: minsToTwelveH(t),
      arrTime: minsToTwelveH(arr),
      depCode: stops[i],
      depCity: cityNameOf(stops[i]),
      depTerm: i === 0 ? `Terminal ${depTerm}` : 'Terminal 1',
      arrCode: stops[i + 1],
      arrCity: cityNameOf(stops[i + 1]),
      arrTerm: i === n - 1 ? `Terminal ${arrTerm}` : 'Terminal 1',
      layoverMin: i < n - 1 ? layovers[i] : undefined,
    });
    t = arr + (layovers[i] ?? 0);
  }
  return legs;
};

const ItineraryDetails = ({ f }: { f: Flight }) => {
  const stripStart = useFlightStore((s) => s.stripStart);
  const stripSel = useFlightStore((s) => s.stripSel);
  const legs = itineraryLegs(f);
  const travelDate = new Date(2026, 8, 9 + stripStart + stripSel);
  const dateLabel = `${travelDate.toLocaleDateString('en-US', { weekday: 'short' })} ${travelDate.getDate()} ${travelDate.toLocaleDateString('en-US', { month: 'short' })}, ${travelDate.getFullYear()}`;

  return (
    <div className="rounded-[12px] border border-[#29466e] bg-[#0d1b2a] p-4">
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF]">
        <PlaneTakeoff className="h-3.5 w-3.5" />
        Flight Details
      </div>
      <div className="mt-3">
        {legs.map((leg, i) => (
          <div key={`${leg.code}-${i}`}>
            {i > 0 && (
              <div className="my-3 flex items-center justify-center gap-1.5 text-[11.5px] font-semibold text-white/80">
                <Timer className="h-4 w-4" />
                {legs[i - 1].layoverMin} min Layover
              </div>
            )}
            <div className="flex items-start gap-3 sm:gap-5">
              {/* Airline + flight no */}
              <div className="flex w-[104px] shrink-0 flex-col sm:w-[120px]">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 scale-[0.78] origin-left">
                    <AirlineLogo airline={f.airline} />
                  </span>
                  <span className="min-w-0 text-[13px] font-bold lowercase leading-tight tracking-wide text-white">{f.airline}</span>
                </div>
                <span className="mt-1 pl-1 whitespace-nowrap text-[11px] text-[#9eafc7]">{leg.code}</span>
              </div>

              {/* Departure → Arrival details */}
              <div className="grid min-w-0 flex-1 grid-cols-2 gap-3 sm:gap-5">
                <div className="min-w-0">
                  <div className="whitespace-nowrap text-[16px] font-bold leading-none text-white">{leg.depTime}</div>
                  <div className="mt-1 text-[11.5px] font-semibold leading-none text-white">{leg.depCode}</div>
                  <div className="mt-0.5 text-[11px] leading-none text-[#9baec7]">{leg.depCity}</div>
                  <div className="mt-0.5 text-[11px] leading-none text-[#9baec7]">{dateLabel}</div>
                  <div className="mt-1.5 text-[11.5px] font-semibold leading-none text-white">{leg.depCode}</div>
                  <div className="mt-0.5 text-[11px] leading-none text-[#9baec7]">{leg.depTerm}</div>
                </div>
                <div className="min-w-0 border-l border-white/10 pl-3 text-right sm:pl-5">
                  <div className="whitespace-nowrap text-[16px] font-bold leading-none text-white">{leg.arrTime}</div>
                  <div className="mt-1 text-[11.5px] font-semibold leading-none text-white">{leg.arrCode}</div>
                  <div className="mt-0.5 text-[11px] leading-none text-[#9baec7]">{leg.arrCity}</div>
                  <div className="mt-0.5 text-[11px] leading-none text-[#9baec7]">{dateLabel}</div>
                  <div className="mt-1.5 text-[11.5px] font-semibold leading-none text-white">{leg.arrCode}</div>
                  <div className="mt-0.5 text-[11px] leading-none text-[#9baec7]">{leg.arrTerm}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Price breakdown (expanded card) ---------- */

const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const SuitcaseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7v13" />
    <path d="M15 7v13" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const PriceBreakdown = ({ base, baggage }: { base: number; baggage: string }) => {
  const rows = [
    { icon: <UserIcon />, label: 'Base fare', sub: '1 × Adult', value: inr(base - 730) },
    { icon: <SettingsIcon />, label: 'Taxes & fees', sub: 'Includes GST', value: inr(730) },
    { icon: <SeatIcon />, label: 'Seat selection', sub: 'Standard seat', value: inr(500) },
    { icon: <SuitcaseIcon />, label: 'Baggage', sub: baggage.replace(/baggage/i, 'check-in'), value: inr(0) },
    { icon: <GlobeIcon />, label: 'Service fee', sub: 'Platform fee', value: inr(100) },
  ];
  const total = base + 600;
  return (
    <div className="flex flex-col rounded-[12px] border border-[#29466e] bg-[#0d1b2a] p-4">
      <div className="text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF]">PRICE BREAKDOWN</div>
      <div className="mt-3 space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-3 rounded-[8px] bg-white/[0.03] px-2.5 py-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[#1b2b47] text-[#7CC0FF]">{r.icon}</span>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-white">{r.label}</div>
                <div className="text-[10px] text-[#7e93b3]">{r.sub}</div>
              </div>
            </div>
            <span className="shrink-0 text-[12px] font-bold text-white">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-dashed border-[#73869e] pt-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-wide text-white">TOTAL</div>
            <div className="text-[9.5px] text-[#7e93b3]">Per person</div>
          </div>
          <div className="text-[18px] font-bold leading-none text-[#3B9CFF]">{inr(total)}</div>
        </div>
      </div>
      <button className="mt-4 flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#2593fc] text-[13px] font-bold text-white shadow-[0_6px_18px_rgba(37,147,252,0.45)] transition-all duration-300 hover:bg-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.7),0_0_45px_rgba(212,175,55,0.4)] active:bg-[#f0c265]">
        Continue
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

const minutesToHm = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const SelectButton = ({ selected, onSelect }: { selected: boolean; onSelect?: () => void }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onSelect?.();
    }}
    className={`flex h-[36px] w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] text-[13.5px] font-bold text-white transition-all duration-300 ${
      selected
        ? 'bg-[#d4af37] shadow-[0_0_16px_rgba(212,175,55,0.5),0_0_30px_rgba(212,175,55,0.25)] hover:bg-[#f0c265] hover:shadow-[0_0_20px_rgba(212,175,55,0.7),0_0_40px_rgba(212,175,55,0.35)]'
        : 'bg-[#3b82f6] shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:bg-[#d4af37] hover:shadow-[0_0_16px_rgba(212,175,55,0.5),0_0_35px_rgba(212,175,55,0.25)] active:bg-[#d4af37] active:shadow-[0_0_22px_rgba(212,175,55,0.65),0_0_45px_rgba(212,175,55,0.35)]'
    }`}
  >
    <span>{selected ? 'Selected' : 'Select'}</span>
    {selected ? (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ) : (
      <svg {...iconProps('h-3.5 w-3.5')}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
    )}
  </button>
);

const CompactFlightLeft = ({
  f,
  fromLabel,
  toLabel,
}: {
  f: Flight;
  fromLabel: string;
  toLabel: string;
}) => {
  const viaList = viaCities(f.via);
  const stopN = stopsCount(f.stops);
  const planeCount = Math.max(stopN + 1, viaList.length + 1);
  const depCode = fromLabel.split(' ')[0];
  const depTerm = fromLabel.split(' ').slice(1).join(' ') || 'Terminal 1';
  const arrCode = toLabel.split(' ')[0];
  const arrTerm = toLabel.split(' ').slice(1).join(' ') || 'Terminal 1';
  const layoverMin = 30 + ((f.code.charCodeAt(0) + f.code.length * 13) % 90);
  const co2Pct = 8 + ((f.code.charCodeAt(f.code.length - 1) + f.code.length * 7) % 22);
  const co2Level = co2Pct < 15 ? 'low' : co2Pct < 22 ? 'mid' : 'high';
  return (
    <div className="min-w-0 flex-1 pr-4 pb-4 lg:pb-0">
      {/* Airline header row */}
      <div className="flex items-center gap-2.5">
        <div className="flex shrink-0 flex-col items-center">
          <AirlineLogo airline={f.airline} />
          <span className="mt-1 whitespace-nowrap text-[11px] text-[#9eafc7]">{f.code}</span>
        </div>
        <span className="min-w-0 text-[13px] font-bold leading-tight tracking-wide text-white">{f.airline}</span>
      </div>

      {/* Schedule row: departure — timeline — arrival (dedicated space so text never overlaps) */}
      <div className="mt-3.5 flex items-center">
        <div className="w-[72px] shrink-0 text-right">
          <div className="whitespace-nowrap text-[16px] font-bold leading-none text-white">{f.departure.time}</div>
          <div className="mt-1 text-[10.5px] font-semibold leading-none text-white">{depCode}</div>
          <div className="mt-0.5 text-[9.5px] leading-none text-[#a0a8b8]">{depTerm}</div>
        </div>

        <div className="relative mx-2 h-12 min-w-0 flex-1">
          <div className="absolute inset-x-0 top-[11px] border-t border-dotted border-[#8295ad]" />
          {f.via ? (
            Array.from({ length: planeCount }, (_, i) => (
              <div
                key={`p-${i}`}
                className="absolute top-[11px] flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#e2e8f2] shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                style={{ left: `${((i + 0.5) / planeCount) * 100}%` }}
              >
                <PlaneFill className="h-3 w-3 rotate-45 text-[#2e7bf6]" />
              </div>
            ))
          ) : (
            <div className="absolute left-1/2 top-[11px] flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#e2e8f2] shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
              <PlaneFill className="h-3 w-3 rotate-45 text-[#2e7bf6]" />
            </div>
          )}
          {f.via && (
            <div className="absolute left-1/2 top-[26px] -translate-x-1/2 whitespace-nowrap text-[9.5px] text-[#9baec7]">
              via {viaList.join(', ')}
            </div>
          )}
        </div>

        <div className="w-[72px] shrink-0 text-left">
          <div className="whitespace-nowrap text-[16px] font-bold leading-none text-white">{f.arrival.time}</div>
          <div className="mt-1 text-[10.5px] font-semibold leading-none text-white">{arrCode}</div>
          <div className="mt-0.5 text-[9.5px] leading-none text-[#a0a8b8]">{arrTerm}</div>
        </div>
      </div>

      {/* Horizontal divider */}
      <div className="mt-3 border-t border-dashed border-[#73869e]" />

      {/* Metadata: two sub-rows */}
      <div className="mt-2.5 text-[11.5px] text-white">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1.5">
            <Clock className="h-[14px] w-[14px] text-[#b6c3d5]" />
            {f.duration}
          </span>
          <span className="h-3 w-px bg-[#315073]" />
          {stopN > 0 ? (
            <span className="flex items-center gap-1.5">
              <span className="h-[8px] w-[8px] rounded-full bg-[#fb923c]" />
              <span className="whitespace-nowrap">{stopN} {stopN === 1 ? 'Stop' : 'Stops'}</span>
            </span>
          ) : (
            <span className="whitespace-nowrap">Non-stop</span>
          )}
          <span className="h-3 w-px bg-[#315073]" />
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="h-[14px] w-[14px] text-[#b6c3d5]" />
            {f.baggage}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          {f.via && (
            <>
              <span className="flex items-center gap-1.5">
                <span className="h-[8px] w-[8px] rounded-full bg-[#22c55e]" />
                <span className="whitespace-nowrap">Layover {minutesToHm(layoverMin)} at {viaList.join(', ')}</span>
              </span>
              <span className="h-3 w-px bg-[#315073]" />
              <span className="flex items-center gap-1.5">
                <span className="h-[8px] w-[8px] rounded-full bg-[#ef4444]" />
                <span className="whitespace-nowrap">Hop Flight</span>
              </span>
              <span className="h-3 w-px bg-[#315073]" />
            </>
          )}
          <span className="flex items-center gap-1.5">
            <LeafIcon />
            <span className="whitespace-nowrap">-{co2Pct}% CO₂ ({co2Level})</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const CompactPriceCol = ({
  f,
  dayDelta,
  selected,
  onSelect,
}: {
  f: Flight;
  dayDelta: number;
  selected: boolean;
  onSelect?: () => void;
}) => (
  <div className="flex w-full shrink-0 flex-col items-center border-t border-dotted border-[#73869e] pt-3 text-center lg:w-[150px] lg:border-t-0 lg:pl-3 lg:pt-0">
    <div className="text-[10.5px] font-semibold tracking-[0.1em] text-[#9baec7]">TRIP FIT</div>
    <div className="mt-0.5 text-[19px] font-bold leading-tight tracking-tight text-white">{inr(f.price + dayDelta)}</div>
    <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#b6c3d5]">
      <Clock className="h-3.5 w-3.5" />
      {f.duration}
    </div>
    <div className="mt-auto w-full">
      <SelectButton selected={selected} onSelect={onSelect} />
    </div>
  </div>
);

const FlightCard = ({
  f,
  dayDelta,
  selected,
  onSelect,
  fromLabel,
  toLabel,
  expandable = true,
  index = 0,
  compact = false,
}: {
  f: Flight;
  dayDelta: number;
  selected?: boolean;
  onSelect?: () => void;
  fromLabel?: string;
  toLabel?: string;
  expandable?: boolean;
  index?: number;
  compact?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const base = f.price + dayDelta;
  const viaList = viaCities(f.via);
  const planeCount = Math.max(stopsCount(f.stops) + 1, viaList.length + 1);
  return (
  <article
    onClick={onSelect}
    style={{ animationDelay: `${index * 90}ms` }}
    className={`card-flash-in relative flex min-h-[168px] flex-col rounded-[12px] border bg-[#0f172a] ${compact ? 'p-3 pb-4 pt-8' : 'p-4 pb-5 pt-8'} shadow-[inset_0_1px_0_rgba(255,255,255,0.015)] transition-all duration-300 ${
      selected
        ? 'border-[#d4af37] shadow-[inset_0_1px_0_rgba(255,255,255,0.015),0_0_18px_rgba(212,175,55,0.45),0_0_45px_rgba(212,175,55,0.18)]'
        : 'border-[#214b7e] hover:border-[#d4af37]/70 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.015),0_0_18px_rgba(212,175,55,0.28),0_0_45px_rgba(212,175,55,0.12)]'
    } ${onSelect ? 'cursor-pointer' : ''}`}
  >
    {/* Badge (solid pill, overlapping top-left edge) */}
    <div className={`absolute left-[15px] top-2 flex h-[20px] min-w-[88px] items-center justify-center rounded-full px-3 ${f.badgeBg}`}>
      <span className="text-[9px] font-bold tracking-[0.2px] text-white">{f.badge}</span>
    </div>

    {/* Top-right: selected check + expand/collapse chevron */}
    <div className="absolute right-4 top-4 flex items-center gap-2">
      {selected && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.8)]">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      )}
      {expandable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((x) => !x);
          }}
          aria-label={expanded ? 'Collapse fare details' : 'Expand fare details'}
          aria-expanded={expanded}
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-[#315073] bg-[#0d1b2a] text-[#7CC0FF] transition-all duration-300 hover:border-[#d4af37]/70 hover:text-[#f0c265]"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-3 w-3 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      )}
    </div>

    {compact ? (
      <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
        <CompactFlightLeft
          f={f}
          fromLabel={fromLabel ?? f.departure.airport}
          toLabel={toLabel ?? f.arrival.airport}
        />
        <CompactPriceCol
          f={f}
          dayDelta={dayDelta}
          selected={!!selected}
          onSelect={onSelect}
        />
      </div>
    ) : (
    <>
    <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
    <div className="min-w-0 flex-1 pr-0 lg:pr-6">

      {/* Top row: logo with code, airline name, metadata inline */}
      <div className="flex items-center gap-3.5">
        <div className="flex shrink-0 flex-col items-center">
          <AirlineLogo airline={f.airline} />
          <span className="mt-1 text-[11px] text-[#9eafc7]">{f.code}</span>
        </div>
        <div className="min-w-0">
          <span className="block text-[15px] font-bold leading-snug tracking-wide text-white">{f.airline}</span>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-white">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Clock className="h-[15px] w-[15px] text-[#b6c3d5]" />
              {f.duration}
            </span>
            <span className="h-3 w-px bg-[#315073]" />
            <span className="whitespace-nowrap">{f.stops}</span>
            <span className="h-3 w-px bg-[#315073]" />
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <ShoppingBag className="h-[15px] w-[15px] text-[#b6c3d5]" />
              {f.baggage}
            </span>
          </div>
        </div>
      </div>

      {/* Times row */}
      <div className="mt-4 flex items-center">
        <div className="w-[92px] shrink-0 text-left sm:w-[120px]">
          <div className="text-[17px] font-bold leading-tight text-white">{f.departure.time}</div>
          <div className="mt-0.5 text-[11.5px] text-[#9baec7]">{fromLabel ?? f.departure.airport}</div>
        </div>

        <div className="relative mx-2 h-10 min-w-[72px] flex-1 sm:min-w-[88px]">
          <div className="absolute inset-x-0 top-1/2 border-t border-dotted border-[#8295ad]" />
          {f.via ? (
            /* Layover: one plane per leg (stops + 1), via city below each plane */
            <>
              {Array.from({ length: planeCount }, (_, i) => (
                <div
                  key={`p-${i}`}
                  className="absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#dbe2ec] shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                  style={{ left: `${((i + 0.5) / planeCount) * 100}%` }}
                >
                  <PlaneFill className="h-3.5 w-3.5 rotate-45 text-[#1d3a63]" />
                </div>
              ))}
              {viaList.map((city, i) => (
                <div
                  key={`v-${city}`}
                  className="absolute top-1/2 max-w-[50%] -translate-x-1/2 translate-y-[20px] truncate px-0.5 text-[10.5px] text-[#9baec7]"
                  style={{ left: `${((i + 0.5) / planeCount) * 100}%` }}
                >
                  via {city}
                </div>
              ))}
            </>
          ) : (
            <div className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#dbe2ec] shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
              <PlaneFill className="h-3.5 w-3.5 rotate-45 text-[#1d3a63]" />
            </div>
          )}
        </div>

        <div className="w-[92px] shrink-0 text-right sm:w-[120px]">
          <div className="text-[17px] font-bold leading-tight text-white">{f.arrival.time}</div>
          <div className="mt-0.5 text-[11.5px] text-[#9baec7]">{toLabel ?? f.arrival.airport}</div>
        </div>
      </div>

    </div>

    {/* Right section: pricing & action */}
    <div className="flex w-full shrink-0 flex-col items-center border-t border-dotted border-[#73869e] pt-4 text-center lg:w-[210px] lg:border-t-0 lg:pl-6 lg:pt-0">
      <div className="text-[10.5px] font-semibold tracking-[0.1em] text-[#9baec7]">TRIP FIT</div>
      <div className="mt-0.5 text-[21px] font-bold leading-tight tracking-tight text-white">{inr(f.price + dayDelta)}</div>
      <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#b6c3d5]">
        <Clock className="h-3.5 w-3.5" />
        {f.duration}
      </div>
      <div className="mt-4 w-full lg:mt-auto">
        <SelectButton selected={!!selected} onSelect={onSelect} />
      </div>
    </div>
    </div>
    </>
    )}

    {/* Expanded: fare option tiers + layover details */}
    {expanded && (
      <div
        className="mt-4 border-t border-dotted border-[#73869e] pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-4 grid grid-cols-1 items-stretch gap-3 xl:grid-cols-2">
          <ItineraryDetails f={f} />
          <PriceBreakdown base={base} baggage={f.baggage} />
        </div>
        <div className="mt-4 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {fareTiers(base).map((tier) => (
            <FareTierCard key={tier.name} tier={tier} />
          ))}
          <LayoverPanel f={f} />
        </div>

      </div>
    )}
  </article>
  );
};

/* ---------- Round-trip columns & summary bar ---------- */

const durationMinutes = (d: string): number => {
  const m = d.match(/(\d+)h\s*(\d+)?m?/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 60 + (m[2] ? parseInt(m[2], 10) : 0);
};

const timeMinutes = (t: string): number => {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/);
  if (!m) return 0;
  const h = (parseInt(m[1], 10) % 12) + (m[3] === 'PM' ? 12 : 0);
  return h * 60 + parseInt(m[2], 10);
};

const sortFlights = (list: Flight[], key: SortKey): Flight[] => {
  const arr = [...list];
  if (key === 'price') arr.sort((a, b) => a.price - b.price);
  else if (key === 'fastest') arr.sort((a, b) => durationMinutes(a.duration) - durationMinutes(b.duration));
  else arr.sort((a, b) => timeMinutes(a.departure.time) - timeMinutes(b.departure.time));
  return arr;
};

const SortTabs = ({ active, onChange }: { active: SortKey; onChange: (k: SortKey) => void }) => (
  <div className="flex items-center gap-1">
    {(['price', 'fastest', 'departure'] as SortKey[]).map((k) => (
      <button
        key={k}
        onClick={() => onChange(k)}
        className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-semibold capitalize transition-colors duration-200 ${
          active === k
            ? 'bg-[#2593fc] text-white shadow-[0_2px_8px_rgba(37,147,252,0.4)]'
            : 'bg-transparent text-[#7CC0FF] hover:bg-[rgba(37,147,252,0.14)]'
        }`}
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

const ResultsColumn = ({ title, flights, dayDelta, selected, onSelect, fromLabel, toLabel, sort, onSort }: ResultsColumnProps) => (
  <section className="min-w-0">
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[15px] font-bold text-white">{title}</span>
      <span className="text-[12px] text-[#9baec7]">{flights.length} Flights Available</span>
    </div>
    <div className="mt-2 flex items-center gap-1 border-b border-white/10 pb-2">
      <SortTabs active={sort} onChange={onSort} />
      <span className="ml-auto text-[11px] text-[#7CC0FF]">Smart</span>
    </div>
    <div className="space-y-5 pt-4">
      {flights.map((f, i) => (
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

type SummaryBarProps = {
  onward: Flight | null;
  ret: Flight | null;
  dayDelta: number;
};

const FlightSummary = ({ label, f }: { label: 'ONWARD' | 'RETURN'; f: Flight | null }) => (
  <div className="flex min-w-0 items-center gap-2.5 px-3 py-2.5 sm:w-auto sm:flex-1 sm:gap-3.5 sm:px-6 sm:py-3">
    <span className="shrink-0 text-[10px] font-bold tracking-[0.12em] text-[#7CC0FF] sm:text-[10.5px]">{label}</span>
    {f ? (
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span className="hidden h-8 w-8 shrink-0 items-center justify-center overflow-hidden sm:flex"><AirlineLogo airline={f.airline} /></span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="truncate text-[11.5px] font-semibold text-white sm:text-[12.5px]">
            {f.airline} <span className="text-[#9baec7]">• {f.code}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#b6c3d5] sm:text-[11px]">
            <span className="min-w-0 truncate">{f.departure.time} → {f.arrival.time}</span>
            <span className="h-2.5 w-px shrink-0 bg-[#315073]" />
            <span className="shrink-0 whitespace-nowrap">{f.duration}</span>
          </div>
        </div>
      </div>
    ) : (
      <span className="truncate text-[11.5px] text-white/40 sm:text-[12.5px]">
        {label === 'ONWARD' ? 'Select an onward flight' : 'Select a return flight'}
      </span>
    )}
  </div>
);

const SummaryBar = ({ onward, ret, dayDelta }: SummaryBarProps) => {
  const total = (onward ? onward.price + dayDelta : 0) + (ret ? ret.price + dayDelta : 0);
  const both = !!onward && !!ret;
  return (
    <div className="group fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(124,192,255,0.25)] bg-[#0F1B3A]/95 shadow-[0_-10px_36px_rgba(0,0,0,0.55)] backdrop-blur transition-all duration-300 hover:border-[#d4af37]/60 hover:shadow-[0_-10px_36px_rgba(0,0,0,0.55),0_0_22px_rgba(212,175,55,0.35),0_0_60px_rgba(212,175,55,0.16)] md:left-[300px]">
    <div className="flex flex-wrap items-stretch">
      <div className="grid w-full grid-cols-2 divide-x divide-white/10 sm:w-auto sm:flex">
        <FlightSummary label="ONWARD" f={onward} />
        <FlightSummary label="RETURN" f={ret} />
      </div>
      <div className="flex w-full shrink-0 items-center justify-between gap-4 border-t border-white/10 px-4 py-2.5 sm:w-auto sm:justify-start sm:gap-5 sm:border-l sm:border-t-0 sm:px-6 sm:py-3">
          <div className="text-right">
            <div className="text-[10px] font-semibold text-[#ff8533] sm:text-[11px]">Flight Details &gt;</div>
            <div className="mt-0.5 text-[18px] font-bold leading-none text-white sm:mt-1 sm:text-[22px]">{inr(total)}</div>
            <div className={`mt-0.5 text-[10px] font-semibold sm:mt-1 sm:text-[11px] ${both ? 'text-[#34d399]' : 'text-white/40'}`}>
              {both ? 'Extra ₹697 Off' : 'Select return to combine fares'}
            </div>
          </div>
          <button className="flex h-9 shrink-0 cursor-pointer items-center rounded-[10px] bg-[#2593fc] px-4 text-[13px] font-bold text-white shadow-[0_6px_18px_rgba(37,147,252,0.45)] transition-all duration-300 hover:bg-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.7),0_0_45px_rgba(212,175,55,0.4)] active:bg-[#f0c265] active:shadow-[0_0_26px_rgba(212,175,55,0.85),0_0_55px_rgba(212,175,55,0.5)] sm:h-[44px] sm:px-8 sm:text-[14.5px]">
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

const stripInr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
type PriceStripProps = {
  dates: StripDay[];
  selected: number;
  onPick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
};

const PriceStrip = ({ dates, selected, onPick, onPrev, onNext, canPrev, canNext }: PriceStripProps) => (
  <div className="flex items-stretch overflow-hidden rounded-[14px] border border-[rgba(124,192,255,0.22)] bg-[#0F1B3A] shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
    {/* Left arrow */}
    <button
      onClick={onPrev}
      disabled={!canPrev}
      aria-label="Previous week"
      className="group relative flex w-[44px] shrink-0 cursor-pointer items-center justify-center border-r border-white/10 bg-transparent text-[#7CC0FF] transition-all duration-300 hover:bg-[rgba(212,175,55,0.16)] disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_28px_rgba(212,175,55,0.5)] transition-opacity duration-300 group-hover:opacity-100" />
      <svg {...iconProps('h-4 w-4 transition-colors duration-300 group-hover:text-[#f0c265]')}><path d="m15 18-6-6 6-6" /></svg>
    </button>

    {/* Date cards */}
    <div className="relative flex min-w-0 flex-1 divide-x divide-white/10 overflow-x-auto">
      {dates.map((d, i) => {
        const isSel = i === selected;
        return (
          <button
            key={d.label}
            onClick={() => onPick(i)}
            aria-pressed={isSel}
            className={`group relative flex min-w-[72px] flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-2.5 transition-colors duration-300 sm:min-w-0 ${isSel ? 'bg-[#121E3C]' : 'bg-transparent hover:bg-[#131c33]'}`}
          >
            <span className={`hidden max-w-full truncate text-[11px] leading-none transition-colors duration-300 sm:block ${isSel ? 'font-semibold text-[#7CC0FF]' : 'text-[#9baec7] group-hover:text-[#e8c86a]'}`}>{d.label}</span>
            <span className={`block max-w-full truncate text-[11px] leading-none transition-colors duration-300 sm:hidden ${isSel ? 'font-semibold text-[#7CC0FF]' : 'text-[#9baec7] group-hover:text-[#e8c86a]'}`}>{d.label.split(', ')[1]}</span>
            <span className={`max-w-full truncate px-0.5 text-[12px] font-bold leading-none transition-colors duration-300 sm:text-[13.5px] ${isSel ? 'text-[#3B9CFF]' : 'text-white group-hover:text-[#d4af37]'}`}>{stripInr(d.price)}</span>
            {/* Golden glow ring for the hovered cell only */}
            <span className="pointer-events-none absolute inset-[2px] rounded-[10px] opacity-0 shadow-[inset_0_0_14px_rgba(212,175,55,0.35),0_0_16px_rgba(212,175,55,0.45)] ring-1 ring-inset ring-[#d4af37]/80 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        );
      })}
      {/* Sliding selection indicator */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 h-[3px] rounded-full bg-[#3B9CFF] shadow-[0_0_10px_rgba(59,156,255,0.75)] transition-[left] duration-300 ease-out"
        style={{ left: `${(selected * 100) / dates.length}%`, width: `${100 / dates.length}%` }}
      />
    </div>

    {/* Right arrow */}
    <button
      onClick={onNext}
      disabled={!canNext}
      aria-label="Next week"
      className="group relative flex w-[44px] shrink-0 cursor-pointer items-center justify-center border-l border-white/10 bg-transparent text-[#7CC0FF] transition-all duration-300 hover:bg-[rgba(212,175,55,0.16)] disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_28px_rgba(212,175,55,0.5)] transition-opacity duration-300 group-hover:opacity-100" />
      <svg {...iconProps('h-4 w-4 transition-colors duration-300 group-hover:text-[#f0c265]')}><path d="m9 18 6-6-6-6" /></svg>
    </button>
  </div>
);

const monthGrid = (year: number, month: number) => {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: ({ day: number } | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1 })),
  ];
  return cells;
};

const monthName = (year: number, month: number) =>
  new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const formatReturn = (year: number, month: number, day: number) =>
  new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

type MonthProps = {
  year: number;
  month: number;
  selected: string | null;
  onPick: (label: string, year: number, month: number, day: number) => void;
};

const MonthGrid = ({ year, month, selected, onPick }: MonthProps) => {
  const today = new Date();
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-2 text-center text-[13px] font-bold text-white">{monthName(year, month)}</div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] font-semibold uppercase tracking-wide text-[#7a8ba3]">
        {WEEKDAYS.map((w) => <span key={w} className="py-0.5">{w}</span>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1">
        {monthGrid(year, month).map((cell, idx) => {
          if (!cell) return <span key={`e-${idx}`} />;
          const d = new Date(year, month, cell.day);
          const past = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const p = priceFor(year, month, cell.day);
          const holiday = holidayForDate(year, month, cell.day);
          const isSel = selected === formatReturn(year, month, cell.day);
          return (
            <button
              key={cell.day}
              disabled={past}
              title={holiday?.name}
              onClick={() => onPick(formatReturn(year, month, cell.day), year, month, cell.day)}
              className={`group relative flex cursor-pointer flex-col items-center rounded-[10px] px-0.5 py-1 transition-all duration-200 ${isSel ? 'bg-[#2593fc] shadow-[0_0_12px_rgba(37,147,252,0.5)]' : past ? 'cursor-default opacity-30 hover:bg-transparent' : 'hover:bg-[#d4af37] hover:text-black hover:shadow-[0_0_14px_rgba(212,175,55,0.65)]'}`}
            >
              {holiday && !isSel && (
                <span className="absolute right-0.5 top-0.5 text-[9px] leading-none">{holiday.emoji}</span>
              )}
              <span className={`text-[12px] font-semibold leading-none transition-colors duration-200 ${isSel ? 'text-white' : past ? '' : 'group-hover:text-black'} ${isSel ? '' : holiday ? 'text-[#fb923c]' : 'text-[#dde6f0]'}`}>{cell.day}</span>
              <span className={`mt-1 text-[8.5px] leading-none transition-colors duration-200 ${isSel ? 'text-white/90' : past ? '' : 'group-hover:text-black'} ${isSel ? '' : holiday ? 'text-[#fb923c]/90' : priceColor[p.level]}`}>{isSel ? 'Selected' : holiday ? holiday.name.includes('Long') ? 'Festival' : 'Holiday' : p.price}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const HolidayStrip = () => (
  <div className="pretty-scroll -mx-1 mb-3 flex items-center gap-2 overflow-x-auto px-1 pb-1">
    {HOLIDAYS.map((h) => (
      <button
        key={h.name}
        className="flex shrink-0 cursor-pointer items-center gap-2.5 rounded-full border border-[rgba(124,192,255,0.3)] bg-[#121E3C] py-1.5 pl-1.5 pr-4 text-left transition-all duration-200 hover:border-[#d4af37]/70 hover:bg-[rgba(212,175,55,0.08)]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[16px]" style={{ background: `${h.accent}22` }}>{h.emoji}</span>
        <span className="min-w-0">
          <span className="block truncate text-[11.5px] font-bold text-white">{h.name}</span>
          <span className="block text-[10px] text-[#8fa3bf]">{h.dates}</span>
        </span>
      </button>
    ))}
    <button className="flex shrink-0 cursor-pointer items-center gap-1 border-none bg-transparent pl-2 text-[11.5px] font-bold text-[#fb923c] transition-colors duration-200 hover:text-[#f0c265]">
      Holiday List <ChevronRight className="h-3 w-3" />
    </button>
  </div>
);

const ReturnCalendar = ({
  monthOffset,
  onShift,
  selected,
  onPick,
  onClose,
}: {
  monthOffset: number;
  onShift: (dir: -1 | 1) => void;
  selected: string | null;
  onPick: (label: string) => void;
  onClose: () => void;
}) => {
  const baseYear = 2026;
  const baseMonth = 8 + monthOffset; // Sep 2026 is index 8
  const year = baseYear + Math.floor(baseMonth / 12);
  const month = ((baseMonth % 12) + 12) % 12;
  const year2 = baseYear + Math.floor((baseMonth + 1) / 12);
  const month2 = ((baseMonth + 1) % 12 + 12) % 12;

  return (
    <div className="pretty-scroll flex max-h-[80dvh] w-[min(780px,94vw)] flex-col overflow-y-auto rounded-[16px] border border-[rgba(124,192,255,0.35)] bg-[#0F1B3A] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.55)] sm:p-4">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onShift(-1)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[rgba(124,192,255,0.4)] text-[#7CC0FF] transition-colors duration-200 hover:border-[#d4af37]/70 hover:text-[#f0c265]"
            aria-label="Previous months"
          >
            <svg {...iconProps('h-3.5 w-3.5')}><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <span className="text-[12px] font-semibold text-[#7CC0FF]">Select return date</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onShift(1)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[rgba(124,192,255,0.4)] text-[#7CC0FF] transition-colors duration-200 hover:border-[#d4af37]/70 hover:text-[#f0c265]"
            aria-label="Next months"
          >
            <svg {...iconProps('h-3.5 w-3.5')}><path d="m9 18 6-6-6-6" /></svg>
          </button>
          <button
            onClick={onClose}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors duration-200 hover:border-white/25 hover:text-white"
            aria-label="Close calendar"
          >
            <svg {...iconProps('h-3.5 w-3.5')}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Holiday / occasion strip */}
      <HolidayStrip />

      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <MonthGrid year={year} month={month} selected={selected} onPick={(label) => onPick(label)} />
        <MonthGrid year={year2} month={month2} selected={selected} onPick={(label) => onPick(label)} />
      </div>

      {/* Price colour legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-2.5 text-[11px] text-[#9baec7] sm:gap-5">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#34d399]" /> Cheapest</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#eab308]" /> Average</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#fb923c]" /> Pricier</span>
      </div>
    </div>
  );
};

/* ---------- Skeleton loading ---------- */

const SkeletonCard = ({ index }: { index: number }) => (    <div
      className="card-shimmer relative flex min-h-[168px] animate-pulse flex-col overflow-hidden rounded-[12px] border border-[#214b7e] bg-[#0f172a] p-4 pt-8 lg:flex-row"
    style={{ '--shimmer-delay': `${index * 180}ms`, animationDelay: `${index * 180}ms` } as CSSProperties}
  >
    {/* Badge placeholder */}
    <div className="absolute left-[22px] top-[15px] h-[24px] w-[104px] rounded-full bg-[#16304f]" />
    {/* Left column */}
    <div className="min-w-0 flex-1 pr-0 lg:pr-6">
      {/* Airline row */}
      <div className="flex items-center gap-3.5">
        <div className="flex flex-col items-center">
          <div className="h-[44px] w-[44px] rounded-full bg-[#16324f]" />
          <div className="mt-1 h-[10px] w-[36px] rounded bg-[#122844]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="h-[13px] w-[80px] rounded bg-[#1c3a5f]" />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="h-[10px] w-[50px] rounded bg-[#122844]" />
            <div className="h-[12px] w-px bg-[#315073]" />
            <div className="h-[10px] w-[46px] rounded bg-[#122844]" />
            <div className="h-[12px] w-px bg-[#315073]" />
            <div className="h-[10px] w-[70px] rounded bg-[#122844]" />
          </div>
        </div>
      </div>
      {/* Times row */}
      <div className="mt-4 flex items-center">
        <div className="w-[92px] sm:w-[120px]">
          <div className="h-[16px] w-[70px] rounded bg-[#1d3f69]" />
          <div className="mt-1.5 h-[10px] w-[88px] rounded bg-[#122844]" />
        </div>
        <div className="relative mx-2 h-10 min-w-[56px] flex-1 sm:min-w-[80px]">
          <div className="absolute inset-x-0 top-1/2 border-t border-dotted border-[#8295ad]/40" />
        </div>
        <div className="w-[92px] text-right sm:w-[120px]">
          <div className="ml-auto h-[16px] w-[70px] rounded bg-[#1d3f69]" />
          <div className="ml-auto mt-1.5 h-[10px] w-[88px] rounded bg-[#122844]" />
        </div>
      </div>
    </div>
    {/* Right column */}
    <div className="flex w-full shrink-0 flex-col items-center border-t border-dotted border-[#73869e] pt-4 lg:w-[210px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
      <div className="mt-1 h-[10px] w-[48px] rounded bg-[#122844]" />
      <div className="mt-2 h-[20px] w-[70px] rounded bg-[#1c3a5f]" />
      <div className="mt-3 h-[10px] w-[56px] rounded bg-[#122844]" />
      <div className="mt-4 h-[36px] w-full rounded-[10px] bg-[#1b4aa0] lg:mt-auto" />
    </div>
  </div>
);

const SearchPage = () => {
  const [swapSpin, setSwapSpin] = useState(0);
  const flights = useFlightStore((s) => s.flights);
  const returnFlights = useFlightStore((s) => s.returnFlights);
  const datePool = useFlightStore((s) => s.datePool);
  const fromCity = useFlightStore((s) => s.fromCity);
  const toCity = useFlightStore((s) => s.toCity);
  const returnOpen = useFlightStore((s) => s.returnOpen);
  const filtersOpen = useFlightStore((s) => s.filtersOpen);
  const monthOffset = useFlightStore((s) => s.monthOffset);
  const returnDate = useFlightStore((s) => s.returnDate);
  const searching = useFlightStore((s) => s.searching);
  const searched = useFlightStore((s) => s.searched);
  const selectedOnward = useFlightStore((s) => s.selectedOnward);
  const selectedReturn = useFlightStore((s) => s.selectedReturn);
  const onwardSort = useFlightStore((s) => s.onwardSort);
  const returnSort = useFlightStore((s) => s.returnSort);
  const stripStart = useFlightStore((s) => s.stripStart);
  const stripSel = useFlightStore((s) => s.stripSel);
  const setReturnOpen = useFlightStore((s) => s.setReturnOpen);
  const setFiltersOpen = useFlightStore((s) => s.setFiltersOpen);
  const setSelectedOnward = useFlightStore((s) => s.setSelectedOnward);
  const setSelectedReturn = useFlightStore((s) => s.setSelectedReturn);
  const setOnwardSort = useFlightStore((s) => s.setOnwardSort);
  const setReturnSort = useFlightStore((s) => s.setReturnSort);
  const setStripSel = useFlightStore((s) => s.setStripSel);
  const shiftMonth = useFlightStore((s) => s.shiftMonth);
  const pickReturnDate = useFlightStore((s) => s.pickReturnDate);
  const shiftStrip = useFlightStore((s) => s.shiftStrip);
  const swapCities = useFlightStore((s) => s.swapCities);
  const doSearch = useFlightStore((s) => s.doSearch);
  const openFilters = useFlightStore((s) => s.openFilters);
  const toggleFilterGroup = useFlightStore((s) => s.toggleFilterGroup);
  const clearFilters = useFlightStore((s) => s.clearFilters);

  const stripDates = datePool.slice(stripStart, stripStart + STRIP_WINDOW);
  const stripDay = datePool[stripStart + stripSel];
  const baseStripDay = datePool[STRIP_DEFAULT_START + STRIP_DEFAULT_SEL];
  const dayDelta = stripDay.price - baseStripDay.price;

  const fromCode = fromCity.split(' - ')[0];
  const toCode = toCity.split(' - ')[0];
  const relabel = (airport: string, code: string) => `${code}${airport.replace(/^[A-Z]{3}/, '')}`;
  const barVisible = searched && !!returnDate && (!!selectedOnward || !!selectedReturn);

  const handleSwap = () => {
    swapCities();
    setSwapSpin((s) => s + 1);
  };

  const handleSearch = () => {
    doSearch();
  };

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-[#0B132B] text-white lg:h-[100dvh] lg:overflow-hidden">
      {/* ---- Header ---- */}
      <header className="sticky top-0 z-30 shrink-0 border-b border-white/10 bg-[#0E1833] px-3 pb-2 pt-2 sm:px-6 sm:pb-4 sm:pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-5">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Akbar Bizvoy Logo" className="h-8 w-8 shrink-0 rounded-full object-cover shadow-[0_0_12px_rgba(225,29,46,0.35)] sm:h-10 sm:w-10" />
              <span className="whitespace-nowrap text-[14px] font-bold tracking-tight sm:text-[17px]">Akbar Bizvoy</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-5">
            <button className="flex cursor-pointer items-center gap-1.5 border-none bg-transparent text-[12.5px] font-medium text-white/85 sm:text-[13.5px]">
              Economy <ChevronDown className="h-3.5 w-3.5 text-white/50" />
            </button>
            <span className="hidden text-[12.5px] text-white/45 md:inline">43 options analyzed</span>
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              aria-label="Toggle filters"
              aria-expanded={filtersOpen}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[rgba(212,175,55,0.35)] text-[#f0c265] transition-colors duration-200 hover:border-[#d4af37]/70 hover:text-[#f5d67b] md:hidden"
            >
              <svg {...iconProps('h-4 w-4')}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B5BFF] text-[12px] font-semibold text-white">
              AS
            </div>
          </div>
        </div>

        {/* ---- Search widget bar ---- */}
        <div className="group relative mt-2 flex flex-wrap items-stretch overflow-hidden rounded-[26px] border border-[rgba(124,192,255,0.22)] bg-[#0F1B3A] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-[#d4af37]/70 hover:shadow-[0_0_18px_rgba(212,175,55,0.3),0_0_50px_rgba(212,175,55,0.14)] sm:mt-3 sm:rounded-l-[16px] sm:rounded-r-[26px]">
          {/* From + To (swap button overlaps the divider) */}
          <div className="relative flex w-full min-w-0 border-b border-white/10 sm:w-auto sm:flex-1 sm:border-b-0">
            <div className="relative flex min-w-0 flex-1 items-center px-3 py-2 sm:px-5 sm:py-4">
              <div className="min-w-0">
                <div className="bar-text text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF] transition-all duration-300">From</div>
                <div className="bar-text-value mt-1 truncate text-[13px] font-bold text-white transition-all duration-300 sm:text-[15px]">{fromCity}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap From and To"
              title="Swap From and To"
              className="swap-glow-hover swap-glow-click absolute left-1/2 top-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[rgba(124,192,255,0.45)] bg-[#0E1833] shadow-[0_3px_10px_rgba(0,0,0,0.45)]"
            >
              <span key={swapSpin} className="spin-swap">
                <ArrowLeftRight className="h-3.5 w-3.5 text-[#7CC0FF] transition-colors duration-300" />
              </span>
            </button>

            <div className="relative flex min-w-0 flex-1 items-center border-l border-white/10 px-3 py-2 sm:px-5 sm:py-4">
              <div className="min-w-0">
                <div className="bar-text text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF] transition-all duration-300">To</div>
                <div className="bar-text-value mt-1 truncate text-[13px] font-bold text-white transition-all duration-300 sm:text-[15px]">{toCity}</div>
              </div>
            </div>
          </div>

          {/* Departure */}
          <div className="flex w-1/2 shrink-0 items-center border-b border-l-0 border-white/10 px-3 py-2 sm:w-[150px] sm:border-b-0 sm:border-l sm:px-5 sm:py-4">
            <div>
              <div className="bar-text text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF] transition-all duration-300">Departure</div>
              <div className="bar-text-value mt-1 text-[13px] font-bold text-white transition-all duration-300 sm:text-[15px]">{stripDay.label}</div>
            </div>
          </div>

          {/* Return */}
          <button
            type="button"
            onClick={() => setReturnOpen(!returnOpen)}
            className="relative flex w-1/2 shrink-0 cursor-pointer items-center border-b border-l border-white/10 px-3 py-2 text-left transition-colors duration-200 hover:bg-[rgba(212,175,55,0.06)] sm:w-[150px] sm:border-b-0 sm:px-5 sm:py-4"
          >
            <div>
              <div className="bar-text text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF] transition-all duration-300">Return</div>
              <div className={`mt-1 truncate text-[13px] font-bold transition-all duration-300 sm:text-[15px] ${returnDate ? 'bar-text-value text-white' : 'bar-text-muted text-white/40'}`}>{returnDate ?? 'Return'}</div>
              <ChevronDown className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
            </div>
          </button>

          {/* Travellers & Class */}
          <div className="flex w-full min-w-0 items-center border-l-0 border-white/10 px-3 py-2 sm:w-auto sm:flex-1 sm:border-l sm:px-5 sm:py-4">
            <div className="min-w-0">
              <div className="bar-text text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF] transition-all duration-300">Travellers & Class</div>
              <div className="bar-text-value mt-1 truncate text-[13px] font-bold text-white transition-all duration-300 sm:text-[15px]">1 Traveller, Economy</div>
            </div>
          </div>

          {/* Search button — blue pill cap, flush with the bar's top/bottom/right edges */}
          <button
            type="button"
            onClick={handleSearch}
            className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-b-[26px] rounded-r-[26px] border-none bg-[#2593fc] px-4 py-2 text-[13px] font-bold tracking-wide text-white shadow-[0_0_28px_rgba(37,147,252,0.4)] transition-all duration-300 group-hover:bg-[#d4af37] group-hover:shadow-[0_0_18px_rgba(212,175,55,0.45),0_0_45px_rgba(212,175,55,0.25)] sm:absolute sm:inset-y-0 sm:right-0 sm:z-20 sm:w-auto sm:justify-start sm:rounded-b-none sm:py-0 sm:pl-10 sm:pr-11 sm:text-[16px]"
          >
            {searching ? (
              <>
                <svg className="h-[18px] w-[18px] animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                  <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <span>Searching</span>
              </>
            ) : (
              <>
                <span>Search</span>
                <ChevronRight className="h-[18px] w-[18px]" />
              </>
            )}
          </button>
        </div>

        {/* Return-date calendar — dropdown floating under the search bar (page stays visible) */}
        {returnOpen && (
          <div className="relative z-50 mt-2 w-full lg:absolute lg:left-1/2 lg:top-full lg:mt-2 lg:w-max lg:max-w-[94vw] lg:-translate-x-1/2">
            <div className="pointer-events-none absolute -top-[9px] left-1/2 hidden h-0 w-0 -translate-x-1/2 border-x-[10px] border-b-[10px] border-x-transparent border-b-[rgba(124,192,255,0.35)] lg:block" />
            <ReturnCalendar
              monthOffset={monthOffset}
              onShift={(dir) => shiftMonth(dir)}
              selected={returnDate}
              onPick={pickReturnDate}
              onClose={() => setReturnOpen(false)}
            />
          </div>
        )}
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-stretch overflow-hidden md:flex-row">
        {/* ---- Sidebar ---- */}
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

        {/* ---- Results ---- */}
        <main className={`pretty-scroll min-w-0 flex-1 overflow-x-hidden overflow-y-scroll p-3 sm:p-6 ${barVisible ? 'pb-[128px] md:pb-[124px]' : ''}`}>
          {!searched ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(124,192,255,0.4)] bg-[#0F1B3A] text-[#7CC0FF]">
                <PlaneTakeoff className="h-7 w-7" />
              </div>
              <p className="mt-5 text-[16px] font-bold text-white">Search flights to see results</p>
              <p className="mt-1.5 max-w-sm text-[13px] text-white/50">
                Enter your route and press the Search button to load available flights for {fromCity} → {toCity}.
              </p>
            </div>
          ) : searching ? (
            <div className="pt-1">
              {/* Date & price strip skeleton */}
              <div className="card-shimmer h-[52px] animate-pulse overflow-hidden rounded-[14px] border border-[rgba(124,192,255,0.22)] bg-[#0F1B3A]" />

              {returnDate ? (
                /* Round trip: two columns of skeleton cards */
                <div className="grid grid-cols-1 items-start gap-6 pt-5 xl:grid-cols-2">
                  {[0, 1].map((col) => (
                    <div key={col}>
                      <div className="flex animate-pulse items-baseline justify-between gap-3">
                        <div className="h-[15px] w-[96px] rounded bg-[#1c3a5f]" />
                        <div className="h-[12px] w-[128px] rounded bg-[#122844]" />
                      </div>
                      <div className="mt-2 flex items-center gap-2 border-b border-white/10 pb-2">
                        {[0, 1, 2].map((p) => (
                          <div key={p} className="h-[24px] w-[58px] animate-pulse rounded-full bg-[#16304f]" />
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
                  flights={sortFlights(flights, onwardSort)}
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
                  flights={sortFlights(returnFlights, returnSort)}
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
                  <FlightCard key={i} f={f} dayDelta={dayDelta} index={i} />
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
