export function getBackendBaseUrl(): URL {
  return new URL('/', import.meta.env.INTERCODE_BACKEND ?? 'https://intercode.test:5050');
}
