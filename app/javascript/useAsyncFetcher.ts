import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFetcher } from 'react-router';

export function useAsyncFetcher() {
  const fetcher = useFetcher();
  const resolveRef = useRef<(data: unknown) => void | undefined>(undefined);

  const loadAsync = useCallback(
    <Data>(...args: Parameters<typeof fetcher.load>) =>
      new Promise<Data>((resolve, reject) => {
        if (resolveRef.current) {
          reject(new Error('Request already in progress'));
        } else {
          resolveRef.current = resolve;
          fetcher.load(...args);
        }
      }),
    [fetcher],
  );

  const submitAsync = useCallback(
    <Data>(...args: Parameters<typeof fetcher.submit>) =>
      new Promise<Data>((resolve, reject) => {
        if (resolveRef.current) {
          reject(new Error('Request already in progress'));
        } else {
          resolveRef.current = resolve;
          fetcher.submit(...args);
        }
      }),
    [fetcher],
  );

  useEffect(() => {
    if (fetcher.state === 'idle' && resolveRef.current && fetcher.data) {
      const result = fetcher.data;
      const resolve = resolveRef.current;
      resolveRef.current = undefined;
      resolve(result);
    }
  }, [fetcher]);

  const asyncFetcher = useMemo(
    () => ({
      ...fetcher,
      loadAsync,
      submitAsync,
    }),
    [fetcher, loadAsync, submitAsync],
  );

  return asyncFetcher;
}
