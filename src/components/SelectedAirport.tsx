// SelectedAirport.tsx
// A removable chip representing one selected airport in the From/To field.
import { X } from 'lucide-react';
import type { Airport } from '../data/airports';
import { useThemeStore } from '../store/themeStore';

interface SelectedAirportProps {
  airport: Airport;
  onRemove: (iata: string) => void;
}

export const SelectedAirport = ({ airport, onRemove }: SelectedAirportProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 rounded-full border py-0.5 pl-1.5 pr-0.5 text-[11px] font-semibold leading-none ${isLight ? 'border-[#DBEAFE] bg-[#EFF6FF] text-[#2563EB]' : 'border-[rgba(124,192,255,0.35)] bg-[rgba(37,147,252,0.12)] text-[#7CC0FF]'}`}
    >
      <span className="truncate">
        <span className="font-extrabold">{airport.iataCode}</span>
        <span className={isLight ? 'text-[#5B7AA0]' : 'text-[#8FB4D6]'}>{` - ${airport.city}`}</span>
      </span>
      <button
        type="button"
        aria-label={`Remove ${airport.iataCode}`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(airport.iataCode);
        }}
        className={`flex h-3.5 w-3.5 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 ${isLight ? 'text-[#2563EB] hover:bg-[#DBEAFE]' : 'text-[#7CC0FF] hover:bg-white/10'}`}
      >
        <X className="h-2.5 w-2.5" strokeWidth={3} />
      </button>
    </span>
  );
};