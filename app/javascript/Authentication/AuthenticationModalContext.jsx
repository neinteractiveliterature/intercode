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
  const [unauthenticatedError, setUnauthenticatedError] = useState(false);

  const contextValue = useMemo(
    () => ({
      visible,
      open,
      close,
      afterSignInPath,
      setAfterSignInPath,
      currentView: (state || {}).currentView,
      setCurrentView: (view) => setState({ ...state, currentView: view }),
      recaptchaSiteKey,
      unauthenticatedError,
      setUnauthenticatedError,
    }),
    [
      afterSignInPath, close, open, recaptchaSiteKey, setState, setUnauthenticatedError, state,
      unauthenticatedError, visible,
    ],
  );

  return contextValue;
}

export default AuthenticationModalContext;
