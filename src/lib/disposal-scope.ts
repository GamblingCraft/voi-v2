/** Releases owned resources once, in reverse acquisition order. */
export function createDisposalScope() {
  let disposed = false;
  const callbacks: Array<() => void> = [];
  return {
    add(cleanup: () => void) {
      if (disposed) cleanup();
      else callbacks.push(cleanup);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      const errors: unknown[] = [];
      for (const cleanup of callbacks.reverse()) {
        try {
          cleanup();
        } catch (error) {
          errors.push(error);
        }
      }
      callbacks.length = 0;
      if (errors.length) console.error("resource-cleanup", errors);
    },
  };
}
