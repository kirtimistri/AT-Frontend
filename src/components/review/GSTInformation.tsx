import { FileText, PlusCircle } from 'lucide-react';
import { FormInput } from './FormInput';
import { useThemeStore } from '../../store/themeStore';

export const GSTInformation = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <div className={`rounded-lg border p-6 lg:p-7 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#29466e] bg-[#0f172a]'}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileText className={`h-5 w-5 transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#7CC0FF]'}`} />
          <h2 className={`text-[20px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>GST Information (Optional)</h2>
        </div>
        <button className={`flex cursor-pointer items-center gap-1.5 bg-transparent text-[12px] font-semibold transition-colors duration-300 hover:underline ${isLight ? 'text-[#004B7C]' : 'text-[#7CC0FF]'}`}>
          <PlusCircle className="h-3.5 w-3.5" />
          Add New GST
        </button>
      </div>

      <p className={`mb-4 text-[12px] transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-[#7e93b3]'}`}>
        Claim corporate input tax credit by providing your company GST details below.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormInput label="GST Number" defaultValue="27AAACB1234C1ZU" />
        <FormInput label="Company Name" defaultValue="Bizvoy Technologies Pvt Ltd" />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormInput label="Company Email" defaultValue="accounts@bizvoyenterprise.com" />
        <FormInput label="Company Phone" defaultValue="+91 20 6655 4400" />
      </div>
      <div className="mt-3">
        <FormInput label="Registered Address" defaultValue="Survey No. 15, Baner Road, Pune, Maharashtra 411045" wrapperClassName="sm:col-span-2" />
      </div>
    </div>
  );
};