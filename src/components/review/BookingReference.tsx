// BookingReference – Shows the unique booking reference ID and a corporate-policy compliance badge.

import { ShieldCheck } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export const BookingReference = () => {
  // Theme for light / dark mode styling
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <div className="mb-6 flex items-center justify-end">
      <div className={`flex items-center gap-4 rounded-lg border px-5 py-3 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#29466e] bg-[#0f172a]'}`}>
        {/* Booking reference label and ID */}
        <div>
          <div className={`text-[9px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-[#9baec7]'}`}>
            Booking Reference
          </div>
          <div className={`mt-0.5 text-[16px] font-bold transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#7CC0FF]'}`}>TRV-2024-8894X</div>
        </div>
        {/* Vertical divider */}
        <div className={`h-8 w-px transition-colors duration-300 ${isLight ? 'bg-[#EEEEEE]' : 'bg-[#29466e]'}`} />
        {/* Compliance badge */}
        <div className="flex items-center gap-1.5 rounded bg-[#FDE9DC] px-2.5 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-[#98552F]" />
          <span className="text-[10.5px] font-semibold text-[#98552F]">Corporate Policy Compliant</span>
        </div>
      </div>
    </div>
  );
};