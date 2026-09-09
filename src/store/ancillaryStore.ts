import { create } from 'zustand';
import type { AncillarySelection, SegmentKey } from '../lib/ancillary';

/* Ancillary selection state, shaped per the booking model:
   selectedAncillaries[travellerId][segmentId] = { meal, seat, baggage, ssr }
   Each traveller's services for each segment are kept separate.

   This is a small Zustand store that reuses the app's existing state
   management approach — no new state library is introduced. */
type TravellerId = string;

type AncillaryState = {
  selectedAncillaries: Record<TravellerId, Partial<Record<SegmentKey, AncillarySelection>>>;
  setTravellerSection: (
    travellerId: TravellerId,
    segmentId: SegmentKey,
    section: keyof AncillarySelection,
    value: AncillarySelection[keyof AncillarySelection] | null
  ) => void;
  resetTravellerSegment: (travellerId: TravellerId, segmentId: SegmentKey) => void;
};

const emptyCell = (): AncillarySelection => ({ meal: null, seat: null, baggage: null, ssr: [] });

export const useAncillaryStore = create<AncillaryState>((set) => ({
  selectedAncillaries: {
    'adult-1': {
      onward: emptyCell(),
      return: emptyCell(),
    },
  },

  setTravellerSection: (travellerId, segmentId, section, value) =>
    set((state) => {
      const perTraveller = { ...(state.selectedAncillaries[travellerId] ?? {}) };
      const cell = { ...(perTraveller[segmentId] ?? emptyCell()) };
      if (section === 'ssr') {
        cell.ssr = (value as AncillarySelection['ssr']) ?? [];
      } else {
        cell[section] = value as never;
      }
      perTraveller[segmentId] = cell;
      return {
        selectedAncillaries: { ...state.selectedAncillaries, [travellerId]: perTraveller },
      };
    }),

  resetTravellerSegment: (travellerId, segmentId) =>
    set((state) => {
      const perTraveller = { ...(state.selectedAncillaries[travellerId] ?? {}) };
      delete perTraveller[segmentId];
      return {
        selectedAncillaries: { ...state.selectedAncillaries, [travellerId]: perTraveller },
      };
    }),
}));

export const travellerSectionOf = (
  state: AncillaryState['selectedAncillaries'],
  travellerId: TravellerId,
  segmentId: SegmentKey
): AncillarySelection => state[travellerId]?.[segmentId] ?? emptyCell();
