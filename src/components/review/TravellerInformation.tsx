import { Users } from 'lucide-react';
import { FormInput, FormSelect } from './FormInput';

export const TravellerInformation = () => {
  return (
    <div className="rounded-lg border border-[#EEEEEE] bg-white p-6 lg:p-7">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Users className="h-5 w-5 text-[#004B7C]" />
          <h2 className="text-[20px] font-medium text-[#171717]">Traveller Information</h2>
        </div>
        <span className="text-[12px] text-[#777]">1 Adult &middot; Corporate Booker</span>
      </div>

      {/* Inner form card */}
      <div className="rounded-[7px] bg-[#F7F4F3] p-5">
        {/* Top row */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[#171717]">Adult 1 (Primary Traveller)</span>
          <span className="rounded bg-[#E1EFFB] px-2 py-0.5 text-[10px] font-semibold text-[#004B7C]">
            Frequent Flyer Linked
          </span>
        </div>

        {/* Form fields */}
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
