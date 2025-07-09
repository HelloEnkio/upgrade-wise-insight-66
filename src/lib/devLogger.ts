type DevLogSubscriber = (message: string) => void;

const subscribers: DevLogSubscriber[] = [];

export function subscribeDevLog(fn: DevLogSubscriber): () => void {
  subscribers.push(fn);
  return () => {
    const index = subscribers.indexOf(fn);
    if (index !== -1) subscribers.splice(index, 1);
  };
}

export function logDevError(context: string, error: unknown): void {
  if (import.meta.env.DEV) {
    const err = error instanceof Error ? error : new Error(String(error));
    const message = `[DEV] ${context}: ${err.message}`;
    console.error(message);
    if (err.stack) {
      console.error(err.stack);
    }
    const fullMessage = err.stack ? `${message}\n${err.stack}` : message;
    subscribers.forEach(fn => fn(fullMessage));
  }
}
