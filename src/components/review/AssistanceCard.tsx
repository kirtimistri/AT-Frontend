// AssistanceCard – Displays a help prompt with a phone number and chat option for corporate travellers.

import { LogoIcon } from '../Logo';
import { useThemeStore } from '../../store/themeStore';

export const AssistanceCard = () => {
  // Theme for light / dark mode styling
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <div className={`rounded-lg border p-5 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#29466e] bg-[#0f172a]'}`}>
      <div className="flex items-start gap-3">
        {/* Company icon */}
        <LogoIcon size="sm" />
        <div>
          {/* Heading and contact message */}
          <h4 className={`text-[12px] font-medium transition-colors duration-300 ${isLight ? 'text-[#171717]' : 'text-white'}`}>Need assistance?</h4>
          <p className={`mt-0.5 text-[10px] leading-relaxed transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#7e93b3]'}`}>
            Call our corporate desk at 1800-22-8585 or chat with an expert.
          </p>
        </div>
      </div>
    </div>
  );
};