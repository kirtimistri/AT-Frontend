import { useThemeStore } from '../../store/themeStore';

export const Footer = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <footer className={`mt-12 border-t py-5 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-[#F7F5F4]' : 'border-[#214b7e] bg-[#0a1420]'}`}>
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-5 sm:flex-row lg:px-8">
        <p className={`text-[10px] transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-white/40'}`}>
          &copy; 1978-2024 Akbar Bizvoy Travel Solutions. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className={`text-[10px] transition-colors duration-300 ${isLight ? 'text-[#999] hover:text-[#555]' : 'text-white/40 hover:text-white/70'}`}>
            Privacy Policy
          </a>
          <a href="#" className={`text-[10px] transition-colors duration-300 ${isLight ? 'text-[#999] hover:text-[#555]' : 'text-white/40 hover:text-white/70'}`}>
            Corporate Terms
          </a>
          <a href="#" className={`text-[10px] transition-colors duration-300 ${isLight ? 'text-[#999] hover:text-[#555]' : 'text-white/40 hover:text-white/70'}`}>
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};
