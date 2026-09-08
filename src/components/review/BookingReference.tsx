import { ShieldCheck } from 'lucide-react';

export const BookingReference = () => {
  return (
    <div className="mb-6 flex items-center justify-end">
      <div className="flex items-center gap-4 rounded-lg border border-[#EEEEEE] bg-white px-5 py-3">
        <div>
          <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#777]">
            Booking Reference
          </div>
          <div className="mt-0.5 text-[16px] font-bold text-[#004B7C]">TRV-2024-8894X</div>
        </div>
        <div className="h-8 w-px bg-[#EEEEEE]" />
        <div className="flex items-center gap-1.5 rounded bg-[#FDE9DC] px-2.5 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-[#98552F]" />
          <span className="text-[10.5px] font-semibold text-[#98552F]">Corporate Policy Compliant</span>
        </div>
      </div>
    </div>
  );
};
