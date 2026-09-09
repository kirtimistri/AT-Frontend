// FareSummary – Breaks down the booking cost into base fare, taxes, fees, and insurance, then shows the total.

import { useThemeStore } from '../../store/themeStore';
import { inr } from '../../lib/format';

export const FareSummary = ({
  onwardPrice = 34900,
  returnPrice = 15200,
}: {
  onwardPrice?: number;
  returnPrice?: number;
}) => {
  // Theme for light / dark mode styling
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Calculate individual fare components from the two leg prices
  const base = onwardPrice + returnPrice;
  const taxes = Math.round(base * 0.08);
  const airlineFees = 560;
  const insurance = 190;
  const total = base + taxes + airlineFees + insurance;

  // Row data for the itemised fare breakdown
  const fareRows: { label: string; price: string; key: string }[] = [
    { label: 'Base Fare (1 Traveller - Round Trip)', price: inr(base), key: 'base' },
    { label: 'Taxes & Surcharges', price: inr(taxes), key: 'taxes' },
    { label: 'Airline Fee & Services', price: inr(airlineFees), key: 'airline-fees' },
    { label: 'Travel Insurance', price: inr(insurance), key: 'insurance' },
  ];

  return (
    <div className={`review-card rounded-lg border p-6 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#29466e] bg-[#0f172a]'}`}>
      {/* Section title */}
      <h3 className={`review-card-title mb-4 text-[20px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Fare Summary</h3>

      {/* Individual fare line items */}
      <div className={`mb-4 space-y-3 border-b pb-4 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE]' : 'border-[#29466e]'}`}>
        {fareRows.map((row) => (
          <div key={row.key} className="flex items-center justify-between">
            <span className={`review-fare-label text-[12px] transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>{row.label}</span>
            <span className={`review-fare-value text-[12px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>{row.price}</span>
          </div>
        ))}
      </div>

      {/* Grand total */}
      <div className={`mb-4 flex items-center justify-between border-b pb-4 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE]' : 'border-[#29466e]'}`}>
        <span className={`text-[14px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Total Amount</span>
        <span className={`text-[26px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#3B9CFF]'}`}>{inr(total)}</span>
      </div>
    </div>
  );
};