// FlightTimeline – Visual timeline bar connecting departure and arrival (dots, line, plane icon, duration, stops).

import { Plane } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

type FlightTimelineProps = {
  duration: string;
  isDirect: boolean;
  stops: string;
  isReturn?: boolean;
};

export const FlightTimeline = ({ duration, isDirect, stops, isReturn = false }: FlightTimelineProps) => {
  // Theme and derived colors (return flights use a red accent)
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const accentColor = isReturn ? '#B5122B' : '#004B7C';
  const lineColor = isReturn ? '#E5B8BE' : '#D1D5DB';
  // On the dark itinerary panel the timeline line and plane icon are light blue
  // so they stay clearly visible; light mode keeps its softer colors.
  const planeColor = isLight ? accentColor : '#7CC0FF';
  const timelineColor = isLight ? lineColor : '#7CC0FF';
  // The "Direct / Stops" text below the timeline must stay readable on the dark
  // panel, so dark mode swaps the navy accent for a lighter brand blue.
  const stopTextColor = isReturn ? '#B5122B' : isLight ? '#004B7C' : '#7CC0FF';

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      {/* Duration label above the timeline */}
      <span className={`mb-1.5 text-[11px] transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-[#7e93b3]'}`}>{duration}</span>
      {/* Timeline bar: departure dot — line with plane — arrival dot */}
      <div className="flex w-full items-center gap-0">
        <span
          className="h-[8px] w-[8px] shrink-0 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <div className="relative flex-1" style={{ height: '2px' }}>
          <div
            className="absolute inset-0"
            style={{ backgroundColor: timelineColor }}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Plane
              className="h-4 w-4 rotate-45"
              style={{ color: planeColor }}
            />
          </div>
        </div>
        <span
          className="h-[8px] w-[8px] shrink-0 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>
      {/* Stop info label below the timeline */}
      <span
        className="mt-1.5 text-[11px] font-medium"
        style={{ color: stopTextColor }}
      >
        {isDirect ? 'Direct' : stops}
      </span>
    </div>
  );
};