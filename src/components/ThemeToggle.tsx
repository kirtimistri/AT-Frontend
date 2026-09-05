import { useThemeStore } from '../store/themeStore';

const SunIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

/** Switch-style theme toggle. Rendered on every page: floating top-right by default, or inline (e.g. inside the header) via a custom className. */
export const ThemeToggle = ({ className = 'fixed right-4 top-4 z-[100]' }: { className?: string }) => {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isLight = theme === 'light';

  return (
    <div className={className}>
      <button
        type="button"
        role="switch"
        aria-checked={isLight}
        aria-label="Toggle dark / light theme"
        title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
        onClick={toggleTheme}
        className={`relative h-[30px] w-[58px] cursor-pointer rounded-full border transition-all duration-300 ${
          isLight
            ? 'border-black/15 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.2)]'
            : 'border-[rgba(124,192,255,0.4)] bg-[#0E1833] shadow-[0_2px_12px_rgba(0,0,0,0.35)]'
        }`}
      >
        {/* Sun (left) */}
        <span className={`pointer-events-none absolute left-[9px] top-1/2 -translate-y-1/2 transition-colors duration-300 ${isLight ? 'text-[#f59e0b]' : 'text-[#f0c265]/70'}`}>
          <SunIcon className="h-3.5 w-3.5" />
        </span>
        {/* Moon (right) */}
        <span className={`pointer-events-none absolute right-[9px] top-1/2 -translate-y-1/2 transition-colors duration-300 ${isLight ? 'text-[#94a3b8]' : 'text-[#7CC0FF]/80'}`}>
          <MoonIcon className="h-3.5 w-3.5" />
        </span>
        {/* Sliding knob */}
        <span
          className={`absolute left-[3px] top-[3px] h-[24px] w-[24px] rounded-full transition-transform duration-300 ${
            isLight
              ? 'translate-x-[28px] bg-white ring-1 ring-black/10'
              : 'translate-x-0 bg-gradient-to-br from-[#2B5BFF] to-[#2593fc]'
          }`}
        />
      </button>
    </div>
  );
};