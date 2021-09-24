import { useContext } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import AppRootContext, { AppRootContextValue } from '../AppRootContext';
import useLoginRequired from './useLoginRequired';

type AbilityType = AppRootContextValue['currentAbility'];
type AbilityName = keyof AbilityType;

export function useAuthorizationRequiredWithoutLogin(...abilities: AbilityName[]) {
  const { t } = useTranslation();
  const { currentAbility } = useContext(AppRootContext);

  if (!abilities.every((ability) => currentAbility[ability])) {
    return (
      <div className="alert alert-danger">
        {t('errors.unauthorized', 'Sorry, your account is not authorized to view this page.')}
      </div>
    );
  }

  return false;
}

export default function useAuthorizationRequired(...abilities: AbilityName[]) {
  const loginRequired = useLoginRequired();
  const authorizationRequired = useAuthorizationRequiredWithoutLogin(...abilities);

  if (loginRequired) {
    // useLoginRequired is going to pop the login dialog, we just need to return something truthy
    // so the caller can halt rendering
    return <></>;
  }

  return authorizationRequired;
}

export type AuthorizationWrapperProps = {
  abilities: AbilityName[];
  children: React.ReactNode;
};

export function AuthorizationWrapper({ abilities, children }: AuthorizationWrapperProps) {
  const authorizationRequired = useAuthorizationRequired(...abilities);

  if (authorizationRequired) {
    return <>{authorizationRequired}</>;
  }

  return <>{children}</>;
}

export function NoLoginAuthorizationWrapper({ abilities, children }: AuthorizationWrapperProps) {
  const authorizationRequired = useAuthorizationRequiredWithoutLogin(...abilities);

  if (authorizationRequired) {
    return <>{authorizationRequired}</>;
  }

  return <>{children}</>;
}
