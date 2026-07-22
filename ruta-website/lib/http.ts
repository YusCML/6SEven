export async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  const text = await response.text();
  const fallbackMessage = `Unexpected response from server (${response.status}).`;

  throw new Error(text.trim() || fallbackMessage);
}