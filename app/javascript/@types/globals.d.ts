import { ErrorInfo } from 'react';

declare class GlobalRollbar {
  error: (error: Error | string, options?: { errorInfo?: ErrorInfo }) => void;

  warn: (error: Error | string, options?: { errorInfo?: ErrorInfo }) => void;
}

// Stolen from bootstrap-native's git HEAD
interface BSN {
  initCallback(
    /** @default document */
    element?: Element,
  ): void;

  removeDataAPI(
    /** @default document */
    container?: Element,
  ): void;

  Version: string;
  componentsInit: object;
}

declare global {
  const Rollbar: GlobalRollbar | undefined;

  interface Window {
    BSN: BSN;
  }
}
