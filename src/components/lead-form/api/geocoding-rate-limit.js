let nextRequestAt = 0;

// Share the request interval between address searches and manual map clicks.
// https://operations.osmfoundation.org/policies/nominatim/
export async function waitForGeocodingSlot(signal) {
  signal?.throwIfAborted();
  const delay = Math.max(0, nextRequestAt - Date.now());
  nextRequestAt = Date.now() + delay + 1100;

  if (!delay) return;

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, delay);

    function abort() {
      clearTimeout(timer);
      reject(signal.reason);
    }

    signal?.addEventListener("abort", abort, { once: true });
  });
}
