import { ReviewHeader } from '../components/review/Header';
import { PageHeader } from '../components/review/PageHeader';
import { BookingReference } from '../components/review/BookingReference';
import { FlightItinerary } from '../components/review/FlightItinerary';
import { TravellerInformation } from '../components/review/TravellerInformation';
import { GSTInformation } from '../components/review/GSTInformation';
import { FareSummary } from '../components/review/FareSummary';
import { AssistanceCard } from '../components/review/AssistanceCard';
import { Footer } from '../components/review/Footer';
import type { FlightCardProps } from '../components/review/FlightCard';
import type { Flight } from '../store/flightStore';
import { cityNameOf } from '../lib/format';

type BookingSelection = {
  onward?: Flight | null;
  returnFlight?: Flight | null;
  date?: string;
  fromCode?: string;
  toCode?: string;
};

const airportParts = (airport: string) => {
  const m = airport.match(/^([A-Z]{3})(?:\s*Terminal\s*(\d+))?/i);
  return {
    code: m?.[1] ?? airport.split(' ')[0],
    terminal: m?.[2] ? `Terminal ${m[2]}` : 'Terminal 1',
  };
};

const titleCase = (s: string) =>
  s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

const toReviewCard = (f: Flight, type: 'OUTBOUND' | 'RETURN', date: string): FlightCardProps => {
  const dep = airportParts(f.departure.airport);
  const arr = airportParts(f.arrival.airport);
  const m = f.code.match(/^(\D+)\s*(\d+)$/);
  const flightNumber = m ? `${m[1].trim()}-${m[2]}` : f.code;
  const baggageMatch = f.baggage.match(/(\d+)\s*kg/i);
  const checkIn = baggageMatch ? `${baggageMatch[1]} kg` : '15 kg';

  const depCity = cityNameOf(dep.code);
  const arrCity = cityNameOf(arr.code);
  const stopsText =
    f.stops === 'Non-stop' ? 'Direct' : `${f.stops}${f.via ? ` via ${f.via.replace(/^via\s*/i, '')}` : ''}`;

  return {
    type,
    date,
    flightNumber,
    airline: titleCase(f.airline),
    departureTime: f.departure.time,
    departureAirport: depCity,
    departureCode: dep.code,
    departureTerminal: dep.terminal,
    arrivalTime: f.arrival.time,
    arrivalAirport: arrCity,
    arrivalCode: arr.code,
    arrivalTerminal: arr.terminal,
    duration: f.duration,
    stops: stopsText,
    checkIn,
    cabin: '7 kg',
    meal: 'Meal Included',
  };
};

const TripReviewPage = () => {
  let onward: FlightCardProps | undefined;
  let ret: FlightCardProps | undefined;
  let onwardPrice: number | undefined;
  let returnPrice: number | undefined;
  let fromCode = 'PNQ';
  let toCode = 'DEL';
  let date = '';

  try {
    const raw = sessionStorage.getItem('bookingSelection');
    if (raw) {
      const booking: BookingSelection = JSON.parse(raw);
      date = booking.date ?? '';
      fromCode = booking.fromCode ?? 'PNQ';
      toCode = booking.toCode ?? 'DEL';
      if (booking.onward) {
        onwardPrice = booking.onward.price;
        onward = toReviewCard(booking.onward, 'OUTBOUND', date);
      }
      if (booking.returnFlight) {
        returnPrice = booking.returnFlight.price;
        ret = toReviewCard(booking.returnFlight, 'RETURN', date);
      }
    }
  } catch {
    // fall back to empty itinerary if stored selection is invalid
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F7]">
      <ReviewHeader />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-6 lg:px-6">
        {/* Back link + Title + Booking Reference */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <PageHeader />
          </div>
          <BookingReference />
        </div>

        {/* Main grid */}
        <div className="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(310px,0.95fr)]">
          {/* Left column */}
          <div className="space-y-6">
            <FlightItinerary onward={onward} ret={ret} />
            <TravellerInformation />
            <GSTInformation />
          </div>

          {/* Right sidebar */}
          <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <FareSummary
              onwardPrice={onwardPrice}
              returnPrice={returnPrice}
              fromCode={fromCode}
              toCode={toCode}
            />
            <AssistanceCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TripReviewPage;
