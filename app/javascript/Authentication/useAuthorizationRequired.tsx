import { useContext } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import AppRootContext, { AppRootContextValue } from '../AppRootContext';
import useLoginRequired from './useLoginRequired';

export function AuthorizationError() {
  const { t } = useTranslation();

  return <div className="alert alert-danger">{t('errors.unauthorized')}</div>;
}

export type AbilityType = AppRootContextValue['currentAbility'];
export type AbilityName = keyof AbilityType;

export function useAuthorizationRequiredWithoutLogin(...abilities: AbilityName[]): React.JSX.Element | false {
  const { currentAbility } = useContext(AppRootContext);

  if (!abilities.every((ability) => currentAbility[ability])) {
    return <AuthorizationError />;
  }

  return false;
}

export default function useAuthorizationRequired(...abilities: AbilityName[]): React.JSX.Element | false {
  const loginRequired = useLoginRequired();
  const authorizationRequired = useAuthorizationRequiredWithoutLogin(...abilities);

  if (loginRequired) {
    // Not signed in yet — render the login redirect UI (spinner/error) from useLoginRequired
    return loginRequired;
  }

  return authorizationRequired;
}

export type AuthorizationWrapperProps = {
  abilities: AbilityName[];
  children: React.ReactNode;
};

export function AuthorizationWrapper({ abilities, children }: AuthorizationWrapperProps): React.JSX.Element {
  const authorizationRequired = useAuthorizationRequired(...abilities);

  if (authorizationRequired) {
    return <>{authorizationRequired}</>;
  }

  return <>{children}</>;
}

export function NoLoginAuthorizationWrapper({ abilities, children }: AuthorizationWrapperProps): React.JSX.Element {
  const authorizationRequired = useAuthorizationRequiredWithoutLogin(...abilities);

  if (authorizationRequired) {
    return <>{authorizationRequired}</>;
  }

  return <>{children}</>;
}
