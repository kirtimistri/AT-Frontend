// AkbarBizvoyPageLoader.tsx
// Global branded loading + SPA page-transition system for Akbar Bizvoy.
//
// It is made of two pieces, both mounted ONCE in App.tsx:
//   1. <AkbarBizvoyPageLoader /> – the single global overlay. It is purely a
//      view: it renders only while `counter > 0` in the globalLoader store.
//   2. <PageTransitionController /> – listens to React Router `useLocation()`
//      and drives the loader for meaningful SPA page changes (login →
//      dashboard, flights → details, booking → confirmation, logout → login).
//      Tiny interactions (dropdowns, modals, tabs, tooltips) never touch it.
//
// The overlay never hides itself with a hardcoded "load done" timeout. The
// route controller only schedules a SHORT minimum brand-transition dwell time
// so a navigation is never a zero-frame flash; real async work keeps the
// counter > 0 (each worker calls showLoader()/hideLoader()), so the fade-out
// is always gated on actual loading state.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FlightLoader } from './FlightLoader';
import { LogoIcon } from './Logo';
import {
  useGlobalLoaderStore,
  GLOBAL_NAV_MESSAGES,
  AIRPLANE_RUN_MS,
} from '../store/globalLoader';
import { useFlightStore } from '../store/flightStore';
import { useThemeStore } from '../store/themeStore';

// The message rotation interval must match the `.bizvoy-message-cycle` CSS
// duration (2300ms) so each message fades out exactly as the next fades in.
const MESSAGE_INTERVAL_MS = 2300;
const ENTER_MS = 500;
const EXIT_MS = 400;

// Minimum visual dwell for a SPA page transition: exactly one full airplane
// flight across the path. It never overrides real work: any operation that is
// still running keeps its own counter reference, so the loader stays visible
// until it ends. There is no extra artificial delay beyond the flight itself.
const ROUTE_TRANSITION_MS = AIRPLANE_RUN_MS;

// NATO-phonetic spelling of "LOADING" (LIMA OSCAR ALPHA DELTA INDIA
// NOVEMBER GOLF) — the headline shown by the unified flight-strip loader
// on every NON-search transition, matching the brand reference art.
const NATO_LOADING = 'LIMA OSCAR ALPHA DELTA INDIA NOVEMBER GOLF…';

// Fallback messages when a caller did not provide its own.
const FALLBACK_MESSAGES = [
  'Loading, please wait...',
];

type Phase = 'enter' | 'idle' | 'exit';

/* ========================================================================== */
/*  The single global overlay view                                            */
/* ========================================================================== */

export const AkbarBizvoyPageLoader = () => {
  const counter = useGlobalLoaderStore((s) => s.counter);
  const message = useGlobalLoaderStore((s) => s.message);
  const messages = useGlobalLoaderStore((s) => s.messages);
  const contentVersion = useGlobalLoaderStore((s) => s.contentVersion);

  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // When a flight search is in progress, the loader becomes route-aware: it
  // reads the real source/destination from the flight store and shows them
  // as the strip headline while the plane flies left → right.
  const searching = useFlightStore((s) => s.searching);
  const fromCity = useFlightStore((s) => s.fromCity);
  const toCity = useFlightStore((s) => s.toCity);
  const isFlightSearch = searching;

  // Full city names for the route loader text: "PNQ - Pune" → "Pune"
  // (falls back to the whole string if no " - " suffix is present).
  const fromName = fromCity.split(' - ')[1] ?? fromCity;
  const toName = toCity.split(' - ')[1] ?? toCity;

  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [msgIndex, setMsgIndex] = useState(0);

  const shownRef = useRef(false);
  const enterTimer = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);
  const lastVersionRef = useRef(contentVersion);

  const isLoading = counter > 0;

  const rotationMessages = useMemo(
    () => (messages && messages.length > 0 ? messages : FALLBACK_MESSAGES),
    [messages],
  );
  const rotate = !message && rotationMessages.length > 1;

  // Show / hide the whole overlay from the real global state. On fade-out the
  // overlay stays mounted for `EXIT_MS` so the CSS exit animation completes.
  useEffect(() => {
    if (isLoading) {
      if (exitTimer.current) {
        window.clearTimeout(exitTimer.current);
        exitTimer.current = null;
      }
      if (enterTimer.current) return; // already animating in
      setMsgIndex(0);
      setPhase('enter');
      setShow(true);
      shownRef.current = true;
      enterTimer.current = window.setTimeout(() => {
        setPhase('idle');
        enterTimer.current = null;
      }, ENTER_MS);
    } else if (shownRef.current) {
      if (enterTimer.current) {
        window.clearTimeout(enterTimer.current);
        enterTimer.current = null;
      }
      setPhase('exit');
      exitTimer.current = window.setTimeout(() => {
        setShow(false);
        setPhase('idle');
        shownRef.current = false;
        exitTimer.current = null;
      }, EXIT_MS);
    }
  }, [isLoading]);

  // Clear any pending timers if the loader unmounts mid-transition.
  useEffect(
    () => () => {
      if (enterTimer.current) window.clearTimeout(enterTimer.current);
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
    },
    [],
  );

  // Lock the page scroll while the overlay is visible so the background
  // cannot move or be interacted with during the operation.
  useEffect(() => {
    if (!show) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [show]);

  // Rotate through the status messages while a load is running. When the
  // active operation swaps its content mid-flight (e.g. login messages →
  // navigation messages) the rotation restarts from the first message of the
  // new set. The check happens on the timer tick, never synchronously in an
  // effect, so the rotation is purely interval-driven.
  useEffect(() => {
    if (!isLoading || !rotate) return;
    const handle = window.setInterval(() => {
      const currentVersion = useGlobalLoaderStore.getState().contentVersion;
      setMsgIndex((i) => {
        if (currentVersion !== lastVersionRef.current) {
          lastVersionRef.current = currentVersion;
          return 0;
        }
        return (i + 1) % rotationMessages.length;
      });
    }, MESSAGE_INTERVAL_MS);
    return () => window.clearInterval(handle);
  }, [isLoading, rotate, rotationMessages]);

  if (!show) return null;

  const overlayPhase =
    phase === 'enter' ? 'bizvoy-overlay-enter' : phase === 'exit' ? 'bizvoy-overlay-exit' : 'bizvoy-overlay-idle';
  const contentPhase =
    phase === 'enter' ? 'bizvoy-content-enter' : phase === 'exit' ? 'bizvoy-content-exit' : 'bizvoy-content-idle';

  const displayedMessage = message ?? rotationMessages[msgIndex % rotationMessages.length];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy
      aria-label="Akbar Bizvoy is loading"
      className={`bizvoy-overlay fixed inset-0 z-[110] flex items-center justify-center overflow-hidden backdrop-blur-sm ${isLight ? 'bg-white/55' : 'bg-[#060e1f]/60'} ${overlayPhase}`}
    >
      <div className={`flex h-full w-full flex-col items-center justify-center px-6 ${contentPhase}`}>
        {/* Brand logo (enters once, then stays stable) */}
        <div className="bizvoy-logo-enter">
          <LogoIcon
            size="md"
            className={`rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.18)] ring-1 sm:h-16 sm:w-16 lg:h-20 lg:w-20 ${isLight ? 'ring-black/10' : 'ring-white/10'}`}
          />
        </div>

        {/* Brand name */}
        <div
          className={`bizvoy-brand-enter mt-5 text-center text-[24px] font-extrabold leading-none tracking-tight sm:text-[26px] lg:text-[30px] ${isLight ? 'text-[#111827]' : 'text-white'} ${isLight ? 'bizvoy-brand-glow-light' : 'bizvoy-brand-glow-dark'}`}
          style={{ fontFamily: "'Inter Variable', 'Inter', 'Segoe UI', system-ui, sans-serif" }}
        >
          Akbar Bizvoy
        </div>

        {/* Loading / status message (contextual detail) */}
        <div className="mt-2.5 flex min-h-[18px] items-center justify-center">
          <p
            key={displayedMessage}
            className={`bizvoy-message-${rotate ? 'cycle' : 'fixed'} text-center text-[11px] font-medium sm:text-[12px] ${isLight ? 'text-[#5B6472]' : 'text-[#9baec7]'}`}
          >
            {displayedMessage}
          </p>
        </div>

        {/* THE SAME loader on every page: a bold headline with a red accent
            and the airplane SVG flying left → right while the text types out
            one letter at a time. Flight search names the full route
            ("PUNE TO NEW DELHI..."); every other transition spells "LOADING"
            in NATO phonetics, per the brand art. */}
        <div className="mt-9 flex w-full justify-center">
          {isFlightSearch ? (
            <FlightLoader
              isLoading
              primary={fromName}
              accent="TO"
              secondary={`${toName}...`}
            />
          ) : (
            <FlightLoader
              isLoading
              primary="LIMA"
              accent="OSCAR"
              secondary={NATO_LOADING.slice('LIMA OSCAR '.length)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/*  Page transition controller (requires react-router context)                */
/* ========================================================================== */

export const PageTransitionController = () => {
  const location = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      // Initial app load / hard refresh: the requested page is already being
      // rendered, so do not interrupt it with a transition loader.
      firstRender.current = false;
      return;
    }

    const store = useGlobalLoaderStore.getState();
    if (store.counter > 0) {
      // A previous operation (e.g. login) is still showing the loader. Keep
      // its reference, just swap the wording for the new page.
      store.setLoaderContent(GLOBAL_NAV_MESSAGES);
    } else {
      store.showLoader(GLOBAL_NAV_MESSAGES);
    }

    // Conclude this transition once the loader has played its entrance. This
    // is a visual minimum, NOT a "work is done" signal — any operation that is
    // still loading keeps counter > 0 and therefore keeps the overlay visible.
    const timer = window.setTimeout(() => {
      useGlobalLoaderStore.getState().hideLoader();
    }, ROUTE_TRANSITION_MS);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return null;
};

export default AkbarBizvoyPageLoader;