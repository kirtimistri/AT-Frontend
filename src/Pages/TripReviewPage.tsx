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
import type { BookingSelection } from '../lib/openReview';

// Fallback demo data — shown only when no booking selection is available so the
// page keeps its original content instead of showing an empty itinerary.
const DEMO_ONWARD: FlightCardProps = {
  type: 'OUTBOUND',
  date: 'Tue, 24 Oct 2024',
  flightNumber: 'AI-865',
  airline: 'Air India',
  departureTime: '06:15 AM',
  departureAirport: 'Pune',
  departureCode: 'PNQ',
  departureTerminal: 'Pune Airport',
  arrivalTime: '10:00 AM',
  arrivalAirport: 'Guwahati',
  arrivalCode: 'GAU',
  arrivalTerminal: 'Lokpriya Gopinath Bordoloi',
  duration: '3h 45m',
  stops: 'Direct',
  checkIn: '25 kg',
  cabin: '7 kg',
  meal: 'Meal Included',
};

const DEMO_RETURN: FlightCardProps = {
  type: 'RETURN',
  date: 'Sat, 28 Oct 2024',
  flightNumber: '6E-642',
  airline: 'IndiGo',
  departureTime: '04:30 PM',
  departureAirport: 'Guwahati',
  departureCode: 'GAU',
  departureTerminal: 'Lokpriya Gopinath Bordoloi',
  arrivalTime: '08:40 PM',
  arrivalAirport: 'Pune',
  arrivalCode: 'PNQ',
  arrivalTerminal: 'Pune Airport',
  duration: '4h 10m',
  stops: '1 Stop via Kolkata (CCU)',
  checkIn: '15 kg',
  cabin: '7 kg',
  meal: 'Buy On Board',
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
  const stopsText =
    f.stops === 'Non-stop' ? 'Direct' : `${f.stops}${f.via ? ` via ${f.via.replace(/^via\s*/i, '')}` : ''}`;

  return {
    type,
    date,
    flightNumber,
    airline: titleCase(f.airline),
    departureTime: f.departure.time,
    departureAirport: cityNameOf(dep.code),
    departureCode: dep.code,
    departureTerminal: dep.terminal,
    arrivalTime: f.arrival.time,
    arrivalAirport: cityNameOf(arr.code),
    arrivalCode: arr.code,
    arrivalTerminal: arr.terminal,
    duration: f.duration,
    stops: stopsText,
    checkIn,
    cabin: '7 kg',
    meal: 'Meal Included',
  };
};

const readBooking = (): BookingSelection | null => {
  const raw =
    sessionStorage.getItem('bookingSelection') ?? localStorage.getItem('bookingSelection');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BookingSelection;
  } catch {
    return null;
  }
};

const TripReviewPage = () => {
  let onward: FlightCardProps | undefined;
  let ret: FlightCardProps | undefined;
  let onwardPrice: number | undefined;
  let returnPrice: number | undefined;
  let fromCode = 'PNQ';
  let toCode = 'GAU';

  const booking = readBooking();
  if (booking && (booking.onward || booking.returnFlight)) {
    const date = booking.date ?? '';
    fromCode = booking.fromCode ?? fromCode;
    toCode = booking.toCode ?? toCode;
    if (booking.onward) {
      onwardPrice = booking.onward.price;
      onward = toReviewCard(booking.onward, 'OUTBOUND', date);
    }
    if (booking.returnFlight) {
      returnPrice = booking.returnFlight.price;
      ret = toReviewCard(booking.returnFlight, 'RETURN', date);
    }
  } else {
    onward = DEMO_ONWARD;
    ret = DEMO_RETURN;
    onwardPrice = 18450;
    returnPrice = 15200;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F7]">
      

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