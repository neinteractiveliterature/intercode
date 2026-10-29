interface Window {
  intercodeAssetsHost?: string;
  __intercodeAssetURL: (filename: string) => string;
  // A request to /oauth_session/refresh that the server-rendered shell started before this script loaded
  intercodeEarlyRefresh?: Promise<Response>;
  // The parsed /client_configuration, fetched by the shell (and used to set the title and favicon) before this script loaded
  intercodeEarlyClientConfiguration?: Promise<unknown>;
  // Set once the app's entry script has started, so the framework-mode shell's recovery script (shellRecovery.ts) stops
  // watching for load failures
  intercodeShellBooted?: boolean;
}
