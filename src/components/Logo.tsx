interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withText?: boolean;
  textClassName?: string;
}

const SIZE_CLASSES: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-[50px] w-[50px] lg:h-[65px] lg:w-[65px]',
  xl: 'h-[70px] w-[70px]',
};

export const LogoIcon = ({ size = 'md', className = '' }: Omit<LogoProps, 'withText' | 'textClassName'>) => (
  <svg
    viewBox="0 0 100 100"
    role="img"
    aria-label="Akbar Bizvoy"
    focusable="false"
    className={`akbar-logo-icon block ${SIZE_CLASSES[size]} ${className}`}
  >
    <g className="akbar-logo-sections">
      <path d="M50 50 L50 2 A48 48 0 0 1 98 50 Z" fill="var(--logo-blue)" />
      <path d="M50 50 L98 50 A48 48 0 0 1 50 98 Z" fill="var(--logo-green)" />
      <path d="M50 50 L50 98 A48 48 0 0 1 2 50 Z" fill="var(--logo-orange)" />
      <path d="M50 50 L2 50 A48 48 0 0 1 50 2 Z" fill="var(--logo-pink)" />
    </g>
    <circle cx="50" cy="50" r="38" fill="var(--logo-inner)" />
    <circle cx="50" cy="50" r="38" fill="none" stroke="var(--logo-inner-ring)" strokeWidth="4" />
    <circle cx="50" cy="50" r="22" fill="var(--logo-pink)" />
  </svg>
);

export const Logo = ({
  size = 'md',
  className = '',
  withText = true,
  textClassName = '',
}: LogoProps) => (
  <div className={`akbar-logo flex items-center gap-2 ${className}`}>
    <LogoIcon size={size} />
    {withText && (
      <span className={`akbar-logo-text ${textClassName}`}>akbar bizvoy</span>
    )}
  </div>
);

export default Logo;