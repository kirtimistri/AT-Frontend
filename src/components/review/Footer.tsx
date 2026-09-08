import { useThemeStore } from '../../store/themeStore';

export const Footer = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <footer className={`mt-12 border-t py-5 transition-colors duration-300 ${isLight ? 'border-[#EEEEEE] bg-[#F7F5F4]' : 'border-[#1c3a5f] bg-[#0E1833]'}`}>
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-5 sm:flex-row lg:px-8">
        <p className={`text-[10px] transition-colors duration-300 ${isLight ? 'text-[#999]' : 'text-[#7e93b3]'}`}>
          &copy; 1978-2024 Akbar Bizvoy Travel Solutions. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className={`text-[10px] transition-colors duration-300 hover:text-[#555] ${isLight ? 'text-[#999]' : 'text-[#7CC0FF] hover:text-[#a8d8ff]'}`}>
            Privacy Policy
          </a>
          <a href="#" className={`text-[10px] transition-colors duration-300 hover:text-[#555] ${isLight ? 'text-[#999]' : 'text-[#7CC0FF] hover:text-[#a8d8ff]'}`}>
            Corporate Terms
          </a>
          <a href="#" className={`text-[10px] transition-colors duration-300 hover:text-[#555] ${isLight ? 'text-[#999]' : 'text-[#7CC0FF] hover:text-[#a8d8ff]'}`}>
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};
