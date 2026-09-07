import { ShieldCheck, Lock } from 'lucide-react';
import { inr } from '../../lib/format';

type FareSummaryProps = {
  onwardPrice?: number;
  returnPrice?: number;
  fromCode?: string;
  toCode?: string;
};

export const FareSummary = ({ onwardPrice, returnPrice, fromCode, toCode }: FareSummaryProps) => {
  const hasOnward = typeof onwardPrice === 'number';
  const hasReturn = typeof returnPrice === 'number';

  const fareRows: { label: string; price: string; key: string }[] = [];
  if (hasOnward) fareRows.push({ label: `Outbound Fare (${fromCode}-${toCode})`, price: inr(onwardPrice), key: 'outbound' });
  if (hasReturn) fareRows.push({ label: `Return Fare (${toCode}-${fromCode})`, price: inr(returnPrice), key: 'return' });
  fareRows.push({ label: 'Taxes & Surcharges', price: '₹ 5,840', key: 'taxes' });
  fareRows.push({ label: 'Travel Insurance', price: '₹ 199', key: 'insurance' });

  const total = (hasOnward ? onwardPrice : 0) + (hasReturn ? returnPrice : 0) + 5840 + 199;

  return (
    <div className="rounded-lg border border-[#EEEEEE] bg-white p-6">
      <h3 className="mb-4 text-[20px] font-medium text-[#171717]">Fare Summary</h3>

      <div className="mb-4 space-y-3 border-b border-[#EEEEEE] pb-4">
        {fareRows.map((row) => (
          <div key={row.key} className="flex items-center justify-between">
            <span className="text-[12px] text-[#555]">{row.label}</span>
            <span className="text-[12px] font-medium text-[#171717]">{row.price}</span>
          </div>
        ))}
      </div>

      {/* Combined Total */}
      <div className="mb-4 flex items-center justify-between border-b border-[#EEEEEE] pb-4">
        <span className="text-[14px] font-medium text-[#171717]">Combined Total</span>
        <span className="text-[26px] font-semibold text-[#004B7C]">{inr(total)}</span>
      </div>
      <p className="mb-4 text-[11px] text-[#999]">Inclusive of all taxes</p>

      {/* Security message */}
      <div className="mb-4 flex items-start gap-2 rounded bg-[#F7F4F3] p-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#004B7C]" />
        <p className="text-[11px] leading-relaxed text-[#777]">
          Your booking is backed by Akbar Bizvoy's 24/7 corporate travel desk support.
        </p>
      </div>

      {/* Payment button */}
      <button className="flex h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded bg-[#004B7C] text-[13px] font-semibold text-white transition-colors hover:bg-[#003E67]">
        Continue to Secure Payment
        <Lock className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
