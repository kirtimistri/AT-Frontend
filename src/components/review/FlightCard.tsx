import { Luggage, Briefcase, UtensilsCrossed } from 'lucide-react';
import { FlightTimeline } from './FlightTimeline';
import { AirlineLogo } from '../Logos';

export type FlightCardProps = {
  type: 'OUTBOUND' | 'RETURN';
  date: string;
  flightNumber: string;
  airline: string;
  departureTime: string;
  departureAirport: string;
  departureCode: string;
  departureTerminal: string;
  arrivalTime: string;
  arrivalAirport: string;
  arrivalCode: string;
  arrivalTerminal: string;
  duration: string;
  stops: string;
  checkIn: string;
  cabin: string;
  meal: string;
};

export const FlightCard = ({
  type,
  date,
  flightNumber,
  airline,
  departureTime,
  departureAirport,
  departureCode,
  departureTerminal,
  arrivalTime,
  arrivalAirport,
  arrivalCode,
  arrivalTerminal,
  duration,
  stops,
  checkIn,
  cabin,
  meal,
}: FlightCardProps) => {
  const isReturn = type === 'RETURN';
  const isDirect = stops === 'Direct';

  return (
    <div className="rounded-[7px] bg-[#F7F4F3] p-5">
      {/* Top row */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="shrink-0 origin-left">
            <AirlineLogo airline={airline.toUpperCase()} />
          </span>
          <span className="text-[13px] font-semibold text-[#171717]">{airline}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-[3px] px-2.5 py-1 text-[10px] font-bold uppercase ${
                isReturn
                  ? 'bg-[#B5122B] text-white'
                  : 'bg-white text-[#004B7C]'
              }`}
            >
              {type}
            </span>
            <span className="text-[13px] text-[#555]">{date}</span>
          </div>
          <span className="text-[11px] text-[#999]">
            Flight {flightNumber}
          </span>
        </div>
      </div>

      {/* Route + timeline */}
      <div className="mb-4 flex items-center gap-4">
        {/* Departure */}
        <div className="shrink-0">
          <div className="text-[17px] font-medium text-[#171717]">{departureTime}</div>
          <div className="mt-0.5 text-[11px] text-[#555]">
            {departureAirport} ({departureCode})
          </div>
          <div className="text-[10px] text-[#999]">{departureTerminal}</div>
        </div>

        {/* Timeline */}
        <FlightTimeline
          duration={duration}
          isDirect={isDirect}
          stops={stops}
          isReturn={isReturn}
        />

        {/* Arrival */}
        <div className="shrink-0 text-right">
          <div className="text-[17px] font-medium text-[#171717]">{arrivalTime}</div>
          <div className="mt-0.5 text-[11px] text-[#555]">
            {arrivalAirport} ({arrivalCode})
          </div>
          <div className="text-[10px] text-[#999]">{arrivalTerminal}</div>
        </div>
      </div>

      {/* Bottom details */}
      <div className="flex items-center gap-4 border-t border-[#E5E5E5] pt-3">
        <span className="flex items-center gap-1.5 text-[10.5px] text-[#555]">
          <Luggage className="h-3.5 w-3.5 text-[#777]" />
          Check-in: {checkIn}
        </span>
        <span className="flex items-center gap-1.5 text-[10.5px] text-[#555]">
          <Briefcase className="h-3.5 w-3.5 text-[#777]" />
          Cabin: {cabin}
        </span>
        <span className="flex items-center gap-1.5 text-[10.5px] text-[#555]">
          <UtensilsCrossed className="h-3.5 w-3.5 text-[#777]" />
          {meal}
        </span>
      </div>
    </div>
  );
};
