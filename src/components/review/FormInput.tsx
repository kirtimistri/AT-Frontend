import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { useThemeStore } from '../../store/themeStore';

type BaseProps = {
  label: string;
  className?: string;
  wrapperClassName?: string;
};

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;

export const FormInput = ({ label, className = '', wrapperClassName = '', ...props }: InputProps) => {
  const theme = useThemeStore((s) => s.theme);
  const isLight = theme === 'light';
  return (
    <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
      <label className={`text-[10.5px] font-medium transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>{label}</label>
      <input
        className={`h-[36px] rounded-[3px] border px-3 text-[11.5px] outline-none transition-colors focus:border-[#004B7C] ${isLight ? 'border-[#DEDEDE] bg-white text-[#171717]' : 'border-[#315073] bg-[#0d1b2a] text-white'} ${className}`}
        {...props}
      />
    </div>
  );
};

type SelectProps = BaseProps & SelectHTMLAttributes<HTMLSelectElement>;

export const FormSelect = ({ label, children, className = '', wrapperClassName = '', ...props }: SelectProps) => {
  const theme = useThemeStore((s) => s.theme);
  const isLight = theme === 'light';
  return (
    <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
      <label className={`text-[10.5px] font-medium transition-colors duration-300 ${isLight ? 'text-[#555]' : 'text-[#9baec7]'}`}>{label}</label>
      <select
        className={`h-[36px] rounded-[3px] border px-3 text-[11.5px] outline-none transition-colors focus:border-[#004B7C] ${isLight ? 'border-[#DEDEDE] bg-white text-[#171717]' : 'border-[#315073] bg-[#0d1b2a] text-white'} ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};