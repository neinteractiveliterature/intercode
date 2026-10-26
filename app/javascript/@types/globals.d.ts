interface Window {
  intercodeAssetsHost?: string;
  __intercodeAssetURL: (filename: string) => string;
  // A request to /oauth_session/refresh that the server-rendered shell started before this script loaded
  intercodeEarlyRefresh?: Promise<Response>;
}
