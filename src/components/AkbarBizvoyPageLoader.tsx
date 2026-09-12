import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import planeImg from '../assets/airplane-loader.svg';
import { LogoIcon } from './Logo';

import {
  useGlobalLoaderStore,
  GLOBAL_NAV_MESSAGES,
  AIRPLANE_RUN_MS,
} from '../store/globalLoader';

import { useThemeStore } from '../store/themeStore';

const ENTER_MS = 500;
const EXIT_MS = 400;
const ROUTE_TRANSITION_MS = AIRPLANE_RUN_MS;

const FALLBACK_MESSAGES = ['Loading, please wait...'];
const WELCOME_MESSAGE = 'Welcome to Akbar Travels';

type Phase = 'enter' | 'idle' | 'exit';

export const AkbarBizvoyPageLoader = () => {
  const counter = useGlobalLoaderStore((s) => s.counter);
  const message = useGlobalLoaderStore((s) => s.message);
  const messages = useGlobalLoaderStore((s) => s.messages);
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [planeProgress, setPlaneProgress] = useState(0);

  const shownRef = useRef(false);

  const enterTimer = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const animationStartRef = useRef<number | null>(null);

  const isLoading = counter > 0;

  const rotationMessages = useMemo(
    () =>
      messages && messages.length > 0
        ? messages
        : FALLBACK_MESSAGES,
    [messages],
  );

  const activeMessages =
    message != null ? [message] : rotationMessages;

  // ============================================================
  // AIRPLANE ANIMATION
  // ============================================================

  useEffect(() => {
    if (!isLoading) {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(
          animationFrameRef.current,
        );

        animationFrameRef.current = null;
      }

      animationStartRef.current = null;
      setPlaneProgress(0);

      return;
    }

    setPlaneProgress(0);
    animationStartRef.current = null;

    const animate = (timestamp: number) => {
      if (animationStartRef.current === null) {
        animationStartRef.current = timestamp;
      }

      const elapsed =
        timestamp - animationStartRef.current;

      const rawProgress = Math.min(
        elapsed / AIRPLANE_RUN_MS,
        1,
      );

      // Smooth ease-out movement
      const easedProgress =
        1 - Math.pow(1 - rawProgress, 3);

      setPlaneProgress(easedProgress);

      if (rawProgress < 1 && isLoading) {
        animationFrameRef.current =
          window.requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current =
      window.requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(
          animationFrameRef.current,
        );

        animationFrameRef.current = null;
      }

      animationStartRef.current = null;
    };
  }, [isLoading]);

  // ============================================================
  // LOADER ENTER / EXIT
  // ============================================================

  useEffect(() => {
    if (isLoading) {
      if (exitTimer.current) {
        window.clearTimeout(exitTimer.current);
        exitTimer.current = null;
      }

      if (enterTimer.current) {
        return;
      }

      setPhase('enter');
      setShow(true);
      shownRef.current = true;

      enterTimer.current = window.setTimeout(() => {
        setPhase('idle');
        enterTimer.current = null;
      }, ENTER_MS);
    } else if (shownRef.current) {
      if (enterTimer.current) {
        window.clearTimeout(enterTimer.current);
        enterTimer.current = null;
      }

      setPhase('exit');

      exitTimer.current = window.setTimeout(() => {
        setShow(false);
        setPhase('idle');
        shownRef.current = false;
        exitTimer.current = null;
      }, EXIT_MS);
    }
  }, [isLoading]);

  // ============================================================
  // CLEANUP
  // ============================================================

  useEffect(
    () => () => {
      if (enterTimer.current) {
        window.clearTimeout(enterTimer.current);
      }

      if (exitTimer.current) {
        window.clearTimeout(exitTimer.current);
      }

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(
          animationFrameRef.current,
        );
      }
    },
    [],
  );

  // ============================================================
  // PREVENT PAGE SCROLL
  // ============================================================

  useEffect(() => {
    if (!show) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [show]);

  // ============================================================
  // SEQUENTIAL MESSAGES AT ENDPOINT
  // ============================================================

  /*
   * The airplane index snaps cleanly to the messages array so the
   * message shown always matches the airplane's current leg + partial.
   *
   * The message appears at the airplane endpoint, starting exactly when
   * the plane first crosses the message's flight-band band. Showing it
   * only for its own leg keeps the band exclusive: any complete
   * cross-band flip sits in a different band than the rotated inset.
   */

  const activeMessageCount =
    activeMessages.length;

  const messageBandWidth =
    1 / activeMessageCount;

  const currentIndex =
    Math.min(
      Math.floor(planeProgress / messageBandWidth),
      activeMessageCount - 1,
    );

  const currentMessage =
    activeMessages[currentIndex] ??
    activeMessages[activeMessageCount - 1];

  // ============================================================
  // DON'T RENDER WHEN HIDDEN
  // ============================================================

  if (!show) {
    return null;
  }

  // ============================================================
  // PHASE CLASSES
  // ============================================================

  const overlayPhase =
    phase === 'enter'
      ? 'bizvoy-overlay-enter'
      : phase === 'exit'
        ? 'bizvoy-overlay-exit'
        : 'bizvoy-overlay-idle';

  const contentPhase =
    phase === 'enter'
      ? 'bizvoy-content-enter'
      : phase === 'exit'
        ? 'bizvoy-content-exit'
        : 'bizvoy-content-idle';

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Akbar Bizvoy is loading"
      className={`
        bizvoy-overlay
        fixed
        inset-0
        z-[110]
        flex
        items-center
        justify-center
        overflow-hidden
        backdrop-blur-lg
        ${
          isLight
            ? 'bg-white/70'
            : 'bg-[#060e1f]/70'
        }
        ${overlayPhase}
      `}
    >
      <div
        className={`
          flex
          h-full
          w-full
          flex-col
          items-center
          justify-center
          px-6
          ${contentPhase}
        `}
      >
        {/* ================================================== */}
        {/* LOGO */}
        {/* ================================================== */}

        <div className="bizvoy-logo-enter">
          <LogoIcon
            size="md"
            className={`
              rounded-2xl
              shadow-[0_10px_40px_rgba(0,0,0,0.18)]
              ring-1
              sm:h-16
              sm:w-16
              lg:h-20
              lg:w-20
              ${
                isLight
                  ? 'ring-black/10'
                  : 'ring-white/10'
              }
            `}
          />
        </div>

        {/* ================================================== */}
        {/* BRAND NAME */}
        {/* ================================================== */}

        <div
          className={`
            bizvoy-logo-enter
            mt-5
            text-center
            text-[24px]
            font-extrabold
            leading-none
            tracking-tight
            sm:text-[26px]
            lg:text-[30px]
            ${
              isLight
                ? 'text-[#111827]'
                : 'text-white'
            }
          `}
          style={{
            fontFamily:
              "'Inter', 'Segoe UI', system-ui, sans-serif",
          }}
        >
          Akbar Bizvoy
        </div>

        {/* ================================================== */}
        {/* LOADING DOTS */}
        {/* ================================================== */}

        <div
          className="mt-3 flex items-center gap-1.5"
          aria-hidden="true"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`
                bizvoy-dot
                h-1
                w-1
                rounded-full
                ${
                  isLight
                    ? 'bg-[#2563EB]'
                    : 'bg-[#7CC0FF]'
                }
              `}
              style={{
                animationDelay: `${i * 220}ms`,
              }}
            />
          ))}
        </div>

        {/* ================================================== */}
        {/* AIRPLANE + SEQUENTIAL ENDPOINT MESSAGES */}
        {/* ================================================== */}

        <div
          className="
            relative
            mt-14
            h-36
            w-[min(1200px,96vw)]
            overflow-visible
            sm:h-40
            lg:h-48
          "
          aria-label={currentMessage}
        >
          {/* ================================================= */}
          {/* SUBTLE PROGRESS PATH LINE */}
          {/* ================================================= */}

          <div
            className={`
              absolute
              top-1/2
              left-0
              right-0
              h-px
              -translate-y-1/2
              rounded-full
              border-t
              border-t-transparent/80
              ${isLight ? 'border-[#2563EB]/40' : 'border-[#7CC0FF]/40'}
            `}
            style={{
              width: `${Math.max(0, planeProgress) * 100}%`,
            }}
          >
            <div
              className={`
                absolute
                inset-x-0
                top-1/2
                h-px
                -translate-y-1/2
                border-t
                rounded-full
                ${isLight ? 'border-[#2563EB]/40' : 'border-[#7CC0FF]/40'}
              `}
              style={{
                width: `${Math.max(0, planeProgress) * 100}%`,
                backgroundImage:
                  isLight
                    ? 'repeating-linear-gradient(90deg, #2563EB 0 6px, transparent 6px 12px)'
                    : 'repeating-linear-gradient(90deg, #7CC0FF 0 6px, transparent 6px 12px)',
              }}
            />
          </div>

          {/* ================================================= */}
          {/* SEQUENTIAL MESSAGES POSITIONED ALONG THE PATH */}
          {/* ================================================= */}

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              z-10
            "
          >
            {activeMessages.map((msg, index) => {
              const messageLeft =
                8 +
                ((index + 1) / activeMessageCount) * 78;

              const messageAlpha =
                Math.max(
                  0,
                  1 -
                    Math.abs(
                      planeProgress -
                        messageLeft /
                          100,
                    ) /
                      messageBandWidth,
                );

              return (
                <span
                  key={index}
                  className={`
                    absolute
                    inline-block
                    whitespace-nowrap
                    text-center
                    text-2xl
                    font-bold
                    tracking-wide
                    sm:text-3xl
                    lg:text-4xl
                    ${
                      isLight
                        ? 'text-[#1E3A8A]'
                        : 'text-white'
                    }
                  `}
                  style={{
                    left:
                      `${messageLeft}%`,
                    top: '50%',
                    transform:
                      'translate(-50%, -50%)',
                    opacity: messageAlpha,
                    filter:
                      messageAlpha < 0.5 ? 'blur(2px)' : 'none',
                    animation:
                      `bizvoy-endpoint-message-in 0.45s ease both`,
                    animationDelay:
                      `${ENTER_MS + index * (AIRPLANE_RUN_MS / activeMessageCount)}ms`,
                    textShadow:
                      isLight
                        ? '0 2px 8px rgba(30,58,138,0.15)'
                        : '0 2px 12px rgba(124,192,255,0.25)',
                  }}
                >
                  {msg}
                </span>
              );
            })}
          </div>

          {/* ================================================= */}
          {/* MOVING AIRPLANE */}
          {/* ================================================= */}

          <div
            className="
              absolute
              top-1/2
              flex
              h-32
              w-32
              items-center
              justify-center
              sm:h-36
              sm:w-36
              lg:h-44
              lg:w-44
              xl:h-48
              xl:w-48
              z-20
            "
            style={{
              left: `${planeProgress * 100}%`,
              transform:
                'translate(-50%, -50%)',
              zIndex: 20,
              willChange:
                'left, transform',
            }}
          >
            <img
              src={planeImg}
              alt=""
              draggable={false}
              className={`
                pointer-events-none
                select-none
                w-auto
                h-20
                sm:h-24
                lg:h-28
                xl:h-32
                ${
                  isLight
                    ? 'drop-shadow-[0_10px_24px_rgba(10,40,90,0.40)]'
                    : 'drop-shadow-[0_12px_30px_rgba(0,0,0,0.60)]'
                }
              `}
            />
          </div>
        </div>

        {/* ================================================== */}
        {/* ACCESSIBILITY */}
        {/* ================================================== */}

        <span className="sr-only">
          {currentMessage}
        </span>
      </div>
    </div>
  );
};

// ============================================================
// PAGE TRANSITION CONTROLLER
// ============================================================

export const PageTransitionController = () => {
  const location = useLocation();

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const store =
      useGlobalLoaderStore.getState();

    if (store.counter > 0) {
      store.setLoaderContent(
        GLOBAL_NAV_MESSAGES,
      );
    } else {
      store.showLoader(
        GLOBAL_NAV_MESSAGES,
      );
    }

    const timer = window.setTimeout(() => {
      useGlobalLoaderStore
        .getState()
        .hideLoader();
    }, ROUTE_TRANSITION_MS);

    return () =>
      window.clearTimeout(timer);
  }, [location.pathname]);

  return null;
};

export default AkbarBizvoyPageLoader;