import { FileText, PlusCircle } from 'lucide-react';
import { FormInput } from './FormInput';
import { useThemeStore } from '../../store/themeStore';

export const GSTInformation = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <div className={`rounded-lg border p-6 lg:p-7 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#214b7e] bg-[#0f172a]'}`}>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileText className={`h-5 w-5 transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#7CC0FF]'}`} />
          <h2 className={`text-[20px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>GST Information (Optional)</h2>
        </div>
        <button className={`flex cursor-pointer items-center gap-1.5 bg-transparent text-[12px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#004B7C] hover:text-[#003E67]' : 'text-[#7CC0FF] hover:text-[#a5d8ff]'} hover:underline`}>
          <PlusCircle className="h-3.5 w-3.5" />
          Add New GST
        </button>
      </div>

      <p className={`mb-4 text-[12px] transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-white/50'}`}>
        Claim corporate input tax credit by providing your company GST details below.
      </p>

      {/* Form */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormInput label="GST Number" defaultValue="27AAACB1234C1ZU" />
        <FormInput label="Company Name" defaultValue="Bizvoy Technologies Pvt Ltd" />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormInput label="Company Email" defaultValue="accounts@bizvoyenterprise.com" />
        <FormInput label="Company Phone" defaultValue="+91 20 6655 4400" />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-1">
        <FormInput label="Company Address" defaultValue="Office No. 501, 5th Floor, Trade Centre, Baner Road, Pune, Maharashtra 411045" />
      </div>
    </div>
  );
};
