import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { inr } from '../../lib/format';
import type { ConfirmedSelections } from '../SeatMealPricingPanel';

type FareSummaryProps = {
  onwardPrice?: number;
  returnPrice?: number;
  fromCode?: string;
  toCode?: string;
  ancillary?: ConfirmedSelections | null;
};

type AncillaryItem = { label: string; price: number };

const ancillaryItemsOf = (ancillary: ConfirmedSelections | null | undefined): AncillaryItem[] => {
  if (!ancillary) return [];
  const items: AncillaryItem[] = [];
  for (const p of ancillary.passengers) {
    if (p.seat) {
      items.push({ label: `Seat ${p.seat.id}${ancillary.passengers.length > 1 ? ` (${p.name})` : ''}`, price: p.seat.price });
    }
    if (p.baggage) {
      items.push({ label: `Extra Baggage — ${p.baggage.weight} KG${ancillary.passengers.length > 1 ? ` (${p.name})` : ''}`, price: p.baggage.price });
    }
    for (const m of p.meals) {
      items.push({ label: `Meal — ${m.short}${ancillary.passengers.length > 1 ? ` (${p.name})` : ''}`, price: m.price });
    }
    for (const s of p.ssr) {
      items.push({ label: s.name, price: s.price });
    }
  }
  return items;
};

export const FareSummary = ({ onwardPrice, returnPrice, fromCode, toCode, ancillary }: FareSummaryProps) => {
  const [ancillaryOpen, setAncillaryOpen] = useState(false);

  const hasOnward = typeof onwardPrice === 'number';
  const hasReturn = typeof returnPrice === 'number';

  const fareRows: { label: string; price: string; key: string }[] = [];
  if (hasOnward) fareRows.push({ label: `Outbound Fare (${fromCode} → ${toCode})`, price: inr(onwardPrice), key: 'outbound' });
  if (hasReturn) fareRows.push({ label: `Return Fare (${toCode} → ${fromCode})`, price: inr(returnPrice), key: 'return' });
  fareRows.push({ label: 'Taxes & Surcharges', price: '₹ 5,840', key: 'taxes' });
  fareRows.push({ label: 'Travel Insurance', price: '₹ 199', key: 'insurance' });

  const ancillaryItems = ancillaryItemsOf(ancillary);
  const ancillaryTotal = ancillary?.total ?? 0;

  const total = (hasOnward ? onwardPrice : 0) + (hasReturn ? returnPrice : 0) + 5840 + 199 + ancillaryTotal;

  return (
    <div className="w-full rounded-lg border border-[#EEEEEE] bg-white p-6">
      <h3 className="mb-4 text-[20px] font-medium text-[#171717]">Fare Summary</h3>

      <div className="mb-4 space-y-3 border-b border-[#EEEEEE] pb-4">
        {fareRows.map((row) => (
          <div key={row.key} className="flex items-center justify-between">
            <span className="text-[12px] text-[#555]">{row.label}</span>
            <span className="text-[12px] font-medium text-[#171717]">{row.price}</span>
          </div>
        ))}
      </div>

      {ancillaryItems.length > 0 && (
        <div className="mb-4 border-b border-[#EEEEEE] pb-4">
          <button
            type="button"
            onClick={() => setAncillaryOpen((o) => !o)}
            aria-expanded={ancillaryOpen}
            className="flex w-full cursor-pointer items-center justify-between"
          >
            <span className="text-[13px] font-medium text-[#171717]">Ancillary Services</span>
            <span className="flex items-center gap-1.5">
              <span className="text-[12px] font-medium text-[#171717]">{inr(ancillaryTotal)}</span>
              <ChevronDown
                className={`h-4 w-4 text-[#888] transition-transform duration-200 ${ancillaryOpen ? 'rotate-180' : ''}`}
              />
            </span>
          </button>

          {ancillaryOpen && (
            <div className="mt-3 space-y-2">
              {ancillaryItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <span className="text-[11.5px] text-[#777]">{item.label}</span>
                  <span className="shrink-0 text-[11.5px] font-medium text-[#171717]">{inr(item.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Combined Total */}
      <div className="mb-4 flex items-center justify-between border-b border-[#EEEEEE] pb-4">
        <span className="text-[14px] font-medium text-[#171717]">Combined Total</span>
        <span className="text-[26px] font-semibold text-[#004B7C]">{inr(total)}</span>
      </div>
      <p className="mb-4 text-[11px] text-[#999]">Inclusive of all taxes</p>
    </div>
  );
};
