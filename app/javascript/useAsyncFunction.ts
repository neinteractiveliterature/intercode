import { useState, useCallback } from 'react';
import { CombinedGraphQLErrors } from '@apollo/client';
import { useIsMounted } from '@neinteractiveliterature/litform';

import errorReporting from './ErrorReporting';

// An error that is an expected outcome of the user's action (like "Current password is invalid"), whose message is
// meant to be shown to them. useAsyncFunction doesn't report these when it swallows them.
export class UserFacingError extends Error {}

// GraphQL errors from our server are already reported by the server if they're unexpected (see IntercodeSchema), and
// the rest are validation or authorization problems the user is told about.
function shouldReport(error: unknown) {
  return !(error instanceof UserFacingError) && !CombinedGraphQLErrors.is(error);
}

export type UseAsyncFunctionOptions = {
  suppressError?: boolean;
};

export type WrappedAsyncFunction<T, A extends unknown[]> = (...args: A) => Promise<T | null>;

export type UseAsyncFunctionReturn<T, A extends unknown[]> = [
  WrappedAsyncFunction<T, A>,
  Error | null,
  boolean,
  () => void,
];

export default function useAsyncFunction<T, A extends unknown[]>(
  func: (...args: A) => Promise<T>,
  { suppressError }: UseAsyncFunctionOptions = {},
): UseAsyncFunctionReturn<T, A> {
  const [error, setError] = useState<Error | null>(null);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const isMounted = useIsMounted();

  return [
    useCallback(
      async (...args: A) => {
        setError(null);
        setInProgress(true);
        try {
          return await func(...args);
        } catch (e) {
          if (isMounted.current) {
            setError(e as Error);
          }
          if (!suppressError) {
            throw e;
          }
          // The caller is showing the error, so it won't reach the global unhandled rejection reporting. Still report
          // anything unexpected (network failures, bugs) so it isn't lost.
          if (shouldReport(e)) {
            errorReporting().error(e instanceof Error ? e : String(e), { tags: { context: 'useAsyncFunction' } });
          }
          return null;
        } finally {
          if (isMounted.current) {
            setInProgress(false);
          }
        }
      },
      [func, suppressError, isMounted],
    ),
    error,
    inProgress,
    () => setError(null),
  ];
}
