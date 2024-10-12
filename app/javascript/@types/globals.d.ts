interface Window {
  intercodeAssetsHost?: string;
  sentryFrontendDSN?: string;
  rollbarClientAccessToken?: string;
  __intercodeAssetURL: (filename: string) => string;
}
