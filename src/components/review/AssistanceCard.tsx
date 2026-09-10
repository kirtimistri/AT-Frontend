// AssistanceCard – Displays a help prompt with a phone number and chat option for corporate travellers.

import { useThemeStore } from '../../store/themeStore';

export const AssistanceCard = () => {
  // Theme for light / dark mode styling
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <div className={`rounded-lg border p-5 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#214b7e] bg-[#0f172a]'}`}>
    </div>
  );
};