import { useState, useCallback } from 'react';
import { useIsMounted } from '@neinteractiveliterature/litform';

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
            setError(e);
          }
          if (!suppressError) {
            throw e;
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
