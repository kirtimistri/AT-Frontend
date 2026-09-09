const API_URL = import.meta.env.VITE_API_URL ?? '';

// Prevents the UI from appearing frozen when the backend is slow/unreachable.
const REQUEST_TIMEOUT_MS = 0;

function baseUrl(): string {
  if (!API_URL || API_URL === 'YOUR_API_BASE_URL') {
    throw new ApiError(
      'API base URL is not configured. Set VITE_API_URL in your .env file.',
      0,
      null
    );
  }
  return API_URL;
}

type SignupPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  captcha: string;
};

type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function post<T>(
  path: string,
  payload: unknown
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;

  try {
    res = await fetch(`${baseUrl()}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError(
        'The request timed out. Please try again.',
        408,
        null
      );
    }
    throw new ApiError(
      'Unable to reach the server. Check your connection and try again.',
      0,
      null
    );
  }

  clearTimeout(timer);

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      (body as { message?: string } | null)?.message ??
      (body as { error?: string } | null)?.error ??
      `Request failed (${res.status})`;

    throw new ApiError(msg, res.status, body);
  }

  return body as ApiResponse<T>;
}

export function signupUser(
  payload: SignupPayload
): Promise<ApiResponse> {
  return post('/api/auth/signup', payload);
}

export function loginUser(
  email: string,
  password: string,
  captcha = ''
): Promise<ApiResponse<{ name: string; email: string }>> {
  return post<{ name: string; email: string }>(
    '/api/auth/login',
    { email, password, captcha }
  );
}