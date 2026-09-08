import { Luggage, Briefcase, UtensilsCrossed } from 'lucide-react';
import { FlightTimeline } from './FlightTimeline';
import { useThemeStore } from '../../store/themeStore';

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
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const isReturn = type === 'RETURN';
  const isDirect = stops === 'Direct';

  return (
    <div className={`rounded-[7px] p-5 transition-colors duration-300 ${isLight ? 'bg-[#F7F4F3]' : 'bg-[#0d1b2a]'}`}>
      {/* Top row */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-[3px] px-2.5 py-1 text-[10px] font-bold uppercase ${isReturn ? 'bg-[#B5122B] text-white' : isLight ? 'bg-white text-[#004B7C]' : 'bg-[#12304f] text-[#7CC0FF]'}`}
          >
            {type}
          </span>
          <span className={`text-[13px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-white/60'}`}>{date}</span>
        </div>
        <span className={`text-[11px] transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-white/40'}`}>
          Flight {flightNumber} &middot; {airline}
        </span>
      </div>

      {/* Route + timeline */}
      <div className="mb-4 flex items-center gap-4">
        {/* Departure */}
        <div className="shrink-0">
          <div className={`text-[17px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{departureTime}</div>
          <div className={`mt-0.5 text-[11px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-white/60'}`}>
            {departureAirport} ({departureCode})
          </div>
          <div className={`text-[10px] transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-white/40'}`}>{departureTerminal}</div>
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
          <div className={`text-[17px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{arrivalTime}</div>
          <div className={`mt-0.5 text-[11px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-white/60'}`}>
            {arrivalAirport} ({arrivalCode})
          </div>
          <div className={`text-[10px] transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-white/40'}`}>{arrivalTerminal}</div>
        </div>
      </div>

      {/* Bottom details */}
      <div className={`flex items-center gap-4 border-t pt-3 transition-colors duration-300 ${isLight ? 'border-[#E5E5E5]' : 'border-[#214b7e]'}`}>
        <span className={`flex items-center gap-1.5 text-[10.5px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-white/60'}`}>
          <Luggage className={`h-3.5 w-3.5 transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-white/40'}`} />
          Check-in: {checkIn}
        </span>
        <span className={`flex items-center gap-1.5 text-[10.5px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-white/60'}`}>
          <Briefcase className={`h-3.5 w-3.5 transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-white/40'}`} />
          Cabin: {cabin}
        </span>
        <span className={`flex items-center gap-1.5 text-[10.5px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-white/60'}`}>
          <UtensilsCrossed className={`h-3.5 w-3.5 transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-white/40'}`} />
          {meal}
        </span>
      </div>
    </div>
  );
};
