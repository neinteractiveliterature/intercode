import { ErrorInfo } from 'react';

declare class GlobalRollbar {
  error: (error: Error | string, options?: { errorInfo?: ErrorInfo }) => void;

  warn: (error: Error | string, options?: { errorInfo?: ErrorInfo }) => void;
}

declare namespace global {
  const Rollbar: GlobalRollbar;
}

declare const Rollbar: GlobalRollbar | undefined;
