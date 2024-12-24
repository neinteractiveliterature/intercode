export const proxyPaths = new Set([
  '/graphql',
  '/authenticity_tokens',
  '/rails/active_storage/direct_uploads',
  '^/rails/active_storage/disk/\\w+',
]);

let backendUrl: URL | undefined;
export function getBackendUrl() {
  if (!backendUrl) {
    backendUrl = new URL('/', process.env.INTERCODE_BACKEND);
  }

  return backendUrl;
}
