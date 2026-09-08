import type { Flight } from '../store/flightStore';

/* ============================================================================
   Ancillary / SSR data derivation.
   ----------------------------------------------------------------------------
   The app's data model only exposes a single flight `price` (see
   priceBreakdownOf, legFlightCode, minutesToHm in ./format). Real seat-map,
   meal, baggage and special-service APIs are not wired into this project yet.
   Following the same "derive deterministically from the flight" convention
   established elsewhere in the codebase, this module derives a stable,
   deterministic catalog of ancillaries from a flight's code / airline / price
   so the UI can be built and tested against realistic data.

   This is a thin adapter boundary: swap these pure functions for real API
   responses (returning { code, name, description, price, currency, available,
   quantity, segmentId, travellerId }) without changing the presentation layer.
   ============================================================================ */

export type AncillaryKind = 'meal' | 'seat' | 'baggage' | 'ssr';

export type MealOption = {
  code: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  imageUrl: string;
};

export type SeatStatus = 'available' | 'occupied' | 'selected' | 'blocked';
export type SeatFeature = 'exit' | 'legroom' | 'nonrecline';

export type Seat = {
  number: string;
  row: number;
  column: string;
  status: SeatStatus;
  features: SeatFeature[];
  price: number;
};

export type BaggageOption = {
  code: string;
  name: string;
  weightKg: number;
  description: string;
  price: number;
  available: boolean;
};

export type SsrOption = {
  code: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
};

export type AncillaryCatalog = {
  airline: string;
  flightCode: string;
  meals: MealOption[];
  seats: Seat[];
  baggage: BaggageOption[];
  ssr: SsrOption[];
};

/* Deterministic single-char hash of a string -> 0..mask */
const hash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const SEAT_COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
const SEAT_ROWS = 20;

const priceFrom = (seed: number, base: number, spread: number) =>
  Math.round((base + (seed % spread)) / 10) * 10;

/* Meals — deterministic but reuses the same categories shown in the app's
   SeatMealCard (Vegetarian, Non-Vegetarian, Jain) plus a light option.
   Each meal carries a small square thumbnail (Unsplash CDN, verified live). */
const MEAL_IMAGES: Record<string, string> = {
  VEGM: 'photo-1546833999-b9f581a1996d',
  NVGM: 'photo-1604503468506-a8da13d82791',
  JAIN: 'photo-1546069901-ba9599a7e63c',
  VGTD: 'photo-1512621776951-a57141f2eefd',
};
const mealImage = (code: string) =>
  `https://images.unsplash.com/${MEAL_IMAGES[code]}?auto=format&fit=crop&w=112&h=112&q=80`;

export const mealsOf = (flight: Flight): MealOption[] => {
  const h = hash(flight.code);
  const veg = priceFrom(h, 250, 91);
  const list: MealOption[] = [
    {
      code: 'VEGM',
      name: 'Veg Meal',
      description: 'Vegetarian meal — fresh seasonal vegetables, rice and bread.',
      price: veg,
      available: (h >> 1) % 10 !== 0,
      imageUrl: mealImage('VEGM'),
    },
    {
      code: 'NVGM',
      name: 'Non-Veg Meal',
      description: 'Non-vegetarian meal — grilled chicken with herbs and rice.',
      price: veg + 50,
      available: true,
      imageUrl: mealImage('NVGM'),
    },
    {
      code: 'JAIN',
      name: 'Jain Meal',
      description: 'Jain meal — no root vegetables, onion or garlic.',
      price: veg + 30,
      available: true,
      imageUrl: mealImage('JAIN'),
    },
    {
      code: 'VGTD',
      name: 'Vegan Meal',
      description: 'Plant-based vegan meal with tofu and quinoa.',
      price: veg + 20,
      available: (h >> 2) % 10 !== 0,
      imageUrl: mealImage('VGTD'),
    },
  ];
  return list;
};

/* Seat map — deterministic grid generated from the flight code. The occupied /
   blocked cells are derived so every flight renders a slightly different map.
   Seat numbers genuinely come from the flight (not hardcoded labels). */
export const seatsOf = (flight: Flight): Seat[] => {
  const seats: Seat[] = [];
  for (let r = 1; r <= SEAT_ROWS; r++) {
    for (const col of SEAT_COLUMNS) {
      const seed = hash(`${flight.code}:${r}${col}`);
      const features: SeatFeature[] = [];
      const price = priceFrom(seed, 0, 801); // 0 for free, else up to ₹800
      const isExit = r === 1 || r === SEAT_ROWS;
      const isLegroom = r % 5 === 0;
      const isNonrecline = r % 4 === 0;
      if (isExit) features.push('exit');
      if (isLegroom) features.push('legroom');
      if (isNonrecline) features.push('nonrecline');
      const occupied = seed % 3 === 0;
      seats.push({
        number: `${r}${col}`,
        row: r,
        column: col,
        status: occupied ? 'occupied' : 'available',
        features,
        price,
      });
    }
  }
  return seats;
};

export const baggageOf = (flight: Flight): BaggageOption[] => {
  const h = hash(flight.code);
  const base = priceFrom(h, 600, 500) * 2; // base doubles (10 kg reference)
  return [
    {
      code: 'BAG5',
      name: '5 KG Extra Baggage',
      weightKg: 5,
      description: 'Additional 5 KG checked baggage for this segment.',
      price: Math.round(base / 4 / 10) * 10,
      available: true,
    },
    {
      code: 'BAG10',
      name: '10 KG Extra Baggage',
      weightKg: 10,
      description: 'Additional 10 KG checked baggage for this segment.',
      price: Math.round(base / 2 / 10) * 10,
      available: true,
    },
    {
      code: 'BAG15',
      name: '15 KG Extra Baggage',
      weightKg: 15,
      description: 'Additional 15 KG checked baggage for this segment.',
      price: Math.round((base * 3) / 4 / 10) * 10,
      available: true,
    },
  ];
};

export const ssrOf = (flight: Flight): SsrOption[] => {
  const h = hash(flight.code);
  const p = (seedOffset: number, base: number, spread: number) =>
    priceFrom(h + seedOffset * 97, base, spread);
  return [
    {
      code: 'WCHR',
      name: 'Wheelchair Assistance',
      description: 'Priority wheelchair assistance at origin and destination.',
      price: 0,
      available: true,
    },
    {
      code: 'PRB',
      name: 'Priority Boarding',
      description: 'Board the aircraft early before the general queue.',
      price: p(1, 350, 151),
      available: true,
    },
    {
      code: 'SPEQ',
      name: 'Sports Equipment',
      description: 'Carry one piece of sports equipment (ski / golf) as checked baggage.',
      price: p(2, 1200, 601),
      available: (h >> 3) % 10 !== 0,
    },
    {
      code: 'ASST',
      name: 'Special Assistance',
      description: 'Dedicated ground staff assistance through the airport.',
      price: 0,
      available: true,
    },
    {
      code: 'EXBG',
      name: 'Extra Hand Baggage',
      description: 'Add an additional cabin bag of up to 5 KG.',
      price: p(3, 800, 401),
      available: (h >> 4) % 10 !== 0,
    },
  ];
};

export const catalogueOf = (flight: Flight): AncillaryCatalog => ({
  airline: flight.airline,
  flightCode: flight.code,
  meals: mealsOf(flight),
  seats: seatsOf(flight),
  baggage: baggageOf(flight),
  ssr: ssrOf(flight),
});

/* ---- Selected-ancillary shape (mirrors the conceptual state in the spec) ---- */

export type SegmentKey = string; // "onward" | "return"
export type AncillarySelection = {
  meal: MealOption | null;
  seat: Seat | null;
  baggage: BaggageOption | null;
  ssr: SsrOption[];
};

export const emptySelection = (): AncillarySelection => ({
  meal: null,
  seat: null,
  baggage: null,
  ssr: [],
});

export const selectionTotal = (sel: AncillarySelection): number =>
  (sel.meal?.price ?? 0) +
  (sel.seat?.price ?? 0) +
  (sel.baggage?.price ?? 0) +
  sel.ssr.reduce((s, x) => s + x.price, 0);
