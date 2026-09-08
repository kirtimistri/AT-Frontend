interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withText?: boolean;
  withTagline?: boolean;
  textClassName?: string;
}

const SIZE_CLASSES: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-[50px] w-[50px] lg:h-[65px] lg:w-[65px]',
  xl: 'h-[70px] w-[70px]',
};

/**
 * Four-color circular ring icon with a hot-pink center dot.
 * Top-left: cyan/sky blue · Top-right: lime green · Bottom-left: orange · Bottom-right: magenta
 */
export const LogoIcon = ({ size = 'md', className = '' }: Omit<LogoProps, 'withText' | 'textClassName' | 'withTagline'>) => (
  <svg
    viewBox="0 0 100 100"
    role="img"
    aria-label="Akbar Bizvoy"
    focusable="false"
    className={`akbar-logo-icon block ${SIZE_CLASSES[size]} ${className}`}
  >
    {/* Cyan / sky blue — top-left quadrant */}
    <path
      d="M4,50 A46,46 0 0,1 50,4 L50,26 A24,24 0 0,0 26,50 Z"
      fill="#00BCF2"
    />
    {/* Lime green — top-right quadrant */}
    <path
      d="M50,4 A46,46 0 0,1 96,50 L74,50 A24,24 0 0,0 50,26 Z"
      fill="#7AC143"
    />
    {/* Orange — bottom-left quadrant */}
    <path
      d="M50,96 A46,46 0 0,1 4,50 L26,50 A24,24 0 0,0 50,74 Z"
      fill="#F7941D"
    />
    {/* Hot pink / magenta — bottom-right quadrant */}
    <path
      d="M96,50 A46,46 0 0,1 50,96 L50,74 A24,24 0 0,0 74,50 Z"
      fill="#EC4899"
    />
    {/* Hot-pink center dot */}
    <circle cx="50" cy="50" r="12" fill="#EC4899" />
  </svg>
);

export const Logo = ({
  size = 'md',
  className = '',
  withText = true,
  withTagline = false,
  textClassName = '',
}: LogoProps) => (
  <div className={`akbar-logo ${className}`}>
    {/* Icon + brand name */}
    <div className="flex items-center gap-2">
      <LogoIcon size={size} />
      {withText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-extrabold tracking-tight text-[#242365] ${textClassName || 'text-[17px]'}`}
            style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
          >
            akbar
          </span>
          <span
            className={`font-extrabold tracking-tight text-[#242365] ${textClassName || 'text-[17px]'}`}
            style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
          >
            bizvoy
          </span>
        </div>
      )}
    </div>

    {/* Pink tagline strip */}
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

export default Logo;