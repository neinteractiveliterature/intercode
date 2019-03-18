import { useState } from 'react';

export default function useAsyncFunction(func) {
  const [error, setError] = useState(null);
  const [inProgress, setInProgress] = useState(false);

  return [
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
    error,
    inProgress,
  ];
}
