export type ToastKind = 'error' | 'success' | 'info' | 'warning';

export type ToastData = {
  id: number;
  kind: ToastKind;
  code?: number;
  title: string;
  message?: string;
  duration: number;
};

export type ToastInput = {
  title?: string;
  message?: string;
  code?: number;
  kind?: ToastKind;
  duration?: number;
};

let seq = 0;
let active: ToastData[] = [];
const subscribers = new Set<(t: ToastData[]) => void>();

const notify = () => subscribers.forEach((s) => s([...active]));

export function dismissToast(id: number) {
  active = active.filter((t) => t.id !== id);
  notify();
}

export function getActiveToasts(): ToastData[] {
  return active;
}

export function subscribeToasts(cb: (t: ToastData[]) => void): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

const defaults: Record<ToastKind, string> = {
  error: 'Error',
  success: 'Success',
  info: 'Info',
  warning: 'Warning',
};

export function toast(input: string | ToastInput) {
  const cfg = typeof input === 'string' ? { message: input } : input;
  const kind = cfg.kind ?? 'info';
  const duration = cfg.duration ?? 4500;
  const item: ToastData = {
    id: ++seq,
    kind,
    code: cfg.code,
    title: cfg.title ?? defaults[kind],
    message: cfg.message,
    duration,
  };
  active = [...active, item];
  notify();
  window.setTimeout(() => dismissToast(item.id), duration);
}