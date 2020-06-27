import { useState, useEffect, DependencyList } from 'react';

export default function useCachedLoadableValue<T>(
  loading: boolean,
  error: Error | null | undefined,
  getValue: () => T,
  dependencies: DependencyList = [],
) {
  const [cachedValue, setCachedValue] = useState<T | null>(null);

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
