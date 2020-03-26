import {
  useState, useCallback, useDebugValue, useMemo,
} from 'react';

export default function useModal(initiallyOpen = false) {
  const [visible, setVisible] = useState(initiallyOpen);
  const [state, setState] = useState(null);

  const open = useCallback(
    (newModalState) => { setState(newModalState); setVisible(true); },
    [],
  );

  const close = useCallback(
    () => { setState(null); setVisible(false); },
    [],
  );

  const returnValue = useMemo(
    () => ({
      visible, state, setState, open, close,
    }),
    [visible, state, setState, open, close],
  );

  useDebugValue(state, (debugState) => `Modal visible: ${visible}\nModal state: ${JSON.stringify(debugState)}`);

  return returnValue;
}
