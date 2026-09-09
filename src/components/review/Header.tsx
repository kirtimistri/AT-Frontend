// Header – The sticky site-wide navigation bar for the review page (logo, nav links, theme toggle, profile).

import { BrandLogo } from '../BrandLogo';
import { ThemeToggle } from '../ThemeToggle';
import { useThemeStore } from '../../store/themeStore';

// Navigation tab labels
const navItems = ['Flights', 'Hotels', 'Visa', 'Holidays', 'Bus', 'Cruise', 'Cabs'];

export const ReviewHeader = () => {
  // Theme for light / dark mode styling
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <header className={`sticky top-0 z-30 flex h-[75px] w-full items-center border-b px-5 lg:px-8 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-white' : 'border-[#1c3a5f] bg-[#0B132B]'}`}>
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between">
        {/* Left: Brand logo and name */}
        <div className="flex items-center gap-2.5">
          <BrandLogo size="md" />
          <div className="flex flex-col">
            <span className={`text-[16px] font-bold tracking-tight transition-colors duration-300 ${isLight ? 'text-[#004B7C]' : 'text-white'}`}>Akbar Bizvoy</span>
            <span className={`text-[8px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-white/50'}`}>Since 1978</span>
          </div>
        </div>

        {/* Center: Nav items */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item}
              className={`cursor-pointer rounded px-4 py-2 text-[13px] font-medium transition-colors ${
                item === 'Flights'
                  ? isLight ? 'bg-[#004B7C] text-white' : 'bg-[#2593fc] text-white'
                  : isLight ? 'bg-transparent text-[#555] hover:bg-[#F5F5F5]' : 'bg-transparent text-white/70 hover:bg-white/10'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right: Theme toggle + profile icon */}
        <div className="flex items-center gap-3">
          <ThemeToggle size="sm" className="shrink-0" />
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${isLight ? 'bg-[#004B7C]' : 'bg-[#2593fc]'}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};
