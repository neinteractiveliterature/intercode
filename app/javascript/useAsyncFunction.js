import {
  useState, useCallback, useEffect, useRef,
} from 'react';

export default function useAsyncFunction(func, { suppressError } = {}) {
  const [error, setError] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const unmounted = useRef(false);
  useEffect(
    () => {
      unmounted.current = false;
      return () => { unmounted.current = true; };
    },
  );

  return [
    useCallback(
      async (...args) => {
        setError(null);
        setInProgress(true);
        try {
          return await func(...args);
        } catch (e) {
          if (!unmounted.current) {
            setError(e);
          }
          if (!suppressError) {
            throw e;
          }
          return null;
        } finally {
          if (!unmounted.current) {
            setInProgress(false);
          }
        }
      },
      [func, suppressError],
    ),
    error,
    inProgress,
    () => setError(null),
  ];
}
