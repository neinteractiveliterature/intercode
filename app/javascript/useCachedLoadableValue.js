import { useState, useEffect } from 'react';

export default function useCachedLoadableValue(loading, error, getValue, dependencies = []) {
  const [cachedValue, setCachedValue] = useState(null);

  useEffect(
    () => {
      if (!loading && !error) {
        setCachedValue(getValue());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [error, loading, ...dependencies],
  );

  return cachedValue;
}
