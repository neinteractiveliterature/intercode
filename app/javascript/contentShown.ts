// Lets downloads that nothing on screen depends on wait until the page's content has been painted, so that they don't
// compete with the ones it does depend on. AppRootLayout calls markContentShown.

// Not every page uses AppRootLayout (and one that fails to load never gets there), so don't wait forever. Longer than a
// page takes to appear on a slow phone connection.
const FALLBACK_MS = 15000;

let resolveShown: () => void;
const shown = new Promise<void>((resolve) => {
  resolveShown = resolve;
});

export function markContentShown(): void {
  // Lets the browser get on with rendering the content first. This doesn't guarantee that the content is on screen yet:
  // measured in Chrome, it can still be a few tens of milliseconds from there.
  requestAnimationFrame(() => setTimeout(resolveShown, 0));
}

export function afterContentShown(): Promise<void> {
  return Promise.race([shown, new Promise<void>((resolve) => setTimeout(resolve, FALLBACK_MS))]);
}
