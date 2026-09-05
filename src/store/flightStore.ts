import { create } from 'zustand';
import { toast } from '../components/toastStore';

export type Flight = {
  badge: string;
  badgeBg: string;
  airline: string;
  code: string;
  departure: { time: string; airport: string };
  arrival: { time: string; airport: string };
  via?: string;
  duration: string;
  stops: string;
  baggage: string;
  price: number;
  checkedAgo: string;
};

export type SortKey = 'price' | 'fastest' | 'departure';

export type StripDay = { label: string; price: number };

// ── Client-side dummy data ────────────────────────────────────────────────
// These arrays live inside the zustand store (see useFlightStore) so all
// components read the same data through the store instead of importing it.

const onwardFlights: Flight[] = [
  {
    badge: 'BEST VALUE',
    badgeBg: 'bg-[#7ac143]',
    airline: 'INDIGO',
    code: '6E 1234',
    departure: { time: '10:30 AM', airport: 'BOM Terminal 1' },
    arrival: { time: '12:40 PM', airport: 'DEL Terminal 2' },
    via: 'via PNQ',
    duration: '2h 10m',
    stops: '1 Stop',
    baggage: '15 kg baggage',
    price: 5430,
    checkedAgo: 'Price checked 18 sec ago.',
  },
  {
    badge: 'FASTEST',
    badgeBg: 'bg-[#1aa6e4]',
    airline: 'AIR INDIA',
    code: 'AI 247',
    departure: { time: '9:40 AM', airport: 'BOM Terminal 2' },
    arrival: { time: '11:30 AM', airport: 'DEL Terminal 2' },
    duration: '1h 50m',
    stops: 'Non-stop',
    baggage: '15 kg baggage',
    price: 6250,
    checkedAgo: 'Price checked 22 sec ago.',
  },
  {
    badge: 'MOST FLEXIBLE',
    badgeBg: 'bg-[#e4007c]',
    airline: 'AKASA',
    code: 'QP 1421',
    departure: { time: '7:55 AM', airport: 'BOM Terminal 1' },
    arrival: { time: '10:15 AM', airport: 'DEL Terminal 1' },
    duration: '2h 20m',
    stops: 'Non-stop',
    baggage: '20 kg baggage',
    price: 5980,
    checkedAgo: 'Price checked 38 sec ago.',
  },
  {
    badge: 'LOW',
    badgeBg: 'bg-[#f39200]',
    airline: 'SPICEJET',
    code: 'SG 812',
    departure: { time: '11:20 AM', airport: 'BOM Terminal 1' },
    arrival: { time: '1:40 PM', airport: 'DEL Terminal 2' },
    duration: '2h 20m',
    stops: 'Non-stop',
    baggage: '15 kg baggage',
    price: 4980,
    checkedAgo: 'Price checked 48 sec ago.',
  },
  {
    badge: 'CHEAPEST',
    badgeBg: 'bg-[#f39200]',
    airline: 'SPICEJET',
    code: 'SG 819',
    departure: { time: '6:05 AM', airport: 'BOM Terminal 1' },
    arrival: { time: '8:25 AM', airport: 'DEL Terminal 2' },
    duration: '2h 20m',
    stops: 'Non-stop',
    baggage: '15 kg baggage',
    price: 4210,
    checkedAgo: 'Price checked 11 sec ago.',
  },
  {
    badge: 'ECO',
    badgeBg: 'bg-[#7ac143]',
    airline: 'AKASA',
    code: 'QP 1410',
    departure: { time: '2:15 PM', airport: 'BOM Terminal 2' },
    arrival: { time: '4:30 PM', airport: 'DEL Terminal 1' },
    duration: '2h 15m',
    stops: 'Non-stop',
    baggage: '20 kg baggage',
    price: 6480,
    checkedAgo: 'Price checked 5 sec ago.',
  },
  {
    badge: 'EARLY BIRD',
    badgeBg: 'bg-[#1aa6e4]',
    airline: 'AIR INDIA',
    code: 'AI 610',
    departure: { time: '5:30 AM', airport: 'BOM Terminal 2' },
    arrival: { time: '7:35 AM', airport: 'DEL Terminal 3' },
    duration: '2h 5m',
    stops: 'Non-stop',
    baggage: '23 kg baggage',
    price: 7850,
    checkedAgo: 'Price checked 2 min ago.',
  },
  {
    badge: 'REDEYE',
    badgeBg: 'bg-[#e4007c]',
    airline: 'INDIGO',
    code: '6E 205',
    departure: { time: '10:45 PM', airport: 'BOM Terminal 1' },
    arrival: { time: '12:55 AM', airport: 'DEL Terminal 2' },
    via: 'via LKO',
    duration: '2h 10m',
    stops: '1 Stop',
    baggage: '15 kg baggage',
    price: 5120,
    checkedAgo: 'Price checked 3 min ago.',
  },
  {
    badge: '2 STOPS',
    badgeBg: 'bg-[#f39200]',
    airline: 'INDIGO',
    code: '6E 512',
    departure: { time: '3:10 PM', airport: 'BOM Terminal 1' },
    arrival: { time: '7:35 PM', airport: 'DEL Terminal 2' },
    via: 'via BLR, HYD',
    duration: '4h 25m',
    stops: '2 Stops',
    baggage: '15 kg baggage',
    price: 5460,
    checkedAgo: 'Price checked 9 sec ago.',
  },
];

const returnFlightData: Flight[] = [
  {
    badge: 'CHEAPEST',
    badgeBg: 'bg-[#f39200]',
    airline: 'SPICEJET',
    code: 'SG 421',
    departure: { time: '6:00 AM', airport: 'BOM Terminal 1' },
    arrival: { time: '8:20 AM', airport: 'DEL Terminal 2' },
    duration: '2h 20m',
    stops: 'Non-stop',
    baggage: '15 kg baggage',
    price: 4480,
    checkedAgo: 'Price checked 12 sec ago.',
  },
  {
    badge: 'EARLIEST',
    badgeBg: 'bg-[#1aa6e4]',
    airline: 'INDIGO',
    code: '6E 885',
    departure: { time: '5:30 AM', airport: 'BOM Terminal 1' },
    arrival: { time: '7:40 AM', airport: 'DEL Terminal 2' },
    duration: '2h 10m',
    stops: 'Non-stop',
    baggage: '15 kg baggage',
    price: 5120,
    checkedAgo: 'Price checked 8 sec ago.',
  },
  {
    badge: 'FASTEST',
    badgeBg: 'bg-[#7ac143]',
    airline: 'AIR INDIA',
    code: 'AI 632',
    departure: { time: '8:15 AM', airport: 'BOM Terminal 2' },
    arrival: { time: '10:05 AM', airport: 'DEL Terminal 3' },
    duration: '1h 50m',
    stops: 'Non-stop',
    baggage: '23 kg baggage',
    price: 6250,
    checkedAgo: 'Price checked 25 sec ago.',
  },
  {
    badge: 'BEST VALUE',
    badgeBg: 'bg-[#e4007c]',
    airline: 'AKASA',
    code: 'QP 1421',
    departure: { time: '4:35 PM', airport: 'BOM Terminal 1' },
    arrival: { time: '6:55 PM', airport: 'DEL Terminal 1' },
    duration: '2h 20m',
    stops: 'Non-stop',
    baggage: '20 kg baggage',
    price: 5980,
    checkedAgo: 'Price checked 31 sec ago.',
  },
  {
    badge: 'REDEYE',
    badgeBg: 'bg-[#1aa6e4]',
    airline: 'INDIGO',
    code: '6E 298',
    departure: { time: '11:20 PM', airport: 'BOM Terminal 1' },
    arrival: { time: '1:30 AM', airport: 'DEL Terminal 2' },
    via: 'via LKO',
    duration: '2h 10m',
    stops: '1 Stop',
    baggage: '15 kg baggage',
    price: 4980,
    checkedAgo: 'Price checked 42 sec ago.',
  },
];

// Days per visible window and defaults matching the original mock
// (initial window starts Wed, 16 Sep with Thu, 17 Sep selected).
export const STRIP_WINDOW = 7;
export const STRIP_DEFAULT_START = 7; // pool index of Wed, 16 Sep
export const STRIP_DEFAULT_SEL = 1; // selected day in the window: Thu, 17 Sep

// Exact fares from the design; surrounding days get a stable generated fare.
const KNOWN_DAY_FARES: Record<string, number> = {
  '2026-9-16': 7153,
  '2026-9-17': 7032,
  '2026-9-18': 7153,
  '2026-9-19': 7154,
  '2026-9-20': 7154,
  '2026-9-21': 7072,
  '2026-9-22': 7153,
};

const stripLabel = (d: Date) => {
  const wd = d.toLocaleDateString('en-US', { weekday: 'short' });
  const mo = d.toLocaleDateString('en-US', { month: 'short' });
  return `${wd}, ${d.getDate()} ${mo}`;
};

const stripPriceFor = (d: Date): number => {
  const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const known = KNOWN_DAY_FARES[key];
  if (known) return known;
  const raw = 7000 + ((d.getDate() * 173 + (d.getMonth() + 1) * 97 + 41) % 260);
  return Math.round(raw / 10) * 10;
};

// Pool of consecutive days around the default week so the arrows can page.
const datePoolData: StripDay[] = Array.from({ length: 28 }, (_, i) => {
  const day = new Date(2026, 8, 9 + i); // Wed, 09 Sep 2026 + i days
  return { label: stripLabel(day), price: stripPriceFor(day) };
});

// ── Return-date calendar dummy data ───────────────────────────────────────
// Static labels, deterministic pseudo-fares and occasions backing the
// return-date picker calendar (kept out of the page components).

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const priceFor = (year: number, month: number, day: number): { price: string; level: 'low' | 'mid' | 'high' } => {
  // Deterministic pseudo prices so the calendar is stable across renders
  const raw = 5200 + ((day * 371 + month * 199 + year * 7) % 8800);
  const rounded = Math.round(raw / 10) * 10;
  const level = rounded < 7000 ? 'low' : rounded < 8800 ? 'mid' : 'high';
  const formatted = `₹${Math.round((rounded / 1000) * 10) / 10}k`;
  return { price: formatted, level };
};

export const priceColor: Record<'low' | 'mid' | 'high', string> = {
  low: 'text-[#34d399]',
  mid: 'text-[#eab308]',
  high: 'text-[#fb923c]',
};

export type Holiday = {
  name: string;
  dates: string;
  emoji: string;
  accent: string;
  from: { y: number; m: number; d: number }; // m is 0-based
  to: { y: number; m: number; d: number };
};

export const HOLIDAYS: Holiday[] = [
  { name: 'Janmashtami (Long Weekend)', dates: 'Fri, 04 Sep - Sun, 06 Sep • 3 Days', emoji: '🦚', accent: '#fb923c', from: { y: 2026, m: 8, d: 4 }, to: { y: 2026, m: 8, d: 6 } },
  { name: 'Janmashtami', dates: 'Fri, 04 Sep • 1 Day', emoji: '🦚', accent: '#fb923c', from: { y: 2026, m: 8, d: 4 }, to: { y: 2026, m: 8, d: 4 } },
  { name: 'Gandhi Jayanti', dates: 'Fri, 02 Oct • 1 Day', emoji: '🕊️', accent: '#34d399', from: { y: 2026, m: 9, d: 2 }, to: { y: 2026, m: 9, d: 2 } },
  { name: 'Dussehra', dates: 'Wed, 21 Oct • 1 Day', emoji: '🏹', accent: '#eab308', from: { y: 2026, m: 9, d: 21 }, to: { y: 2026, m: 9, d: 21 } },
];

export const holidayForDate = (year: number, month: number, day: number): Holiday | undefined =>
  HOLIDAYS.find((h) => {
    const s = new Date(h.from.y, h.from.m, h.from.d);
    const e = new Date(h.to.y, h.to.m, h.to.d);
    const d = new Date(year, month, day);
    return d >= s && d <= e;
  });

type FlightStore = {
  // Client-side dummy data (seeded here so zustand owns it)
  flights: Flight[];
  returnFlights: Flight[];
  datePool: StripDay[];

  // UI state
  fromCity: string;
  toCity: string;
  returnOpen: boolean;
  filtersOpen: boolean;
  monthOffset: number;
  returnDate: string | null;
  searching: boolean;
  searched: boolean;
  selectedOnward: Flight | null;
  selectedReturn: Flight | null;
  onwardSort: SortKey;
  returnSort: SortKey;
  stripStart: number;
  stripSel: number;
  openFilters: boolean[];
  setReturnOpen: (v: boolean) => void;
  setFiltersOpen: (v: boolean) => void;
  toggleFilterGroup: (i: number) => void;
  clearFilters: () => void;
  shiftMonth: (dir: -1 | 1) => void;
  pickReturnDate: (label: string) => void;
  setSelectedOnward: (f: Flight | null) => void;
  setSelectedReturn: (f: Flight | null) => void;
  setOnwardSort: (k: SortKey) => void;
  setReturnSort: (k: SortKey) => void;
  setStripSel: (i: number) => void;
  shiftStrip: (dir: -1 | 1) => void;
  swapCities: () => void;
  doSearch: () => void;
};

export const useFlightStore = create<FlightStore>()((set, get) => ({
  flights: onwardFlights,
  returnFlights: returnFlightData,
  datePool: datePoolData,

  fromCity: 'PNQ - Pune',
  toCity: 'DEL - New Delhi',
  returnOpen: false,
  filtersOpen: false,
  monthOffset: 0,
  returnDate: null,
  searching: false,
  searched: false,
  selectedOnward: null,
  selectedReturn: null,
  onwardSort: 'price',
  returnSort: 'price',
  stripStart: STRIP_DEFAULT_START,
  stripSel: STRIP_DEFAULT_SEL,
  openFilters: Array(8).fill(false),

  setReturnOpen: (v) => set({ returnOpen: v }),
  setFiltersOpen: (v) => set({ filtersOpen: v }),
  toggleFilterGroup: (i) =>
    set((s) => ({ openFilters: s.openFilters.map((v, idx) => (idx === i ? !v : v)) })),
  clearFilters: () => {
    set({
      openFilters: Array(8).fill(false),
      returnDate: null,
      selectedOnward: null,
      selectedReturn: null,
      onwardSort: 'price',
      returnSort: 'price',
      monthOffset: 0,
      stripStart: STRIP_DEFAULT_START,
      stripSel: STRIP_DEFAULT_SEL,
    });
    toast({ kind: 'info', code: 200, title: 'Filters Cleared', message: 'All filters have been reset.' });
  },
  shiftMonth: (dir) =>
    set((s) => ({ monthOffset: Math.max(-12, Math.min(12, s.monthOffset + dir)) })),
  pickReturnDate: (label) => set({ returnDate: label, returnOpen: false }),
  setSelectedOnward: (f) => set({ selectedOnward: f }),
  setSelectedReturn: (f) => set({ selectedReturn: f }),
  setOnwardSort: (k) => set({ onwardSort: k }),
  setReturnSort: (k) => set({ returnSort: k }),
  setStripSel: (i) => set({ stripSel: i }),
  shiftStrip: (dir) =>
    set((s) => ({
      stripStart:
        dir < 0
          ? Math.max(0, s.stripStart - STRIP_WINDOW)
          : Math.min(s.datePool.length - STRIP_WINDOW, s.stripStart + STRIP_WINDOW),
    })),
  swapCities: () => set((s) => ({ fromCity: s.toCity, toCity: s.fromCity })),

  doSearch: () => {
    const { searching, fromCity, toCity, returnDate } = get();
    if (searching) return;
    const fromCode = fromCity.split(' - ')[0];
    const toCode = toCity.split(' - ')[0];
    if (fromCode === toCode) {
      toast({ kind: 'error', code: 400, title: 'Bad Request', message: 'From and To cities must be different.' });
      return;
    }
    if (!returnDate) {
      toast({ kind: 'warning', code: 400, title: 'No Return Date', message: 'Showing one-way results — select a return date for round-trip pricing.' });
    }
    set({ selectedOnward: null, selectedReturn: null, searching: true });
    window.setTimeout(() => {
      set({ searching: false, searched: true });
      const { fromCity: fc, toCity: tc } = get();
      toast({ kind: 'success', code: 200, title: 'Search Complete', message: `${fc} → ${tc} flights loaded.` });
    }, 1400);
  },
}));
