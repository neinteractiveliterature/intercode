export function getBackendBaseUrl(): URL {
  if (typeof window !== 'undefined') {
    return new URL('/', window.location.href);
  } else {
    return new URL('/', process.env.INTERCODE_BACKEND);
  }
}
