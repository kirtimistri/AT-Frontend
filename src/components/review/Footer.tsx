export const Footer = () => {
  return (
    <footer className="mt-12 border-t border-[#EEEEEE] bg-[#F7F5F4] py-5">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-5 sm:flex-row lg:px-8">
        <p className="text-[10px] text-[#999]">
          &copy; 1978-2024 Akbar Bizvoy Travel Solutions. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-[10px] text-[#999] hover:text-[#555]">
            Privacy Policy
          </a>
          <a href="#" className="text-[10px] text-[#999] hover:text-[#555]">
            Corporate Terms
          </a>
          <a href="#" className="text-[10px] text-[#999] hover:text-[#555]">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};
