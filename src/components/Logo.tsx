// Logo.tsx – Full brand logo: image icon plus "Akbar Bizvoy" text and an optional tagline.
import logo2 from '../assets/Backgoundimages/logo2.svg';
import { useThemeStore } from '../store/themeStore';

// Props for the Logo component.
interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withText?: boolean;
  withTagline?: boolean;
  textClassName?: string;
}

// Maps each size keyword to its Tailwind height/width classes.
const SIZE_CLASSES: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-[50px] w-[50px] lg:h-[65px] lg:w-[65px]',
  xl: 'h-[70px] w-[70px]',
};

// Component that just shows the logo image icon on its own.
export const LogoIcon = ({ size = 'md', className = '' }: Omit<LogoProps, 'withText' | 'textClassName' | 'withTagline'>) => (
  <img
    src={logo2}
    alt="Akbar Bizvoy"
    className={`akbar-logo-icon block ${SIZE_CLASSES[size]} ${className}`}
  />
);

// Full Logo component: icon + text, plus an optional tagline below.
export const Logo = ({
  size = 'md',
  className = '',
  withText = true,
  withTagline = false,
  textClassName = '',
}: LogoProps) => {
  // Get the current theme so the text color matches it.
  const { theme } = useThemeStore();
  return (
  <div className={`akbar-logo ${className}`}>
    <div className="flex items-center gap-2">
      <LogoIcon size={size} />
      {/* Show the "Akbar Bizvoy" text next to the icon when requested. */}
      {withText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-extrabold tracking-tight text-[#242365] ${textClassName || 'text-[17px]'}`}
            style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", color: theme === 'light' ? '#111827' : '#ffffff' }}
          >
            Akbar
          </span>
          <span
            className={`font-extrabold tracking-tight text-[#242365] ${textClassName || 'text-[17px]'}`}
            style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", color: theme === 'light' ? '#111827' : '#ffffff' }}
          >
            Bizvoy
          </span>
        </div>
      )}
    </div>

    {/* Optionally show the "An Enterprise Travel Solution" tagline badge below the name. */}
    {withTagline && (
      <div className="mt-2 flex w-full items-center justify-center rounded bg-[#F20D59] px-4 py-1.5">
        <span
          className="text-[11px] font-semibold tracking-[0.08em] text-white"
          style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
        >
          An Enterprise Travel Solution
        </span>
      </div>
    )}
  </div>
  );
};

export default Logo;