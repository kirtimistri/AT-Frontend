import type { ReactNode } from 'react';

const IndigoLogo = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0B5CAB]">
    <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  </div>
);

const AirIndiaLogo = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#A6192E]">
    <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M4 14.5c4.5-1.6 9.5-2.1 17-3.3-.6 4.7-3.4 8-8.6 9.4-1.7.5-3.4.3-4.6-.4-1-.6-2.5-2.5-3.8-5.7Z" />
      <path d="M4 14.5c1.2-4.6 3.7-7.6 7-9.5" />
    </svg>
  </div>
);

const AkasaLogo = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#2A1650]">
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path d="M12 4 20 19H4L12 4Z" fill="#F97316" />
      <path d="M12 8.5 17 19H7L12 8.5Z" fill="#FB923C" />
    </svg>
  </div>
);

const SpiceJetLogo = () => (
  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-[#D81E2B]">
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <circle cx="6" cy="6" r="1.3" fill="#1B1B1B" />
      <circle cx="13" cy="5" r="1.3" fill="#1B1B1B" />
      <circle cx="19" cy="7" r="1.3" fill="#1B1B1B" />
      <circle cx="8" cy="12" r="1.3" fill="#1B1B1B" />
      <circle cx="15" cy="11" r="1.3" fill="#1B1B1B" />
      <circle cx="20" cy="13" r="1.3" fill="#1B1B1B" />
      <circle cx="6" cy="18" r="1.3" fill="#1B1B1B" />
      <circle cx="13" cy="17" r="1.3" fill="#1B1B1B" />
      <circle cx="18" cy="19" r="1.3" fill="#1B1B1B" />
    </svg>
  </div>
);

const LOGO_BY_AIRLINE: Record<string, ReactNode> = {
  INDIGO: <IndigoLogo />,
  'AIR INDIA': <AirIndiaLogo />,
  AKASA: <AkasaLogo />,
  SPICEJET: <SpiceJetLogo />,
};

/** Renders the airline logo tile for a flight's airline name. */
export const AirlineLogo = ({ airline }: { airline: string }) =>
  LOGO_BY_AIRLINE[airline] ?? <IndigoLogo />;

export { IndigoLogo, AirIndiaLogo, AkasaLogo, SpiceJetLogo };