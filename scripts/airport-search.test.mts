// Temporary functional test for the airport search service + flight store
// single-select logic. Run: node scripts/airport-search.test.mjs (after bundling)
import assert from 'node:assert/strict';
import { searchAirports, airportByCode, airportFromLabel, MAX_AIRPORT_RESULTS } from '../src/services/airportSearch';
import { useFlightStore } from '../src/store/flightStore';

const codes = (list: { iataCode: string }[]) => list.map((a) => a.iataCode);

// ── Search: Pune ────────────────────────────────────────────────────────────
let r = await searchAirports('pune');
assert.equal(r[0].iataCode, 'PNQ', 'pune → PNQ first');
assert.ok(!codes(r).includes('BOM'), 'pune does not match unrelated airports');

// ── Search: PNQ (exact IATA wins) ───────────────────────────────────────────
r = await searchAirports('PNQ');
assert.equal(r[0].iataCode, 'PNQ', 'PNQ exact IATA first');
assert.equal(r[0].city, 'Pune');

// Case-insensitive IATA
r = await searchAirports('pnq');
assert.equal(r[0].iataCode, 'PNQ', 'lowercase pnq works');

// ── Search: Mumbai ──────────────────────────────────────────────────────────
r = await searchAirports('Mumbai');
assert.equal(r[0].iataCode, 'BOM', 'Mumbai → BOM');

// ── Search: India (country) ─────────────────────────────────────────────────
r = await searchAirports('india');
assert.equal(r.length, MAX_AIRPORT_RESULTS, 'India results capped at the display limit');
assert.ok(r.every((a) => a.country === 'India'), 'all results are Indian');

// ── Search: Dubai ───────────────────────────────────────────────────────────
r = await searchAirports('Dubai');
assert.equal(r[0].iataCode, 'DXB', 'Dubai → DXB');

// ── Search: London (UK airports) ────────────────────────────────────────────
r = await searchAirports('London');
assert.ok(r.some((a) => a.iataCode === 'LHR'), 'London includes LHR');
assert.ok(r.every((a) => a.country === 'United Kingdom'), 'London → UK airports only');

// ── Search: airport name ────────────────────────────────────────────────────
r = await searchAirports('Indira Gandhi');
assert.equal(r[0].iataCode, 'DEL', 'airport name search → DEL');

// ── Invalid query ───────────────────────────────────────────────────────────
r = await searchAirports('xyzzy123');
assert.deepEqual(r, [], 'invalid query → no results');

// ── Empty query ─────────────────────────────────────────────────────────────
r = await searchAirports('   ');
assert.deepEqual(r, [], 'blank query → no results');

// ── Lookup helpers ──────────────────────────────────────────────────────────
assert.equal(airportByCode('DXB')?.city, 'Dubai');
assert.equal(airportFromLabel('DEL - New Delhi').iataCode, 'DEL');
assert.equal(airportFromLabel('PNQ - Pune').city, 'Pune');

// ── Store: single select, replace, From≠To guard, swap ──────────────────────
const s = useFlightStore.getState();
assert.equal(s.fromCity, 'PNQ - Pune');
assert.equal(s.fromAirport.iataCode, 'PNQ');
assert.equal(s.toAirport.iataCode, 'DEL');
assert.equal(s.toCity, 'DEL - New Delhi');

// Selecting another airport replaces the previous selection
s.setFromAirport(airportByCode('BOM')!);
let now = useFlightStore.getState();
assert.equal(now.fromAirport.iataCode, 'BOM');
assert.equal(now.fromCity, 'BOM - Mumbai', 'label mirrors the new selection');

// The same airport cannot be used for both From and To
now.setToAirport(airportByCode('BOM')!);
now = useFlightStore.getState();
assert.equal(now.toAirport.iataCode, 'DEL', 'To unchanged — same airport rejected');
assert.equal(now.toCity, 'DEL - New Delhi');

now.setFromAirport(airportByCode('DEL')!);
now = useFlightStore.getState();
assert.equal(now.fromAirport.iataCode, 'BOM', 'From unchanged — same airport rejected');
assert.equal(now.fromCity, 'BOM - Mumbai');

// To-side replacement works when it doesn't clash with From
now.setToAirport(airportByCode('GAU')!);
now = useFlightStore.getState();
assert.equal(now.toAirport.iataCode, 'GAU');
assert.equal(now.toCity, 'GAU - Guwahati');

// Re-selecting the same airport is a harmless replacement
now.setToAirport(airportByCode('GAU')!);
now = useFlightStore.getState();
assert.equal(now.toAirport.iataCode, 'GAU');

// Swap exchanges both selections and labels
now.swapCities();
now = useFlightStore.getState();
assert.equal(now.fromAirport.iataCode, 'GAU');
assert.equal(now.fromCity, 'GAU - Guwahati');
assert.equal(now.toAirport.iataCode, 'BOM');
assert.equal(now.toCity, 'BOM - Mumbai');

// doSearch guard still works off the mirrored label strings
assert.equal(now.fromCity.split(' - ')[0], 'GAU');

console.log('✅ All airport search + store single-select tests passed');


// ── Search: PNQ (exact IATA wins) ───────────────────────────────────────────
r = await searchAirports('PNQ');
assert.equal(r[0].iataCode, 'PNQ', 'PNQ exact IATA first');
assert.equal(r[0].city, 'Pune');

// Case-insensitive IATA
r = await searchAirports('pnq');
assert.equal(r[0].iataCode, 'PNQ', 'lowercase pnq works');

// ── Search: Mumbai ──────────────────────────────────────────────────────────
r = await searchAirports('Mumbai');
assert.equal(r[0].iataCode, 'BOM', 'Mumbai → BOM');

// ── Search: India (country) ─────────────────────────────────────────────────
r = await searchAirports('india');
assert.equal(r.length, MAX_AIRPORT_RESULTS, 'India results capped at the display limit');
assert.ok(r.every((a) => a.country === 'India'), 'all results are Indian');

// ── Search: Dubai ───────────────────────────────────────────────────────────
r = await searchAirports('Dubai');
assert.equal(r[0].iataCode, 'DXB', 'Dubai → DXB');

// ── Search: London (UK airports) ────────────────────────────────────────────
r = await searchAirports('London');
assert.ok(r.some((a) => a.iataCode === 'LHR'), 'London includes LHR');
assert.ok(r.every((a) => a.country === 'United Kingdom'), 'London → UK airports only');

// ── Search: airport name ────────────────────────────────────────────────────
r = await searchAirports('Indira Gandhi');
assert.equal(r[0].iataCode, 'DEL', 'airport name search → DEL');

// ── Invalid query ───────────────────────────────────────────────────────────
r = await searchAirports('xyzzy123');
assert.deepEqual(r, [], 'invalid query → no results');

// ── Empty query ─────────────────────────────────────────────────────────────
r = await searchAirports('   ');
assert.deepEqual(r, [], 'blank query → no results');

// ── Lookup helpers ──────────────────────────────────────────────────────────
assert.equal(airportByCode('dx b'.replace(' ', ''))?.city, 'Dubai');
assert.equal(airportFromLabel('DEL - New Delhi').iataCode, 'DEL');
assert.equal(airportFromLabel('PNQ - Pune').city, 'Pune');

// ── Store: multi-select, dedupe, primary label, swap ────────────────────────
const s = useFlightStore.getState();
assert.equal(s.fromCity, 'PNQ - Pune');
assert.deepEqual(codes(s.fromAirports), ['PNQ']);

// Select multiple, including a duplicate attempt
s.addFromAirport(airportByCode('BOM')!);
s.addFromAirport(airportByCode('DEL')!);
s.addFromAirport(airportByCode('BOM')!); // duplicate → ignored
const after = useFlightStore.getState();
assert.deepEqual(codes(after.fromAirports), ['PNQ', 'BOM', 'DEL'], 'multi-select, no duplicates');
assert.equal(after.fromCity, 'PNQ - Pune', 'first selection stays primary');

// Remove one → primary unchanged; remove all but one → primary updates
after.removeFromAirport('BOM');
let now = useFlightStore.getState();
assert.deepEqual(codes(now.fromAirports), ['PNQ', 'DEL']);
assert.equal(now.fromCity, 'PNQ - Pune');
now.removeFromAirport('PNQ');
now = useFlightStore.getState();
assert.deepEqual(codes(now.fromAirports), ['DEL']);
assert.equal(now.fromCity, 'DEL - New Delhi', 'primary follows first remaining');

// To-side helpers + swap
now.addToAirport(airportByCode('BOM')!);
now = useFlightStore.getState();
assert.deepEqual(codes(now.toAirports), ['DEL', 'BOM'], 'multi-select on To side');
assert.equal(now.toCity, 'DEL - New Delhi', 'primary To stays first selection');

now.swapCities();
now = useFlightStore.getState();
assert.deepEqual(codes(now.fromAirports), ['DEL', 'BOM'], 'swap swaps lists');
assert.deepEqual(codes(now.toAirports), ['DEL']);
assert.equal(now.fromCity, 'DEL - New Delhi');
assert.equal(now.toCity, 'DEL - New Delhi');

// doSearch guard still works off the mirrored label strings
assert.equal(now.fromCity.split(' - ')[0], 'DEL');

console.log('✅ All airport search + store multi-select tests passed');
