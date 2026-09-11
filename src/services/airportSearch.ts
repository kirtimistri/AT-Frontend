// airportSearch.ts
// Airport search service. The UI talks to this module only – never to the
// dataset directly. `searchAirports` returns a Promise so a future real
// airport/flight API can replace the local dataset without rewriting the UI.
import { AIRPORTS } from '../data/airports';
import type { Airport } from '../data/airports';

/** Cap the number of rows rendered – keep the dropdown fast. */
export const MAX_AIRPORT_RESULTS = 12;

/** Priority buckets for ranking (lower = earlier). */
type Rank = 0 | 1 | 2 | 3 | 4;

const rankAirport = (a: Airport, q: string): Rank | null => {
  const iata = a.iataCode.toLowerCase();
  const city = a.city.toLowerCase();
  const name = a.airportName.toLowerCase();
  const country = a.country.toLowerCase();

  if (iata === q) return 0; // exact IATA code
  if (city === q) return 1; // exact city
  if (city.startsWith(q)) return 2; // city starts with term
  if (name.startsWith(q)) return 3; // airport name starts with term
  if (iata.startsWith(q) || city.includes(q) || name.includes(q) || country.includes(q)) {
    return 4; // partial match anywhere
  }
  return null;
};

/**
 * Case-insensitive search over iataCode, city, airportName and country.
 * Results are ranked 0 → 4 per the priority list and capped at `limit`.
 */
export const searchAirports = (
  rawQuery: string,
  limit: number = MAX_AIRPORT_RESULTS,
): Promise<Airport[]> => {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return Promise.resolve([]);

  const hits: { airport: Airport; rank: Rank }[] = [];
  for (const airport of AIRPORTS) {
    const rank = rankAirport(airport, query);
    if (rank !== null) hits.push({ airport, rank });
  }

  hits.sort((x, y) => {
    if (x.rank !== y.rank) return x.rank - y.rank;
    if (x.airport.iataCode !== y.airport.iataCode) {
      return x.airport.iataCode < y.airport.iataCode ? -1 : 1;
    }
    return x.airport.city < y.airport.city ? -1 : 1;
  });

  return Promise.resolve(hits.slice(0, limit).map((h) => h.airport));
};

/** Direct lookup by IATA code (used to seed selections from stored labels). */
export const airportByCode = (code: string): Airport | undefined =>
  AIRPORTS.find((a) => a.iataCode.toUpperCase() === code.toUpperCase());

/** Parse a "CODE - City" label into an Airport, falling back to a best-effort object. */
export const airportFromLabel = (label: string): Airport => {
  const [code, city = ''] = label.split(' - ');
  const trimmedCode = code.trim();
  const known = airportByCode(trimmedCode);
  if (known) return known;
  const trimmedCity = city.trim() || trimmedCode;
  return { iataCode: trimmedCode, city: trimmedCity, airportName: trimmedCity, country: '' };
};