// FlightCard.tsx
// Displays a single flight option with airline info, schedule, pricing, and expandable fare tiers.
import { useEffect, useRef, useState } from 'react';
import type { Flight } from '../store/flightStore';
import { useFlightStore } from '../store/flightStore';
import { useThemeStore } from '../store/themeStore';
import { AirlineLogo } from './Logos';
import { Clock, ShoppingBag, PlaneFill, LeafIcon } from './icons';
import { iconProps } from '../lib/iconProps';
import { inr, viaCities, stopsCount, minutesToHm, priceBreakdownOf } from '../lib/format';
import { PriceBreakdownPopover } from './PriceBreakdownPopover';
import { tierAdjustedPrice } from '../lib/fare';
import { openReview } from '../lib/openReview';

/* ---------- Fare option tiers (expandable card details) ---------- */
// Returns the three fare tiers (SAVER, FLEX, PREMIUM) with their prices and feature rows.

type FareRow = { label: string; sub: string; kind: 'text' | 'no' | 'yes'; value?: string };

const fareTiers = (price: number): { name: string; tagline: string; price: number; rows: FareRow[] }[] => [
  {
    name: 'SAVER',
    tagline: 'Great for light packers',
    price: price - 730,
    rows: [
      { label: '₹ Price', sub: 'per person', kind: 'text', value: inr(price - 730) },
      { label: 'Bag check in', sub: 'Baggage', kind: 'text', value: '15 kg' },
      { label: 'Cancellation', sub: 'Refund', kind: 'no' },
      { label: 'Date Change', sub: 'Before departure', kind: 'no' },
      { label: 'Seat', sub: 'Selection', kind: 'text', value: '₹ 300-600' },
      { label: 'Meal', sub: 'On board', kind: 'no' },
    ],
  },
  {
    name: 'FLEX',
    tagline: 'More flexibility included',
    price: price + 370,
    rows: [
      { label: '₹ Price', sub: 'per person', kind: 'text', value: inr(price + 370) },
      { label: 'Bag check in', sub: 'Baggage', kind: 'text', value: '20 kg' },
      { label: 'Cancellation', sub: 'Before 24 hrs', kind: 'text', value: '₹ 1,500' },
      { label: 'Cancellation', sub: 'After 24 hrs', kind: 'text', value: '₹ 750' },
      { label: 'Date Change', sub: 'Before departure', kind: 'text', value: '₹ 1,000' },
      { label: 'Seat', sub: 'Selection', kind: 'yes', value: 'Included' },
      { label: 'Meal', sub: 'On board', kind: 'yes', value: 'Included' },
    ],
  },
  {
    name: 'PREMIUM',
    tagline: 'Maximum flexibility',
    price: price + 2370,
    rows: [
      { label: '₹ Price', sub: 'per person', kind: 'text', value: inr(price + 2370) },
      { label: 'Bag check in', sub: 'Baggage', kind: 'text', value: '25 kg' },
      { label: 'Cancellation', sub: 'Before 24 hrs', kind: 'yes', value: 'Free' },
      { label: 'Cancellation', sub: 'After 24 hrs', kind: 'yes', value: 'Free' },
      { label: 'Date Change', sub: 'Before departure', kind: 'yes', value: 'Free' },
      { label: 'Seat', sub: 'Selection', kind: 'yes', value: 'Included' },
      { label: 'Meal', sub: 'On board', kind: 'yes', value: 'Included' },
    ],
  },
];

// Displays a single fare tier card with its name, tagline, price rows, and a select button.
const FareTierCard = ({
  tier,
  tierId,
  selected = false,
  onSelect,
}: {
  tier: ReturnType<typeof fareTiers>[number];
  tierId: string;
  selected?: boolean;
  onSelect?: () => void;
}) => (
  <div
    className={`fare-tier-card flex min-w-0 flex-1 flex-col rounded-[12px] border bg-[#0d1b2a] p-3 transition-all duration-300 ${selected ? 'border-[#d4af37] shadow-[0_0_18px_rgba(212,175,55,0.4),0_0_40px_rgba(212,175,55,0.15)]' : 'border-[#29466e] hover:border-[#d4af37]/50'}`}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="fare-tier-name text-[13px] font-bold tracking-wide text-white transition-colors duration-300">{tier.name}</div>
        <div className="fare-tier-tagline mt-0.5 text-[10.5px] leading-tight text-[#9baec7] transition-colors duration-300">{tier.tagline}</div>
      </div>
      <button
        onClick={onSelect}
        className={`fare-tier-submit cursor-pointer rounded-[7px] border px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide transition-all duration-200 ${selected ? 'border-[#d4af37] bg-[#d4af37] text-[#0d1b2a] shadow-[0_0_12px_rgba(212,175,55,0.6)]' : 'border-[#315073] bg-transparent text-[#7CC0FF] hover:border-[#d4af37]/70 hover:text-[#f0c265]'}`}
      >
        {selected ? 'Selected' : 'Select'}
      </button>
    </div>
    <div className="mt-2.5 space-y-1.5">
      {tier.rows.map((row) =>
        row.label === '₹ Price' ? (
          <PriceBreakdownPopover
            key={`${row.label}:${row.sub}`}
            id={tierId}
            breakdown={priceBreakdownOf(tier.price)}
            className="fare-tier-row flex w-full cursor-pointer items-center justify-between gap-2 rounded-[8px] border-0 bg-white/[0.03] px-2.5 py-1.5 text-left transition-colors duration-300 hover:bg-white/[0.08]"
          >
            <span className="min-w-0">
              <span className="fare-tier-row-label block text-[11px] font-semibold text-white transition-colors duration-300">{row.label}</span>
              <span className="fare-tier-row-sub block text-[9.5px] text-[#7e93b3] transition-colors duration-300">{row.sub}</span>
            </span>
            <span className="fare-tier-row-value shrink-0 text-[11.5px] font-bold text-white transition-colors duration-300">{row.value}</span>
          </PriceBreakdownPopover>
        ) : (
          <div key={`${row.label}:${row.sub}`} className="fare-tier-row flex items-center justify-between gap-2 rounded-[8px] bg-white/[0.03] px-2.5 py-1.5 transition-colors duration-300">
            <div className="min-w-0">
              <div className="fare-tier-row-label text-[11px] font-semibold text-white transition-colors duration-300">{row.label}</div>
              <div className="fare-tier-row-sub text-[9.5px] text-[#7e93b3] transition-colors duration-300">{row.sub}</div>
            </div>
            {row.kind === 'no' ? (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ef4444]/20 text-[9px] font-bold text-[#ef4444]">
                ✕
              </span>
            ) : row.kind === 'yes' ? (
              <span className="flex shrink-0 items-center gap-1 text-[10.5px] font-bold text-[#22c55e]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22c55e]/20 text-[9px]">✓</span>
                {row.value}
              </span>
            ) : (
              <span className="fare-tier-row-value shrink-0 text-[11.5px] font-bold text-white transition-colors duration-300">{row.value}</span>
            )}
          </div>
        )
      )}
    </div>
  </div>
);


// Small button used to select or view a flight; shows a checkmark when selected.
const SelectButton = ({ selected, onSelect, isLight }: { selected: boolean; onSelect?: () => void; isLight?: boolean }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onSelect?.();
    }}
    className={`flex h-[20px] w-full cursor-pointer items-center justify-center gap-1 rounded-[6px] text-[11px] font-bold text-white transition-all duration-300 ${isLight ? 'bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)] active:bg-[#1D4ED8]' : selected ? 'bg-[#d4af37] shadow-[0_0_16px_rgba(212,175,55,0.5),0_0_30px_rgba(212,175,55,0.25)] hover:bg-[#f0c265] hover:shadow-[0_0_20px_rgba(212,175,55,0.7),0_0_40px_rgba(212,175,55,0.35)]' : 'bg-[#3b82f6] shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:bg-[#d4af37] hover:shadow-[0_0_16px_rgba(212,175,55,0.5),0_0_35px_rgba(212,175,55,0.25)] active:bg-[#d4af37] active:shadow-[0_0_22px_rgba(212,175,55,0.65),0_0_45px_rgba(212,175,55,0.35)]'}`}
  >
    <span>{selected ? 'Selected' : 'View'}</span>
    {selected ? (
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ) : (
      <svg {...iconProps('h-3 w-3')}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
    )}
  </button>
);

// Left side of the compact card: airline logo, stops info, departure/arrival times, and a flight timeline.
const CompactFlightLeft = ({
  f,
  fromLabel,
  toLabel,
  isLight,
}: {
  f: Flight;
  fromLabel: string;
  toLabel: string;
  isLight?: boolean;
}) => {
  const stopN = stopsCount(f.stops);
  const viaList = viaCities(f.via);
  const planeCount = Math.max(stopN, viaList.length);
  const depCode = fromLabel.split(' ')[0];
  const depTerm = fromLabel.split(' ').slice(1).join(' ') || 'Terminal 1';
  const arrCode = toLabel.split(' ')[0];
  const arrTerm = toLabel.split(' ').slice(1).join(' ') || 'Terminal 1';
  return (
    <div className="min-w-0 flex-1 pr-2 pb-1 lg:pb-0">
      {/* Left details + schedule side by side */}
      <div className="mt-0.5 flex items-start justify-between gap-2">
        <div className="flex shrink-0 flex-col items-start">
          <AirlineLogo airline={f.airline} size="sm" />
          <span className={`mt-0.5 whitespace-nowrap text-[11px] font-bold leading-none tracking-wide transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.airline}</span>
          <span className={`mt-0.5 whitespace-nowrap text-[9px] font-semibold leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9eafc7]'}`}>{f.code}</span>
        </div>

        {/* Schedule row: departure — timeline — arrival */}
        <div className="flex min-w-0 flex-1 items-center justify-end">
          <div className="w-[64px] shrink-0 text-right">
            <div className={`whitespace-nowrap text-[13px] font-bold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.departure.time}</div>
            <div className={`mt-0.5 text-[10px] font-semibold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{depCode}</div>
            <div className={`mt-0.5 text-[9px] leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#a0a8b8]'}`}>{depTerm}</div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center">
            <div className="relative mx-2 h-6 w-full max-w-[260px] shrink-0">
              <div className={`absolute inset-x-0 top-[9px] border-t border-dotted transition-colors duration-300 ${isLight ? 'border-[#D1D5DB]' : 'border-[#8295ad]'}`} />
              {f.via ? (
                Array.from({ length: planeCount }, (_, i) => (
                  <div
                    key={`p-${i}`}
                    className={`absolute top-[9px] flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.1)] transition-colors duration-300 ${isLight ? 'bg-[#EFF6FF]' : 'bg-[#e2e8f2]'}`}
                    style={{ left: `${((i + 0.5) / planeCount) * 100}%` }}
                  >
                    <PlaneFill className={`h-3 w-3 rotate-45 transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#2e7bf6]'}`} />
                  </div>
                ))
              ) : (
                <div className="absolute left-1/2 top-[9px] flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#e2e8f2] shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                  <PlaneFill className={`h-3 w-3 rotate-45 transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#2e7bf6]'}`} />
                </div>
              )}
            </div>
          </div>

          <div className="w-[64px] shrink-0 text-left">
            <div className={`whitespace-nowrap text-[13px] font-bold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.arrival.time}</div>
            <div className={`mt-0.5 text-[10px] font-semibold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{arrCode}</div>
            <div className={`mt-0.5 text-[9px] leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#a0a8b8]'}`}>{arrTerm}</div>
          </div>
        </div>
      </div>

      </div>
  );
};

// Right side of the compact card: price, select button, duration, baggage, and CO2 info.
const CompactPriceCol = ({
  f,
  dayDelta,
  selected,
  onSelect,
  isLight,
  scope,
  onToggleExpand,
}: {
  f: Flight;
  dayDelta: number;
  selected: boolean;
  onSelect?: () => void;
  isLight?: boolean;
  scope?: string;
  onToggleExpand?: () => void;
}) => {
  const co2Pct = 8 + ((f.code.charCodeAt(f.code.length - 1) + f.code.length * 7) % 22);
  const co2Level = co2Pct < 15 ? 'low' : co2Pct < 22 ? 'mid' : 'high';
  return (
  <div className={`flex w-full shrink-0 flex-col items-center border-t border-dotted pt-1 lg:w-[180px] lg:border-t-0 lg:border-l lg:pl-3 lg:pt-0 transition-colors duration-300 ${isLight ? 'border-[#E5E7EB]' : 'border-[#73869e]'}`}>
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex shrink-0 flex-col items-start">
        <PriceBreakdownPopover
          id={`${scope ?? 'flight'}:${f.code}`}
          breakdown={priceBreakdownOf(f.price + dayDelta)}
          className={`text-[16px] font-bold leading-tight tracking-tight transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}
        >
          {inr(f.price + dayDelta)}
        </PriceBreakdownPopover>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1">
        <div className="mr-2 w-[62px] shrink-0">
          <SelectButton
            selected={selected}
            onSelect={() => {
              onSelect?.();
              onToggleExpand?.();
            }}
            isLight={isLight}
          />
        </div>
      </div>
    </div>
    <div className="mt-1 flex flex-col items-center gap-0.5">
      <div className={`flex items-center gap-1 whitespace-nowrap text-[9.5px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`}>
        <Clock className={`h-[10px] w-[10px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`} />
        {f.duration}
        <span className={`h-2 w-px transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#315073]'}`} />
        <ShoppingBag className={`h-[10px] w-[10px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`} />
        {f.baggage}
      </div>
      <div className={`flex items-center gap-1 whitespace-nowrap text-[9.5px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`}>
        <LeafIcon />
        -{co2Pct}% CO₂ ({co2Level})
      </div>
    </div>
  </div>
  );
};

// Main flight card component: shows flight details, pricing, and an expandable fare-tier section.
export const FlightCard = ({
  f,
  dayDelta,
  selected,
  onSelect,
  fromLabel,
  toLabel,
  expandable = true,
  index = 0,
  compact = false,
  scope,
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
  scope?: string;
}) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const [expanded, setExpanded] = useState(false);
  const tierScrollRef = useRef<HTMLDivElement>(null);
  const [tierCanLeft, setTierCanLeft] = useState(false);
  const [tierCanRight, setTierCanRight] = useState(true);

  // Check whether the tier list can scroll left or right when expanded.
  useEffect(() => {
    if (!expanded) return;
    const el = tierScrollRef.current;
    if (el) {
      setTierCanLeft(el.scrollLeft > 4);
      setTierCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }
  }, [expanded]);

  // Smoothly scroll the tier list left or right by 220px.
  const scrollTiers = (dir: 'left' | 'right') => {
    const el = tierScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' });
  };
  const selectedOnwardTier = useFlightStore((s) => s.selectedOnwardTier);
  const selectedReturnTier = useFlightStore((s) => s.selectedReturnTier);
  const setSelectedOnwardTier = useFlightStore((s) => s.setSelectedOnwardTier);
  const setSelectedReturnTier = useFlightStore((s) => s.setSelectedReturnTier);
  const setSelectedOnward = useFlightStore((s) => s.setSelectedOnward);
  const setSelectedReturn = useFlightStore((s) => s.setSelectedReturn);
  const datePool = useFlightStore((s) => s.datePool);
  const stripStart = useFlightStore((s) => s.stripStart);
  const stripSel = useFlightStore((s) => s.stripSel);
  const fromCity = useFlightStore((s) => s.fromCity);
  const toCity = useFlightStore((s) => s.toCity);
  const isReturn = scope === 'return';
  const selTier = isReturn ? selectedReturnTier : selectedOnwardTier;
  const setSelTier = isReturn ? setSelectedReturnTier : setSelectedOnwardTier;
  const selFlight = isReturn ? setSelectedReturn : setSelectedOnward;
  // When a fare tier is selected, update the store and open the review screen.
  const pickTier = (tier: ReturnType<typeof fareTiers>[number]) => {
    const s = useFlightStore.getState();
    const adjusted = { ...f, price: tierAdjustedPrice(base, tier.name) };
    setSelTier(tier.name);
    selFlight(f);
    openReview({
      onward: isReturn ? s.selectedOnward : adjusted,
      returnFlight: isReturn ? adjusted : s.selectedReturn,
      date: datePool[stripStart + stripSel]?.label ?? '',
      fromCode: fromCity.split(' - ')[0],
      toCode: toCity.split(' - ')[0],
    });
  };
  const base = f.price + dayDelta;
  const viaList = viaCities(f.via);
  const stopN = stopsCount(f.stops);
  const layoverMin = 30 + ((f.code.charCodeAt(0) + f.code.length * 13) % 90);
  const planeCount = Math.max(stopsCount(f.stops) + 1, viaList.length + 1);

  return (
  <article
    onClick={onSelect}
    style={{ animationDelay: `${index * 90}ms` }}
    className={`card-flash-in relative flex min-h-[84px] flex-col rounded-[12px] border p-1.5 pb-1.5 pt-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.015)] transition-all duration-300 ${onSelect ? 'cursor-pointer' : ''} ${isLight ? 'bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-[#D1D5DB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]' : 'bg-[#0f172a] border-[#214b7e] hover:border-[#d4af37]/70 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.015),0_0_18px_rgba(212,175,55,0.28),0_0_45px_rgba(212,175,55,0.12)]'} ${selected ? (isLight ? 'border-[#DC2626] shadow-[0_0_0_2px_#DC2626,0_4px_12px_rgba(220,38,38,0.25)]' : 'border-[#d4af37] shadow-[inset_0_1px_0_rgba(255,255,255,0.015),0_0_18px_rgba(212,175,55,0.45),0_0_45px_rgba(212,175,55,0.18)]') : ''}`}
  >
    {/* Badge + selected check (left side) */}
    <div className="absolute left-3 top-1.5 flex items-center gap-1.5">
      <div className={`flex h-[13px] min-w-0 items-center justify-center rounded-full px-1.5 text-[7.5px] font-bold ${f.badgeBg}`}>
        <span className="text-[7.5px] font-bold tracking-[0.2px] text-white">{f.badge}</span>
      </div>
      {f.via && (
        <>
          <span className="flex items-center gap-1 whitespace-nowrap text-[8px] font-semibold leading-none text-[#22c55e]">
            <span className="h-[6px] w-[6px] rounded-full bg-[#22c55e]" />
            Layover {minutesToHm(layoverMin)} at {viaList.join(', ')}
          </span>
          <span className={`h-2.5 w-px shrink-0 transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#315073]'}`} />
          <span className="flex items-center gap-1 whitespace-nowrap text-[8px] font-semibold leading-none text-[#ef4444]">
            <span className="h-[6px] w-[6px] rounded-full bg-[#ef4444]" />
            Hop Flight
          </span>
          <span className={`h-2.5 w-px shrink-0 transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#315073]'}`} />
        </>
      )}
      <span className={`whitespace-nowrap text-[8px] font-semibold leading-none transition-colors duration-300 ${f.via ? (isLight ? 'text-[#6B7280]' : 'text-[#9eafc7]') : 'text-[#22c55e]'}`}>
        {f.via ? `via ${viaList.join(', ')} · ${stopN} ${stopN === 1 ? 'Stop' : 'Stops'}` : 'Non-stop'}
      </span>
      {selected && (
        <span className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-300 ${isLight ? 'bg-[#DC2626] shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.8)]'}`}>
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      )}
    </div>

    {compact ? (
      <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
        <CompactFlightLeft
          f={f}
          fromLabel={fromLabel ?? f.departure.airport}
          toLabel={toLabel ?? f.arrival.airport}
          isLight={isLight}
        />
        <CompactPriceCol
          f={f}
          dayDelta={dayDelta}
          selected={!!selected}
          onSelect={onSelect}
          isLight={isLight}
          scope={scope}
          onToggleExpand={() => setExpanded((x) => !x)}
        />
      </div>
    ) : (
    <>
    <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
    <div className="min-w-0 flex-1 pr-0 pb-1 lg:pr-6">

      {/* Top row: airline block (left) + timeline details (right side) */}
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <div className="flex shrink-0 items-start gap-2">
          <AirlineLogo airline={f.airline} size="sm" />
          <div className="flex flex-col items-start pt-[3px]">
            <span className={`whitespace-nowrap text-[13px] font-bold leading-none tracking-wide transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.airline}</span>
            <span className={`mt-0.5 whitespace-nowrap text-[9.5px] font-semibold leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9eafc7]'}`}>{f.code}</span>
          </div>
        </div>

        {/* Timeline details (right side of airline block) */}
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <div className="flex w-full items-start justify-center">
          <div className="w-[88px] shrink-0 text-right">
            <div className={`whitespace-nowrap text-[14px] font-bold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.departure.time}</div>
            <div className={`mt-0.5 text-[10px] leading-none transition-colors duration-300 ${isLight ? 'text-[#4B5563]' : 'text-[#9baec7]'}`}>{fromLabel ?? f.departure.airport}</div>
          </div>

          <div className="relative mx-2 h-6 min-w-0 flex-1 sm:max-w-[340px]">
            <div className={`absolute inset-x-0 top-1/2 border-t border-dotted transition-colors duration-300 ${isLight ? 'border-[#D1D5DB]' : 'border-[#8295ad]'}`} />
            {f.via ? (
              <>
                {Array.from({ length: planeCount }, (_, i) => (
                  <div
                    key={`p-${i}`}
                    className="absolute top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#fdba74] shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                    style={{ left: `${((i + 0.5) / planeCount) * 100}%` }}
                  >
                    <PlaneFill className={`h-3 w-3 rotate-45 transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#1d3a63]'}`} />
                  </div>
                ))}
                {viaList.map((city, i) => (
                  <div
                    key={`v-${city}`}
                    className={`absolute top-1/2 max-w-[50%] -translate-x-1/2 -translate-y-[18px] truncate px-0.5 text-[9.5px] leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}
                    style={{ left: `${((i + 0.5) / planeCount) * 100}%` }}
                  >
                    {city}
                  </div>
                ))}
              </>
            ) : (
              <div className={`absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.1)] transition-colors duration-300 ${isLight ? 'bg-[#EFF6FF]' : 'bg-[#dbe2ec]'}`}>
                <PlaneFill className={`h-3 w-3 rotate-45 transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#1d3a63]'}`} />
              </div>
            )}
          </div>

          <div className="w-[88px] shrink-0 text-left">
            <div className={`whitespace-nowrap text-[14px] font-bold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.arrival.time}</div>
            <div className={`mt-0.5 text-[10px] leading-none transition-colors duration-300 ${isLight ? 'text-[#4B5563]' : 'text-[#9baec7]'}`}>{toLabel ?? f.arrival.airport}</div>
          </div>
          </div>

          {/* Details below the timeline */}
          <div className={`flex items-center gap-1 whitespace-nowrap text-[10px] transition-colors duration-300 ${isLight ? 'text-[#4B5563]' : 'text-white'}`}>
            <span className="flex items-center gap-1">
              <Clock className={`h-[10px] w-[10px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`} />
              {f.duration}
            </span>
            <span className={`h-2 w-px transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#315073]'}`} />
            <span className="whitespace-nowrap">{f.stops}</span>
            <span className={`h-2 w-px transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#315073]'}`} />
            <span className="flex items-center gap-1">
              <ShoppingBag className={`h-[10px] w-[10px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`} />
              {f.baggage}
            </span>
          </div>
        </div>
      </div>

    </div>

    {/* Right section: pricing & action */}
<div className={`flex w-full shrink-0 flex-col items-center border-t border-dotted pt-1 lg:w-[190px] lg:border-t-0 lg:border-l lg:pl-5 lg:pt-0 transition-colors duration-300 ${isLight ? 'border-[#E5E7EB]' : 'border-[#73869e]'}`}>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex shrink-0 flex-col items-start">
          <PriceBreakdownPopover
            id={`${scope ?? 'flight'}:${f.code}`}
            breakdown={priceBreakdownOf(f.price + dayDelta)}
            className={`text-[16px] font-bold leading-tight tracking-tight transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}
          >
            {inr(f.price + dayDelta)}
          </PriceBreakdownPopover>
          <div className={`mt-0.5 flex items-center gap-1.5 text-[11px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`}>
            <Clock className={`h-3 w-3 transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`} />
            {f.duration}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="mr-2 w-[70px] shrink-0">
            <SelectButton
              selected={!!selected}
              onSelect={() => {
                onSelect?.();
                setExpanded((x) => !x);
              }}
              isLight={isLight}
            />
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
    )}

    {/* Expanded: fare option tiers */}
    {expandable && expanded && (
      <div
        className="expanded-divider mt-4 border-t border-dotted border-[#73869e] pt-4 transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {tierCanLeft && (
            <button
              onClick={() => scrollTiers('left')}
              aria-label="Scroll fare options left"
              className={`absolute -left-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-110 ${isLight ? 'border-[#D1D5DB] bg-white text-[#111827]' : 'border-[#315073] bg-[#1d2b40] text-white'}`}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}
          <div
            ref={tierScrollRef}
            onScroll={() => {
              const el = tierScrollRef.current;
              if (!el) return;
              setTierCanLeft(el.scrollLeft > 4);
              setTierCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
            }}
            className="pretty-scroll mt-1 pb-1"
            style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
          >
            <div className="grid min-w-[680px] grid-cols-3 gap-3">
              {fareTiers(base).map((tier) => (
                <FareTierCard
                  key={tier.name}
                  tier={tier}
                  tierId={`${scope ?? 'flight'}:${f.code}:${tier.name.toLowerCase()}`}
                  selected={selTier === tier.name}
                  onSelect={() => pickTier(tier)}
                />
              ))}
            </div>
          </div>
          {tierCanRight && (
            <button
              onClick={() => scrollTiers('right')}
              aria-label="Scroll fare options right"
              className={`absolute -right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-110 ${isLight ? 'border-[#D1D5DB] bg-white text-[#111827]' : 'border-[#315073] bg-[#1d2b40] text-white'}`}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    )}
  </article>
  );
};