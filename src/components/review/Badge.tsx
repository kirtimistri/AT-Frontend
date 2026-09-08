import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant?: 'blue' | 'orange' | 'green' | 'red' | 'default';
  className?: string;
};

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  blue: 'bg-[#E1EFFB] text-[#004B7C]',
  orange: 'bg-[#FDE9DC] text-[#98552F]',
  green: 'bg-[#E6F9ED] text-[#166534]',
  red: 'bg-[#FEE2E2] text-[#991B1B]',
  default: 'bg-[#F3F4F6] text-[#374151]',
};

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => (
  <span
    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${variantStyles[variant]} ${className}`}
  >
    {children}
  </span>
);
