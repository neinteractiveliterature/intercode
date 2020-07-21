// adapted from https://github.com/siddharthkp/use-timeout/blob/master/index.js
import { useEffect, useRef } from 'react';

function useTimeout(callback: (...args: any[]) => void, delay: number) {
  const savedCallback = useRef<(...args: any[]) => void>();

  // Remember the latest callback.
  useEffect(
    () => {
      savedCallback.current = callback;
    },
    [callback],
  );

  // Set up the interval.
  useEffect(
    () => {
      function tick() {
        if (savedCallback.current) {
          savedCallback.current();
        }
      }
      if (delay !== null) {
        const id = setTimeout(tick, delay);
        return () => clearTimeout(id);
      }
      return undefined;
    },
    [delay],
  );
}

export default useTimeout;
