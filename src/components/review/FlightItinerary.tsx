import { Plane } from 'lucide-react';
import { FlightCard as ReviewFlightCard, type FlightCardProps } from './FlightCard';

type FlightItineraryProps = {
  onward?: FlightCardProps;
  ret?: FlightCardProps;
};

export const FlightItinerary = ({ onward, ret }: FlightItineraryProps) => {
  const isRoundTrip = !!onward && !!ret;
  return (
    <div className="rounded-lg border border-[#EEEEEE] bg-white p-6 lg:p-7">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Plane className="h-5 w-5 text-[#004B7C]" />
          <h2 className="text-[20px] font-medium text-[#171717]">Flight Itinerary</h2>
        </div>
        <span className="rounded-full bg-[#E1EFFB] px-3 py-1 text-[11px] font-semibold text-[#004B7C]">
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
