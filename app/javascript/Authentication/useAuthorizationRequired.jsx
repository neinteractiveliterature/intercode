import React, { useContext } from 'react';

import AppRootContext from '../AppRootContext';

export default function useAuthorizationRequired(...abilities) {
  const { currentAbility } = useContext(AppRootContext);

  if (!abilities.every((ability) => currentAbility[ability])) {
    return (
      <div className="alert alert-danger">
        Sorry, your account is not authorized to view this page.
      </div>
    );
  }

  return false;
}
