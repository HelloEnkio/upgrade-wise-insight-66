export function logDevError(context: string, error: unknown): void {
  if (import.meta.env.DEV) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`[DEV] ${context}:`, err.message);
    if (err.stack) {
      console.error(err.stack);
    }
  }
}
