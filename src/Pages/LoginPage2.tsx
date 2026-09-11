// Login page: lets the user sign in with email + password, or use the demo
// account, and redirects to the search page after a successful login.
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/Backgoundimages/logo2.svg';
import bg2Webp640 from '../assets/Backgoundimages/bg2-640w.webp';
import bg2Webp960 from '../assets/Backgoundimages/bg2-960w.webp';
import bg2Webp1280 from '../assets/Backgoundimages/bg2-1280w.webp';
import bg2Webp from '../assets/Backgoundimages/bg2.webp';
import bg2Avif640 from '../assets/Backgoundimages/bg2-640w.avif';
import bg2Avif960 from '../assets/Backgoundimages/bg2-960w.avif';
import bg2Avif1280 from '../assets/Backgoundimages/bg2-1280w.avif';
import bg2Avif from '../assets/Backgoundimages/bg2.avif';
import lightBgWebp640 from '../assets/Backgoundimages/backgroundlight-640w.webp';
import lightBgWebp960 from '../assets/Backgoundimages/backgroundlight-960w.webp';
import lightBgWebp1280 from '../assets/Backgoundimages/backgroundlight-1280w.webp';
import lightBgWebp from '../assets/Backgoundimages/backgroundlight.webp';
import lightBgAvif640 from '../assets/Backgoundimages/backgroundlight-640w.avif';
import lightBgAvif960 from '../assets/Backgoundimages/backgroundlight-960w.avif';
import lightBgAvif1280 from '../assets/Backgoundimages/backgroundlight-1280w.avif';
import lightBgAvif from '../assets/Backgoundimages/backgroundlight.avif';

import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useGlobalLoader, GLOBAL_LOGIN_MESSAGES } from '../store/globalLoader';
import { loginUser, ApiError } from '../services/authService';
import { toast } from '../store/toastStore';
import { ThemeToggle } from '../components/ThemeToggle';
import { ResponsiveImageView, type ImageVariant } from '../components/ResponsiveImageView';

// Responsive variants (640 / 960 / 1280 / full width) for the dark background.
const darkBgVariants = {
  webp: [
    { src: bg2Webp640, w: 640 },
    { src: bg2Webp960, w: 960 },
    { src: bg2Webp1280, w: 1280 },
    { src: bg2Webp, w: 1672 },
  ] as ImageVariant[],
  avif: [
    { src: bg2Avif640, w: 640 },
    { src: bg2Avif960, w: 960 },
    { src: bg2Avif1280, w: 1280 },
    { src: bg2Avif, w: 1672 },
  ] as ImageVariant[],
};

// Responsive variants for the light background.
const lightBgVariants = {
  webp: [
    { src: lightBgWebp640, w: 640 },
    { src: lightBgWebp960, w: 960 },
    { src: lightBgWebp1280, w: 1280 },
    { src: lightBgWebp, w: 1600 },
  ] as ImageVariant[],
  avif: [
    { src: lightBgAvif640, w: 640 },
    { src: lightBgAvif960, w: 960 },
    { src: lightBgAvif1280, w: 1280 },
    { src: lightBgAvif, w: 1600 },
  ] as ImageVariant[],
};

// Pre-filled credentials for the demo login button.
const DEMO_EMAIL = 'demo@akbarbizvoy.com';
const DEMO_PASSWORD = 'demo123';

const LoginPage2 = () => {
  const navigate = useNavigate();

  // Theme + auth store setup.
  const { theme } = useThemeStore();
  const authLogin = useAuthStore((s) => s.login);

  // Global branded loader for the full auth transition.
  const { showLoader, hideLoader } = useGlobalLoader();

  // Form state.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Whether the password is visible (toggle) and if the form is submitting.
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronous lock that prevents duplicate submissions even if state updates
  // haven't rendered yet (e.g. double-click before the re-render).
  const submitLock = useRef(false);

  const isLight = theme === 'light';

  // ------------------------------------------
  // LIGHT THEME TAGLINE
  // ------------------------------------------

  const taglineWords = [
    'Smart',
    'journeys.',
    'Seamless',
    'experiences.',
    'Every',
    'time.',
  ];

  const [visibleWords, setVisibleWords] = useState(0);

  const [fadePhase, setFadePhase] =
    useState<'in' | 'out'>('in');

  // ------------------------------------------
  // DARK THEME TYPING PHRASES
  // ------------------------------------------

  const typingPhrases = [
    'Travel with confidence.',
    'Your journey, simplified.',
    'Fly beyond boundaries.',
  ];

  const WORD_DELAY = 300;
  const HOLD_DURATION = 2000;
  const FADE_OUT_DURATION = 600;

  const [phraseIndex, setPhraseIndex] = useState(0);

  // ------------------------------------------
  // DARK THEME TYPING ANIMATION
  // ------------------------------------------

  useEffect(() => {
    if (isLight) return;

    let active = true;

    const currentPhrase =
      typingPhrases[phraseIndex];

    const words = currentPhrase.split(' ');

    const timers: ReturnType<typeof setTimeout>[] = [];

    setVisibleWords(0);
    setFadePhase('in');

    words.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          if (active) {
            setVisibleWords(i + 1);
          }
        }, (i + 1) * WORD_DELAY)
      );
    });

    const totalTyping =
      words.length * WORD_DELAY;

    timers.push(
      setTimeout(() => {
        if (active) {
          setFadePhase('out');
        }
      }, totalTyping + HOLD_DURATION)
    );

    timers.push(
      setTimeout(() => {
        if (active) {
          setPhraseIndex(
            (prev) =>
              (prev + 1) % typingPhrases.length
          );
        }
      }, totalTyping + HOLD_DURATION + FADE_OUT_DURATION)
    );

    return () => {
      active = false;

      timers.forEach(clearTimeout);
    };
  }, [phraseIndex, isLight]);

  // ------------------------------------------
  // LIGHT THEME TAGLINE ANIMATION
  // ------------------------------------------

  useEffect(() => {
    if (!isLight) return;

    let active = true;

    const timers: ReturnType<typeof setTimeout>[] = [];

    const runCycle = () => {
      if (!active) return;

      setVisibleWords(0);
      setFadePhase('in');

      taglineWords.forEach((_, i) => {
        timers.push(
          setTimeout(() => {
            if (active) {
              setVisibleWords(i + 1);
            }
          }, (i + 1) * 300)
        );
      });

      const totalReveal =
        taglineWords.length * 300 + 800;

      timers.push(
        setTimeout(() => {
          if (active) {
            setFadePhase('out');
          }
        }, totalReveal)
      );

      timers.push(
        setTimeout(() => {
          if (active) {
            runCycle();
          }
        }, totalReveal + 600)
      );
    };

    runCycle();

    return () => {
      active = false;

      timers.forEach(clearTimeout);
    };
  }, [isLight]);

  // ------------------------------------------
  // LOGIN SUBMIT
  // ------------------------------------------

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isSubmitting || submitLock.current) return;

    submitLock.current = true;

    const trimmed = email.trim();

    setIsSubmitting(true);

    // Full-screen branded loader while the auth request is in flight.
    showLoader(GLOBAL_LOGIN_MESSAGES);

    try {
      const res = await loginUser(trimmed, password);

      if (res.success && res.data) {
        authLogin(res.data);

        toast({
          kind: 'success',
          code: 200,
          title: 'Signed In',
          message:
            'Welcome back! Redirecting…',
        });

        // Keep the loader visible through the SPA transition — the page
        // transition controller fades it out once the search page mounts.
        navigate('/search');
      } else {
        hideLoader();

        toast({
          kind: 'error',
          code: 400,
          title: 'Login Failed',
          message:
            res.message || 'Invalid credentials.',
        });
      }
    } catch (err: unknown) {
      hideLoader();

      const { message, title, code } =
        err instanceof ApiError
          ? {
              message: err.message,
              title:
                err.status === 0
                  ? 'Network Error'
                  : err.status === 408
                    ? 'Request Timed Out'
                    : err.status === 401 ||
                        err.status === 403
                      ? 'Unauthorized'
                      : 'Server Error',
              code:
                err.status === 0
                  ? 0
                  : err.status === 401 ||
                      err.status === 403
                    ? err.status
                    : 500,
            }
          : {
              message:
                'Something went wrong. Please try again.',
              title: 'Server Error',
              code: 500,
            };

      toast({
        kind: 'error',
        code,
        title,
        message,
      });
    } finally {
      submitLock.current = false;
      setIsSubmitting(false);
    }
  };

  // ------------------------------------------
  // GOLDEN EARTH DOTS
  // ------------------------------------------

  const goldenDots = [
    { left: '14%', bottom: '32%', size: 2, delay: '0s', dur: '2.2s' },
    { left: '16%', bottom: '34%', size: 2, delay: '0.3s', dur: '2.5s' },
    { left: '13%', bottom: '33%', size: 2, delay: '0.6s', dur: '2.3s' },
    { left: '18%', bottom: '32%', size: 2, delay: '0.9s', dur: '2.7s' },
    { left: '15%', bottom: '35%', size: 2, delay: '1.2s', dur: '2.1s' },
    { left: '17%', bottom: '31%', size: 2, delay: '0.2s', dur: '2.6s' },
    { left: '12%', bottom: '34%', size: 2, delay: '1.5s', dur: '2.4s' },
    { left: '19%', bottom: '33%', size: 2, delay: '0.4s', dur: '2.8s' },
    { left: '20%', bottom: '35%', size: 2, delay: '0.7s', dur: '2.2s' },
    { left: '11%', bottom: '32%', size: 2, delay: '1.1s', dur: '2.5s' },

    { left: '29%', bottom: '24%', size: 2, delay: '0.8s', dur: '2.4s' },
    { left: '30%', bottom: '22%', size: 2, delay: '0.1s', dur: '2.7s' },
    { left: '28%', bottom: '23%', size: 2, delay: '1.4s', dur: '2.3s' },
    { left: '31%', bottom: '25%', size: 2, delay: '0.5s', dur: '2.6s' },
    { left: '27%', bottom: '21%', size: 2, delay: '1.0s', dur: '2.2s' },
    { left: '32%', bottom: '23%', size: 2, delay: '0.3s', dur: '2.5s' },

    { left: '41%', bottom: '32%', size: 2, delay: '0.2s', dur: '2.3s' },
    { left: '43%', bottom: '31%', size: 2, delay: '0.6s', dur: '2.6s' },
    { left: '40%', bottom: '33%', size: 2, delay: '1.1s', dur: '2.4s' },
    { left: '44%', bottom: '32%', size: 2, delay: '0.4s', dur: '2.7s' },
    { left: '42%', bottom: '30%', size: 2, delay: '0.8s', dur: '2.2s' },
    { left: '45%', bottom: '33%', size: 2, delay: '1.3s', dur: '2.5s' },
    { left: '39%', bottom: '31%', size: 2, delay: '0.7s', dur: '2.8s' },
    { left: '44%', bottom: '34%', size: 2, delay: '1.0s', dur: '2.3s' },

    { left: '43%', bottom: '25%', size: 2, delay: '0.5s', dur: '2.5s' },
    { left: '44%', bottom: '23%', size: 2, delay: '0.9s', dur: '2.3s' },
    { left: '42%', bottom: '24%', size: 2, delay: '1.3s', dur: '2.6s' },
    { left: '45%', bottom: '22%', size: 2, delay: '0.2s', dur: '2.4s' },
    { left: '41%', bottom: '26%', size: 2, delay: '0.7s', dur: '2.2s' },

    { left: '48%', bottom: '28%', size: 2, delay: '0.4s', dur: '2.7s' },
    { left: '49%', bottom: '27%', size: 2, delay: '1.2s', dur: '2.3s' },
    { left: '47%', bottom: '29%', size: 2, delay: '0.8s', dur: '2.5s' },

    { left: '54%', bottom: '24%', size: 2, delay: '0.1s', dur: '2.4s' },
    { left: '55%', bottom: '22%', size: 2, delay: '1.5s', dur: '2.6s' },
    { left: '53%', bottom: '23%', size: 2, delay: '0.6s', dur: '2.3s' },
    { left: '56%', bottom: '21%', size: 2, delay: '1.1s', dur: '2.5s' },
    { left: '52%', bottom: '25%', size: 2, delay: '0.3s', dur: '2.7s' },

    { left: '61%', bottom: '28%', size: 2, delay: '0.5s', dur: '2.2s' },
    { left: '63%', bottom: '27%', size: 2, delay: '0.9s', dur: '2.6s' },
    { left: '60%', bottom: '29%', size: 2, delay: '1.3s', dur: '2.4s' },
    { left: '64%', bottom: '28%', size: 2, delay: '0.2s', dur: '2.7s' },
    { left: '62%', bottom: '26%', size: 2, delay: '0.7s', dur: '2.3s' },
    { left: '65%', bottom: '29%', size: 2, delay: '1.0s', dur: '2.5s' },
    { left: '59%', bottom: '27%', size: 2, delay: '0.4s', dur: '2.8s' },
    { left: '66%', bottom: '28%', size: 2, delay: '1.4s', dur: '2.2s' },

    { left: '67%', bottom: '24%', size: 2, delay: '0.3s', dur: '2.5s' },
    { left: '68%', bottom: '23%', size: 2, delay: '1.6s', dur: '2.7s' },
    { left: '66%', bottom: '25%', size: 2, delay: '0.8s', dur: '2.3s' },

    { left: '71%', bottom: '21%', size: 2, delay: '0.4s', dur: '2.6s' },
    { left: '72%', bottom: '20%', size: 2, delay: '1.0s', dur: '2.4s' },
    { left: '70%', bottom: '22%', size: 2, delay: '1.5s', dur: '2.2s' },

    { left: '22%', bottom: '36%', size: 2, delay: '0.5s', dur: '2.5s' },
    { left: '35%', bottom: '27%', size: 2, delay: '1.3s', dur: '2.8s' },
    { left: '48%', bottom: '30%', size: 2, delay: '0.8s', dur: '2.3s' },
    { left: '53%', bottom: '26%', size: 2, delay: '0.2s', dur: '2.6s' },
    { left: '59%', bottom: '25%', size: 2, delay: '1.5s', dur: '2.4s' },
    { left: '38%', bottom: '26%', size: 2, delay: '0.9s', dur: '2.7s' },
    { left: '46%', bottom: '27%', size: 2, delay: '1.7s', dur: '2.2s' },
  ];

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }

          50% {
            opacity: 0;
          }
        }

        @keyframes goldenSpin {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dotPulse {
          0%, 100% {
            opacity: 0.55;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        .input-golden-wrapper {
          position: relative;
          border-radius: 10px;
          padding: 1.5px;
          overflow: hidden;
          background: rgba(80, 130, 200, 0.18);
        }

        .input-golden-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 10px;
          box-shadow: 0 0 0 3px rgba(50, 120, 220, 0.1);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .input-golden-wrapper:focus-within {
          background: rgba(80, 150, 240, 0.35);
        }

        .input-golden-wrapper:focus-within::after {
          opacity: 1;
        }

        .input-golden-inner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          height: 40px;
          background: #0c1630;
          border-radius: 9px;
          padding: 0 14px;
        }

        .light-theme .input-golden-inner {
          background: #f1f5f9;
        }

        .light-theme .input-golden-wrapper {
          background: rgba(37, 99, 235, 0.10);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .card-golden-wrapper {
          position: relative;
          border-radius: 18px;
          padding: 1.5px;
          overflow: hidden;
          box-shadow:
            0 20px 60px rgba(0,0,0,0.4),
            0 0 6px rgba(218,165,32,0.30),
            0 0 16px rgba(218,165,32,0.16),
            0 0 32px rgba(218,165,32,0.06);
        }

        .card-golden-wrapper::before {
          content: '';
          position: absolute;
          inset: -50%;
          z-index: 0;

          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 55deg,
            #b8860b 75deg,
            #d4af37 95deg,
            #ffd700 120deg,
            #fff1a8 145deg,
            #ffd700 165deg,
            #d4af37 190deg,
            #b8860b 210deg,
            #8b6914 230deg,
            transparent 250deg,
            transparent 360deg
          );

          animation: goldenSpin 4s linear infinite;
          pointer-events: none;
        }

        .card-golden-inner {
          position: relative;
          z-index: 1;
          border-radius: 17px;
          background: rgba(10, 20, 45, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);

          box-shadow:
            inset 0 0 6px rgba(218,165,32,0.20),
            inset 0 0 14px rgba(218,165,32,0.10);
        }

        .light-theme .card-golden-inner {
          background: rgba(255, 255, 255, 0.97);

          box-shadow:
            inset 0 0 6px rgba(218,165,32,0.10),
            inset 0 0 14px rgba(218,165,32,0.05);
        }

        .light-theme .card-golden-wrapper {
          box-shadow:
            0 20px 60px rgba(0,0,0,0.10),
            0 0 6px rgba(218,165,32,0.20),
            0 0 16px rgba(218,165,32,0.10);
        }

        .earth-dot {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;

          animation:
            dotPulse var(--dur, 3s)
            ease-in-out infinite;

          animation-delay: var(--delay, 0s);
        }

        .light-theme .earth-dot {
          opacity: 0.3;
        }

        @media (prefers-reduced-motion: reduce) {
          .card-golden-wrapper::before {
            animation: none;
          }

          .earth-dot {
            animation: none;
            opacity: 0.5;
          }
        }
      `}</style>

      {/* Main Page */}
      <div
        className={`
          relative
          flex
          flex-col
          lg:flex-row
          h-auto
          min-h-screen
          lg:h-screen
          w-full
          overflow-y-auto
          lg:overflow-hidden
          font-[Segoe_UI,Roboto,Helvetica_Neue,Arial,sans-serif]
          ${isLight ? 'bg-transparent' : 'bg-[#060d1a]'}
        `}
      >
        {/* -------------------------------- */}
        {/* BACKGROUND IMAGES */}
        {/* -------------------------------- */}

        <ResponsiveImageView
          avif={darkBgVariants.avif}
          webp={darkBgVariants.webp}
          fallback={bg2Webp}
          imgClassName={`pointer-events-none fixed inset-0 z-0 h-[100dvh] min-h-full w-full object-cover object-center lg:object-left ${isLight ? 'hidden' : ''}`}
        />

        <ResponsiveImageView
          avif={lightBgVariants.avif}
          webp={lightBgVariants.webp}
          fallback={lightBgWebp}
          imgClassName={`pointer-events-none fixed inset-0 z-0 h-[100dvh] min-h-full w-full object-cover object-center lg:object-left ${isLight ? '' : 'hidden'}`}
        />

        {/* -------------------------------- */}
        {/* GOLDEN DOTS */}
        {/* -------------------------------- */}

        {!isLight && (
          <div className="pointer-events-none absolute inset-0 z-[3]">
            {goldenDots.map((d, i) => (
              <div
                key={i}
                className="earth-dot"
                style={
                  {
                    left: d.left,
                    bottom: d.bottom,
                    width: `${d.size}px`,
                    height: `${d.size}px`,
                    background:
                      'radial-gradient(circle, rgba(255,223,100,1) 0%, rgba(255,200,50,0.9) 25%, rgba(255,180,0,0.5) 55%, transparent 80%)',
                    boxShadow:
                      `0 0 ${d.size + 2}px rgba(255,223,100,0.9), ` +
                      `0 0 ${d.size + 6}px rgba(255,200,50,0.6), ` +
                      `0 0 ${d.size + 10}px rgba(255,180,0,0.3)`,
                    '--delay': d.delay,
                    '--dur': d.dur,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}

        {/* -------------------------------- */}
        {/* THEME TOGGLE */}
        {/* -------------------------------- */}

        <div className="absolute right-4 top-4 z-[60]">
          <ThemeToggle size="sm" />
        </div>

        {/* -------------------------------- */}
        {/* LEFT PANEL */}
        {/* -------------------------------- */}

        <div
          className="
            relative
            z-[5]
            flex
            min-h-[auto]
            lg:min-h-screen
            flex-1
            flex-col
            px-6
            lg:px-[50px]
            pb-10
            lg:pb-[50px]
            pt-8
            lg:pt-10
          "
        >
          {/* Logo */}
          <div className="relative z-10 flex flex-col items-start">
            <div className="relative flex h-[54px] w-[54px] items-center justify-center">
              <div className="absolute inset-[-4px] rounded-full border-[2px] border-[rgba(40,140,255,0.6)] shadow-[0_0_16px_rgba(40,140,255,0.3),0_0_32px_rgba(40,140,255,0.15),inset_0_0_14px_rgba(40,140,255,0.1)]" />

              <div className="absolute inset-[-10px] z-0 rounded-full bg-[radial-gradient(circle,rgba(40,140,255,0.12)_0%,transparent_70%)]" />

              <img
                src={logo}
                alt="Akbar Bizvoy Logo"
                className="h-[44px] w-auto"
              />            </div>

            <p
              className={`
                m-0
                mt-1
                text-[10px]
                font-semibold
                tracking-[5px]
                uppercase
                ${
                  isLight
                    ? 'text-[#64748b]'
                    : 'text-[rgba(200,215,235,0.65)]'
                }
              `}
            >
              AKBAR BIZVOY
            </p>
          </div>

          {/* -------------------------------- */}
          {/* TAGLINE */}
          {/* -------------------------------- */}

          <div
            className={`
              relative
              z-10
              max-w-[520px]
              pl-2
              ${
                isLight
                  ? 'flex-1 flex flex-col justify-end pb-18'
                  : 'mt-6'
              }
            `}
          >
            {isLight && (
              <div className="flex items-center gap-1.5 mb-3">
                <span className="h-[3px] w-6 rounded-full bg-[#2563eb]" />

                <span className="h-[3px] w-3 rounded-full bg-[#f59e0b]" />
              </div>
            )}

            {isLight ? (
              /* LIGHT THEME TAGLINE */
              <h2
                className="
                  m-0
                  text-[28px]
                  lg:text-[40px]
                  font-bold
                  leading-[1.2]
                  text-[#1e293b]
                "
              >
                {taglineWords.map((word, i) => {
                  const isBlue =
                    word === 'Seamless';

                  return (
                    <span key={i}>
                      <span
                        style={{
                          opacity:
                            fadePhase === 'out'
                              ? 0
                              : i < visibleWords
                              ? 1
                              : 0,

                          transition:
                            `opacity ${
                              fadePhase === 'out'
                                ? 0.5
                                : 0.3
                            }s ease-in-out`,

                          color: isBlue
                            ? '#2563eb'
                            : undefined,
                        }}
                      >
                        {word}
                      </span>

                      {word === 'Seamless' && (
                        <br />
                      )}

                      {i <
                        taglineWords.length - 1 &&
                        word !== 'Seamless' &&
                        ' '}
                    </span>
                  );
                })}
              </h2>
            ) : (
              /* DARK THEME TAGLINE */
              <div className="relative z-10 mt-4 max-w-[500px]">
                <div
                  className="flex flex-wrap items-center"
                  style={{
                    minHeight: '50px',
                  }}
                >
                  {typingPhrases[
                    phraseIndex
                  ]
                    .split(' ')
                    .map((word, i) => {
                      const isVisible =
                        i < visibleWords;

                      const isBlue =
                        word.endsWith('.');

                      return (
                        <span
                          key={`${phraseIndex}-${i}`}
                          className="
                            text-[24px]
                            lg:text-[36px]
                            font-bold
                            leading-[1.15]
                          "
                          style={{
                            color: isBlue
                              ? '#3b9cff'
                              : '#ffffff',

                            opacity:
                              fadePhase === 'out'
                                ? 0
                                : isVisible
                                ? 1
                                : 0,

                            transition:
                              `opacity ${
                                fadePhase === 'out'
                                  ? FADE_OUT_DURATION
                                  : 300
                              }ms ease-in-out`,

                            marginRight: '10px',
                          }}
                        >
                          {word}
                        </span>
                      );
                    })}
                </div>

                {/* Brand Lines */}
                <div className="mt-[14px] flex items-center gap-[3px]">
                  <span className="h-[3px] w-9 rounded-full bg-[#00AEEF] lg:w-10" />

                  <span className="h-[3px] w-9 rounded-full bg-[#8CC63F] lg:w-10" />

                  <span className="h-[3px] w-9 rounded-full bg-[#F5821F] lg:w-10" />

                  <span className="h-[3px] w-9 rounded-full bg-[#E4007F] lg:w-10" />
                </div>

                <p className="m-0 mt-[14px] text-[14px] lg:text-[16px] leading-[1.65] text-[rgba(170,195,225,0.6)]">
                  Smart journeys. Seamless
                  <br />
                  experiences. Every time.
                </p>
              </div>
            )}
          </div>

          {!isLight && (
            <div className="flex-1" />
          )}

          {/* -------------------------------- */}
          {/* FEATURE ICONS */}
          {/* -------------------------------- */}

          <div
            className="
              relative
              z-10
              flex
              flex-wrap
              gap-4
              lg:gap-9
              pb-2
              mt-2
            "
          >
            {[
              {
                icon: (
                  <>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />

                    <polyline points="9 12 11 14 15 10" />
                  </>
                ),

                title: 'Trusted',
                sub: 'Since 1987',

                bgColor: isLight
                  ? 'bg-[#e0edff]'
                  : 'bg-[rgba(50,120,220,0.15)]',

                iconColor: isLight
                  ? 'text-[#2563eb]'
                  : 'text-[#4aa3ff]',
              },

              {
                icon: (
                  <>
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                    />

                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />

                    <line
                      x1="2"
                      y1="12"
                      x2="22"
                      y2="12"
                    />
                  </>
                ),

                title: 'Global',
                sub: 'Presence',

                bgColor: isLight
                  ? 'bg-[#e0edff]'
                  : 'bg-[rgba(50,120,220,0.15)]',

                iconColor: isLight
                  ? 'text-[#2563eb]'
                  : 'text-[#4aa3ff]',
              },

              {
                icon: (
                  <>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </>
                ),

                title: 'Seamless',
                sub: 'Journeys',

                bgColor: isLight
                  ? 'bg-[#e0edff]'
                  : 'bg-[rgba(50,120,220,0.15)]',

                iconColor: isLight
                  ? 'text-[#2563eb]'
                  : 'text-[#4aa3ff]',
              },

              {
                icon: (
                  <>
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />

                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </>
                ),

                title: '24/7',
                sub: 'Support',

                bgColor: isLight
                  ? 'bg-[#e0edff]'
                  : 'bg-[rgba(50,120,220,0.15)]',

                iconColor: isLight
                  ? 'text-[#2563eb]'
                  : 'text-[#4aa3ff]',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
              >
                <div
                  className={`
                    flex
                    items-center
                    gap-[3.5px]
                    rounded-[12px]
                    border
                    ${
                      isLight
                        ? 'border-[rgba(0,0,0,0.06)]'
                        : 'border-[rgba(50,120,220,0.12)]'
                    }
                    ${f.bgColor}
                  `}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`
                      m-[10px]
                      h-[22px]
                      w-[22px]
                      ${f.iconColor}
                    `}
                  >
                    {f.icon}
                  </svg>
                </div>

                <div className="flex flex-col">
                  <span
                    className={`
                      text-[13px]
                      font-semibold
                      leading-[1.2]
                      ${
                        isLight
                          ? 'text-[#1e293b]'
                          : 'text-white'
                      }
                    `}
                  >
                    {f.title}
                  </span>

                  <span
                    className={`
                      text-[12px]
                      leading-[1.3]
                      ${
                        isLight
                          ? 'text-[#64748b]'
                          : 'text-[rgba(170,195,225,0.5)]'
                      }
                    `}
                  >
                    {f.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* -------------------------------- */}
        {/* RIGHT PANEL */}
        {/* -------------------------------- */}

        <div
          className="
            relative
            z-10
            flex
            w-full
            lg:w-[500px]
            min-w-0
            lg:min-w-[440px]
            translate-x-0
            lg:-translate-x-10
            items-center
            justify-center
            px-6
            lg:px-11
            py-8
            lg:py-10
          "
        >
          <div className="card-golden-wrapper relative w-full max-w-[400px]">
            <div
              className="
                card-golden-inner
                px-5
                lg:px-8
                py-[22px]
                pb-[18px]
                text-center
              "
            >
              {/* Logo */}
              <div className="mb-3 flex justify-center">
                <div className="relative flex h-[85px] w-[85px] items-center justify-center">
                  <div className="absolute inset-[-5px] rounded-full border-[2.5px] border-[rgba(40,140,255,0.6)] shadow-[0_0_20px_rgba(40,140,255,0.3),0_0_40px_rgba(40,140,255,0.15),inset_0_0_20px_rgba(40,140,255,0.1)]" />

                  <div className="absolute inset-[-12px] z-0 rounded-full bg-[radial-gradient(circle,rgba(40,140,255,0.12)_0%,transparent_70%)]" />

                  <img
                    src={logo}
                    alt="Akbar Bizvoy Logo"
                    className="h-[70px] w-auto"
                  />
                </div>
              </div>

              {/* Brand name */}
              <p
                className={`
                  m-0
                  mb-1
                  text-center
                  text-[13px]
                  font-semibold
                  tracking-[6px]
                  uppercase
                  ${
                    isLight
                      ? 'text-[#64748b]'
                      : 'text-[rgba(200,215,235,0.65)]'
                  }
                `}
              >
                AKBAR BIZVOY
              </p>

              {/* Heading */}
              <h1
                className={`
                  m-0
                  mb-1
                  text-[26px]
                  font-bold
                  ${
                    isLight
                      ? 'text-[#1e293b]'
                      : 'text-white'
                  }
                `}
              >
                Welcome{' '}
                <span className="text-[#2563eb]">
                  back.
                </span>
              </h1>

              <p
                className={`
                  m-0
                  mb-5
                  text-[13px]
                  ${
                    isLight
                      ? 'text-[#64748b]'
                      : 'text-[rgba(170,195,225,0.55)]'
                  }
                `}
              >
                Sign in to continue to your account.
              </p>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-3 text-left"
              >
                {/* EMAIL */}
                <div>
                  <label
                    className={`
                      mb-1
                      block
                      text-[12px]
                      font-medium
                      ${
                        isLight
                          ? 'text-[#475569]'
                          : 'text-[rgba(200,215,235,0.7)]'
                      }
                    `}
                  >
                    Email address
                  </label>

                  <div className="input-golden-wrapper">
                    <div className="input-golden-inner">
                      <svg
                        className={`
                          golden-icon
                          mr-3
                          h-[18px]
                          w-[18px]
                          shrink-0
                          ${
                            isLight
                              ? 'text-[#94a3b8]'
                              : 'text-[rgba(140,170,210,0.45)]'
                          }
                        `}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />

                        <circle
                          cx="12"
                          cy="7"
                          r="4"
                        />
                      </svg>

                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="Enter your email"
                        required
                        className={`
                          h-full
                          flex-1
                          bg-transparent
                          text-[14px]
                          font-inherit
                          leading-[40px]
                          outline-none
                          ${
                            isLight
                              ? 'text-[#1e293b] placeholder:text-[#94a3b8]'
                              : 'text-[#dde6f0] placeholder:text-[rgba(140,170,210,0.4)]'
                          }
                        `}
                      />
                    </div>
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    className={`
                      mb-1
                      block
                      text-[12px]
                      font-medium
                      ${
                        isLight
                          ? 'text-[#475569]'
                          : 'text-[rgba(200,215,235,0.7)]'
                      }
                    `}
                  >
                    Password
                  </label>

                  <div className="input-golden-wrapper">
                    <div className="input-golden-inner relative">
                      <svg
                        className={`
                          golden-icon
                          mr-3
                          h-[18px]
                          w-[18px]
                          shrink-0
                          ${
                            isLight
                              ? 'text-[#94a3b8]'
                              : 'text-[rgba(140,170,210,0.45)]'
                          }
                        `}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                        />

                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>

                      <input
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        placeholder="Enter your password"
                        required
                        className={`
                          h-full
                          flex-1
                          bg-transparent
                          text-[14px]
                          font-inherit
                          leading-[40px]
                          outline-none
                          ${
                            isLight
                              ? 'text-[#1e293b] placeholder:text-[#94a3b8]'
                              : 'text-[#dde6f0] placeholder:text-[rgba(140,170,210,0.4)]'
                          }
                        `}
                      />

                      {/* SHOW PASSWORD */}
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        className={`
                          absolute
                          right-3
                          top-1/2
                          flex
                          -translate-y-1/2
                          cursor-pointer
                          items-center
                          justify-center
                          border-none
                          bg-transparent
                          p-1
                          transition-colors
                          duration-200
                          ${
                            isLight
                              ? 'text-[#94a3b8] hover:text-[#475569]'
                              : 'text-[rgba(140,170,210,0.45)] hover:text-[rgba(170,200,240,0.8)]'
                          }
                        `}
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-[18px] w-[18px]"
                        >
                          {showPassword ? (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />

                              <circle
                                cx="12"
                                cy="12"
                                r="3"
                              />
                            </>
                          ) : (
                            <>
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />

                              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />

                              <path d="m14.12 14.12-4.24-4.24" />

                              <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />

                              <line
                                x1="1"
                                y1="1"
                                x2="23"
                                y2="23"
                              />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* FORGOT PASSWORD */}
                <div className="mt-[-3px] text-right">
                  <a
                    href="#"
                    className={`
                      text-[12.5px]
                      font-medium
                      no-underline
                      transition-colors
                      duration-200
                      hover:underline
                      ${
                        isLight
                          ? 'text-[#2563eb] hover:text-[#1d4ed8]'
                          : 'text-[#3b9cff] hover:text-[#6bb3ff]'
                      }
                    `}
                  >
                    Forgot password?
                  </a>
                </div>

                

                

                {/* SIGN IN */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    mt-0.5
                    flex
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-[10px]
                    border-none
                    bg-gradient-to-br
                    from-[#1565e0]
                    via-[#1d7bf5]
                    to-[#2b8df8]
                    py-[11px]
                    text-[15px]
                    font-semibold
                    tracking-[0.3px]
                    font-inherit
                    text-white
                    shadow-[0_4px_20px_rgba(25,100,230,0.3),0_1px_3px_rgba(25,100,230,0.2)]
                    transition
                    duration-250
                    hover:-translate-y-px
                    hover:from-[#1d75f0]
                    hover:via-[#2588ff]
                    hover:to-[#3598ff]
                    hover:shadow-[0_6px_28px_rgba(25,100,230,0.4),0_2px_6px_rgba(25,100,230,0.25)]
                    active:translate-y-0
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:translate-y-0
                    disabled:hover:from-[#1565e0]
                    disabled:hover:via-[#1d7bf5]
                    disabled:hover:to-[#2b8df8]
                    disabled:hover:shadow-[0_4px_20px_rgba(25,100,230,0.3),0_1px_3px_rgba(25,100,230,0.2)]
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-[16px] w-[16px]"
                  >
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>

                  {isSubmitting ? 'Signing In…' : 'Sign In'}
                </button>

                {/* DEMO LOGIN */}
                <button
                  type="button"
                  onClick={() => {
                    setEmail(DEMO_EMAIL);
                    setPassword(DEMO_PASSWORD);

                    toast({
                      kind: 'success',
                      code: 200,
                      title: 'Demo Account',
                      message:
                        'Credentials filled — signing you in…',
                    });

                    navigate('/search');
                  }}
                  className="
                    mt-2
                    flex
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-[8px]
                    border
                    border-[rgba(212,175,55,0.35)]
                    bg-[rgba(212,175,55,0.08)]
                    px-3
                    py-2
                    text-left
                    transition
                    duration-200
                    hover:border-[#d4af37]
                    hover:bg-[rgba(212,175,55,0.16)]
                  "
                >
                  <span className="text-[9px] font-bold tracking-[0.14em] text-[#f0c265]">
                    DEMO
                  </span>

                  <span
                    className={`
                      text-[11.5px]
                      ${
                        isLight
                          ? 'text-[#475569]'
                          : 'text-white/70'
                      }
                    `}
                  >
                    demo@akbarbizvoy.com / demo123
                  </span>
                </button>

                {/* CREATE ACCOUNT */}
                <p
                  className={`
                    m-0
                    mt-1.5
                    text-center
                    text-[13px]
                    ${
                      isLight
                        ? 'text-[#64748b]'
                        : 'text-[rgba(170,195,225,0.5)]'
                    }
                  `}
                >
                  Don't have an account?{' '}

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/register');
                    }}
                    className={`
                      font-semibold
                      no-underline
                      transition-colors
                      duration-200
                      hover:underline
                      ${
                        isLight
                          ? 'text-[#2563eb] hover:text-[#1d4ed8]'
                          : 'text-[#3b9cff] hover:text-[#6bb3ff]'
                      }
                    `}
                  >
                    Create account
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage2;