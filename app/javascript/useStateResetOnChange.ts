import { useState } from 'react';

// State that starts out as `value` and goes back to it whenever `resetKey` changes (by default, whenever `value` itself
// changes, for example when a route's loader data is replaced), instead of copying the value into state in an effect.
// The reset happens during render, so the stale state is never shown.
export default function useStateResetOnChange<T>(value: T, resetKey: unknown = value) {
  const [state, setState] = useState(value);
  const [previousResetKey, setPreviousResetKey] = useState(resetKey);

  if (resetKey !== previousResetKey) {
    setPreviousResetKey(resetKey);
    setState(value);
  }

  return [state, setState] as const;
}
