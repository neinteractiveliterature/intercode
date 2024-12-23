import { useRef, useEffect } from 'react';

export default function useWhyDidYouUpdate<P>(name: string, props: P): void {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef<P>();

  useEffect(() => {
    const previousValue = previousProps.current;

    if (previousValue) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousValue, ...props }) as (keyof P)[];
      // Use this object to keep track of changed props
      // Iterate through keys
      const changesObj = allKeys.reduce<Partial<P>>((acc, key) => {
        // If previous is different from current
        if (previousValue[key] !== props[key]) {
          // Add to changesObj
          return {
            ...acc,
            [key]: {
              from: previousValue[key],
              to: props[key],
            },
          };
        }

        return acc;
      }, {});

      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log('[why-did-you-update]', name, changesObj);
      }
    }

    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}
