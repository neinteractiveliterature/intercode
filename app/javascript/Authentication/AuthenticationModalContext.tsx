import { useState, useMemo } from 'react';
import * as React from 'react';
import { useModal } from '@neinteractiveliterature/litform';

export type AuthenticationModalView = 'signIn' | 'signUp' | 'forgotPassword';

export type AuthenticationModalState = {
  currentView?: AuthenticationModalView;
};

export type AuthenticationModalContextData = {
  visible: boolean;
  currentView?: AuthenticationModalView;
  afterSignInPath?: string;
  setAfterSignInPath: (afterSignInPath?: string) => void;
  setCurrentView: (currentView?: AuthenticationModalView) => void;
  open: (state: AuthenticationModalState) => void;
  close: () => void;
  recaptchaSiteKey?: string;
  unauthenticatedError: boolean;
  setUnauthenticatedError: React.Dispatch<boolean>;
};

const AuthenticationModalContext = React.createContext<AuthenticationModalContextData>({
  visible: false,
  setAfterSignInPath: () => {},
  setCurrentView: () => {},
  open: () => {},
  close: () => {},
  unauthenticatedError: false,
  setUnauthenticatedError: () => {},
});

export function useAuthenticationModalProvider(recaptchaSiteKey?: string) {
  const { visible, state, setState, open, close } = useModal<AuthenticationModalState>();
  const [afterSignInPath, setAfterSignInPath] = useState<string>();
  const [unauthenticatedError, setUnauthenticatedError] = useState(false);

  const contextValue = useMemo(
    () => ({
      visible,
      open,
      close,
      afterSignInPath,
      setAfterSignInPath,
      currentView: state?.currentView,
      setCurrentView: (view?: AuthenticationModalView) => setState({ ...state, currentView: view }),
      recaptchaSiteKey,
      unauthenticatedError,
      setUnauthenticatedError,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      afterSignInPath,
      close,
      open,
      recaptchaSiteKey,
      setState,
      setUnauthenticatedError,
      state,
      unauthenticatedError,
      visible,
    ],
  );

  return contextValue;
}

export default AuthenticationModalContext;
