function getRecaptchaScriptId(): string {
  return 'grecaptcha-api-script';
}

const RECAPTCHA_API_URLS = [
  'https://www.google.com/recaptcha/api.js',
  'https://www.recaptcha.net/recaptcha/api.js',
];

let pendingLoad: Promise<void> | null = null;

// reCAPTCHA v3 tokens are valid for 2 minutes. Cache the most recent token
// per site key + action and reuse it so submitting skips the Google round-trip.
// 90s keeps us safely inside the 2-minute window.
const TOKEN_CACHE_MAX_AGE_MS = 9000;

const tokenCache = new Map<
  string,
  { token: string; when: number }
>();

const pendingExec = new Map<string, Promise<string>>();

export function loadRecaptchaScript(
  siteKey: string
): Promise<void> {
  if (!siteKey) {
    return Promise.reject(
      new Error('reCAPTCHA site key is not configured.')
    );
  }

  if (window.grecaptcha) {
    return Promise.resolve();
  }

  if (pendingLoad) {
    return pendingLoad;
  }

  pendingLoad = loadFromHosts(siteKey, 0);
  pendingLoad.finally(() => {
    pendingLoad = null;
  }).catch(() => {});

  return pendingLoad;
}

function loadFromHosts(
  siteKey: string,
  index: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (index >= RECAPTCHA_API_URLS.length) {
      console.error(
        '[reCAPTCHA] All API hosts failed to load.'
      );
      reject(
        new Error(
          'Failed to load reCAPTCHA script.'
        )
      );
      return;
    }

    const script = document.createElement('script');

    script.id = getRecaptchaScriptId();
    script.src =
      `${RECAPTCHA_API_URLS[index]}?render=${encodeURIComponent(
        siteKey
      )}`;
    script.async = true;
    script.defer = true;

    script.onload = () =>
      setTimeout(() => {
        console.log(
          `[reCAPTCHA] script loaded from ${
            RECAPTCHA_API_URLS[index]
          }, grecaptcha:`,
          typeof window.grecaptcha
        );
        resolve();
      });

    script.onerror = () => {
      console.error(
        `[reCAPTCHA] Failed to load script from ${
          RECAPTCHA_API_URLS[index]
        }`
      );
      script.remove();
      resolve(loadFromHosts(siteKey, index + 1));
    };

    document.head.appendChild(script);
  });
}

export function executeRecaptcha(
  siteKey: string,
  action: string
): Promise<string> {
  const cacheKey = `${siteKey}:${action}`;

  // Reuse a fresh cached token instead of waiting on Google again.
  const cached = tokenCache.get(cacheKey);

  if (
    cached &&
    Date.now() - cached.when < TOKEN_CACHE_MAX_AGE_MS
  ) {
    return Promise.resolve(cached.token);
  }

  // Share an in-flight execution so concurrent callers (e.g. a pre-warm and
  // an actual submit) don't both round-trip to Google.
  const inFlight = pendingExec.get(cacheKey);

  if (inFlight) {
    return inFlight;
  }

  const run = new Promise<string>((resolve, reject) => {
    if (!siteKey) {
      reject(
        new Error(
          'reCAPTCHA site key is not configured.'
        )
      );
      return;
    }

    const timer = setTimeout(() => {
      console.error(
        '[reCAPTCHA] Timed out waiting for a token.'
      );
      reject(
        new Error('reCAPTCHA token timed out.')
      );
    }, 20000);

    loadRecaptchaScript(siteKey)
      .then(() => {
        const gc = window.grecaptcha;

        if (!gc) {
          clearTimeout(timer);
          reject(
            new Error('reCAPTCHA is not available.')
          );
          return;
        }

        gc.ready(() => {
          console.log(
            '[reCAPTCHA] executing action:',
            action
          );

          gc.execute(siteKey, { action })
            .then((token: string) => {
              clearTimeout(timer);
              console.log(
                '[reCAPTCHA] token received:',
                token
                  ? `${token.slice(0, 20)}…`
                  : '(empty)'
              );
              tokenCache.set(cacheKey, {
                token,
                when: Date.now(),
              });
              resolve(token);
            })
            .catch((err: unknown) => {
              clearTimeout(timer);
              console.error(
                '[reCAPTCHA] execute failed:',
                err
              );
              reject(
                new Error(
                  'reCAPTCHA verification failed.'
                )
              );
            });
        });
      })
      .catch((err: unknown) => {
        clearTimeout(timer);
        reject(err);
      });
  }).finally(() => {
    pendingExec.delete(cacheKey);
  });

  pendingExec.set(cacheKey, run);

  return run;
}