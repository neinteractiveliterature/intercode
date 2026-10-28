interface Window {
  intercodeAssetsHost?: string;
  __intercodeAssetURL: (filename: string) => string;
  // A request to /oauth_session/refresh that the server-rendered shell started before this script loaded
  intercodeEarlyRefresh?: Promise<Response>;
  // The parsed /client_configuration, fetched by the shell (and used to set the title and favicon) before this script loaded
  intercodeEarlyClientConfiguration?: Promise<unknown>;
}
