function getRecaptchaScriptId(): string {
  return 'grecaptcha-api-script';
}

const RECAPTCHA_API_URLS = [
  'https://www.google.com/recaptcha/api.js',
  'https://www.recaptcha.net/recaptcha/api.js',
];

let pendingLoad: Promise<void> | null = null;

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
  return new Promise((resolve, reject) => {
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
  });
}