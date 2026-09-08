import { Plane } from 'lucide-react';
import { FlightCard as ReviewFlightCard, type FlightCardProps } from './FlightCard';
import { useThemeStore } from '../../store/themeStore';

type FlightItineraryProps = {
  onward?: FlightCardProps;
  ret?: FlightCardProps;
};

export const FlightItinerary = ({ onward, ret }: FlightItineraryProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const isRoundTrip = !!onward && !!ret;
  return (
    <div className={`rounded-lg border p-6 lg:p-7 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#214b7e] bg-[#0f172a]'}`}>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Plane className={`h-5 w-5 transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#7CC0FF]'}`} />
          <h2 className={`text-[20px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Flight Itinerary</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors duration-300 ${isLight ? 'bg-[#E1EFFB] text-[#004B7C]' : 'bg-[#12304f] text-[#7CC0FF]'}`}>
          {isRoundTrip ? 'Round Trip' : 'One Way'}
        </span>
      </div>

      {/* Flight cards */}
      <div className="space-y-4">
        {onward && <ReviewFlightCard {...onward} />}
        {ret && <ReviewFlightCard {...ret} />}
      </div>
    </div>
  );
};
