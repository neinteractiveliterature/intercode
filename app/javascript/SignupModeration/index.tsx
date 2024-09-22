import { Outlet } from 'react-router-dom';
import { RouteActivatedBootstrapNavLink } from '../UIComponents/BootstrapNavLink';

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
        <RouteActivatedBootstrapNavLink path="/signup_moderation/queue" icon="bi-list-check">
          {t('signupModeration.moderationQueue')}
        </RouteActivatedBootstrapNavLink>
        <RouteActivatedBootstrapNavLink path="/signup_moderation/create_signups" icon="bi-plus-circle">
          {t('signupModeration.createSignups')}
        </RouteActivatedBootstrapNavLink>
        {signupAutomationMode === SignupAutomationMode.RankedChoice && (
          <RouteActivatedBootstrapNavLink path="/signup_moderation/ranked_choice_queue" icon="bi-card-checklist">
            {t('signupModeration.rankedChoiceQueue')}
          </RouteActivatedBootstrapNavLink>
        )}
      </ul>
      <Outlet />
    </>
  );
}

export const Component = SignupModeration;
