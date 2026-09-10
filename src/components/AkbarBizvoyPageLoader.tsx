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
import planeImg from '../assets/airplane-loader.svg';
import { LogoIcon } from './Logo';
import {
  useGlobalLoaderStore,
  GLOBAL_NAV_MESSAGES,
  AIRPLANE_RUN_MS,
} from '../store/globalLoader';
import { useThemeStore } from '../store/themeStore';

// The message rotation interval must match the `.bizvoy-message-cycle` CSS
// duration (2600ms) so each message fades out exactly as the next fades in.
const MESSAGE_INTERVAL_MS = 2600;
const ENTER_MS = 500;
const EXIT_MS = 400;

// Minimum visual dwell for a SPA page transition: exactly one full airplane
// flight across the path. It never overrides real work: any operation that is
// still running keeps its own counter reference, so the loader stays visible
// until it ends. There is no extra artificial delay beyond the flight itself.
const ROUTE_TRANSITION_MS = AIRPLANE_RUN_MS;

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
      className={`bizvoy-overlay fixed inset-0 z-[110] flex items-center justify-center overflow-hidden backdrop-blur-lg ${isLight ? 'bg-white/70' : 'bg-[#060e1f]/70'} ${overlayPhase}`}
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
          className={`bizvoy-logo-enter mt-5 text-center text-[24px] font-extrabold leading-none tracking-tight sm:text-[26px] lg:text-[30px] ${isLight ? 'text-[#111827]' : 'text-white'}`}
          style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
        >
          Akbar Bizvoy
        </div>

        {/* Loading / status message */}
        <div className="mt-4 flex min-h-[22px] items-center justify-center">
          <p
            key={displayedMessage}
            className={`bizvoy-message-${rotate ? 'cycle' : 'fixed'} text-center text-[13px] font-medium sm:text-[14px] ${isLight ? 'text-[#5B6472]' : 'text-[#9baec7]'}`}
          >
            {displayedMessage}
          </p>
        </div>

        {/* Subtle progress indicator */}
        <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`bizvoy-dot h-1 w-1 rounded-full ${isLight ? 'bg-[#2563EB]' : 'bg-[#7CC0FF]'}`}
              style={{ animationDelay: `${i * 220}ms` }}
            />
          ))}
        </div>

        {/* Animated airplane along the flight path */}
        <div
          className="relative mt-9 w-[min(380px,80vw)] sm:w-[min(440px,64vw)] lg:w-[min(540px,52vw)]"
          aria-hidden="true"
        >
          <div
            className={`absolute inset-x-0 top-1/2 h-px rounded-full border-t border-dashed ${isLight ? 'border-[#2563EB]/30' : 'border-[#7CC0FF]/25'}`}
          />
          <span
            className={`absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${isLight ? 'bg-[#2563EB]/40' : 'bg-[#7CC0FF]/40'}`}
          />
          <span
            className={`absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${isLight ? 'bg-[#2563EB]/40' : 'bg-[#7CC0FF]/40'}`}
          />
          <div
            className="bizvoy-plane-rail absolute left-0 top-1/2 -mt-4 flex h-8 w-full items-center sm:-mt-5 sm:h-10 lg:-mt-6 lg:h-12"
            style={{ ['--plane-ms' as string]: `${AIRPLANE_RUN_MS}ms` }}
          >
            <div className="bizvoy-plane-inner flex h-8 items-center sm:h-10 lg:h-12">
              <img
                src={planeImg}
                alt=""
                draggable={false}
                className={`pointer-events-none h-8 w-auto select-none sm:h-10 lg:h-12 ${isLight ? 'drop-shadow-[0_6px_14px_rgba(10,40,90,0.35)]' : 'drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]'}`}
              />
            </div>
          </div>
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