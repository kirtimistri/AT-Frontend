import { create } from 'zustand';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'akbar-theme';

const readInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';
  return window.localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
};

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  if (theme === 'light') {
    document.documentElement.classList.add('light-theme');
  } else {
    document.documentElement.classList.remove('light-theme');
  }
};

type ThemeStore = {
  theme: Theme;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: readInitialTheme(),
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    set({ theme: next });
  },
}));

// Keep the <html> data-theme in sync with the persisted preference on load
// so the toggle switch reflects the stored theme on every page.
applyTheme(readInitialTheme());

// Cross-tab sync: when another tab/window changes the theme in localStorage,
// apply it here too so every open tab updates in real time.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return;
    const next: Theme = e.newValue === 'light' ? 'light' : 'dark';
    applyTheme(next);
    useThemeStore.setState({ theme: next });
  });
}