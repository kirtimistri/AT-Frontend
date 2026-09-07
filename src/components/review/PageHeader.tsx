import { ArrowLeft } from 'lucide-react';

export const PageHeader = () => {
  return (
    <div className="mb-6">
      <a
        href="/search"
        onClick={(e) => {
          e.preventDefault();
          window.history.back();
        }}
        className="mb-3 inline-flex items-center gap-1.5 text-[13px] text-[#004B7C] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Search Results
      </a>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold leading-[1.1] text-[#171717] lg:text-[34px]">
            Review your trip
          </h1>
          <p className="mt-1 text-[13px] text-[#777]">
            Verify flight itineraries, add traveller details, and complete corporate booking requirements.
          </p>
        </div>
      </div>
    </div>
  );
};
