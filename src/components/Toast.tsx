// Toast.tsx – Toast notification system that shows temporary messages at the top of the screen.
import { useEffect, useState, type ReactNode } from 'react';
import { dismissToast, getActiveToasts, subscribeToasts, type ToastData, type ToastKind } from './toastStore';
import { useThemeStore } from '../store/themeStore';

// Helper to convert HTTP status codes to human-readable labels.
const statusLabel = (code: number): string => {
  switch (code) {
    case 200:
      return 'OK';
    case 201:
      return 'Created';
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 409:
      return 'Conflict';
    case 422:
      return 'Unprocessable Entity';
    case 429:
      return 'Too Many Requests';
    case 500:
      return 'Internal Server Error';
    case 502:
      return 'Bad Gateway';
    case 503:
      return 'Service Unavailable';
    case 504:
      return 'Gateway Timeout';
    default:
      return '';
  }
};

// Color themes for each toast kind (error, warning, success, info).
const kindTheme: Record<
  ToastKind,
  { bar: string; text: string; glow: string; tileBg: string; tileRing: string; lightBg: string; lightText: string }
> = {
  error: {
    bar: '#ff5f6d',
    text: '#ff8a94',
    glow: 'rgba(255,95,109,0.45)',
    tileBg: 'linear-gradient(135deg, rgba(255,95,109,0.30), rgba(255,95,109,0.07))',
    tileRing: 'rgba(255,95,109,0.35)',
    lightBg: 'linear-gradient(135deg, rgba(255,95,109,0.12), rgba(255,95,109,0.04))',
    lightText: '#dc2626',
  },
  warning: {
    bar: '#d4af37',
    text: '#f0c265',
    glow: 'rgba(212,175,55,0.5)',
    tileBg: 'linear-gradient(135deg, rgba(212,175,55,0.32), rgba(212,175,55,0.08))',
    tileRing: 'rgba(240,197,101,0.4)',
    lightBg: 'linear-gradient(135deg, rgba(212,175,55,0.14), rgba(212,175,55,0.04))',
    lightText: '#B8860B',
  },
  success: {
    bar: '#34d399',
    text: '#6ee7b7',
    glow: 'rgba(52,211,153,0.4)',
    tileBg: 'linear-gradient(135deg, rgba(52,211,153,0.28), rgba(52,211,153,0.06))',
    tileRing: 'rgba(52,211,153,0.35)',
    lightBg: 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(52,211,153,0.03))',
    lightText: '#16A34A',
  },
  info: {
    bar: '#7CC0FF',
    text: '#a8d8ff',
    glow: 'rgba(124,192,255,0.45)',
    tileBg: 'linear-gradient(135deg, rgba(124,192,255,0.3), rgba(124,192,255,0.07))',
    tileRing: 'rgba(124,192,255,0.35)',
    lightBg: 'linear-gradient(135deg, rgba(124,192,255,0.12), rgba(124,192,255,0.04))',
    lightText: '#2563EB',
  },
};

// SVG icons for each toast kind.
const kindIcons: Record<ToastKind, ReactNode> = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
};

// Main component that renders the toast notification list.
export function ToastViewport() {
  // Subscribe to active toasts from the toast store.
  const [items, setItems] = useState<ToastData[]>(() => getActiveToasts());
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Re-render whenever the toast store updates.
  useEffect(() => {
    return subscribeToasts((next) => setItems(next));
  }, []);

  return (
    // List of all active toast notifications.
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex flex-col items-center gap-3 px-3 sm:inset-x-auto sm:top-5 sm:right-5 sm:items-end">
      {items.map((t) => {
        // Look up the colors/theme for this toast kind.
        const p = kindTheme[t.kind];
        return (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            className={`toast-pop pointer-events-auto relative w-full max-w-[380px] overflow-hidden rounded-[14px] border backdrop-blur transition-colors duration-300 ${isLight ? 'border-[#E5E7EB] bg-white/97 shadow-[0_14px_44px_rgba(0,0,0,0.1)]' : 'border-[rgba(124,192,255,0.22)] bg-[#0F1B3A]/95 shadow-[0_14px_44px_rgba(0,0,0,0.6)]'}`}
            style={!isLight ? { boxShadow: `0 14px 44px rgba(0,0,0,0.6), 0 0 24px ${p.glow}` } : undefined}
          >
            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${p.glow}, transparent)` }}
            />
            <div className="relative flex items-start gap-3 py-3 pl-3.5 pr-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]"
                style={{
                  background: isLight ? p.lightBg : p.tileBg,
                  border: `1px solid ${p.tileRing}`,
                  boxShadow: isLight ? 'none' : `inset 0 1px 0 rgba(255,255,255,0.14), 0 0 16px ${p.glow}`,
                }}
              >
                <span className="flex h-[18px] w-[18px]" style={{ color: isLight ? p.lightText : p.text }}>
                  {kindIcons[t.kind]}
                </span>
              </span>

              <div className="min-w-0 flex-1 pt-[2px]">
                {/* Title and optional status code badge. */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[13px] font-bold tracking-wide transition-colors duration-300 ${isLight ? 'text-[#111827]' : ''}`} style={!isLight ? { color: p.text } : undefined}>
                    {t.title}
                  </span>
                  {typeof t.code === 'number' && (
                    <span
                      className="toast-status-badge rounded-[6px] px-1.5 py-px font-mono text-[10px] font-bold tracking-wide transition-colors duration-300"
                      style={!isLight ? { color: p.text, border: `1px solid ${p.tileRing}`, background: 'rgba(14,24,51,0.8)' } : { color: p.lightText, border: `1px solid ${p.tileRing}`, background: '#F7F9FC' }}
                    >
                      {t.code} {statusLabel(t.code)}
                    </span>
                  )}
                </div>
                {t.message && (
                  <p className={`toast-message mt-0.5 text-[12.5px] leading-snug transition-colors duration-300 ${isLight ? 'text-[#4B5563]' : 'text-white/75'}`}>{t.message}</p>
                )}
              </div>

              {/* Dismiss button to close this toast. */}
              <button
                onClick={() => dismissToast(t.id)}
                className={`toast-dismiss-btn flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-transparent transition-all duration-200 ${isLight ? 'border-[#E5E7EB] text-[#9CA3AF] hover:border-[#2563EB] hover:text-[#2563EB]' : 'border-[rgba(124,192,255,0.25)] text-white/45 hover:border-[#d4af37]/70 hover:text-[#f0c265]'}`}
                aria-label="Dismiss"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3 w-3">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress bar that shrinks as the toast countdowns. */}
            <span className="absolute inset-x-0 bottom-0 block h-[3px]">
              <span
                className="toast-progress block h-full rounded-r-full"
                style={{ background: p.bar, boxShadow: `0 0 8px 2px ${p.glow}`, animationDuration: `${t.duration}ms` }}
              />
            </span>
          </div>
        );
      })}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .toast-pop { animation: toastIn 280ms cubic-bezier(0.2, 0.9, 0.3, 1.2) both; }

        @keyframes toastProgress { from { width: 100%; } to { width: 0%; } }
        .toast-progress { width: 100%; animation: toastProgress 4.5s linear forwards; }

        @media (prefers-reduced-motion: reduce) {
          .toast-pop, .toast-progress { animation: none; }
        }
      `}</style>
    </div>
  );
}
