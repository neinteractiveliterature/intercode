import React, { useState, useMemo } from 'react';

import useModal from '../ModalDialogs/useModal';

const AuthenticationModalContext = React.createContext({
  visible: false,
  currentView: null,
  afterSignInPath: null,
  setAfterSignInPath: () => {},
  setCurrentView: () => {},
  open: () => {},
  close: () => {},
  recaptchaSiteKey: null,
});

export function useAuthenticationModalProvider(recaptchaSiteKey) {
  const {
    visible, state, setState, open, close,
  } = useModal();
  const [afterSignInPath, setAfterSignInPath] = useState(null);

  const contextValue = useMemo(
    () => ({
      visible,
      open,
      close,
      afterSignInPath,
      setAfterSignInPath,
      currentView: (state || {}).currentView,
      setCurrentView: view => setState({ ...state, currentView: view }),
      recaptchaSiteKey,
    }),
    [afterSignInPath, close, open, recaptchaSiteKey, setState, state, visible],
  );

  return contextValue;
}

export default AuthenticationModalContext;
