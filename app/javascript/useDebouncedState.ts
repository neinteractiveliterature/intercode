import { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash/debounce';

export default function useDebouncedState<T>(
  initialState: T | (() => T),
  onChange: (value: T) => void,
  wait?: number,
) {
  const [transientValue, setTransientValue] = useState(initialState);
  const transientValueChanged = useMemo(
    () =>
      debounce(
        (newTransientValue: T) => {
          onChange(newTransientValue);
        },
        wait,
        { leading: false, trailing: true },
      ),
    [onChange, wait],
  );

  useEffect(() => {
    transientValueChanged(transientValue);
    return transientValueChanged.cancel;
  }, [transientValue, transientValueChanged]);

  return [transientValue, setTransientValue] as const;
}
