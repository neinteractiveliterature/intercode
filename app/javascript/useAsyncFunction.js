import { useState, useCallback } from 'react';
import useIsMounted from './useIsMounted';

export default function useAsyncFunction(func, { suppressError } = {}) {
  const [error, setError] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const isMounted = useIsMounted();

  return [
    useCallback(
      async (...args) => {
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
