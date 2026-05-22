import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router';

import AppRootContext from '../AppRootContext';
import { AuthenticationManagerContext } from './authenticationManager';

export default function useLoginRequired(): boolean {
  const authenticationManager = useContext(AuthenticationManagerContext);
  const { currentUser } = useContext(AppRootContext);
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      authenticationManager.initiateAuthentication(location.pathname).then(({ redirectUrl }) => {
        window.location.href = redirectUrl.toString();
      });
    }
  }, [authenticationManager, currentUser, location.pathname]);

  return !currentUser;
}
