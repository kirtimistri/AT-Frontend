// SeatMealCard.tsx
// Allows the user to pick a seat and meal, adjust pricing overrides, and proceed to booking.
import { useState } from 'react';
import { SeatIcon } from '../icons';
import { useThemeStore } from '../../store/themeStore';

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

export const SeatMealCard = ({ onBack, onHold, onBook }: { onBack?: () => void; onHold?: () => void; onBook?: () => void }) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [seat, setSeat] = useState('');
  const [meal, setMeal] = useState('');
  const [serviceCharge, setServiceCharge] = useState('');
  const [markupBase, setMarkupBase] = useState('');
  const [markupTax, setMarkupTax] = useState('');

  const selectClass = `w-24 cursor-pointer rounded-md border px-2 py-1.5 text-[10px] font-semibold outline-none transition duration-300 ${isLight ? 'border-[#2563EB] text-[#2563EB] bg-white hover:bg-[#2563EB] hover:text-white' : 'border-[#7CC0FF] text-[#7CC0FF] bg-[#0f172a] hover:bg-[#7CC0FF] hover:text-[#0B132B]'}`;

  return (
    <>
      <div className={`rounded-lg border p-5 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#29466e] bg-[#0f172a]'}`}>
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <span className={`text-[14px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>SEAT / MEAL</span>
        </div>

        {/* Seat & Meal selection row */}
        <div className={`space-y-2 rounded-lg border p-3 transition-colors duration-300 ${isLight ? 'border-[#E5E7EB] bg-[#FAFAFA]' : 'border-[#29466e] bg-white/[0.03]'}`}>
          {/* Seat */}
          <div className={`flex items-center gap-2.5 rounded-md border px-3 py-2 transition-colors duration-300 hover:border-[#2563EB]/30 ${isLight ? 'border-[#E5E7EB]' : 'border-[#29466e]'}`}>
            <SeatIcon />
            <span className={`text-[11px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Seat</span>
            <select value={seat} onChange={(e) => setSeat(e.target.value)} className={`ml-auto ${selectClass}`}>
              <option value="" disabled>Select Seat</option>
              <option value="window">Window</option>
              <option value="aisle">Aisle</option>
              <option value="middle">Middle</option>
            </select>
          </div>

          {/* Meal */}
          <div className={`flex items-center gap-2.5 rounded-md border px-3 py-2 transition-colors duration-300 hover:border-[#2563EB]/30 ${isLight ? 'border-[#E5E7EB]' : 'border-[#29466e]'}`}>
            <svg className={`h-5 w-5 transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
            <span className={`text-[11px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Meal</span>
            <select value={meal} onChange={(e) => setMeal(e.target.value)} className={`ml-auto ${selectClass}`}>
              <option value="" disabled>Select Meal</option>
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
              <option value="jain">Jain Meal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Controls */}
      <div className={`rounded-lg border p-5 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#29466e] bg-[#0f172a]'}`}>
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
