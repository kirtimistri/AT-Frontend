import type { Flight, SearchSnapshot } from '../store/flightStore';
import { useFlightStore } from '../store/flightStore';

export type BookingSelection = {
  onward?: Flight | null;
  returnFlight?: Flight | null;
  date?: string;
  fromCode?: string;
  toCode?: string;
};

const STORAGE_KEY = 'searchSnapshot';

export const saveBooking = (selection: BookingSelection) => {
  const payload = JSON.stringify(selection);
  sessionStorage.setItem('bookingSelection', payload);
  localStorage.setItem('bookingSelection', payload);
};

export const openReview = (selection: BookingSelection) => {
  saveBooking(selection);
  const s = useFlightStore.getState();
  const snapshot: SearchSnapshot = {
    searched: s.searched,
    selectedOnward: s.selectedOnward,
    selectedReturn: s.selectedReturn,
    fromCity: s.fromCity,
    toCity: s.toCity,
    returnDate: s.returnDate,
    returnOpen: s.returnOpen,
    onwardSort: s.onwardSort,
    returnSort: s.returnSort,
    stripStart: s.stripStart,
    stripSel: s.stripSel,
    monthOffset: s.monthOffset,
    filtersOpen: s.filtersOpen,
  };
  const payload = JSON.stringify(snapshot);
  sessionStorage.setItem(STORAGE_KEY, payload);
  localStorage.setItem(STORAGE_KEY, payload);
  window.open('/review-trip?bookingId=TRV-2024-8894X', '_blank', 'noopener,noreferrer');
};

export const readSearchSnapshot = (): SearchSnapshot | null => {
  const raw =
    sessionStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SearchSnapshot;
  } catch {
    return null;
  }
};

export const clearSearchSnapshot = () => {
  sessionStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
};