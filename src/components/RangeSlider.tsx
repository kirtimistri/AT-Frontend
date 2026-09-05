import { useState } from 'react';

export type SliderSpec = { from: number; to: number; lit?: boolean };

export const RangeSlider = ({ from, to, lit = false }: SliderSpec) => {
  const [active, setActive] = useState(false);
  const on = active || lit;

  return (
    <div
      className={`mt-1 cursor-pointer px-0.5 transition-all duration-300 ${on ? 'opacity-100' : ''}`}
      onPointerDown={() => setActive(true)}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      role="slider"
      aria-label="Range slider"
    >
      <div className="relative h-[3px] rounded-full bg-white/10">
        <div
          className={`absolute top-0 h-full rounded-full transition-colors duration-300 ${on ? 'bg-[#d4af37]' : 'bg-[#3B9CFF] group-hover:bg-[#d4af37] group-active:bg-[#d4af37]'}`}
          style={{ left: `${from}%`, width: `${to - from}%` }}
        />
        <div
          className={`absolute top-1/2 h-[14px] w-[14px] -translate-y-1/2 rounded-full border-2 transition-all duration-300 ${on ? 'border-[#f5d67b] bg-[#2a2208]' : 'border-[#7CC0FF] bg-[#121E3C] group-hover:border-[#f5d67b] group-hover:bg-[#2a2208]'}`}
          style={{ left: `calc(${from}% - 7px)` }}
        />
        <div
          className={`absolute top-1/2 h-[14px] w-[14px] -translate-y-1/2 rounded-full border-2 transition-all duration-300 ${on ? 'border-[#f5d67b] bg-[#2a2208]' : 'border-[#7CC0FF] bg-[#121E3C] group-hover:border-[#f5d67b] group-hover:bg-[#2a2208]'}`}
          style={{ left: `calc(${to}% - 7px)` }}
        />
      </div>
    </div>
  );
};