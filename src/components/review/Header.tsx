import { LogoIcon } from '../Logo';

const navItems = ['Flights', 'Hotels', 'Visa', 'Holidays', 'Bus', 'Cruise', 'Cabs'];

export const ReviewHeader = () => {
  return (
    <header className="sticky top-0 z-30 flex h-[75px] w-full items-center border-b border-[#EEEEEE] bg-white px-5 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between">
        {/* Left: Logo + brand */}
        <div className="flex items-center gap-2.5">
          <LogoIcon size="md" />
          <div className="flex flex-col">
            <span className="text-[16px] font-bold tracking-tight text-[#004B7C]">Akbar Bizvoy</span>
            <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#999]">Since 1978</span>
          </div>
        </div>

        {/* Center: Nav items */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item}
              className={`cursor-pointer rounded px-4 py-2 text-[13px] font-medium transition-colors ${
                item === 'Flights'
                  ? 'bg-[#004B7C] text-white'
                  : 'bg-transparent text-[#555] hover:bg-[#F5F5F5]'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right: Sun icon + profile */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#555] transition-colors hover:bg-[#F5F5F5]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#004B7C] text-white">
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
