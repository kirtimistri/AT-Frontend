export const TIER_DELTA: Record<string, number> = {
  SAVER: -730,
  FLEX: 370,
  FAMILY: 1120,
  PREMIUM: 2370,
};

export const tierDeltaOf = (tier?: string | null): number =>
  tier && TIER_DELTA[tier] !== undefined ? TIER_DELTA[tier] : 0;

export const tierAdjustedPrice = (base: number, tier?: string | null): number =>
  base + tierDeltaOf(tier);
