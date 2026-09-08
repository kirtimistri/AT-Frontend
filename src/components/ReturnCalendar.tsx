import { WEEKDAYS, priceFor, priceColor, holidayForDate, HOLIDAYS } from '../store/flightStore';
import { useThemeStore } from '../store/themeStore';
import { iconProps } from '../lib/iconProps';
import { ChevronRight } from './icons';

const monthGrid = (year: number, month: number) => {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: ({ day: number } | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1 })),
  ];
  return cells;
};

const monthName = (year: number, month: number) =>
  new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const formatReturn = (year: number, month: number, day: number) =>
  new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

type MonthProps = {
  year: number;
  month: number;
  selected: string | null;
  isLight: boolean;
  onPick: (label: string, year: number, month: number, day: number) => void;
};

const MonthGrid = ({ year, month, selected, isLight, onPick }: MonthProps) => {
  const today = new Date();
  return (
    <div className="min-w-0 flex-1">
      <div className={`mb-2 text-center text-[13px] font-bold transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{monthName(year, month)}</div>
      <div className={`grid grid-cols-7 gap-y-1 text-center text-[10px] font-semibold uppercase tracking-wide transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#7a8ba3]'}`}>
        {WEEKDAYS.map((w) => <span key={w} className="py-0.5">{w}</span>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1">
        {monthGrid(year, month).map((cell, idx) => {
          if (!cell) return <span key={`e-${idx}`} />;
          const d = new Date(year, month, cell.day);
          const past = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const p = priceFor(year, month, cell.day);
          const holiday = holidayForDate(year, month, cell.day);
          const isSel = selected === formatReturn(year, month, cell.day);
          return (
            <button
              key={cell.day}
              disabled={past}
              title={holiday?.name}
              onClick={() => onPick(formatReturn(year, month, cell.day), year, month, cell.day)}
              className={`group relative flex cursor-pointer flex-col items-center rounded-[10px] px-0.5 py-1 transition-all duration-200 ${isSel ? (isLight ? 'bg-[#2563EB] shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-[#2593fc] shadow-[0_0_12px_rgba(37,147,252,0.5)]') : (past ? 'cursor-default opacity-30 hover:bg-transparent' : (isLight ? 'hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:shadow-[0_0_10px_rgba(37,99,235,0.2)]' : 'hover:bg-[#d4af37] hover:text-black hover:shadow-[0_0_14px_rgba(212,175,55,0.65)]'))}`}
            >
              {holiday && !isSel && (
                <span className="absolute right-0.5 top-0.5 text-[9px] leading-none">{holiday.emoji}</span>
              )}
              <span className={`text-[12px] font-semibold leading-none transition-colors duration-200 ${isSel ? (isLight ? 'text-white' : 'text-white') : (past ? '' : 'group-hover:text-black')} ${isSel ? '' : holiday ? (isLight ? 'text-[#F59E0B]' : 'text-[#fb923c]') : (isLight ? 'text-[#111827]' : 'text-[#dde6f0]')}`}>{cell.day}</span>
              <span className={`mt-1 text-[8.5px] leading-none transition-colors duration-200 ${isSel ? (isLight ? 'text-white/90' : 'text-white/90') : (past ? '' : 'group-hover:text-black')} ${isSel ? '' : holiday ? (isLight ? 'text-[#F59E0B]/90' : 'text-[#fb923c]/90') : priceColor[p.level]}`}>{isSel ? 'Selected' : holiday ? holiday.name.includes('Long') ? 'Festival' : 'Holiday' : p.price}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const HolidayStrip = ({ isLight }: { isLight: boolean }) => (      <div className={`pretty-scroll -mx-1 mb-3 flex items-center gap-2 overflow-x-auto px-1 pb-1 transition-colors duration-300 ${isLight ? 'text-[#111827]' : ''}`}>
    {HOLIDAYS.map((h) => (
      <button
        key={h.name}
        className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 text-left transition-all duration-200 ${isLight ? 'bg-white border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF]' : 'bg-[#121E3C] border-[rgba(124,192,255,0.3)] hover:border-[#d4af37]/70 hover:bg-[rgba(212,175,55,0.08)]'}`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[16px]" style={{ background: `${h.accent}22` }}>{h.emoji}</span>          <span className="min-w-0">
          <span className={`block truncate text-[11.5px] font-bold transition-colors duration-300 ${isLight ? 'text-[#111827]' : 'text-white'}`}>{h.name}</span>
          <span className={`block text-[10px] transition-colors duration-300 ${isLight ? 'text-[#6B7280]' : 'text-[#8fa3bf]'}`}>{h.dates}</span>
        </span>
      </button>
    ))}      <button className={`flex shrink-0 cursor-pointer items-center gap-1 border-none bg-transparent pl-2 text-[11.5px] font-bold transition-colors duration-200 ${isLight ? 'text-[#F59E0B] hover:text-[#D97706]' : 'text-[#fb923c] hover:text-[#f0c265]'}`}>
      Holiday List <ChevronRight className="h-3 w-3" />
    </button>
  </div>
);

export const ReturnCalendar = ({
  monthOffset,
  onShift,
  selected,
  onPick,
  onClose,
}: {
  monthOffset: number;
  onShift: (dir: -1 | 1) => void;
  selected: string | null;
  onPick: (label: string) => void;
  onClose: () => void;
}) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const baseYear = 2026;
  const baseMonth = 8 + monthOffset; // Sep 2026 is index 8
  const year = baseYear + Math.floor(baseMonth / 12);
  const month = ((baseMonth % 12) + 12) % 12;
  const year2 = baseYear + Math.floor((baseMonth + 1) / 12);
  const month2 = ((baseMonth + 1) % 12 + 12) % 12;

  return (
    <div className={`pretty-scroll flex max-h-[80dvh] w-[min(780px,94vw)] flex-col overflow-y-auto rounded-[16px] border p-3 sm:p-4 transition-colors duration-300 ${isLight ? 'bg-white border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.1)]' : 'bg-[#0F1B3A] border-[rgba(124,192,255,0.35)] shadow-[0_20px_60px_rgba(0,0,0,0.55)]'}`}>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onShift(-1)}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 aria-label="Previous months" ${isLight ? 'bg-white border-[#E5E7EB] text-[#2563EB] hover:border-[#2563EB] hover:text-[#1D4ED8]' : 'border-[rgba(124,192,255,0.4)] text-[#7CC0FF] hover:border-[#d4af37]/70 hover:text-[#f0c265]'}`}
          >
            <svg {...iconProps('h-3.5 w-3.5')}><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <span className={`text-[12px] font-semibold transition-colors duration-300 ${isLight ? 'text-[#2563EB]' : 'text-[#7CC0FF]'}`}>Select return date</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onShift(1)}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 aria-label="Next months" ${isLight ? 'bg-white border-[#E5E7EB] text-[#2563EB] hover:border-[#2563EB] hover:text-[#1D4ED8]' : 'border-[rgba(124,192,255,0.4)] text-[#7CC0FF] hover:border-[#d4af37]/70 hover:text-[#f0c265]'}`}
          >
            <svg {...iconProps('h-3.5 w-3.5')}><path d="m9 18 6-6-6-6" /></svg>
          </button>
          <button
            onClick={onClose}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 aria-label="Close calendar" ${isLight ? 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB] hover:text-[#111827]' : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white'}`}
          >
            <svg {...iconProps('h-3.5 w-3.5')}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Holiday / occasion strip */}
      <HolidayStrip isLight={isLight} />

      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <MonthGrid year={year} month={month} selected={selected} isLight={isLight} onPick={(label) => onPick(label)} />
        <MonthGrid year={year2} month={month2} selected={selected} isLight={isLight} onPick={(label) => onPick(label)} />
      </div>

      {/* Price colour legend */}
      <div className={`mt-3 flex flex-wrap items-center justify-center gap-3 border-t pt-2.5 text-[11px] sm:gap-5 transition-colors duration-300 ${isLight ? 'border-[#E5E7EB] text-[#6B7280]' : 'border-white/10 text-[#9baec7]'}`}>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#34d399]" /> Cheapest</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#eab308]" /> Average</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#fb923c]" /> Pricier</span>
      </div>
    </div>
  );
};
