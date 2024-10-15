export const proxyPaths = new Set(['/graphql', '/authenticity_tokens']);

let backendUrl: URL | undefined;
export function getBackendUrl() {
  if (!backendUrl) {
    backendUrl = new URL('/', process.env.INTERCODE_BACKEND);
  }

  return backendUrl;
}
