import { ShieldCheck, Lock } from 'lucide-react';
import { inr } from '../../lib/format';
import { useThemeStore } from '../../store/themeStore';

type FareSummaryProps = {
  onwardPrice?: number;
  returnPrice?: number;
  fromCode?: string;
  toCode?: string;
};

export const FareSummary = ({ onwardPrice, returnPrice, fromCode, toCode }: FareSummaryProps) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const hasOnward = typeof onwardPrice === 'number';
  const hasReturn = typeof returnPrice === 'number';

  const fareRows: { label: string; price: string; key: string }[] = [];
  if (hasOnward) fareRows.push({ label: `Outbound Fare (${fromCode}-${toCode})`, price: inr(onwardPrice), key: 'outbound' });
  if (hasReturn) fareRows.push({ label: `Return Fare (${toCode}-${fromCode})`, price: inr(returnPrice), key: 'return' });
  fareRows.push({ label: 'Taxes & Surcharges', price: '₹ 5,840', key: 'taxes' });
  fareRows.push({ label: 'Travel Insurance', price: '₹ 199', key: 'insurance' });

  const total = (hasOnward ? onwardPrice : 0) + (hasReturn ? returnPrice : 0) + 5840 + 199;

  return (
    <div className={`review-card rounded-lg border p-6 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#29466e] bg-[#0f172a]'}`}>
      <h3 className={`review-card-title mb-4 text-[20px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Fare Summary</h3>

      <div className={`mb-4 space-y-3 border-b pb-4 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE]' : 'border-[#29466e]'}`}>
        {fareRows.map((row) => (
          <div key={row.key} className="flex items-center justify-between">
            <span className={`review-fare-label text-[12px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>{row.label}</span>
            <span className={`review-fare-value text-[12px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{row.price}</span>
          </div>
        ))}
      </div>

      <div className={`mb-4 flex items-center justify-between border-b pb-4 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE]' : 'border-[#29466e]'}`}>
        <span className={`text-[14px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Combined Total</span>
        <span className={`text-[26px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#3B9CFF]'}`}>{inr(total)}</span>
      </div>
      <p className={`mb-4 text-[11px] transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#7e93b3]'}`}>Inclusive of all taxes</p>

      <div className={`mb-4 flex items-start gap-2 rounded p-3 transition-colors duration-300 ${isLight ? 'bg-[#F7F4F3]' : 'bg-white/[0.03]'}`}>
        <ShieldCheck className={`mt-0.5 h-4 w-4 shrink-0 transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#7CC0FF]'}`} />
        <p className={`text-[11px] leading-relaxed transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-[#9baec7]'}`}>
          Your booking is backed by Akbar Bizvoy's 24/7 corporate travel desk support.
        </p>
      </div>

      <button className={`flex h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded text-[13px] font-semibold text-white transition-colors ${isLight ? 'bg-[#004B7C] hover:bg-[#003E67]' : 'bg-[#2593fc] hover:bg-[#d4af37]'}`}>
        Continue to Secure Payment
        <Lock className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};