import { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash/debounce';

export default function useDebouncedState(initialValue, onChange, wait) {
  const [transientValue, setTransientValue] = useState(initialValue);
  const transientValueChanged = useMemo(
    () => debounce(
      (newTransientValue) => {
        onChange(newTransientValue);
      },
      wait,
      { leading: false, trailing: true },
    ),
    [onChange, wait],
  );

  useEffect(
    () => {
      transientValueChanged(transientValue);
      return transientValueChanged.cancel;
    },
    [transientValue, transientValueChanged],
  );

  return [transientValue, setTransientValue];
}
