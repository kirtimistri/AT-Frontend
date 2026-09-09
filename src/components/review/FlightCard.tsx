// FlightCard – Displays all details for a single flight leg (departure/arrival, timeline, baggage, meals, and expandable info).

import { useState } from 'react';
import { Luggage, Briefcase, UtensilsCrossed, ChevronDown } from 'lucide-react';
import { FlightTimeline } from './FlightTimeline';
import { AirlineLogo } from '../Logos';
import { useThemeStore } from '../../store/themeStore';

// Props that define every piece of data a flight card can show
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
  cancellation0to24?: string;
  cancellationAbove24?: string;
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
  cancellation0to24,
  cancellationAbove24,
}: FlightCardProps) => {
  // Theme for light / dark mode styling
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  // Derive display flags from props
  const isReturn = type === 'RETURN';
  const isDirect = stops === 'Direct';
  // Controls whether the expanded detail panel is visible
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-[7px] p-5 transition-colors duration-300 ${isLight ? 'bg-[#F7F4F3]' : 'bg-[#0d1b2a]'}`}>
      {/* Top row */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="shrink-0 origin-left">
              <AirlineLogo airline={airline.toUpperCase()} />
            </span>
            <span className={`text-[13px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{airline}</span>
          </div>
          <button
            type="button"
            onClick={() => setExpanded((x) => !x)}
            aria-label={expanded ? 'Collapse flight details' : 'Expand flight details'}
            aria-expanded={expanded}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 ${isLight ? 'border-[#DEDEDE] bg-white text-[#555] hover:border-[#004B7C] hover:text-[#004B7C]' : 'border-[#315073] bg-[#0d1b2a] text-[#7CC0FF] hover:border-[#d4af37]/70 hover:text-[#f0c265]'}`}
          >
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-[3px] px-2.5 py-1 text-[10px] font-bold uppercase ${
                isReturn
                  ? 'bg-[#B5122B] text-white'
                  : isLight ? 'bg-white text-[#004B7C]' : 'bg-[#29466e] text-[#7CC0FF]'
              }`}
            >
              {type}
            </span>
            <span className={`text-[13px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>{date}</span>
          </div>
          <span className={`text-[11px] transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#7e93b3]'}`}>
            Flight {flightNumber}
          </span>
        </div>
      </div>

      {/* Route + timeline */}
      <div className="mb-4 flex items-center gap-4">
        <div className="shrink-0">
          <div className={`text-[17px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{departureTime}</div>
          <div className={`mt-0.5 text-[11px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>
            {departureAirport} ({departureCode})
          </div>
          <div className={`text-[10px] transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#7e93b3]'}`}>{departureTerminal}</div>
        </div>

        <FlightTimeline
          duration={duration}
          isDirect={isDirect}
          stops={stops}
          isReturn={isReturn}
        />

        <div className="shrink-0 text-right">
          <div className={`text-[17px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{arrivalTime}</div>
          <div className={`mt-0.5 text-[11px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>
            {arrivalAirport} ({arrivalCode})
          </div>
          <div className={`text-[10px] transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#7e93b3]'}`}>{arrivalTerminal}</div>
        </div>
      </div>

      {/* Bottom details */}
      <div className={`flex items-center gap-4 border-t pt-3 transition-colors duration-300 ${isLight ? 'border-[#E5E5E5]' : 'border-[#315073]'}`}>
        <span className={`flex items-center gap-1.5 text-[10.5px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>
          <Luggage className={`h-3.5 w-3.5 transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-[#7e93b3]'}`} />
          Check-in: {checkIn}
        </span>
        <span className={`flex items-center gap-1.5 text-[10.5px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>
          <Briefcase className={`h-3.5 w-3.5 transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-[#7e93b3]'}`} />
          Cabin: {cabin}
        </span>
        <span className={`flex items-center gap-1.5 text-[10.5px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>
          <UtensilsCrossed className={`h-3.5 w-3.5 transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-[#7e93b3]'}`} />
          {meal}
        </span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className={`mt-4 border-t border-dashed pt-4 transition-colors duration-300 ${isLight ? 'border-[#DEDEDE]' : 'border-[#315073]'}`}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: 'Duration', value: duration },
              { label: 'Stops', value: stops },
              { label: 'Flight', value: flightNumber },
              { label: 'Check-in Baggage', value: checkIn },
              { label: 'Cabin Baggage', value: cabin },
              { label: 'Meal', value: meal },
              ...(cancellation0to24 ? [{ label: 'Cancellation (0-24 hrs)', value: cancellation0to24 }] : []),
              ...(cancellationAbove24 ? [{ label: 'Cancellation (above 24 hrs)', value: cancellationAbove24 }] : []),
            ].map((item) => (
              <div key={item.label} className={`rounded p-3 transition-colors duration-300 ${isLight ? 'bg-white' : 'bg-white/[0.04]'}`}>
                <div className={`text-[9px] font-semibold uppercase tracking-wider transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#7e93b3]'}`}>{item.label}</div>
                <div className={`mt-1 text-[13px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};