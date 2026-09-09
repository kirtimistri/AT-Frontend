interface RecaptchaApi {
  ready: (cb: () => void) => void;
  execute: (key: string, opts: { action: string }) => Promise<string>;
}

interface Window {
  grecaptcha?: RecaptchaApi;
}