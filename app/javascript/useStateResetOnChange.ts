import { useState } from 'react';

// State that starts out as `value` and goes back to it whenever `value` changes (for example when a route's loader data
// is replaced), instead of copying the value into state in an effect. The reset happens during render, so the stale
// state is never shown.
export default function useStateResetOnChange<T>(value: T) {
  const [state, setState] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);

  if (value !== previousValue) {
    setPreviousValue(value);
    setState(value);
  }

  return [state, setState] as const;
}
