import type { Flight, SortKey } from '../store/flightStore';

export const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export const stripInr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const minutesToHm = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;

export const airportCodeOf = (airport: string) => airport.split(' ')[0];

export const terminalOf = (airport: string) => airport.match(/Terminal (\d+)/)?.[1] ?? '1';

export const viaCities = (via?: string): string[] =>
  via ? via.replace(/^via\s*/i, '').split(',').map((c) => c.trim()).filter(Boolean) : [];

export const stopsCount = (s: string): number => {
  const m = s.match(/(\d+)\s*Stop/i);
  return m ? parseInt(m[1], 10) : 0;
};

const CITY_NAMES: Record<string, string> = {
  BOM: 'Mumbai',
  DEL: 'Delhi',
  PNQ: 'Pune',
  LKO: 'Lucknow',
  BLR: 'Bengaluru',
  HYD: 'Hyderabad',
};

export const cityNameOf = (code: string) => CITY_NAMES[code] ?? code;

export const twelveHToMins = (t: string): number => {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  const h = (parseInt(m[1], 10) % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0);
  return h * 60 + parseInt(m[2], 10);
};

export const minsToTwelveH = (m: number): string => {
  const h24 = ((m % 1440) + 1440) % 1440;
  const h = Math.floor(h24 / 60);
  const min = h24 % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, '0')} ${period}`;
};

export const legFlightCode = (f: Flight, i: number): string => {
  if (i === 0) return f.code;
  const m = f.code.match(/^(\D+)\s*(\d+)$/);
  if (!m) return f.code;
  return `${m[1]} ${parseInt(m[2], 10) + 31 + i * 47}`;
};

export const durationMinutes = (d: string): number => {
  const m = d.match(/(\d+)h\s*(\d+)?m?/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 60 + (m[2] ? parseInt(m[2], 10) : 0);
};

export const timeMinutes = (t: string): number => {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/);
  if (!m) return 0;
  const h = (parseInt(m[1], 10) % 12) + (m[3] === 'PM' ? 12 : 0);
  return h * 60 + parseInt(m[2], 10);
};

export const sortFlights = (list: Flight[], key: SortKey): Flight[] => {
  const arr = [...list];
  if (key === 'price') arr.sort((a, b) => a.price - b.price);
  else if (key === 'fastest') arr.sort((a, b) => durationMinutes(a.duration) - durationMinutes(b.duration));
  else arr.sort((a, b) => timeMinutes(a.departure.time) - timeMinutes(b.departure.time));
  return arr;
};