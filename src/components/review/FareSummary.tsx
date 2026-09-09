import { useThemeStore } from '../../store/themeStore';

export const FareSummary = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const fareRows: { label: string; price: string; key: string }[] = [
    { label: 'Base Fare (1 Traveller - Round Trip)', price: '₹ 34,900', key: 'base' },
    { label: 'Taxes & Surcharges', price: '₹ 5,600', key: 'taxes' },
    { label: 'Airline Fee & Services', price: '₹ 560', key: 'airline-fees' },
    { label: 'Travel Insurance', price: '₹ 190', key: 'insurance' },
  ];

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
        <span className={`text-[14px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Total Amount</span>
        <span className={`text-[26px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#3B9CFF]'}`}>₹ 41,250</span>
      </div>
    </div>
  );
};