import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router';

import AuthenticationModalContext from './AuthenticationModalContext';
import AppRootContext from '../AppRootContext';

export default function useLoginRequired(): boolean {
  const authenticationModal = useContext(AuthenticationModalContext);
  const { currentUser } = useContext(AppRootContext);
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      if (!authenticationModal.visible) {
        authenticationModal.open({ currentView: 'signIn' });
        authenticationModal.setAfterSignInPath(location.pathname);
      }
    }
  }, [authenticationModal, currentUser, location.pathname]);

  return !currentUser;
}
