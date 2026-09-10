// globalLoader.ts
// Central, account-wide loading state for Akbar Bizvoy. The app renders exactly
// ONE <AkbarBizvoyPageLoader /> (in App.tsx); anything that needs to block the
// screen (login, search, flight details, page transitions, ...) calls
// `showLoader()`/`hideLoader()` through this store.
//
// Multiple overlapping operations are tracked with a reference counter, so the
// loader only fades out once EVERY operation that is currently running has
// finished (no arbitrary timers decide when real work is "done").
import { create } from 'zustand';

export type GlobalLoaderContent = {
  /** Fixed message. When set, the loader shows it statically (no rotation). */
  message?: string;
  /** Rotating status messages. They cycle while the operation runs. */
  messages?: string[];
};

/** Anything a caller may pass to showLoader(): a fixed message, a rotating
    list of messages, or an options object. */
export type LoaderRequest = string | string[] | GlobalLoaderContent;

type ParsedContent = {
  message: string | null;
  messages: string[];
};

type GlobalLoaderState = {
  /** Number of currently visible loader references (0 = hidden). */
  counter: number;
  /** Fixed message currently being displayed, if any. */
  message: string | null;
  /** Rotating message list currently being displayed, if any. */
  messages: string[];
  /** Bumped every time the loader content changes so the rotation restarts. */
  contentVersion: number;
  /** Show the loader. Keeps its own reference, so it must be hidden again. */
  showLoader: (content?: LoaderRequest) => void;
  /** Swap the loader content WITHOUT adding a reference (used during page
      transitions when the loader is already visible from a previous op). */
  setLoaderContent: (content?: LoaderRequest) => void;
  /** Hide the loader (releases the caller's reference). */
  hideLoader: () => void;
};

// --- Per-operation rotating messages ---------------------------------------

// Legacy static search messages (kept for any non-route-aware caller).
export const GLOBAL_SEARCH_MESSAGES = [
  'Searching for available flights...',
  'Checking the best fares...',
  'Finding the best routes...',
  'Comparing flight options...',
  'Almost there...',
];

// Route-aware search messages built from the actual from/to cities in the
// flight store, so the loader text always matches the cities being searched.
export const buildSearchMessages = (fromCity: string, toCity: string, roundTrip: boolean): string[] => {
  const fromName = fromCity.split(' - ')[1] ?? fromCity.split(' - ')[0];
  const toName = toCity.split(' - ')[1] ?? toCity.split(' - ')[0];
  if (roundTrip) {
    return [
      `Searching outbound flights ${fromName} → ${toName}...`,
      'Finding the best outbound fares...',
      `Searching return flights ${toName} → ${fromName}...`,
      'Finding the best return fares...',
      'Almost there...',
    ];
  }
  return [
    `Searching flights from ${fromName}...`,
    `Finding available flights to ${toName}...`,
    'Checking available flights...',
    'Finding the best fares...',
  ];
};

export const GLOBAL_FLIGHT_FARE_MESSAGES = [
  'Loading flight details...',
  'Fetching the latest fares...',
  'Applying your selections...',
  'Almost there...',
];

export const GLOBAL_BOOKING_MESSAGES = [
  'Confirming your booking...',
  'Securing your seats...',
  'Preparing your itinerary...',
  'Almost there...',
];

export const GLOBAL_LOGIN_MESSAGES = [
  'Signing you in...',
  'Preparing your workspace...',
  'Almost there...',
];

export const GLOBAL_SIGNUP_MESSAGES = [
  'Creating your account...',
  'Setting up your profile...',
  'Almost there...',
];

export const GLOBAL_NAV_MESSAGES = [
  'Loading your page...',
  'Preparing your journey...',
  'Almost there...',
];

/**
 * Duration of a single airplane flight across the loader path. Kept in one
 * place so the CSS animation (`--fl-ms`), the overlay dwell time and the
 * Book->review flow all stay perfectly in sync. Slow (6s) on purpose: the
 * plane drifts right → left while the headline letters flash in one by one.
 */
export const AIRPLANE_RUN_MS = 6000;

/**
 * Duration of ONE continuous flight-search animation loop (source → dest,
 * and back again for round trips) in the loader. The plane keyframes are keyed
 * off this via `--plane-ms`, so the animation and search timing stay in sync.
 */
export const ROUTE_LOOP_MS = 1000;

function parseContent(content?: LoaderRequest): ParsedContent {
  if (!content) return { message: null, messages: [] };
  if (typeof content === 'string') return { message: content, messages: [] };
  if (Array.isArray(content))
    return { message: null, messages: content };
  return {
    message: content.message ?? null,
    messages: content.messages ?? [],
  };
}

export const useGlobalLoaderStore = create<GlobalLoaderState>()((set) => ({
  counter: 0,
  message: null,
  messages: [],
  contentVersion: 0,

  showLoader: (content) =>
    set((state) => {
      const parsed = parseContent(content);
      return {
        counter: state.counter + 1,
        message: parsed.message,
        messages: parsed.messages,
        contentVersion: state.contentVersion + 1,
      };
    }),

  setLoaderContent: (content) =>
    set((state) => {
      const parsed = parseContent(content);
      return {
        message: parsed.message,
        messages: parsed.messages,
        contentVersion: state.contentVersion + 1,
      };
    }),

  hideLoader: () =>
    set((state) => ({
      counter: Math.max(0, state.counter - 1),
    })),
}));

/**
 * Convenience hook used by pages/controllers:
 *   const { showLoader, hideLoader } = useGlobalLoader();
 *   showLoader(GLOBAL_LOGIN_MESSAGES); ... hideLoader();
 */
export function useGlobalLoader() {
  const showLoader = useGlobalLoaderStore((s) => s.showLoader);
  const hideLoader = useGlobalLoaderStore((s) => s.hideLoader);
  return { showLoader, hideLoader };
}