// input.ts

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
}

export async function fetchWithRetry(
  url: string,
  options?: RetryOptions
): Promise<string> {
  const retries = options?.retries ?? 3;
  const delayMs = options?.delayMs ?? 1000;

  let attempt = 0;

  while (attempt < retries) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Request failed");
      }
      return await res.text();
    } catch (err) {
      attempt++;
      if (attempt >= retries) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  throw new Error("Unreachable");
}
