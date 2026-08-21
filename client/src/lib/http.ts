export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseJson<T>(response: Response): Promise<T | null> {
  if (!(response.headers.get('content-type') ?? '').includes('application/json')) return null;

  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, { credentials: 'same-origin', ...init });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }

  const data = await parseJson<T & { error?: string }>(response);

  if (!response.ok) {
    throw new ApiError(data?.error || `Request failed (${response.status}).`, response.status);
  }

  if (data === null) {
    throw new ApiError('Unexpected response from the server.', response.status);
  }

  return data;
}

function jsonBody(method: string, body?: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  };
}

export function getJson<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function postJson<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, jsonBody('POST', body));
}

export function patchJson<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, jsonBody('PATCH', body));
}

export function putJson<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, jsonBody('PUT', body));
}

export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
