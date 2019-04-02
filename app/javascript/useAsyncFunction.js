import { useState, useCallback } from 'react';

export default function useAsyncFunction(func) {
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
          throw e;
        } finally {
          setInProgress(false);
        }
      },
      [func],
    ),
    error,
    inProgress,
  ];
}
