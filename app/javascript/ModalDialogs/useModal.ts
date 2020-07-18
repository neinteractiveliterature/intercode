import {
  useState, useCallback, useDebugValue, useMemo,
} from 'react';
import useIsMounted from '../useIsMounted';

export interface ModalData<StateType> {
  open: (newModalState?: StateType) => void;
  close: () => void;
  state?: StateType;
  setState: (newState?: StateType) => void;
  visible: boolean;
}

export default function useModal<StateType>(initiallyOpen = false): ModalData<StateType> {
  const [visible, setVisible] = useState(initiallyOpen);
  const [state, setState] = useState<StateType | undefined>(undefined);
  const isMounted = useIsMounted();

  const open = useCallback(
    (newModalState?: StateType) => { setState(newModalState); setVisible(true); },
    [],
  );

  const close = useCallback(
    () => {
      if (isMounted.current) {
        setState(undefined);
        setVisible(false);
      }
    },
    [isMounted],
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
