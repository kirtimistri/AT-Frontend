import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { BrandLogo } from '../BrandLogo';

export const PageHeader = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => navigate('/search')}
        className={`mb-3 inline-flex items-center gap-1.5 cursor-pointer border-none bg-transparent text-[13px] hover:underline transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-[#7CC0FF]'}`}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Search Results
      </button>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="lg" />
          <div>
            <h1 className={`text-[32px] font-bold leading-[1.1] lg:text-[34px] transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>
              Review your trip
            </h1>
            <p className={`mt-1 text-[13px] transition-colors duration-300 ${isLight ? 'text-[#777]' : 'text-white/50'}`}>
              Verify flight itineraries, add traveller details, and complete corporate booking requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
