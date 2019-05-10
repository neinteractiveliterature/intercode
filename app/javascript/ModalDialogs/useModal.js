import { useState, useDebugValue } from 'react';

export default function useModal(initiallyOpen = false) {
  const [visible, setVisible] = useState(initiallyOpen);
  const [state, setState] = useState(null);

  useDebugValue(state, debugState => `Modal visible: ${visible}\nModal state: ${JSON.stringify(debugState)}`);

  return {
    visible,
    state,
    setState,
    open: (newModalState) => { setState(newModalState); setVisible(true); },
    close: () => { setState(null); setVisible(false); },
  };
}
