import { useState, useCallback } from 'react';

export default function useAsyncFunction(func, { suppressError } = {}) {
  const [error, setError] = useState(null);
  const [inProgress, setInProgress] = useState(false);

  return [
    useCallback(
      async (...args) => {
        setError(null);
        setInProgress(true);
        try {
          return await func(...args);
        } catch (e) {
          setError(e);
          if (!suppressError) {
            throw e;
          }
          return null;
        } finally {
          setInProgress(false);
        }
      },
      [func, suppressError],
    ),
    error,
    inProgress,
    () => setError(null),
  ];
}
