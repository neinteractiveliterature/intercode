import { ErrorInfo } from 'react';

declare class GlobalRollbar {
  error: (error: Error | string, options?: { errorInfo?: ErrorInfo }) => void;

  warn: (error: Error | string, options?: { errorInfo?: ErrorInfo }) => void;
}

declare global {
  const Rollbar: GlobalRollbar | undefined;
}
