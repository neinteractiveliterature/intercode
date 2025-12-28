export function getBackendBaseUrl(): URL {
  // In development with proxy, use the same origin as the frontend
  // In production, use the configured backend URL
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    return new URL('/', window.location.origin);
  }
  return new URL('/', import.meta.env.INTERCODE_BACKEND ?? 'https://intercode.test:5050');
}
