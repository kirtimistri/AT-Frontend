import { ShieldCheck } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export const BookingReference = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <div className="mb-6 flex items-center justify-end">
      <div className={`flex items-center gap-4 rounded-lg border px-5 py-3 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#214b7e] bg-[#0f172a]'}`}>
        <div>
          <div className={`text-[9px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-white/50'}`}>
            Booking Reference
          </div>
          <div className={`mt-0.5 text-[16px] font-bold transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#7CC0FF]'}`}>TRV-2024-8894X</div>
        </div>
        <div className={`h-8 w-px transition-colors duration-300 ${isLight ? 'bg-[#EEEEEE]' : 'bg-[#214b7e]'}`} />
        <div className={`flex items-center gap-1.5 rounded px-2.5 py-1 transition-colors duration-300 ${isLight ? 'bg-[#FDE9DC]' : 'bg-[#2a1a12]'}`}>
          <ShieldCheck className={`h-3.5 w-3.5 transition-colors duration-300 ${isLight ? 'text-[#98552F]' : 'text-[#f0a878]'}`} />
          <span className={`text-[10.5px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#98552F]' : 'text-[#f0a878]'}`}>Corporate Policy Compliant</span>
        </div>
      </div>
    </div>
  );
};
