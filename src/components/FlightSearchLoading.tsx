// FlightSearchLoading.tsx
// Search-bar flight-search loading card. Shows exactly which flight is being
// searched – a prominent "PNQ → DEL" route with city names – plus lightweight
// animations: an airplane flies along a dashed route line between the two
// markers while rotating status text and a shimmering progress bar play below.
// Pure CSS animations (see the `.fsq-*` rules in index.css), theme-aware
// (light/dark), no animation libraries, no fake loading timers.
//
// Everything displayed comes from props – nothing about the route is
// hardcoded, so it always reflects the flight the user just searched.
import { useEffect, useState } from 'react';
import { Plane } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

// ── Types ───────────────────────────────────────────────────────────────────

interface FlightSearchLoadingProps {
  source: string;
  destination: string;
  sourceCode?: string;
  destinationCode?: string;
}

// ── Status messages (rotating title text) ───────────────────────────────────

const STATUS_MESSAGES = [
  'Searching live flight availability...',
  'Checking airline sources...',
  'Comparing available fares...',
  'Finding the best flight options...',
  'Preparing your results...',
];
const STATUS_INTERVAL = 3200;

// ── Component ───────────────────────────────────────────────────────────────

export const FlightSearchLoading = ({
  source,
  destination,
  sourceCode,
  destinationCode,
}: FlightSearchLoadingProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Rotating status text – purely presentational.
  const [statusIdx, setStatusIdx] = useState(0);
  useEffect(() => {
    const id = window.setInterval(
      () => setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length),
      STATUS_INTERVAL,
    );
    return () => window.clearInterval(id);
  }, []);

  // Display values – always derived from props. Codes fall back gracefully
  // to the first token of the label, then to the trimmed city name.
  const srcCode = sourceCode ?? source.split(' - ')[0] ?? source.slice(0, 3).toUpperCase();
  const dstCode = destinationCode ?? destination.split(' - ')[0] ?? destination.slice(0, 3).toUpperCase();
  const srcName = source.split(' - ').pop()?.trim() ?? source;
  const dstName = destination.split(' - ').pop()?.trim() ?? destination;

  return (
    <div
      className={`fsq-root relative w-full overflow-hidden rounded-2xl border transition-colors duration-300 ${isLight
        ? 'bg-white border-[#E5E7EB] shadow-[0_14px_40px_-20px_rgba(31,98,179,0.28)]'
        : 'bg-[#0F1B3A] border-[rgba(124,192,255,0.22)] shadow-[0_18px_50px_-24px_rgba(0,0,0,0.6)]'}`}
    >
      <div className="relative z-10 flex flex-col items-center px-5 py-8 sm:px-8 sm:py-10">
        {/* ── Eyebrow ── */}
        <div className="flex items-center gap-2">
          <Plane
            className={`fsq-plane-bob h-4 w-4 ${isLight ? 'text-[#2563EB]' : 'text-[#7CC0FF]'}`}
            aria-hidden="true"
          />
          <span
            className={`text-[11px] font-bold uppercase tracking-[0.16em] sm:text-[12px] ${isLight ? 'text-[#2563EB]' : 'text-[#7CC0FF]'}`}
          >
            Searching your journey
          </span>
        </div>

        {/* ── Route: source ✈ destination ── */}
        <div className="mt-7 w-full max-w-[460px]">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Source */}
            <div className="fsq-marker flex w-[104px] shrink-0 flex-col items-center sm:w-[124px]">
              <span
                className={`text-[26px] font-extrabold leading-none tracking-tight sm:text-[32px] ${isLight ? 'text-[#111827]' : 'text-white'}`}
              >
                {srcCode}
              </span>
              <span
                className={`mt-1 max-w-full truncate text-[11px] font-semibold sm:text-[12px] ${isLight ? 'text-[#6B7280]' : 'text-[#8fa3bf]'}`}
              >
                {srcName}
              </span>
            </div>

            {/* Animated route: dashed line + flying plane */}
            <div className="fsq-flight relative h-10 min-w-0 flex-1" aria-hidden="true">
              <div
                className={`fsq-route-line absolute left-0 right-0 top-1/2 ${isLight ? 'text-[#93C5FD]' : 'text-[rgba(124,192,255,0.4)]'}`}
              />
              <Plane
                className={`fsq-plane absolute top-1/2 h-6 w-6 ${isLight
                  ? 'text-[#2563EB] drop-shadow-[0_3px_8px_rgba(37,99,235,0.4)]'
                  : 'text-[#7CC0FF] drop-shadow-[0_3px_8px_rgba(124,192,255,0.45)]'}`}
              />
            </div>

            {/* Destination */}
            <div className="fsq-marker flex w-[104px] shrink-0 flex-col items-center sm:w-[124px]">
              <span
                className={`text-[26px] font-extrabold leading-none tracking-tight sm:text-[32px] ${isLight ? 'text-[#111827]' : 'text-white'}`}
              >
                {dstCode}
              </span>
              <span
                className={`mt-1 max-w-full truncate text-[11px] font-semibold sm:text-[12px] ${isLight ? 'text-[#6B7280]' : 'text-[#8fa3bf]'}`}
              >
                {dstName}
              </span>
            </div>
          </div>
        </div>

        {/* ── Rotating status text ── */}
        <div className="mt-7 flex h-5 items-center justify-center">
          <span
            key={statusIdx}
            className={`fsq-status-fade text-[12px] font-semibold tracking-wide sm:text-[13px] ${isLight ? 'text-[#4e7296]' : 'text-[#9baec7]'}`}
          >
            {STATUS_MESSAGES[statusIdx]}
          </span>
        </div>

        {/* ── Shimmering progress bar ── */}
        <div
          className={`fsq-progress mt-4 h-1.5 w-full max-w-[300px] overflow-hidden rounded-full ${isLight ? 'bg-[#EFF6FF]' : 'bg-white/10'}`}
          aria-hidden="true"
        >
          <div
            className={`fsq-shimmer h-full w-1/2 rounded-full ${isLight ? 'bg-[#2563EB]' : 'bg-[#7CC0FF]'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default FlightSearchLoading;