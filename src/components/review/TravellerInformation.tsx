import { Users } from 'lucide-react';
import { FormInput, FormSelect } from './FormInput';
import { useThemeStore } from '../../store/themeStore';

export const TravellerInformation = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <div className={`rounded-lg border p-6 lg:p-7 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#29466e] bg-[#0f172a]'}`}>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Users className={`h-5 w-5 transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#7CC0FF]'}`} />
          <h2 className={`text-[20px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Traveller Information</h2>
        </div>
        <span className={`text-[12px] transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-[#7e93b3]'}`}>1 Adult &middot; Corporate Booker</span>
      </div>

      <div className={`rounded-[7px] p-5 transition-colors duration-300 ${isLight ? 'bg-[#F7F4F3]' : 'bg-[#0d1b2a]'}`}>
        <div className="mb-4 flex items-center justify-between">
          <span className={`text-[13px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Adult 1 (Primary Traveller)</span>
          <span className={`rounded px-2 py-0.5 text-[10px] font-semibold transition-colors duration-300 ${isLight ? 'bg-[#E1EFFB] text-[#004B7C]' : 'bg-[#2593fc]/20 text-[#7CC0FF]'}`}>
            Frequent Flyer Linked
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FormInput label="First & Middle Name" defaultValue="Rajesh Kumar" />
          <FormInput label="Last Name" defaultValue="Sharma" />
          <FormSelect label="Gender" defaultValue="male">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </FormSelect>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormInput label="Email Address (for e-ticket)" defaultValue="rajesh.sharma@bizvoyenterprise.com" />
          <FormInput label="Mobile Number" defaultValue="+91 98230 44512" />
        </div>
      </div>
    </div>
  );
};