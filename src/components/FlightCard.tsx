import { useState } from 'react';
import { useFlightStore, type Flight } from '../store/flightStore';
import { useThemeStore } from '../store/themeStore';


import { AirlineLogo } from './Logos';
import { Clock, ShoppingBag, PlaneTakeoff, PlaneFill, Timer, SeatIcon, UserIcon, SettingsIcon, SuitcaseIcon, GlobeIcon, LeafIcon } from './icons';
import { iconProps } from '../lib/iconProps';
import { inr, airportCodeOf, terminalOf, viaCities, stopsCount, minutesToHm, cityNameOf, twelveHToMins, minsToTwelveH, legFlightCode } from '../lib/format';

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
      {tier.rows.map((row) => (
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
      ))}
    </div>
  </div>
);

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
    <div className="layover-panel flex w-full shrink-0 flex-col rounded-[12px] border border-[#29466e] bg-[#0d1b2a] p-3 transition-colors duration-300 xl:w-[210px] xl:shrink-0">
      <div className="layover-title flex items-center gap-1.5 text-[12px] font-bold text-white transition-colors duration-300">
        <span className="h-[8px] w-[8px] rounded-full bg-[#22c55e]" />

        {f.via ? 'Layover Flight' : 'Non-stop Flight'}
      </div>
      <div className="mt-2.5 space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="layover-row flex items-start gap-2 rounded-[8px] bg-white/[0.03] px-2.5 py-1.5 transition-colors duration-300">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#7CC0FF]">{r.icon}</span>
            <span className="layover-label shrink-0 whitespace-nowrap text-[11px] text-[#9baec7] transition-colors duration-300">{r.label}:</span>
            <span className="layover-value min-w-0 flex-1 text-right text-[11px] font-semibold leading-snug text-white transition-colors duration-300">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


/* ---------- Itinerary details (per-leg breakdown inside expanded card) ---------- */

const ItineraryDetails = ({ f }: { f: Flight }) => {
  const stripStart = useFlightStore((s) => s.stripStart);
  const stripSel = useFlightStore((s) => s.stripSel);
  const legs = itineraryLegs(f);
  const travelDate = new Date(2026, 8, 9 + stripStart + stripSel);
  const dateLabel = `${travelDate.toLocaleDateString('en-US', { weekday: 'short' })} ${travelDate.getDate()} ${travelDate.toLocaleDateString('en-US', { month: 'short' })}, ${travelDate.getFullYear()}`;

  return (
    <div className="itinerary-panel rounded-[12px] border border-[#29466e] bg-[#0d1b2a] p-4 transition-colors duration-300">
      <div className="itinerary-heading flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF] transition-colors duration-300">
        <PlaneTakeoff className="h-3.5 w-3.5" />
        Flight Details
      </div>
      <div className="mt-3">
        {legs.map((leg, i) => (
          <div key={`${leg.code}-${i}`}>
            {i > 0 && (
              <div className="itinerary-layover-text my-3 flex items-center justify-center gap-1.5 text-[11.5px] font-semibold text-white/80 transition-colors duration-300">
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
                  <span className="itinerary-airline-name min-w-0 text-[13px] font-bold lowercase leading-tight tracking-wide text-white transition-colors duration-300">{f.airline}</span>
                </div>
                <span className="itinerary-flight-code mt-1 pl-1 whitespace-nowrap text-[11px] text-[#9eafc7] transition-colors duration-300">{leg.code}</span>
              </div>

              {/* Departure → Arrival details */}
              <div className="grid min-w-0 flex-[1.05] grid-cols-2 gap-3 sm:gap-5">
                <div className="min-w-0">
                  <div className="itinerary-time whitespace-nowrap text-[16px] font-bold leading-none text-white transition-colors duration-300">{leg.depTime}</div>
                  <div className="itinerary-code mt-1 text-[11.5px] font-semibold leading-none text-white transition-colors duration-300">{leg.depCode}</div>
                  <div className="itinerary-city mt-0.5 text-[11px] leading-none text-[#9baec7] transition-colors duration-300">{leg.depCity}</div>
                  <div className="itinerary-date mt-0.5 text-[11px] leading-none text-[#9baec7] transition-colors duration-300">{dateLabel}</div>
                  <div className="itinerary-code mt-1.5 text-[11.5px] font-semibold leading-none text-white transition-colors duration-300">{leg.depCode}</div>
                  <div className="itinerary-terminal mt-0.5 text-[11px] leading-none text-[#9baec7] transition-colors duration-300">{leg.depTerm}</div>
                </div>
                <div className="itinerary-divider min-w-0 border-l border-white/10 pl-3 text-right transition-colors duration-300 sm:pl-5">
                  <div className="itinerary-time whitespace-nowrap text-[16px] font-bold leading-none text-white transition-colors duration-300">{leg.arrTime}</div>
                  <div className="itinerary-code mt-1 text-[11.5px] font-semibold leading-none text-white transition-colors duration-300">{leg.arrCode}</div>
                  <div className="itinerary-city mt-0.5 text-[11px] leading-none text-[#9baec7] transition-colors duration-300">{leg.arrCity}</div>
                  <div className="itinerary-date mt-0.5 text-[11px] leading-none text-[#9baec7] transition-colors duration-300">{dateLabel}</div>
                  <div className="itinerary-code mt-1.5 text-[11.5px] font-semibold leading-none text-white transition-colors duration-300">{leg.arrCode}</div>
                  <div className="itinerary-terminal mt-0.5 text-[11px] leading-none text-[#9baec7] transition-colors duration-300">{leg.arrTerm}</div>
                <div className="min-w-0 border-l border-white/10 pl-3 text-right sm:pl-6">
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

/* ---------- Price breakdown (expanded card) ---------- */

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
    <div className="price-breakdown flex flex-col rounded-[12px] border border-[#29466e] bg-[#0d1b2a] p-4 transition-colors duration-300">
      <div className="price-breakdown-heading text-[10.5px] font-semibold tracking-[0.12em] text-[#7CC0FF] transition-colors duration-300">PRICE BREAKDOWN</div>
      <div className="mt-3 space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="price-breakdown-row flex items-center justify-between gap-3 rounded-[8px] bg-white/[0.03] px-2.5 py-2 transition-colors duration-300">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="price-breakdown-icon flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[#1b2b47] text-[#7CC0FF] transition-colors duration-300">{r.icon}</span>
              <div className="min-w-0">
                <div className="price-breakdown-label text-[12px] font-semibold text-white transition-colors duration-300">{r.label}</div>
                <div className="price-breakdown-sub text-[10px] text-[#7e93b3] transition-colors duration-300">{r.sub}</div>
              </div>
            </div>
            <span className="price-breakdown-value shrink-0 text-[12px] font-bold text-white transition-colors duration-300">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="price-breakdown-divider mt-3 border-t border-dashed border-[#73869e] pt-3 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <div className="price-breakdown-total text-[11px] font-bold tracking-wide text-white transition-colors duration-300">TOTAL</div>
            <div className="price-breakdown-sub text-[9.5px] text-[#7e93b3] transition-colors duration-300">Per person</div>
          </div>
          <div className="price-breakdown-total-value text-[18px] font-bold leading-none text-[#3B9CFF] transition-colors duration-300">{inr(total)}</div>
    <div className="flex flex-col rounded-[12px] border border-[#29466e] bg-[#0d1b2a] p-2.5">
      <div className="text-[10px] font-semibold tracking-[0.12em] text-[#7CC0FF]">PRICE BREAKDOWN</div>
      <div className="mt-1.5 space-y-1">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-2 rounded-[8px] bg-white/[0.03] px-1.5 py-0.5">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] bg-[#1b2b47] text-[#7CC0FF]">{r.icon}</span>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold leading-tight text-white">{r.label}</div>
                <div className="text-[8.5px] leading-tight text-[#7e93b3]">{r.sub}</div>
              </div>
            </div>
            <span className="shrink-0 text-[11px] font-bold text-white">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-1.5 border-t border-dashed border-[#73869e] pt-1.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-wide leading-tight text-white">TOTAL</div>
            <div className="text-[8.5px] leading-tight text-[#7e93b3]">Per person</div>
          </div>
          <div className="text-[16px] font-bold leading-none text-[#3B9CFF]">{inr(total)}</div>
        </div>
      </div>
      <button className="mt-2 flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#2593fc] text-[12.5px] font-bold text-white shadow-[0_6px_18px_rgba(37,147,252,0.45)] transition-all duration-300 hover:bg-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.7),0_0_45px_rgba(212,175,55,0.4)] active:bg-[#f0c265]">
        Continue
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

const SelectButton = ({ selected, onSelect, isLight }: { selected: boolean; onSelect?: () => void; isLight?: boolean }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onSelect?.();
    }}
    className={`flex h-[36px] w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] text-[13.5px] font-bold text-white transition-all duration-300 ${isLight ? 'bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)] active:bg-[#1D4ED8]' : selected ? 'bg-[#d4af37] shadow-[0_0_16px_rgba(212,175,55,0.5),0_0_30px_rgba(212,175,55,0.25)] hover:bg-[#f0c265] hover:shadow-[0_0_20px_rgba(212,175,55,0.7),0_0_40px_rgba(212,175,55,0.35)]' : 'bg-[#3b82f6] shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:bg-[#d4af37] hover:shadow-[0_0_16px_rgba(212,175,55,0.5),0_0_35px_rgba(212,175,55,0.25)] active:bg-[#d4af37] active:shadow-[0_0_22px_rgba(212,175,55,0.65),0_0_45px_rgba(212,175,55,0.35)]'}`}
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
  isLight,
  viaList,
  planeCount,
}: {
  f: Flight;
  fromLabel: string;
  toLabel: string;
  isLight?: boolean;
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
          <span className={`mt-1 whitespace-nowrap text-[11px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9eafc7]'}`}>{f.code}</span>
        </div>
        <span className={`min-w-0 text-[13px] font-bold leading-tight tracking-wide transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.airline}</span>
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
          <div className={`whitespace-nowrap text-[16px] font-bold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.departure.time}</div>
          <div className={`mt-1 text-[10.5px] font-semibold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{depCode}</div>
          <div className={`mt-0.5 text-[9.5px] leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#a0a8b8]'}`}>{depTerm}</div>
        </div>

        <div className="relative mx-2 h-12 min-w-0 flex-1">
          <div className={`absolute inset-x-0 top-[11px] border-t border-dotted transition-colors duration-300 ${isLight ? 'border-[#D1D5DB]' : 'border-[#8295ad]'}`} />
          {f.via ? (
            Array.from({ length: planeCount }, (_, i) => (
              <div
                key={`p-${i}`}
                className={`absolute top-[11px] flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.1)] transition-colors duration-300 ${isLight ? 'bg-[#EFF6FF]' : 'bg-[#e2e8f2]'}`}
                style={{ left: `${((i + 0.5) / planeCount) * 100}%` }}
              >
                <PlaneFill className={`h-3 w-3 rotate-45 transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#2e7bf6]'}`} />
              </div>
            ))
          ) : (
            <div className="absolute left-1/2 top-[11px] flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#e2e8f2] shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
              <PlaneFill className={`h-3 w-3 rotate-45 transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#2e7bf6]'}`} />
            </div>
          )}
          {f.via && (
            <div className={`absolute left-1/2 top-[26px] -translate-x-1/2 whitespace-nowrap text-[9.5px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>
              via {viaList.join(', ')}
            </div>
          )}
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
          <div className={`whitespace-nowrap text-[16px] font-bold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.arrival.time}</div>
          <div className={`mt-1 text-[10.5px] font-semibold leading-none transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{arrCode}</div>
          <div className={`mt-0.5 text-[9.5px] leading-none transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#a0a8b8]'}`}>{arrTerm}</div>
        </div>
      </div>

      {/* Horizontal divider */}
      <div className="mt-3 border-t border-dashed border-[#73869e]" />

      {/* Metadata: two sub-rows */}
      <div className={`mt-2.5 text-[11.5px] transition-colors duration-300 ${isLight ? 'text-[#4B5563]' : 'text-white'}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1.5">
            <Clock className={`h-[14px] w-[14px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`} />
            {f.duration}
          </span>
          <span className={`h-3 w-px transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#315073]'}`} />
          {stopN > 0 ? (
            <span className="flex items-center gap-1.5">
              <span className="h-[8px] w-[8px] rounded-full bg-[#fb923c]" />
              <span className="whitespace-nowrap">{stopN} {stopN === 1 ? 'Stop' : 'Stops'}</span>
            </span>
          ) : (
            <span className="whitespace-nowrap">Non-stop</span>
          )}
          <span className={`h-3 w-px transition-colors duration-300 ${isLight ? 'bg-[#D1D5DB]' : 'bg-[#315073]'}`} />
          <span className="flex items-center gap-1.5">
            <ShoppingBag className={`h-[14px] w-[14px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`} />
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
}: {
  f: Flight;
  dayDelta: number;
  selected: boolean;
  onSelect?: () => void;
  isLight?: boolean;
}) => (
  <div className={`flex w-full shrink-0 flex-col items-center border-t border-dotted pt-3 text-center lg:w-[150px] lg:border-t-0 lg:pl-3 lg:pt-0 transition-colors duration-300 ${isLight ? 'border-[#E5E7EB]' : 'border-[#73869e]'}`}>
    <div className={`text-[10.5px] font-semibold tracking-[0.1em] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>TRIP FIT</div>
    <div className={`mt-0.5 text-[19px] font-bold leading-tight tracking-tight transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{inr(f.price + dayDelta)}</div>
    <div className={`mt-1.5 flex items-center gap-1.5 text-[12px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`}>
      <Clock className={`h-3.5 w-3.5 transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`} />
      {f.duration}
    </div>
    <div className="mt-auto w-full">
      <SelectButton selected={selected} onSelect={onSelect} isLight={isLight} />
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
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const [expanded, setExpanded] = useState(false);
  const base = f.price + dayDelta;
  const viaList = viaCities(f.via);
  const planeCount = Math.max(stopsCount(f.stops) + 1, viaList.length + 1);

  const planeCount = Math.max(stopsCount(f.stops), viaList.length);
  return (
  <article
    onClick={onSelect}
    style={{ animationDelay: `${index * 90}ms` }}
    className={`card-flash-in relative flex min-h-[168px] flex-col rounded-[12px] border p-4 pb-5 pt-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.015)] transition-all duration-300 ${onSelect ? 'cursor-pointer' : ''} ${isLight ? 'bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-[#D1D5DB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]' : 'bg-[#0f172a] border-[#214b7e] hover:border-[#d4af37]/70 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.015),0_0_18px_rgba(212,175,55,0.28),0_0_45px_rgba(212,175,55,0.12)]'} ${selected ? (isLight ? 'border-[#DC2626] shadow-[0_0_0_2px_#DC2626,0_4px_12px_rgba(220,38,38,0.25)]' : 'border-[#d4af37] shadow-[inset_0_1px_0_rgba(255,255,255,0.015),0_0_18px_rgba(212,175,55,0.45),0_0_45px_rgba(212,175,55,0.18)]') : ''}`}
  >
    {/* Badge (solid pill, overlapping top-left edge) */}
    <div className={`absolute left-[15px] top-2 flex h-[20px] min-w-[88px] items-center justify-center rounded-full px-3 ${f.badgeBg}`}>
      <span className="text-[9px] font-bold tracking-[0.2px] text-white">{f.badge}</span>
    </div>

    {/* Top-right: selected check + expand/collapse chevron */}
    <div className="absolute right-4 top-4 flex items-center gap-2">
      {selected && (
        <span className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-300 ${isLight ? 'bg-[#DC2626] shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.8)]'}`}>
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
          className="expand-toggle-btn flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-[#315073] bg-[#0d1b2a] text-[#7CC0FF] transition-all duration-300 hover:border-[#d4af37]/70 hover:text-[#f0c265]"
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
          isLight={isLight}
          viaList={viaList}
          planeCount={planeCount}
        />
        <CompactPriceCol
          f={f}
          dayDelta={dayDelta}
          selected={!!selected}
          onSelect={onSelect}
          isLight={isLight}
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
          <span className={`mt-1 text-[11px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9eafc7]'}`}>{f.code}</span>
        </div>
        <div className="min-w-0">
          <span className={`block text-[15px] font-bold leading-snug tracking-wide transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.airline}</span>
          <div className={`mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] ${isLight ? 'text-[#4B5563]' : 'text-white'}`}>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Clock className={`h-[15px] w-[15px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`} />
              {f.duration}
            </span>
            <span className={`h-3 w-px transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#315073]'}`} />
            <span className="whitespace-nowrap">{f.stops}</span>
            <span className={`h-3 w-px transition-colors duration-300 ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#315073]'}`} />
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <ShoppingBag className={`h-[15px] w-[15px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`} />
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
          <div className={`text-[17px] font-bold leading-tight transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.departure.time}</div>
          <div className={`mt-0.5 text-[11.5px] transition-colors duration-300 ${isLight ? 'text-[#4B5563]' : 'text-[#9baec7]'}`}>{fromLabel ?? f.departure.airport}</div>
        </div>

        <div className="relative mx-2 h-10 min-w-[72px] flex-1 sm:min-w-[88px]">
          <div className={`absolute inset-x-0 top-1/2 border-t border-dotted transition-colors duration-300 ${isLight ? 'border-[#D1D5DB]' : 'border-[#8295ad]'}`} />
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
                >                  <PlaneFill className={`h-3.5 w-3.5 rotate-45 transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#1d3a63]'}`} />
                >
                  <PlaneFill className="h-[11px] w-[11px] rotate-45 text-[#f39200]" />
                </div>
              ))}
              {viaList.map((city, i) => (
                <div
                  key={`v-${city}`}
                  className={`absolute top-1/2 max-w-[50%] -translate-x-1/2 translate-y-[20px] truncate px-0.5 text-[10.5px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}
                  className="absolute top-1/2 max-w-[50%] -translate-x-1/2 translate-y-[16px] truncate px-0.5 text-[10.5px] font-semibold text-[#fdba74]"
                  style={{ left: `${((i + 0.5) / planeCount) * 100}%` }}
                >
                  {city}
                </div>
              ))}
            </>
          ) : (
            <div className={`absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.1)] transition-colors duration-300 ${isLight ? 'bg-[#EFF6FF]' : 'bg-[#dbe2ec]'}`}>
              <PlaneFill className={`h-3.5 w-3.5 rotate-45 transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#1d3a63]'}`} />
            </div>
          )}
          ) : null}
        </div>

        <div className="w-[92px] shrink-0 text-right sm:w-[120px]">
          <div className={`text-[17px] font-bold leading-tight transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{f.arrival.time}</div>
          <div className={`mt-0.5 text-[11.5px] transition-colors duration-300 ${isLight ? 'text-[#4B5563]' : 'text-[#9baec7]'}`}>{toLabel ?? f.arrival.airport}</div>
        </div>
      </div>

    </div>

    {/* Right section: pricing & action */}
    <div className={`flex w-full shrink-0 flex-col items-center border-t border-dotted pt-4 text-center lg:w-[210px] lg:border-t-0 lg:pl-6 lg:pt-0 transition-colors duration-300 ${isLight ? 'border-[#E5E7EB]' : 'border-[#73869e]'}`}>
      <div className={`text-[10.5px] font-semibold tracking-[0.1em] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#9baec7]'}`}>TRIP FIT</div>
      <div className={`mt-0.5 text-[21px] font-bold leading-tight tracking-tight transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{inr(f.price + dayDelta)}</div>
      <div className={`mt-1.5 flex items-center gap-1.5 text-[12px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`}>
        <Clock className={`h-3.5 w-3.5 transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#b6c3d5]'}`} />
        {f.duration}
      </div>
      <div className="mt-4 w-full lg:mt-auto">
        <SelectButton selected={!!selected} onSelect={onSelect} isLight={isLight} />
      </div>
    </div>
    </div>
    </>
    )}

    {/* Expanded: fare option tiers + layover details */}
    {expanded && (
      <div
        className="expanded-divider mt-4 border-t border-dotted border-[#73869e] pt-4 transition-colors duration-300"
    {expanded && (        <div
        className="mt-4 border-t border-dotted border-[#73869e] pt-4 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
          <div className="min-w-0">
            <ItineraryDetails f={f} />
          </div>
          <div className="min-w-0">
            <PriceBreakdown base={base} baggage={f.baggage} />
          </div>
        </div>
        <div className="mt-4 "
          style={{ overflowX: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#2593fc #122844', WebkitOverflowScrolling: 'touch' }}
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {fareTiers(base).map((tier) => (
              <FareTierCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>

      </div>
    )}
  </article>
  );
};