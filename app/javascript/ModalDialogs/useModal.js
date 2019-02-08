import { useState } from 'react';

export default function useModal(initiallyOpen = false) {
  const [visible, setVisible] = useState(initiallyOpen);
  const [state, setState] = useState(null);

  return {
    visible,
    state,
    setState,
    open: (newModalState) => { setState(newModalState); setVisible(true); },
    close: () => { setState(null); setVisible(false); },
  };
}
