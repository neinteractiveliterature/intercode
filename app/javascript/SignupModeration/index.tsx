import { Outlet } from 'react-router-dom';
import { BootstrapNavLink } from '../UIComponents/BootstrapNavLink';

import { useContext } from 'react';
import AppRootContext from '../AppRootContext';
import { SignupAutomationMode } from '../graphqlTypes.generated';
import { useTranslation } from 'react-i18next';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function SignupModeration(): JSX.Element {
  const { signupAutomationMode } = useContext(AppRootContext);
  const { t } = useTranslation();
  const replacementContent = useAuthorizationRequired('can_manage_signups');
  if (replacementContent) {
    return replacementContent;
  }

  return (
    <>
      <h1 className="mb-4">{t('navigation.admin.signupModeration')}</h1>
      <ul className="nav nav-tabs mb-3" role="tablist">
        <BootstrapNavLink path="/signup_moderation/queue" icon="bi-list-check">
          {t('signupModeration.moderationQueue')}
        </BootstrapNavLink>
        <BootstrapNavLink path="/signup_moderation/create_signups" icon="bi-plus-circle">
          {t('signupModeration.createSignups')}
        </BootstrapNavLink>
        {signupAutomationMode === SignupAutomationMode.RankedChoice && (
          <BootstrapNavLink path="/signup_moderation/ranked_choice_queue" icon="bi-card-checklist">
            {t('signupModeration.rankedChoiceQueue')}
          </BootstrapNavLink>
        )}
      </ul>
      <Outlet />
    </>
  );
}

export const Component = SignupModeration;
