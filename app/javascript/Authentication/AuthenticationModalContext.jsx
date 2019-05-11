import React from 'react';
import PropTypes from 'prop-types';

import useModal from '../ModalDialogs/useModal';

const AuthenticationModalContext = React.createContext({
  visible: false,
  currentView: null,
  setCurrentView: () => {},
  open: () => {},
  close: () => {},
  recaptchaSiteKey: null,
});

export function AuthenticationModalContextProvider({ children, recaptchaSiteKey }) {
  const {
    visible, state, setState, open, close,
  } = useModal();

  const contextValue = {
    visible,
    open,
    close,
    currentView: (state || {}).currentView,
    setCurrentView: view => setState({ ...state, currentView: view }),
    recaptchaSiteKey,
  };

  return (
    <AuthenticationModalContext.Provider value={contextValue}>
      {children}
    </AuthenticationModalContext.Provider>
  );
}

AuthenticationModalContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthenticationModalContext;
