// AncillaryServicesCard.tsx
// Summary card for ancillary services (meals, seats, baggage, SSR) shown in the flight review sidebar.
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useAncillaryStore, travellerSectionOf } from '../../store/ancillaryStore';
import { selectionTotal } from '../../lib/ancillary';
import { inr } from '../../lib/format';
import type { AncillarySegment } from './AncillaryServicesModal';

type PricingField = {
  label: string;
  value: string;
  onChange: (val: string) => void;
};

// Reusable input field for entering a rupee amount.
const PricingInput = ({ label, value, onChange, isLight }: PricingField & { isLight: boolean }) => (
  <label className="block">
    <span className={`mb-1.5 block text-[11px] font-medium transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>{label}</span>
    <div className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 transition-colors duration-300 focus-within:border-[#2563EB] ${isLight ? 'border-[#E5E7EB] bg-white' : 'border-[#29466e] bg-[#0f172a]'}`}>
      <span className={`text-[13px] transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#7e93b3]'}`}>₹</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent text-[13px] font-medium outline-none transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}
        placeholder="0"
      />
    </div>
  </label>
);

/* The "Ancillary / SSR" entry card that replaces the legacy Seat / Meal card in
   the Flight Review (trip review) right sidebar. It opens the
   AncillaryServicesModal and reflects the currently selected services. */
// Main card component that shows selected ancillary services and pricing controls.
export const AncillaryServicesCard = ({
  segments,
  onBack,
  onHold,
  onBook,
}: {
  segments: AncillarySegment[];
  onBack?: () => void;
  onHold?: () => void;
  onBook?: () => void;
}) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [serviceCharge, setServiceCharge] = useState('');
  const [markupBase, setMarkupBase] = useState('');
  const [markupTax, setMarkupTax] = useState('');

  const selected = useAncillaryStore((s) => s.selectedAncillaries);
  const selections = segments.map((seg) => travellerSectionOf(selected, 'adult-1', seg.id));
  const total = selections.reduce((sum, s) => sum + selectionTotal(s), 0);
  const count = selections.reduce(
    (c, s) => c + (s.meal ? 1 : 0) + (s.seat ? 1 : 0) + (s.baggage ? 1 : 0) + s.ssr.length,
    0
  );

  return (
    <>
      <div className={`rounded-lg border p-5 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#29466e] bg-[#0f172a]'}`}>
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className={`h-4 w-4 ${isLight ? 'text-[#004B7C]' : 'text-[#7CC0FF]'}`} />
          <span className={`text-[14px] font-semibold ${isLight ? 'text-[#171717]' : 'text-white'}`}>
            ANCILIARY / SSR
          </span>
        </div>

        {/* Traveller summary */}
        <div className={`mb-3 rounded-md border px-3 py-2 transition-colors duration-300 ${isLight ? 'border-[#E5E7EB] bg-[#FAFAFA]' : 'border-[#29466e] bg-white/[0.03]'}`}>
          <div className="mb-1.5">
            <span className={`text-[11px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>
              Traveller Information
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className={`text-[12px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>
              Adult 1
            </span>
            <span className={`truncate text-[12px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>
              Mr. Rajesh Sharma
            </span>
          </div>
        </div>

        {/* Quick summary */}
        {count > 0 && (
          <div
            className={`rounded-lg border p-3 transition-colors duration-300 ${isLight ? 'border-[#E5E7EB] bg-[#FAFAFA]' : 'border-[#29466e] bg-white/[0.03]'}`}
          >
            <div className="space-y-1.5">
              {selections.map((s, i) => {
                const labels: string[] = [];
                if (s.meal) labels.push(`Meal: ${s.meal.name}`);
                if (s.seat) labels.push(`Seat: ${s.seat.number}`);
                if (s.baggage) labels.push(`Baggage: ${s.baggage.name}`);
                s.ssr.forEach((x) => labels.push(`SSR: ${x.name}`));
                if (labels.length === 0) return null;
                return (
                  <div key={i} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className={`text-[11px] font-semibold ${isLight ? 'text-[#171717]' : 'text-white'}`}>
                      {segments[i].fromCode} → {segments[i].toCode}:
                    </span>
                    <span className={`text-[11px] ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>
                      {labels.join(' · ')}
                    </span>
                  </div>
                );
              })}
              <div className={`flex items-center justify-between border-t pt-2 ${isLight ? 'border-[#E5E7EB]' : 'border-[#29466e]'}`}>
                <span className={`text-[11px] font-medium ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>Ancillary Total</span>
                <span className={`text-[15px] font-semibold ${isLight ? 'text-[#004B7C]' : 'text-[#3B9CFF]'}`}>{inr(total)}</span>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onBook}
          className={`mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-semibold text-white transition duration-300 ${isLight ? 'bg-[#004B7C] shadow-[0_4px_12px_rgba(0,75,124,0.25)] hover:bg-[#003E67]' : 'bg-[#2593fc] shadow-[0_6px_18px_rgba(37,147,252,0.45)] hover:bg-[#d4af37]'}`}
        >
          <Sparkles className="h-4 w-4" />
          ANCILLARY
        </button>
      </div>

      {/* Pricing Controls */}
      <div className={`mt-2 rounded-lg border p-5 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#29466e] bg-[#0f172a]'}`}>
        <span className={`mb-3 block text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#7e93b3]'}`}>Pricing Controls</span>
        <div className="space-y-3">
          <PricingInput label="Override Service Charge" value={serviceCharge} onChange={setServiceCharge} isLight={isLight} />
          <PricingInput label="Markup on Base" value={markupBase} onChange={setMarkupBase} isLight={isLight} />
          <PricingInput label="Markup on Tax" value={markupTax} onChange={setMarkupTax} isLight={isLight} />
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={onBack}
            className={`flex-1 cursor-pointer rounded-lg border px-4 py-2.5 text-[12px] font-semibold transition duration-300 ${isLight ? 'border-[#E5E7EB] text-[#555] hover:border-[#2563EB] hover:text-[#2563EB]' : 'border-[#29466e] text-[#9baec7] hover:border-[#7CC0FF] hover:text-[#7CC0FF]'}`}
          >
            Back
          </button>
          <button
            onClick={onHold}
            className={`flex-1 cursor-pointer rounded-lg border px-4 py-2.5 text-[12px] font-semibold transition duration-300 ${isLight ? 'border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white' : 'border-[#7CC0FF] text-[#7CC0FF] hover:bg-[#7CC0FF] hover:text-[#0B132B]'}`}
          >
            Hold
          </button>
          <button
            onClick={onBook}
            className={`flex-1 cursor-pointer rounded-lg px-4 py-2.5 text-[12px] font-semibold text-white transition duration-300 ${isLight ? 'bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[0_4px_12px_rgba(37,99,235,0.3)]' : 'bg-[#2593fc] hover:bg-[#d4af37] shadow-[0_6px_18px_rgba(37,147,252,0.45)]'}`}
          >
            Book
          </button>
        </div>
      </div>
    </>
  );
};
