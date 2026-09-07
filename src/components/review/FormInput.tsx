import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

type BaseProps = {
  label: string;
  className?: string;
  wrapperClassName?: string;
};

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;

export const FormInput = ({ label, className = '', wrapperClassName = '', ...props }: InputProps) => (
  <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
    <label className="text-[10.5px] font-medium text-[#555]">{label}</label>
    <input
      className={`h-[36px] rounded-[3px] border border-[#DEDEDE] bg-white px-3 text-[11.5px] text-[#171717] outline-none transition-colors focus:border-[#004B7C] ${className}`}
      {...props}
    />
  </div>
);

type SelectProps = BaseProps & SelectHTMLAttributes<HTMLSelectElement>;

export const FormSelect = ({ label, children, className = '', wrapperClassName = '', ...props }: SelectProps) => (
  <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
    <label className="text-[10.5px] font-medium text-[#555]">{label}</label>
    <select
      className={`h-[36px] rounded-[3px] border border-[#DEDEDE] bg-white px-3 text-[11.5px] text-[#171717] outline-none transition-colors focus:border-[#004B7C] ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);
