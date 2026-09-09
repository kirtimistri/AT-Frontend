import { useState } from 'react';
import type { Flight } from '../store/flightStore';
import { useThemeStore } from '../store/themeStore';
import { AirlineLogo } from './Logos';
import { Clock, ShoppingBag, PlaneFill, LeafIcon } from './icons';
import { iconProps } from '../lib/iconProps';
import { inr, viaCities, stopsCount, minutesToHm, priceBreakdownOf } from '../lib/format';
import { PriceBreakdownPopover } from './PriceBreakdownPopover';

/* ---------- Fare option tiers (expandable card details) ---------- */

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
    ],
  },
  {
    name: 'FLEX',
    tagline: 'More flexibility included',
    price: price + 370,
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
    price: price + 2370,
    rows: [
      { label: '₹ Price', sub: 'per person', kind: 'text', value: inr(price + 2370) },
      { label: 'Bag check in', sub: 'Baggage', kind: 'text', value: '25 kg' },
      { label: 'Cancellation', sub: 'Refund', kind: 'yes', value: 'Refund' },
      { label: 'Date Change', sub: 'Before departure', kind: 'yes', value: 'Free' },
      { label: 'Seat', sub: 'Selection', kind: 'yes', value: 'Included' },
    ],
  },
];

const FareTierCard = ({ tier, tierId }: { tier: ReturnType<typeof fareTiers>[number]; tierId: string }) => (
  <div className="fare-tier-card flex min-w-0 flex-1 flex-col rounded-[12px] border border-[#29466e] bg-[#0d1b2a] p-3 transition-colors duration-300">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="fare-tier-name text-[13px] font-bold tracking-wide text-white transition-colors duration-300">{tier.name}</div>
        <div className="fare-tier-tagline mt-0.5 text-[10.5px] leading-tight text-[#9baec7] transition-colors duration-300">{tier.tagline}</div>
      </div>
      <button className="fare-tier-submit cursor-pointer rounded-[7px] border border-[#315073] bg-transparent px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-[#7CC0FF] transition-all duration-200 hover:border-[#d4af37]/70 hover:text-[#f0c265]">
        submit
      </button>
    </div>
    <div className="mt-2.5 space-y-1.5">
      {tier.rows.map((row) =>
        row.label === '₹ Price' ? (
          <PriceBreakdownPopover
            key={row.label}
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
          <div key={row.label} className="fare-tier-row flex items-center justify-between gap-2 rounded-[8px] bg-white/[0.03] px-2.5 py-1.5 transition-colors duration-300">
            <div className="min-w-0">
              <div className="fare-tier-row-label text-[11px] font-semibold text-white transition-colors duration-300">{row.label}</div>
              <div className="fare-tier-row-sub text-[9.5px] text-[#7e93b3] transition-colors duration-300">{row.sub}</div>
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
              <span className="fare-tier-row-value shrink-0 text-[11.5px] font-bold text-white transition-colors duration-300">{row.value}</span>
            )}
          </div>
        )
      )}
    </div>
  </div>
);


const SelectButton = ({ selected, onSelect, isLight }: { selected: boolean; onSelect?: () => void; isLight?: boolean }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onSelect?.();
    }}
    className={`flex h-[24px] w-full cursor-pointer items-center justify-center gap-1 rounded-[6px] text-[11px] font-bold text-white transition-all duration-300 ${isLight ? 'bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)] active:bg-[#1D4ED8]' : selected ? 'bg-[#d4af37] shadow-[0_0_16px_rgba(212,175,55,0.5),0_0_30px_rgba(212,175,55,0.25)] hover:bg-[#f0c265] hover:shadow-[0_0_20px_rgba(212,175,55,0.7),0_0_40px_rgba(212,175,55,0.35)]' : 'bg-[#3b82f6] shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:bg-[#d4af37] hover:shadow-[0_0_16px_rgba(212,175,55,0.5),0_0_35px_rgba(212,175,55,0.25)] active:bg-[#d4af37] active:shadow-[0_0_22px_rgba(212,175,55,0.65),0_0_45px_rgba(212,175,55,0.35)]'}`}
  >
    <span>{selected ? 'Selected' : 'Select'}</span>
    {selected ? (
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ) : (
      <svg {...iconProps('h-3 w-3')}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
    )}
  </button>
);

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
  const layoverMin = 30 + ((f.code.charCodeAt(0) + f.code.length * 13) % 90);
  const co2Pct = 8 + ((f.code.charCodeAt(f.code.length - 1) + f.code.length * 7) % 22);
  const co2Level = co2Pct < 15 ? 'low' : co2Pct < 22 ? 'mid' : 'high';
  return (
    <div className="min-w-0 flex-1 pr-2 pb-1 lg:pb-0">
      {/* Left details + schedule side by side */}
      <div className="mt-0.5 flex items-start justify-between gap-2">
        <div className="flex shrink-0 flex-col items-start">
          <span className={`mb-0.5 whitespace-nowrap text-[8.5px] font-semibold leading-none transition-colors duration-300 ${f.via ? (isLight ? 'text-[#6B7280]' : 'text-[#9eafc7]') : 'text-[#22c55e]'}`}>
            {f.via ? `via ${viaList.join(', ')} · ${stopN} ${stopN === 1 ? 'Stop' : 'Stops'}` : 'Non-stop'}
          </span>
          <AirlineLogo airline={f.airline} size="sm" />
          <span className={`mt-0.5 whitespace-nowrap text-[11px] font-bold leading-none tracking-wide transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.airline}</span>
          <span className={`mt-0.5 whitespace-nowrap text-[9px] font-semibold leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9eafc7]'}`}>{f.code}</span>
          <div className={`mt-0.5 flex items-center gap-1 whitespace-nowrap text-[8.5px] transition-colors duration-300 ${isLight ? 'text-[#4B5563]' : 'text-white'}`}>
            <span className="flex items-center gap-1">
              <Clock className={`h-[10px] w-[10px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`} />
              {f.duration}
            </span>
            <span className={`h-2 w-px transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#315073]'}`} />
            <span className="flex items-center gap-1">
              <ShoppingBag className={`h-[10px] w-[10px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`} />
              {f.baggage}
            </span>
          </div>
        </div>

        {/* Schedule row: departure — timeline — arrival */}
        <div className="flex min-w-0 flex-1 items-center justify-end">
          <div className="w-[64px] shrink-0 text-right">
            <div className={`whitespace-nowrap text-[13px] font-bold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.departure.time}</div>
            <div className={`mt-0.5 text-[10px] font-semibold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{depCode}</div>
            <div className={`mt-0.5 text-[9px] leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#a0a8b8]'}`}>{depTerm}</div>
          </div>

          <div className="relative mx-2 h-6 min-w-0 flex-1 sm:max-w-[260px]">
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
            {f.via && (
              <div className={`absolute left-1/2 top-[19px] -translate-x-1/2 whitespace-nowrap text-[8.5px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>
                via {viaList.join(', ')}
              </div>
            )}
          </div>

          <div className="w-[64px] shrink-0 text-left">
            <div className={`whitespace-nowrap text-[13px] font-bold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.arrival.time}</div>
            <div className={`mt-0.5 text-[10px] font-semibold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{arrCode}</div>
            <div className={`mt-0.5 text-[9px] leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#a0a8b8]'}`}>{arrTerm}</div>
          </div>
        </div>
      </div>

      {/* Horizontal divider */}
      <div className="mt-0.5 border-t border-dashed border-[#73869e]" />

      {/* Metadata: second sub-row (layover / hop / CO2) */}
      <div className={`mt-0.5 text-[10px] transition-colors duration-300 ${isLight ? 'text-[#4B5563]' : 'text-white'}`}>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          {f.via && (
            <>
              <span className="flex items-center gap-1.5">
                <span className="h-[8px] w-[8px] rounded-full bg-[#22c55e]" />
                <span className="whitespace-nowrap">Layover {minutesToHm(layoverMin)} at {viaList.join(', ')}</span>
              </span>
              <span className={`h-3 w-px transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#315073]'}`} />
              <span className="flex items-center gap-1.5">
                <span className="h-[8px] w-[8px] rounded-full bg-[#ef4444]" />
                <span className="whitespace-nowrap">Hop Flight</span>
              </span>
              <span className={`h-3 w-px transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#315073]'}`} />
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
  isLight,
  scope,
  expandable = true,
  expanded = false,
  onToggleExpand,
}: {
  f: Flight;
  dayDelta: number;
  selected: boolean;
  onSelect?: () => void;
  isLight?: boolean;
  scope?: string;
  expandable?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
}) => (
  <div className={`flex w-full shrink-0 flex-col items-center border-t border-dotted pt-1 lg:w-[150px] lg:border-t-0 lg:border-l lg:pl-3 lg:pt-0 transition-colors duration-300 ${isLight ? 'border-[#E5E7EB]' : 'border-[#73869e]'}`}>
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
        {expandable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand?.();
            }}
            aria-label={expanded ? 'Collapse fare details' : 'Expand fare details'}
            aria-expanded={expanded}
            className="expand-toggle-btn flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#315073] bg-[#0d1b2a] text-[#7CC0FF] transition-all duration-300 hover:border-[#d4af37]/70 hover:text-[#f0c265]"
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
        <div className="mr-2 w-[62px] shrink-0">
          <SelectButton selected={selected} onSelect={onSelect} isLight={isLight} />
        </div>
      </div>
    </div>
  </div>
);

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
  const base = f.price + dayDelta;
  const viaList = viaCities(f.via);
  const planeCount = Math.max(stopsCount(f.stops) + 1, viaList.length + 1);

  return (
  <article
    onClick={onSelect}
    style={{ animationDelay: `${index * 90}ms` }}
    className={`card-flash-in relative flex min-h-[84px] flex-col rounded-[12px] border p-1.5 pb-1.5 pt-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.015)] transition-all duration-300 ${onSelect ? 'cursor-pointer' : ''} ${isLight ? 'bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-[#D1D5DB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]' : 'bg-[#0f172a] border-[#214b7e] hover:border-[#d4af37]/70 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.015),0_0_18px_rgba(212,175,55,0.28),0_0_45px_rgba(212,175,55,0.12)]'} ${selected ? (isLight ? 'border-[#DC2626] shadow-[0_0_0_2px_#DC2626,0_4px_12px_rgba(220,38,38,0.25)]' : 'border-[#d4af37] shadow-[inset_0_1px_0_rgba(255,255,255,0.015),0_0_18px_rgba(212,175,55,0.45),0_0_45px_rgba(212,175,55,0.18)]') : ''}`}
  >
    {/* Badge + selected check (left side) */}
    <div className="absolute left-3 top-1.5 flex items-center gap-1.5">
      <div className={`flex h-[16px] min-w-[72px] items-center justify-center rounded-full px-2 text-[7.5px] font-bold ${f.badgeBg}`}>
        <span className="text-[7.5px] font-bold tracking-[0.2px] text-white">{f.badge}</span>
      </div>
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
          expandable={expandable}
          expanded={expanded}
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
            {viaList.length > 0 ? (
              <span className="mt-0.5 whitespace-nowrap text-[9.5px] font-semibold leading-none text-[#fdba74]">
                via {viaList.join(', ')}
              </span>
            ) : (
              <span className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[9.5px] font-semibold leading-none text-[#22c55e]">
                <span className="h-[6px] w-[6px] rounded-full bg-[#22c55e]" />
                Non-stop
              </span>
            )}
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
                    className={`absolute top-1/2 max-w-[50%] -translate-x-1/2 translate-y-[18px] truncate px-0.5 text-[9.5px] leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}
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
          {expandable && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((x) => !x);
              }}
              aria-label={expanded ? 'Collapse fare details' : 'Expand fare details'}
              aria-expanded={expanded}
              className="expand-toggle-btn flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#315073] bg-[#0d1b2a] text-[#7CC0FF] transition-all duration-300 hover:border-[#d4af37]/70 hover:text-[#f0c265]"
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
          <div className="mr-2 w-[70px] shrink-0">
            <SelectButton selected={!!selected} onSelect={onSelect} isLight={isLight} />
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
    )}

    {/* Expanded: fare option tiers */}
    {expanded && (
      <div
        className="expanded-divider mt-4 border-t border-dotted border-[#73869e] pt-4 transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="pretty-scroll mt-1 pb-1"
          style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
        >
          <div className="grid min-w-[680px] grid-cols-3 gap-3">
            {fareTiers(base).map((tier) => (
              <FareTierCard key={tier.name} tier={tier} tierId={`${scope ?? 'flight'}:${f.code}:${tier.name.toLowerCase()}`} />
            ))}
          </div>
        </div>
      </div>
    )}
  </article>
  );
};