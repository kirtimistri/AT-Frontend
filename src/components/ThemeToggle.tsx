// Switch-style toggle for switching between light and dark theme.
import { useThemeStore } from '../store/themeStore';

// Small sun graphic shown on the left side of the switch
const SunIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

// Small moon graphic shown on the right side of the switch
const MoonIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

/**
 * Switch-style theme toggle. Rendered on every page: floating top-right by default, or inline (e.g. inside the header) via a custom className.
 * `size="sm"` renders a slightly smaller switch.
 */
export const ThemeToggle = ({
  className = 'fixed right-4 top-4 z-[100]',
  size = 'md',
}: {
  className?: string;
  size?: 'md' | 'sm';
}) => {
  // Read current theme and the toggle action from the store
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isLight = theme === 'light';

  // Size-specific CSS classes so small and large switches render correctly
  const s =
    size === 'sm'
      ? {
          btn: 'h-[22px] w-[42px]',
          knob: 'left-[2px] top-[2px] h-[18px] w-[18px]',
          knobOn: 'translate-x-[20px]',
          icon: 'h-[10px] w-[10px]',
          left: 'left-[6px]',
          right: 'right-[6px]',
        }
      : {
          btn: 'h-[24px] w-[44px]',
          knob: 'left-[2px] top-[2px] h-[20px] w-[20px]',
          knobOn: 'translate-x-[20px]',
          icon: 'h-[11px] w-[11px]',
          left: 'left-[6px]',
          right: 'right-[6px]',
        };

  // Render the switch button with sun, moon, and sliding knob
  return (
    <div className={className}>
      <button
        type="button"
        role="switch"
        aria-checked={isLight}
        aria-label="Toggle dark / light theme"
        onClick={toggleTheme}
        className={`relative cursor-pointer rounded-full border transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0c265]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060d1a] ${s.btn} ${
          isLight
            ? 'border-white/60 bg-gradient-to-br from-white to-[#e8eef7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.12),0_2px_14px_rgba(255,255,255,0.25)]'
            : 'border-[rgba(124,192,255,0.45)] bg-gradient-to-b from-[#0E1833] to-[#08121f] shadow-[inset_0_2px_5px_rgba(0,0,0,0.55),0_0_14px_rgba(59,156,255,0.25)]'
        }`}
      >
        {/* Sun (left) */}
        <span className={`pointer-events-none absolute top-1/2 -translate-y-1/2 transition-all duration-500 ${s.left} ${isLight ? 'text-[#f59e0b] drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]' : 'text-[#f0c265]/50'}`}>
          <SunIcon className={s.icon} />
        </span>
        {/* Moon (right) */}
        <span className={`pointer-events-none absolute top-1/2 -translate-y-1/2 transition-all duration-500 ${s.right} ${isLight ? 'text-[#94a3b8]' : 'text-[#7CC0FF] drop-shadow-[0_0_5px_rgba(124,192,255,0.8)]'}`}>
          <MoonIcon className={s.icon} />
        </span>
        {/* Sliding knob */}
        <span
          className={`absolute rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${s.knob} ${
            isLight
              ? `${s.knobOn} bg-gradient-to-br from-white to-[#f1f5fb] shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-black/10`
              : 'translate-x-0 bg-gradient-to-br from-[#2B5BFF] via-[#2593fc] to-[#7CC0FF] shadow-[0_0_10px_rgba(37,147,252,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]'
          }`}
        />
      </button>
    </div>
  );
};