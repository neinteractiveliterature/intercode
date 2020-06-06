import React, { useContext } from 'react';

import AppRootContext from '../AppRootContext';
import useLoginRequired from './useLoginRequired';

export function useAuthorizationRequiredWithoutLogin(...abilities) {
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

export default function useAuthorizationRequired(...abilities) {
  const loginRequired = useLoginRequired();
  const authorizationRequired = useAuthorizationRequiredWithoutLogin(...abilities);

  if (loginRequired) {
    // useLoginRequired is going to pop the login dialog, we just need to return something truthy
    // so the caller can halt rendering
    return <></>;
  }

  return authorizationRequired;
}

export function AuthorizationWrapper({ abilities, children }) {
  const authorizationRequired = useAuthorizationRequired(abilities);

  if (authorizationRequired) {
    return authorizationRequired;
  }

  return children;
}

export function NoLoginAuthorizationWrapper({ abilities, children }) {
  const authorizationRequired = useAuthorizationRequiredWithoutLogin(abilities);

  if (authorizationRequired) {
    return authorizationRequired;
  }

  return children;
}
