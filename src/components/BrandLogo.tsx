// BrandLogo.tsx – Small brand logo (logo2.svg) used in headers and nav bars.
import logo2 from '../assets/Backgoundimages/logo2.svg';

// Props for the BrandLogo component.
type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

// Maps each size keyword to its Tailwind height/width classes.
const SIZE_CLASSES: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-[54px] w-[54px]',
};

/** Brand logo (logo2.svg) shown in the header of every page. */
export const BrandLogo = ({ size = 'md', className = '' }: BrandLogoProps) => (
  <img src={logo2} alt="Akbar Bizvoy" className={`block ${SIZE_CLASSES[size]} ${className}`} />
);

export default BrandLogo;
