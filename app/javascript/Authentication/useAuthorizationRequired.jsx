import React, { useContext } from 'react';

import AppRootContext from '../AppRootContext';
import useLoginRequired from './useLoginRequired';

export default function useAuthorizationRequired(...abilities) {
  const loginRequired = useLoginRequired();
  const { currentAbility } = useContext(AppRootContext);

  if (loginRequired) {
    // useLoginRequired is going to pop the login dialog, we just need to return something truthy
    // so the caller can halt rendering
    return <></>;
  }

  if (!abilities.every((ability) => currentAbility[ability])) {
    return (
      <div className="alert alert-danger">
        Sorry, your account is not authorized to view this page.
      </div>
    );
  }

  return false;
}
