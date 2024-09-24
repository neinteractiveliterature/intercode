import { ErrorInfo } from 'react';

declare class GlobalRollbar {
  error: (error: Error | string, options?: { errorInfo?: ErrorInfo }) => void;

  warn: (error: Error | string, options?: { errorInfo?: ErrorInfo }) => void;

  configure: (options: { payload: unknown }) => void;
}

declare global {
  const Rollbar: GlobalRollbar | undefined;

  declare interface Window {
    intercodeAssetsHost?: string;
    sentryFrontendDSN?: string;
    __intercodeAssetURL: (filename: string) => string;
  }
}
