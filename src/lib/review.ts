import type { Flight } from '../store/flightStore';

export type ReviewParams = {
  flight: Flight;
  date: string;
  onward?: Flight | null;
  ret?: Flight | null;
  retDate?: string | null;
};

export const reviewUrl = ({ flight, date, onward, ret, retDate }: ReviewParams): string => {
  const params = new URLSearchParams();
  params.set('flight', JSON.stringify(flight));
  params.set('date', date);
  if (onward) params.set('onward', JSON.stringify(onward));
  if (ret) params.set('ret', JSON.stringify(ret));
  if (retDate) params.set('retDate', retDate);
  return `${window.location.origin}/review?${params.toString()}`;
};

export const parseFlightParam = (raw: string | null): Flight | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.code && parsed.departure && parsed.arrival) return parsed as Flight;
    return null;
  } catch {
    return null;
  }
};