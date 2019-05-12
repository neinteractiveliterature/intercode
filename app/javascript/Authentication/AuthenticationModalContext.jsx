import React, { useImperativeHandle, forwardRef } from 'react';
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

// eslint-disable-next-line react/prop-types
function AuthenticationModalContextProvider({ children, recaptchaSiteKey }, ref) {
  const {
    visible, state, setState, open, close,
  } = useModal();

  useImperativeHandle(
    ref,
    () => ({ open, close, setState }),
  );

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

const RefForwardingAuthenticationModalContextProvider = forwardRef(
  AuthenticationModalContextProvider,
);

RefForwardingAuthenticationModalContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  recaptchaSiteKey: PropTypes.string,
};

RefForwardingAuthenticationModalContextProvider.defaultProps = {
  recaptchaSiteKey: null,
};

export default AuthenticationModalContext;
export { RefForwardingAuthenticationModalContextProvider as AuthenticationModalContextProvider };
