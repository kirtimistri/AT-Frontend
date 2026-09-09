// AncillaryServicesModal.tsx
// Full-screen modal for browsing and selecting meals, seats, baggage, and special services.
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { X, ChevronDown, Check, Plus, Utensils } from 'lucide-react';
import type { Flight } from '../store/flightStore';
import {
  catalogueOf,
  selectionTotal,
  type AncillarySelection,
  type AncillaryKind,
  type MealOption,
  type Seat,
  type BaggageOption,
  type SsrOption,
} from '../lib/ancillary';
import {
  useAncillaryStore,
  travellerSectionOf,
} from '../store/ancillaryStore';
import { inr } from '../lib/format';
import { useThemeStore } from '../store/themeStore';

/* ---------------------------------------------------------------------------
   Shared primitives (theme-aware, following the existing review design system)
--------------------------------------------------------------------------- */

const cardBorder = (isLight: boolean) =>
  isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#29466e] bg-[#0f172a]';

const cardText = (isLight: boolean) => (isLight ? 'text-[#171717]' : 'text-white');

const mutedText = (isLight: boolean) =>
  isLight ? 'text-[#777]' : 'text-[#9baec7]';

const subtleBox = (isLight: boolean) =>
  isLight ? 'bg-[#F7F4F3]' : 'bg-white/[0.03]';

/* A small accent label pill reused across tabs */
const Tag = ({ children, isLight, tone = 'blue' }: { children: ReactNode; isLight: boolean; tone?: 'blue' | 'gold' | 'green' }) => {
  const tones: Record<string, string> = {
    blue: isLight ? 'bg-[#E1EFFB] text-[#004B7C]' : 'bg-[#2593fc]/20 text-[#7CC0FF]',
    gold: 'bg-[#d4af37]/20 text-[#d4af37]',
    green: isLight ? 'bg-[#dcfce7] text-[#16A34A]' : 'bg-[#16A34A]/20 text-[#34d399]',
  };
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
};

/* ---------------------------------------------------------------------------
   Segments declaration (derived from the booking + demo fallback)
--------------------------------------------------------------------------- */

export type AncillarySegment = {
  id: 'onward' | 'return';
  label: string;
  fromCode: string;
  toCode: string;
  date: string;
  flight: Flight;
};

const TRAVELLERS = [{ id: 'adult-1', label: 'Adult 1' }];

/* ---------------------------------------------------------------------------
   Tabs
--------------------------------------------------------------------------- */

const TABS: { key: AncillaryKind; label: string; icon: 'meal' | 'seat' | 'baggage' | 'ssr' }[] = [
  { key: 'meal', label: 'Meal', icon: 'meal' },
  { key: 'seat', label: 'Seat', icon: 'seat' },
  { key: 'baggage', label: 'Baggage', icon: 'baggage' },
  { key: 'ssr', label: 'Special Services', icon: 'ssr' },
];

// Returns the SVG icon for each tab type (meal, seat, baggage, SSR).
const TabIcon = ({ kind, isLight }: { kind: (typeof TABS)[number]['icon']; isLight: boolean }) => {
  const color = isLight ? 'text-[#004B7C]' : 'text-[#7CC0FF]';
  switch (kind) {
    case 'meal':
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      );
    case 'seat':
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 18v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" />
          <path d="M5 18h14v2H5z" />
          <path d="M8 10V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" />
        </svg>
      );
    case 'baggage':
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7v13" />
          <path d="M15 7v13" />
        </svg>
      );
    case 'ssr':
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      );
  }
};

/* ---------------------------------------------------------------------------
   Meal tab
--------------------------------------------------------------------------- */

const MealThumb = ({ meal, isLight }: { meal: MealOption; isLight: boolean }) => {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-md ${isLight ? 'bg-[#F2F5F9]' : 'bg-[#16233f]'}`}
      >
        <Utensils className={`h-5 w-5 ${isLight ? 'text-[#9AA6B8]' : 'text-[#56688a]'}`} />
      </div>
    );
  return (
    <img
      src={meal.imageUrl}
      alt={meal.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-14 w-14 shrink-0 rounded-md object-cover ring-1 ring-black/10"
    />
  );
};

// Tab panel that lists available meal options for the selected segment.
const MealTab = ({
  options,
  selected,
  onSelect,
  loading,
  isLight,
}: {
  options: MealOption[];
  selected: MealOption | null;
  onSelect: (m: MealOption) => void;
  loading: boolean;
  isLight: boolean;
}) => {
  if (loading) return <SkeletonBlock rows={3} isLight={isLight} />;
  if (options.length === 0)
    return <EmptyState message="No meal options available for this segment." isLight={isLight} />;
  return (
    <div className="space-y-3">
      {options.map((meal) => {
        const active = selected?.code === meal.code;
        return (
          <div
            key={meal.code}
            className={`flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors duration-300 ${active ? (isLight ? 'border-[#004B7C] bg-[#E1EFFB]/40' : 'border-[#d4af37] bg-[#d4af37]/10') : cardBorder(isLight)}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <MealThumb meal={meal} isLight={isLight} />
              <div className="min-w-0">
                <div className={`flex items-center gap-2 text-[13px] font-semibold ${cardText(isLight)}`}>
                  {meal.name}
                  {!meal.available && <Tag isLight={isLight} tone="gold">Unavailable</Tag>}
                </div>
                <div className={`mt-0.5 text-[11px] ${mutedText(isLight)}`}>{meal.description}</div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className={`text-[13px] font-semibold ${cardText(isLight)}`}>{inr(meal.price)}</span>
              <button
                type="button"
                disabled={!meal.available}
                onClick={() => onSelect(meal)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11px] font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${active ? (isLight ? 'bg-[#004B7C] text-white' : 'bg-[#d4af37] text-[#0B132B]') : (isLight ? 'border-[#004B7C] text-[#004B7C] hover:bg-[#004B7C] hover:text-white' : 'border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0B132B]')}`}
              >
                {active ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Selected
                  </>
                ) : (
                  'Select'
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------------------------------------------------------------------------
   Seat tab
--------------------------------------------------------------------------- */

const seatLegend = (isLight: boolean) => [
  { color: isLight ? 'bg-[#E5E7EB]' : 'bg-[#1c3a5f]', label: 'Available' },
  { color: isLight ? 'bg-[#9CA3AF]' : 'bg-[#374151]', label: 'Occupied' },
  { color: isLight ? 'bg-[#DC2626]' : 'bg-[#d4af37]', label: 'Selected' },
  { color: 'bg-[#d4af37]/30', label: 'Extra Legroom' },
  { color: 'bg-[#3B82F6]/30', label: 'Emergency Exit' },
];

const SeatSeatButton = ({
  seat,
  isLight,
  selected,
  onToggle,
}: {
  seat: Seat;
  isLight: boolean;
  selected: boolean;
  onToggle: (s: Seat) => void;
}) => {
  const disabled = seat.status === 'occupied' || seat.status === 'blocked';
  let cls = '';
  if (selected) {
    cls = isLight ? 'bg-[#DC2626] text-white ring-2 ring-[#DC2626]' : 'bg-[#d4af37] text-[#0B132B] ring-2 ring-[#d4af37]';
  } else if (disabled) {
    cls = isLight ? 'bg-[#9CA3AF] text-white cursor-not-allowed' : 'bg-[#374151] text-white/40 cursor-not-allowed';
  } else {
    const legroom = seat.features.includes('legroom');
    const exit = seat.features.includes('exit');
    if (exit) cls = isLight ? 'bg-[#E1EFFB] text-[#004B7C] hover:bg-[#CBE4F8]' : 'bg-[#2593fc]/30 text-[#7CC0FF] hover:bg-[#2593fc]/50';
    else if (legroom) cls = isLight ? 'bg-[#FDF3D8] text-[#B8860B] hover:bg-[#F6E6B8]' : 'bg-[#d4af37]/25 text-[#f0c265] hover:bg-[#d4af37]/45';
    else cls = isLight ? 'bg-[#E5E7EB] text-[#555] hover:bg-[#D1D5DB]' : 'bg-[#1c3a5f] text-white/80 hover:bg-[#27507c]';
  }

  const tooltip = [seat.number];
  if (seat.price > 0) tooltip.push(inr(seat.price));
  if (seat.features.includes('exit')) tooltip.push('Exit');
  if (seat.features.includes('legroom')) tooltip.push('Extra Legroom');
  if (seat.features.includes('nonrecline')) tooltip.push('Non-reclining');

  return (
    <button
      type="button"
      title={tooltip.join(' · ')}
      aria-label={`Seat ${seat.number}${disabled ? ', occupied' : ''}${seat.price > 0 ? `, ${inr(seat.price)}` : ''}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onToggle(seat)}
      className={`flex h-8 w-9 cursor-pointer items-center justify-center rounded-[4px] text-[10px] font-semibold transition-all duration-200 ${cls}`}
    >
      {seat.row}
      {seat.column}
    </button>
  );
};

// Tab panel showing an interactive seat map where the user can pick a seat.
const SeatTab = ({
  seats,
  selected,
  onSelect,
  loading,
  isLight,
}: {
  seats: Seat[];
  selected: Seat | null;
  onSelect: (s: Seat) => void;
  loading: boolean;
  isLight: boolean;
}) => {
  const rows = useMemo(() => {
    const map = new Map<number, Seat[]>();
    seats.forEach((s) => {
      if (!map.has(s.row)) map.set(s.row, []);
      map.get(s.row)!.push(s);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [seats]);

  if (loading) return <SkeletonBlock rows={6} isLight={isLight} />;
  if (seats.length === 0)
    return <EmptyState message="No seat map available for this segment." isLight={isLight} />;

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        {seatLegend(isLight).map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-[3px] ${item.color}`} />
            <span className={`text-[10px] font-medium ${mutedText(isLight)}`}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Selected seat preview */}
      {selected && (
        <div className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[11px] ${selected.price > 0 ? (isLight ? 'border-[#DC2626]/40 bg-[#DC2626]/5' : 'border-[#d4af37]/50 bg-[#d4af37]/10') : subtleBox(isLight)}`}>
          <Tag isLight={isLight} tone={selected.price > 0 ? 'blue' : 'green'}>Selected</Tag>
          <span className={cardText(isLight)}>
            Seat <strong>{selected.number}</strong>
            {selected.price > 0 && <span className={mutedText(isLight)}> · {inr(selected.price)}</span>}
          </span>
          <button
            type="button"
            onClick={() => onSelect(selected)}
            className={`ml-auto cursor-pointer text-[11px] font-semibold ${isLight ? 'text-[#DC2626] hover:underline' : 'text-[#f87171] hover:underline'}`}
          >
            Remove
          </button>
        </div>
      )}

      {/* Seat map */}
      <div className="pretty-scroll max-h-[340px] overflow-auto rounded-lg border p-3">
        <div className="mx-auto w-fit space-y-1">
          {rows.map(([rowNum, rowSeats]) => (
            <div key={rowNum} className="flex items-center gap-1.5">
              {rowSeats.slice(0, 3).map((s) => (
                <SeatSeatButton key={s.number} seat={s} isLight={isLight} selected={selected?.number === s.number} onToggle={onSelect} />
              ))}
              <span className={`mx-1 w-6 text-center text-[9px] ${mutedText(isLight)}`}>{rowNum}</span>
              {rowSeats.slice(3).map((s) => (
                <SeatSeatButton key={s.number} seat={s} isLight={isLight} selected={selected?.number === s.number} onToggle={onSelect} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------------
   Baggage tab
--------------------------------------------------------------------------- */

// Tab panel listing extra baggage options that can be added to the booking.
const BaggageTab = ({
  options,
  selected,
  onSelect,
  loading,
  isLight,
}: {
  options: BaggageOption[];
  selected: BaggageOption | null;
  onSelect: (b: BaggageOption | null) => void;
  loading: boolean;
  isLight: boolean;
}) => {
  if (loading) return <SkeletonBlock rows={3} isLight={isLight} />;
  if (options.length === 0)
    return <EmptyState message="No baggage options available for this segment." isLight={isLight} />;
  return (
    <div className="space-y-3">
      {options.map((bag) => {
        const active = selected?.code === bag.code;
        return (
          <div
            key={bag.code}
            className={`flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors duration-300 ${active ? (isLight ? 'border-[#004B7C] bg-[#E1EFFB]/40' : 'border-[#d4af37] bg-[#d4af37]/10') : cardBorder(isLight)}`}
          >
            <div className="min-w-0">
              <div className={`text-[13px] font-semibold ${cardText(isLight)}`}>{bag.name}</div>
              <div className={`mt-0.5 text-[11px] ${mutedText(isLight)}`}>{bag.description}</div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className={`text-[13px] font-semibold ${cardText(isLight)}`}>{inr(bag.price)}</span>
              <button
                type="button"
                disabled={!bag.available}
                onClick={() => onSelect(active ? null : bag)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11px] font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${active ? (isLight ? 'bg-[#004B7C] text-white' : 'bg-[#d4af37] text-[#0B132B]') : (isLight ? 'border-[#004B7C] text-[#004B7C] hover:bg-[#004B7C] hover:text-white' : 'border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0B132B]')}`}
              >
                {active ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Added
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Add
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------------------------------------------------------------------------
   SSR tab
--------------------------------------------------------------------------- */

// Tab panel listing special service requests (e.g., wheelchair, infant bassinet).
const SsrTab = ({
  options,
  selected,
  onToggle,
  loading,
  isLight,
}: {
  options: SsrOption[];
  selected: SsrOption[];
  onToggle: (s: SsrOption) => void;
  loading: boolean;
  isLight: boolean;
}) => {
  if (loading) return <SkeletonBlock rows={4} isLight={isLight} />;
  if (options.length === 0)
    return <EmptyState message="No special services available for this segment." isLight={isLight} />;
  return (
    <div className="space-y-3">
      {options.map((ssr) => {
        const active = selected.some((s) => s.code === ssr.code);
        return (
          <div
            key={ssr.code}
            className={`flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors duration-300 ${active ? (isLight ? 'border-[#004B7C] bg-[#E1EFFB]/40' : 'border-[#d4af37] bg-[#d4af37]/10') : cardBorder(isLight)}`}
          >
            <div className="min-w-0">
              <div className={`flex items-center gap-2 text-[13px] font-semibold ${cardText(isLight)}`}>
                {ssr.name}
                {!ssr.available && <Tag isLight={isLight} tone="gold">Unavailable</Tag>}
                {ssr.price === 0 && active && <Tag isLight={isLight} tone="green">Included</Tag>}
              </div>
              <div className={`mt-0.5 text-[11px] ${mutedText(isLight)}`}>{ssr.description}</div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className={`text-[13px] font-semibold ${cardText(isLight)}`}>
                {ssr.price === 0 ? 'Free' : inr(ssr.price)}
              </span>
              <button
                type="button"
                disabled={!ssr.available}
                onClick={() => onToggle(ssr)}
                aria-pressed={active}
                className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11px] font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${active ? (isLight ? 'bg-[#004B7C] text-white' : 'bg-[#d4af37] text-[#0B132B]') : (isLight ? 'border-[#004B7C] text-[#004B7C] hover:bg-[#004B7C] hover:text-white' : 'border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0B132B]')}`}
              >
                {active ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Added
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Add
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------------------------------------------------------------------------
   Summary (right panel) + skeleton + empty states
--------------------------------------------------------------------------- */

// Right-side panel showing a summary of all currently selected ancillary services.
const SummaryPanel = ({
  selection,
  isLight,
}: {
  selection: AncillarySelection;
  isLight: boolean;
}) => {
  const total = selectionTotal(selection);
  const hasAny = selection.meal || selection.seat || selection.baggage || selection.ssr.length > 0;
  return (
    <div className={`flex h-full flex-col rounded-lg border p-5 ${cardBorder(isLight)}`}>
      <h4 className={`text-[13px] font-semibold ${cardText(isLight)}`}>Selected Services</h4>
      <div className="mt-3 flex-1 space-y-2.5">
        <SummaryRow label="Meal" value={selection.meal ? selection.meal.name : '—'} price={selection.meal?.price} isLight={isLight} />
        <SummaryRow label="Seat" value={selection.seat ? selection.seat.number : '—'} price={selection.seat?.price} isLight={isLight} />
        <SummaryRow label="Baggage" value={selection.baggage ? selection.baggage.name : '—'} price={selection.baggage?.price} isLight={isLight} />
        <div>
          <div className={`text-[11px] font-medium ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>Special Services</div>
          {selection.ssr.length === 0 ? (
            <div className={`text-[11px] ${mutedText(isLight)}`}>—</div>
          ) : (
            selection.ssr.map((s) => (
              <div key={s.code} className="flex items-center justify-between py-0.5">
                <span className={`text-[11px] ${cardText(isLight)}`}>{s.name}</span>
                <span className={`text-[11px] font-medium ${cardText(isLight)}`}>{s.price === 0 ? 'Free' : inr(s.price)}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className={`mt-4 flex items-center justify-between border-t pt-3 ${isLight ? 'border-[#EEEEEE]' : 'border-[#29466e]'}`}>
        <span className={`text-[13px] font-medium ${cardText(isLight)}`}>Ancillary Total</span>
        <span className={`text-[18px] font-semibold ${isLight ? 'text-[#004B7C]' : 'text-[#3B9CFF]'}`}>{inr(total)}</span>
      </div>
      {!hasAny && (
        <p className={`mt-2 text-[10.5px] ${mutedText(isLight)}`}>No services selected yet.</p>
      )}
    </div>
  );
};

const SummaryRow = ({
  label,
  value,
  price,
  isLight,
}: {
  label: string;
  value: string;
  price?: number;
  isLight: boolean;
}) => (
  <div className="flex items-center justify-between gap-2">
    <span className={`text-[11px] font-medium ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>{label}</span>
    <span className="min-w-0 truncate text-right">
      <span className={`text-[11px] ${cardText(isLight)}`}>{value}</span>
      {typeof price === 'number' && price > 0 && (
        <span className={`ml-1 text-[11px] font-medium ${cardText(isLight)}`}>{inr(price)}</span>
      )}
    </span>
  </div>
);

// Placeholder rows shown while service data is loading.
const SkeletonBlock = ({ rows, isLight }: { rows: number; isLight: boolean }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className={`card-shimmer flex h-[64px] animate-pulse items-center justify-between rounded-lg border border-[#29466e] p-4 transition-colors duration-300 ${isLight ? 'bg-white' : 'bg-[#0f172a]'}`}
      >
        <div className="space-y-2">
          <div className={`h-[11px] w-[128px] rounded ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#16304f]'}`} />
          <div className={`h-[9px] w-[180px] rounded ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#122844]'}`} />
        </div>
        <div className={`h-[28px] w-[76px] rounded-md ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#16304f]'}`} />
      </div>
    ))}
  </div>
);

// Message shown when no options are available for the current tab and segment.
const EmptyState = ({ message, isLight }: { message: string; isLight: boolean }) => (
  <div className={`flex flex-col items-center justify-center rounded-lg border p-8 text-center ${cardBorder(isLight)}`}>
    <span className={`text-[13px] font-medium ${cardText(isLight)}`}>{message}</span>
    <span className={`mt-1 text-[11px] ${mutedText(isLight)}`}>Please choose another service or segment.</span>
  </div>
);

/* ---------------------------------------------------------------------------
   Modal root
--------------------------------------------------------------------------- */

export type AncillaryServicesModalProps = {
  onClose: () => void;
  segments: AncillarySegment[];
};

// Main modal component: renders tabs, service lists, and a summary panel for ancillary selections.
export const AncillaryServicesModal = ({ onClose, segments }: AncillaryServicesModalProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const [tab, setTab] = useState<AncillaryKind>('meal');
  const [loading, setLoading] = useState(true);
  const [travellerId, setTravellerId] = useState(TRAVELLERS[0].id);
  const [segmentId, setSegmentId] = useState<'onward' | 'return'>(segments[0]?.id ?? 'onward');

  const panelRef = useRef<HTMLDivElement>(null);
  const selected = useAncillaryStore((s) => s.selectedAncillaries);
  const setSection = useAncillaryStore((s) => s.setTravellerSection);

  const segment = segments.find((s) => s.id === segmentId) ?? segments[0];

  const catalogue = useMemo(() => (segment ? catalogueOf(segment.flight) : null), [segment]);

  const selection = useMemo(
    () => travellerSectionOf(selected, travellerId, segmentId),
    [selected, travellerId, segmentId]
  );

  // Simulate a short fetch so real async adapters can replace this cleanly and
  // a skeleton is visibly produced (loading/empty states are spec requirements).
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(t);
  }, [segmentId, travellerId, tab]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const setSegment = (id: 'onward' | 'return') => {
    setSegmentId(id);
    setLoading(true);
  };

  const switchTab = (k: AncillaryKind) => {
    setTab(k);
    setLoading(true);
  };

  const setTraveller = (id: string) => {
    setTravellerId(id);
    setLoading(true);
  };

  const update = (section: keyof AncillarySelection, value: AncillarySelection[keyof AncillarySelection] | null) => {
    setSection(travellerId, segmentId as 'onward' | 'return', section, value);
  };

  if (segments.length === 0) return null;

  const handleContinue = () => {
    // Persisted via the store; the review sidebar reads the same store and
    // reflects the selection immediately. Closing keeps selections intact.
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Additional Services"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        className={`flex max-h-[92vh] w-full max-w-[880px] flex-col overflow-hidden rounded-xl border outline-none transition-colors duration-300 ${
          isLight ? 'border-[#EEEEEE] bg-white text-[#171717] shadow-[0_24px_64px_rgba(0,0,0,0.25)]' : 'border-[#29466e] bg-[#0f172a] text-white shadow-[0_24px_64px_rgba(0,0,0,0.6)]'
        }`}
      >
        {/* Header */}
        <div className={`flex items-start justify-between gap-4 border-b p-5 ${isLight ? 'border-[#EEEEEE]' : 'border-[#29466e]'}`}>
          <div>
            <h3 className={`text-[18px] font-semibold ${cardText(isLight)}`}>Additional Services</h3>
            <p className={`mt-0.5 text-[12px] ${mutedText(isLight)}`}>Customize your journey with optional services</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-colors duration-300 ${isLight ? 'border-[#E5E7EB] text-[#555] hover:border-[#004B7C] hover:text-[#004B7C]' : 'border-[#315073] text-[#7CC0FF] hover:border-[#d4af37]/70 hover:text-[#f0c265]'}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Segment + traveller context */}
        <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 border-b px-5 py-3 ${isLight ? 'border-[#EEEEEE] bg-[#FAFAF9]' : 'border-[#29466e] bg-white/[0.02]'}`}>
          {segments.length > 1 && (
            <ContextSelect
              label="Segment"
              value={segmentId}
              onChange={(v) => setSegment(v as 'onward' | 'return')}
              options={segments.map((s) => ({ value: s.id, label: `${s.fromCode} → ${s.toCode} · ${s.date}` }))}
              isLight={isLight}
            />
          )}
          <ContextSelect
            label="Traveller"
            value={travellerId}
            onChange={setTraveller}
            options={TRAVELLERS.map((t) => ({ value: t.id, label: t.label }))}
            isLight={isLight}
          />
        </div>

        {/* Tabs */}
        <div role="tablist" aria-label="Ancillary services" className="pretty-scroll flex gap-2 overflow-x-auto border-b px-5 py-3">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`ancillary-tab-${t.key}`}
                aria-selected={active}
                aria-controls="ancillary-tabpanel"
                onClick={() => switchTab(t.key)}
                className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2 text-[12px] font-semibold transition-all duration-300 ${active ? (isLight ? 'border-[#004B7C] bg-[#004B7C] text-white' : 'border-[#d4af37] bg-[#d4af37] text-[#0B132B]') : (isLight ? 'border-[#E5E7EB] text-[#555] hover:border-[#004B7C] hover:text-[#004B7C]' : 'border-[#29466e] text-[#9baec7] hover:border-[#d4af37]/60 hover:text-[#f0c265]')}`}
              >
                <TabIcon kind={t.icon} isLight={isLight} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div
          role="tabpanel"
          id="ancillary-tabpanel"
          aria-labelledby={`ancillary-tab-${tab}`}
          className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-5 lg:grid-cols-[minmax(0,1fr)_240px]"
        >
          <div className="min-w-0">
            {tab === 'meal' && catalogue && (
              <MealTab
                options={catalogue.meals}
                selected={selection.meal}
                onSelect={(m) => update('meal', m)}
                loading={loading}
                isLight={isLight}
              />
            )}
            {tab === 'seat' && catalogue && (
              <SeatTab
                seats={catalogue.seats}
                selected={selection.seat}
                onSelect={(s) => update('seat', s)}
                loading={loading}
                isLight={isLight}
              />
            )}
            {tab === 'baggage' && catalogue && (
              <BaggageTab
                options={catalogue.baggage}
                selected={selection.baggage}
                onSelect={(b) => update('baggage', b)}
                loading={loading}
                isLight={isLight}
              />
            )}
            {tab === 'ssr' && catalogue && (
              <SsrTab
                options={catalogue.ssr}
                selected={selection.ssr}
                onToggle={(s) => {
                  const exists = selection.ssr.some((x) => x.code === s.code);
                  update('ssr', exists ? selection.ssr.filter((x) => x.code !== s.code) : [...selection.ssr, s]);
                }}
                loading={loading}
                isLight={isLight}
              />
            )}
          </div>

          {/* Summary (desktop) */}
          <div className="hidden lg:block">
            <SummaryPanel selection={selection} isLight={isLight} />
          </div>
        </div>

        {/* Mobile summary */}
        <div className="border-t px-5 py-4 lg:hidden">
          <SummaryPanel selection={selection} isLight={isLight} />
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 border-t px-5 py-4 ${isLight ? 'border-[#EEEEEE] bg-[#FAFAF9]' : 'border-[#29466e] bg-white/[0.02]'}`}>
          <button
            type="button"
            onClick={onClose}
            className={`cursor-pointer rounded-lg border px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 ${isLight ? 'border-[#E5E7EB] text-[#555] hover:border-[#004B7C] hover:text-[#004B7C]' : 'border-[#29466e] text-[#9baec7] hover:border-[#d4af37]/60 hover:text-[#f0c265]'}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className={`cursor-pointer rounded-lg px-6 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 ${isLight ? 'bg-[#004B7C] shadow-[0_4px_12px_rgba(0,75,124,0.25)] hover:bg-[#003E67]' : 'bg-[#2593fc] shadow-[0_6px_18px_rgba(37,147,252,0.45)] hover:bg-[#d4af37]'}`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

// Dropdown selector for switching between segments (onward/return) and travellers.
const ContextSelect = ({
  label,
  value,
  onChange,
  options,
  isLight,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  isLight: boolean;
}) => (
  <label className="flex items-center gap-2">
    <span className={`text-[11px] font-medium ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>{label}:</span>
    <div className={`relative flex items-center`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none cursor-pointer rounded-md border py-1.5 pl-3 pr-8 text-[11.5px] font-medium outline-none transition-colors duration-300 ${isLight ? 'border-[#DEDEDE] bg-white text-[#171717]' : 'border-[#315073] bg-[#0d1b2a] text-white'}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className={`pointer-events-none absolute right-2 h-3.5 w-3.5 ${isLight ? 'text-[#777]' : 'text-[#7CC0FF]'}`} />
    </div>
  </label>
);
