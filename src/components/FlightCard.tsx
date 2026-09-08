import { useState } from 'react';
import type { Flight } from '../store/flightStore';


import { AirlineLogo } from './Logos';
import { Clock, ShoppingBag, PlaneFill, PlaneTakeoff, LeafIcon } from './icons';
import { iconProps } from '../lib/iconProps';
import { inr, viaCities, stopsCount, minutesToHm, airportCodeOf } from '../lib/format';

/* ---------- Fare option tiers (expandable card details) ---------- */

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

const LayoverFlightCard = ({ f }: { f: Flight }) => {
  const viaList = viaCities(f.via);
  const hash = f.code.charCodeAt(0) + f.code.length * 13;
  const layover = 10 + (hash % 40);
  const location = viaList[0] ?? airportCodeOf(f.arrival.airport);
  const fields: { label: string; value: string }[] = [
    { label: 'Location', value: location },
    { label: 'Terminal', value: '1' },
    { label: 'Time', value: `${layover}m` },
    { label: 'Fare type', value: 'Economy Saver' },
    { label: 'Seats left', value: 'Only 3 seats at this price' },
  ];
  return (
    <div className="flex w-[240px] shrink-0 flex-col rounded-[12px] border border-[#29466e] bg-[#0d1b2a] p-3.5">
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF]">
        <PlaneTakeoff className="h-3.5 w-3.5" />
        Layover Flight
      </div>
      <div className="mt-2.5 space-y-1.5">
        {fields.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2 rounded-[8px] bg-white/[0.03] px-2.5 py-1.5">
            <span className="text-[10px] font-semibold text-[#7e93b3]">{row.label}</span>
            <span className="min-w-0 text-right text-[11px] font-bold text-white">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};



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
  viaList,
  planeCount,
}: {
  f: Flight;
  fromLabel: string;
  toLabel: string;
  viaList: string[];
  planeCount: number;
}) => {
  const stopN = stopsCount(f.stops);
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
        <div className="flex min-w-0 flex-col">
          <span className="min-w-0 text-[13px] font-bold leading-tight tracking-wide text-white">{f.airline}</span>
          {viaList.length > 0 ? (
            <span className="mt-0.5 whitespace-nowrap text-[9px] font-semibold text-[#fdba74]">
              via {viaList.join(', ')}
            </span>
          ) : (
            <span className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[9px] font-semibold text-[#22c55e]">
              <span className="h-[5px] w-[5px] rounded-full bg-[#22c55e]" />
              Non-stop
            </span>
          )}
        </div>
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
            /* Flight with stops: one plane per stop, stop name below each plane */
            <>
              {Array.from({ length: planeCount }, (_, i) => (
                <div
                  key={`p-${i}`}
                  className="absolute top-[11px] flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#fdba74] shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                  style={{ left: `${((i + 0.5) / planeCount) * 100}%` }}
                >
                  <PlaneFill className="h-[11px] w-[11px] rotate-45 text-[#f39200]" />
                </div>
              ))}
              {viaList.map((city, i) => (
                <div
                  key={`v-${city}`}
                  className="absolute top-[11px] max-w-[45%] -translate-x-1/2 translate-y-[14px] truncate px-0.5 text-[9px] font-semibold text-[#fdba74]"
                  style={{ left: `${((i + 0.5) / planeCount) * 100}%` }}
                >
                  {city}
                </div>
              ))}
            </>
          ) : null}
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
  <div className="flex w-full shrink-0 flex-col items-center border-t border-dotted border-[#73869e] pt-3 text-center lg:w-[150px] lg:border-t-0 lg:border-l lg:pl-3 lg:pt-0">
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
  const planeCount = Math.max(stopsCount(f.stops), viaList.length);
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
          viaList={viaList}
          planeCount={planeCount}
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
    <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
    <div className="min-w-0 flex-1 pr-0 lg:pr-6">

      {/* Top row: logo with code, airline name, metadata + last stop inline */}
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
          {viaList.length > 0 ? (
            <span className="mt-1.5 block whitespace-nowrap text-[9.5px] font-semibold text-[#fdba74]">
              via {viaList.join(', ')}
            </span>
          ) : (
            <span className="mt-1.5 flex items-center gap-1 whitespace-nowrap text-[9.5px] font-semibold text-[#22c55e]">
              <span className="h-[5px] w-[5px] rounded-full bg-[#22c55e]" />
              Non-stop
            </span>
          )}
        </div>
      </div>

      {/* Times row */}
      <div className="mt-4 flex items-center">
        <div className="w-[92px] shrink-0 text-left sm:w-[120px]">
          <div className="text-[17px] font-bold leading-tight text-white">{f.departure.time}</div>
          <div className="mt-0.5 text-[11.5px] text-[#9baec7]">{fromLabel ?? f.departure.airport}</div>
        </div>

        <div className="relative mx-2 h-12 min-w-[72px] flex-1 sm:min-w-[88px]">
          <div className="absolute inset-x-0 top-1/2 border-t border-dotted border-[#8295ad]" />
          {f.via ? (
            /* Flight with stops: one plane per leg (stops + 1), via city below each plane */
            <>
              {Array.from({ length: planeCount }, (_, i) => (
                <div
                  key={`p-${i}`}
                  className="absolute top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#fdba74] shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                  style={{ left: `${((i + 0.5) / planeCount) * 100}%` }}
                >
                  <PlaneFill className="h-[11px] w-[11px] rotate-45 text-[#f39200]" />
                </div>
              ))}
              {viaList.map((city, i) => (
                <div
                  key={`v-${city}`}
                  className="absolute top-1/2 max-w-[50%] -translate-x-1/2 translate-y-[16px] truncate px-0.5 text-[10.5px] font-semibold text-[#fdba74]"
                  style={{ left: `${((i + 0.5) / planeCount) * 100}%` }}
                >
                  {city}
                </div>
              ))}
            </>
          ) : null}
        </div>

        <div className="w-[92px] shrink-0 text-right sm:w-[120px]">
          <div className="text-[17px] font-bold leading-tight text-white">{f.arrival.time}</div>
          <div className="mt-0.5 text-[11.5px] text-[#9baec7]">{toLabel ?? f.arrival.airport}</div>
        </div>
      </div>

    </div>

    {/* Right section: pricing & action */}
    <div className="flex w-full shrink-0 flex-col items-center border-t border-dotted border-[#73869e] pt-4 text-center lg:w-[210px] lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
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
    {expanded && (        <div
        className="mt-4 border-t border-dotted border-[#73869e] pt-4 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex min-w-0 flex-1 gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#2593fc #122844', WebkitOverflowScrolling: 'touch' }}
          >
            {fareTiers(base).map((tier) => (
              <div key={tier.name} className="flex min-w-[220px] flex-1">
                <FareTierCard tier={tier} />
              </div>
            ))}
          </div>
          <LayoverFlightCard f={f} />
        </div>

      </div>
    )}
  </article>
  );
};