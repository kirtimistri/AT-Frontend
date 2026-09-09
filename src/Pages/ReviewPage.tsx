// Flight review page: shows the selected flight(s), traveller details and a
// fare summary so the user can confirm before going to payment.
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Flight } from '../store/flightStore';
import { inr } from '../lib/format';
import { parseFlightParam } from '../lib/review';
import { AirlineLogo } from '../components/Logos';
import { BrandLogo } from '../components/BrandLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { Clock, ArrowLeftRight, PlaneFill, PlaneTakeoff } from '../components/icons';

// Lookup of airport codes to readable names.
const AIRPORT_NAMES: Record<string, string> = {
  PNQ: 'Pune Airport',
  BOM: 'Mumbai Intl',
  DEL: 'Lokpriya Gopinath Int',
  BLR: 'Kempegowda Intl',
  HYD: 'Rajiv Gandhi Intl',
  LKO: 'Lucknow Intl',
};

// Small helpers: pull the airport code, terminal number, and pretty label.
const airportCode = (airport: string) => airport.split(' ')[0];
const terminalOf = (airport: string) => (airport.match(/Terminal (\d+)/)?.[1] ?? '1');
const airportLabel = (airport: string) => `${AIRPORT_NAMES[airportCode(airport)] ?? airportCode(airport)}${airport.match(/Terminal (\d+)/) ? `, T${terminalOf(airport)}` : ''}`;

// Price helpers: break a fare into base, taxes, airline fee and insurance.
const fareOf = (f: Flight) => {
  const base = f.price;
  const taxes = Math.round((base * 0.18) / 10) * 10;
  const airlineFee = Math.round((base * 0.025) / 10) * 10;
  const insurance = 199;
  return { base, taxes, airlineFee, insurance, total: base + taxes + airlineFee + insurance };
};

// Add up the fare parts across all segments.
const sumFares = (list: ReturnType<typeof fareOf>[]) =>
  list.reduce(
    (acc, f) => ({
      base: acc.base + f.base,
      taxes: acc.taxes + f.taxes,
      airlineFee: acc.airlineFee + f.airlineFee,
      insurance: acc.insurance + f.insurance,
      total: acc.total + f.total,
    }),
    { base: 0, taxes: 0, airlineFee: 0, insurance: 0, total: 0 }
  );

// How long the price is "held" for the user (in seconds).
const holdingSeconds = 585;

// Banner that counts down how long the current price is guaranteed.
const HoldingPriceBar = () => {
  const [secs, setSecs] = useState(holdingSeconds);
  // Tick down every second while this component is mounted.
  useEffect(() => {
    const t = window.setInterval(() => setSecs((s) => (s <= 0 ? 0 : s - 1)), 1000);
    return () => window.clearInterval(t);
  }, []);
  // Format remaining time as MM:SS.
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return (
    <div className="flex flex-col items-start justify-between gap-2 rounded-[12px] border border-[#29466e] bg-[#0d1b2a] px-4 py-3 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="rounded-full bg-[#2593fc]/20 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-[#7CC0FF]">
          HOLDING PRICE
        </span>
        <span className="text-[12px] text-[#9baec7]">
          Please verify all passenger details and corporate policies before payment.
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#d4af37]/60 px-3 py-1.5">
        <Clock className="h-3.5 w-3.5 text-[#f0c265]" />
        <span className="text-[13px] font-bold tabular-nums text-[#f0c265]">{mm}:{ss} mins</span>
      </div>
    </div>
  );
};

// Banner explaining the booking complies with corporate travel policy.
const PolicyBar = () => (
  <div className="flex flex-col items-start gap-2 rounded-[12px] border border-[#1e8e5a] bg-[rgba(34,197,94,0.09)] px-4 py-3 sm:flex-row sm:items-center">
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="text-[13px] font-bold text-[#34d399]">Corporate Travel Policy Compliant</span>
    </div>
    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#22c55e]/20 px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-[#34d399]">
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Approved
    </span>
    <p className="w-full text-[11px] text-[#b6c3d5] sm:w-auto sm:max-w-lg sm:text-right">
      This itinerary aligns with standard enterprise limits. Economy Q Class is authorized for domestic flights under 4 hours.
    </p>
  </div>
);

// One row of the fare summary (label + value).
const FareRow = ({ label, sub, value }: { label: string; sub?: string; value: string }) => (
  <div className="flex items-center justify-between gap-3 px-3.5 py-1.5">
    <div className="min-w-0">
      <div className="text-[12px] font-semibold text-white">{label}</div>
      {sub && <div className="text-[10px] text-[#7e93b3]">{sub}</div>}
    </div>
    <span className="shrink-0 text-[12.5px] font-bold tabular-nums text-white">{value}</span>
  </div>
);

// Small service badge (e.g. Check-in, Cabin, Meal).
const ServiceChip = ({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-[96px] flex-col items-center rounded-[10px] border border-[#29466e] bg-white/[0.03] px-3 py-2">
    <span className="text-[9.5px] font-semibold uppercase tracking-wide text-[#7e93b3]">{label}</span>
    <span className="mt-0.5 text-[12px] font-bold text-white">{value}</span>
  </div>
);

// Read-only text field used for displaying traveller details.
const Field = ({ label, value }: { label: string; value: string }) => (
  <label className="block">
    <span className="text-[11px] font-semibold text-[#9baec7]">{label}</span>
    <input
      readOnly
      defaultValue={value}
      className="mt-1 w-full rounded-[9px] border border-[#315073] bg-[#0d1b2a] px-3 py-2 text-[13px] text-white outline-none transition-colors focus:border-[#2593fc]"
    />
  </label>
);

// Card that shows one flight's details (airline, times, airports, dates).
const FlightSegment = ({ f, date, label }: { f: Flight; date: string; label?: string }) => {
  // Is this a direct or connecting flight?
  const nonStop = /non-?stop/i.test(f.stops);
  const direct = nonStop ? 'Direct Flight' : 'Connecting Flight';
  return (
    <div className="rounded-[12px] border border-[#29466e] bg-[#0f172a] p-4">
      {label && (
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-[#2593fc]/20 px-2.5 py-1 text-[9.5px] font-bold tracking-[0.12em] text-[#7CC0FF]">{label}</span>
        </div>
      )}
      {/* airline header */}
      <div className="flex items-center gap-2.5">
        <AirlineLogo airline={f.airline} />
        <div className="min-w-0">
          <div className="text-[15px] font-bold leading-tight">{f.airline}</div>
          <div className="truncate text-[11.5px] text-[#9baec7]">{f.code} • Airbus A320neo • Economy Q class • On-time 94%</div>
        </div>
      </div>
      {/* top meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-dashed border-[#73869e] pb-3 text-[11.5px]">
        <span className="flex items-center gap-1.5 text-[#34d399]">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Refundable
        </span>
        <span className="h-3 w-px bg-[#315073]" />
        <span className="font-semibold text-white">{direct}</span>
        <span className="h-3 w-px bg-[#315073]" />
        <span className="text-[#9baec7]">{f.duration}</span>
      </div>

      {/* times */}
      <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <div>
          <div className="text-[17px] font-bold leading-none">{f.departure.time}</div>
          <div className="mt-1.5 text-[11.5px] font-semibold text-[#7CC0FF]">{airportCode(f.departure.airport)}</div>
          <div className="mt-0.5 text-[11px] text-[#9baec7]">{airportLabel(f.departure.airport)}</div>
        </div>
        <div className="relative mx-1 min-w-0">
          <div className="border-t border-dotted border-[#8295ad]" />
          {f.via ? <div className="mt-0.5 text-center text-[10px] text-[#fdba74]">1 Stop</div> : <div className="mt-0.5 text-center text-[10px] text-[#fdba74]">No Layovers</div>}
        </div>
        <div className="text-right">
          <div className="text-[17px] font-bold leading-none">{f.arrival.time}</div>
          <div className="mt-1.5 text-[11.5px] font-semibold text-[#7CC0FF]">{airportCode(f.arrival.airport)}</div>
          <div className="mt-0.5 text-[11px] text-[#9baec7]">{airportLabel(f.arrival.airport)}</div>
        </div>
      </div>

      {/* dates */}
      <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#73869e] pt-3 text-[10.5px] text-[#9baec7]">
        <span>{date || 'Thu, 24 Oct 2024'}</span>
        <PlaneFill className="h-3.5 w-3.5 rotate-45 text-[#fdba74]" />
        <span>{date || 'Thu, 24 Oct 2024'}</span>
      </div>
    </div>
  );
};

const ReviewPage = () => {
  // Read the selected flight(s) from the URL query params.
  const [params] = useSearchParams();
  const f = parseFlightParam(params.get('flight'));
  const onward = parseFlightParam(params.get('onward'));
  const ret = parseFlightParam(params.get('ret'));
  const date = params.get('date') ?? '';
  const retDate = params.get('retDate') ?? '';

  // If no flight was selected, show a friendly "go back" screen.
  if (!f && !onward && !ret) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#0B132B] px-6 text-center text-white">
        <p className="text-[15px] font-bold">No flight selected</p>
        <Link to="/search" className="rounded-full border border-[#315073] px-4 py-2 text-[12.5px] font-semibold text-[#7CC0FF] transition-colors hover:border-[#d4af37] hover:text-[#f0c265]">
          Back to Search Results
        </Link>
      </div>
    );
  }

  // Build the list of segments to show: one for one-way, two for round-trip.
  const roundTrip = !!(onward && ret);
  const segments = roundTrip
    ? [
        { f: onward as Flight, date, label: 'ONWARD' },
        { f: ret as Flight, date: retDate || date, label: 'RETURN' },
      ]
    : [{ f: (f ?? onward ?? ret) as Flight, date, label: undefined }];

  // Total fare across all segments.
  const fare = sumFares(segments.map((s) => fareOf(s.f)));

  return (
    <div className="min-h-[100dvh] bg-[#0B132B] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-[#1c3a5f] bg-[#0B132B]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/search" className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#7CC0FF] transition-colors hover:text-[#f0c265]">
            <ArrowLeftRight className="h-4 w-4 rotate-180" />
            Back to Search Results
          </Link>
          <span className="flex items-center gap-2 text-[12px] font-semibold text-[#9baec7]">
            <BrandLogo size="sm" />
            Akbar Bizvoy
          </span>
          <ThemeToggle size="sm" className="shrink-0" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Heading */}
        <h1 className="text-[20px] font-bold leading-tight">Review your flight details</h1>
        <p className="mt-1 text-[12.5px] text-[#9baec7]">Complete your traveller information to proceed to secure payment.</p>

        <div className="mt-5 space-y-3">
          <HoldingPriceBar />
          <PolicyBar />
        </div>

        <div className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[1fr_380px]">
          {/* Left: flights, services, traveller info */}
          <div className="space-y-4">
            {roundTrip && (
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[12px] font-semibold text-[#9baec7]">Round Trip</span>
                <span className="h-3 w-px bg-[#315073]" />
                <span className="text-[11.5px] text-[#9baec7]">2 segments selected</span>
              </div>
            )}

            {/* Flight cards */}
            {segments.map((s, i) => (
              <FlightSegment key={`${s.f.code}-${i}`} f={s.f} date={s.date} label={s.label} />
            ))}

            {/* Services */}
            <div className="flex flex-wrap items-center gap-2">
              <ServiceChip label="Check-in" value="25 KG" />
              <ServiceChip label="Cabin" value="7 KG" />
              <ServiceChip label="Meal" value="Complimentary" />
              <ServiceChip label="Wi-Fi" value="Available" />
            </div>

            {/* Traveller info */}
            <div className="rounded-[12px] border border-[#29466e] bg-[#0f172a] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold">Traveller Information</span>
                <span className="rounded-full bg-[#2593fc]/15 px-2.5 py-1 text-[10.5px] font-bold text-[#7CC0FF]">1 Adult • Economy</span>
              </div>
              <div className="mt-4 space-y-3">
                <Field label="Full Name (As on Passport/Govt ID)" value="Mr. Rajesh Sharma" />
                <Field label="Corporate Email Address" value="rajesh.sharma@akbarbizvoy.com" />
                <Field label="Mobile Number" value="+91 98765 43210" />
                <Field label="Frequent Flyer Number (Optional)" value="AI-984210938" />
              </div>

              <div className="mt-5 border-t border-dashed border-[#73869e] pt-4">
                <div className="text-[12px] font-bold text-[#7CC0FF]">GST Information (Optional for Tax Credit)</div>
                <p className="mt-1 text-[11px] text-[#9baec7]">Claim commercial tax input credit on this enterprise booking.</p>
                <div className="mt-3 space-y-3">
                  <Field label="GST Number" value="27AAICA1234A1Z5" />
                  <Field label="Company Name / Holder" value="Akbar Bizvoy Travel Solutions Ltd." />
                  <Field label="Registered Email" value="accounts@akbarbizvoy.com" />
                  <Field label="Contact Number" value="+91 22 4000 1234" />
                  <Field label="Company Address" value="Bizvoy House, 78 Corporate Boulevard, Nariman Point, Mumbai 400021" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: fare summary + payment */}
          <div className="space-y-4">
            {/* Fare summary */}
            <div className="rounded-[12px] border border-[#29466e] bg-[#0f172a] p-3">
              <div className="px-3.5 pb-2 pt-1 text-[10px] font-semibold tracking-[0.12em] text-[#7CC0FF]">FARE SUMMARY</div>
              <div className="divide-y divide-dashed divide-[#73869e]/60">
                <FareRow label="Base Fare" sub={`${segments.length} Traveller${segments.length > 1 ? 's' : ''}`} value={inr(fare.base)} />
                <FareRow label="Taxes & Surcharges" sub="Includes GST" value={inr(fare.taxes)} />
                <FareRow label="Airline Fee & Services" sub="Platform & service fee" value={inr(fare.airlineFee)} />
                <FareRow label="Travel Insurance" sub="Not included" value={inr(fare.insurance)} />
                <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                  <div>
                    <div className="text-[13px] font-bold tracking-wide text-white">TOTAL AMOUNT</div>
                    <div className="text-[10px] text-[#7e93b3]">Inclusive of all taxes</div>
                  </div>
                  <div className="text-[18px] font-bold leading-none text-[#3B9CFF]">{inr(fare.total)}</div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-[12px] border border-[#29466e] bg-[#0f172a] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold">Amount Payable</span>
                <span className="text-[19px] font-bold leading-none text-[#3B9CFF]">{inr(fare.total)}</span>
              </div>
              <button className="mt-3.5 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#2593fc] text-[13.5px] font-bold text-white shadow-[0_6px_18px_rgba(37,147,252,0.4)] transition-all duration-300 hover:bg-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]">
                <PlaneTakeoff className="h-4 w-4" />
                Continue to Secure Payment
              </button>
              <p className="mt-2.5 text-center text-[10.5px] leading-relaxed text-[#7e93b3]">
                By proceeding, you agree to Akbar Bizvoy's Corporate Terms & Flight Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;