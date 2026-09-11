// AirportResult.tsx
// A single search result row: prominent IATA badge, city/country primary text,
// and airport name as secondary text.
import type { Airport } from '../data/airports';
import { useThemeStore } from '../store/themeStore';

interface AirportResultProps {
  airport: Airport;
  active: boolean;
  /** Disabled when the airport is already selected in the opposite field. */
  disabled?: boolean;
  onSelect: (a: Airport) => void;
  onHover?: () => void;
}

export const AirportResult = ({ airport, active, onSelect, onHover, disabled = false }: AirportResultProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      aria-disabled={disabled}
      title={disabled ? 'Already selected in the other field' : undefined}
      // Prevent the button from stealing focus from the search input (the
      // keyboard cursor stays in the input while selecting with a mouse).
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        if (!disabled) onSelect(airport);
      }}
      onMouseEnter={disabled ? undefined : onHover}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-100 ${disabled ? 'cursor-not-allowed opacity-40' : `cursor-pointer ${active ? (isLight ? 'bg-[#EFF6FF]' : 'bg-white/10') : isLight ? 'hover:bg-[#F9FAFB]' : 'hover:bg-white/5'}`}`}
    >
      <span
        className={`flex h-9 w-14 shrink-0 items-center justify-center rounded-lg border text-[12px] font-extrabold tracking-wide ${isLight ? 'border-[#DBEAFE] bg-[#EFF6FF] text-[#2563EB]' : 'border-[rgba(124,192,255,0.35)] bg-[rgba(37,147,252,0.12)] text-[#7CC0FF]'}`}
      >
        {airport.iataCode}
      </span>
      <span className="min-w-0">
        <span className={`block truncate text-[13px] font-bold leading-tight ${isLight ? 'text-[#111827]' : 'text-white'}`}>
          {airport.city}
          {airport.country ? (
            <span className={`font-semibold ${isLight ? 'text-[#6B7280]' : 'text-white/50'}`}>{`, ${airport.country}`}</span>
          ) : null}
        </span>
        <span className={`mt-0.5 block truncate text-[12px] leading-tight ${isLight ? 'text-[#6B7280]' : 'text-white/50'}`}>
          {airport.airportName}
        </span>
      </span>
    </button>
  );
};