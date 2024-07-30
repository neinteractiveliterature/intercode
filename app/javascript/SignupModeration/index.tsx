import { Routes, Route, Navigate } from 'react-router-dom';
import { BootstrapNavLink } from '../UIComponents/BootstrapNavLink';

import CreateSignup from './CreateSignup';
import SignupModerationQueue from './SignupModerationQueue';
import { useContext } from 'react';
import AppRootContext from '../AppRootContext';
import { SignupAutomationMode } from '../graphqlTypes.generated';
import { useTranslation } from 'react-i18next';
import RankedChoiceQueue from './RankedChoiceQueue';

function SignupModeration(): JSX.Element {
  const { signupAutomationMode } = useContext(AppRootContext);
  const { t } = useTranslation();

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
      <Routes>
        {signupAutomationMode === SignupAutomationMode.RankedChoice && (
          <Route path="ranked_choice_queue/*" element={<RankedChoiceQueue />} />
        )}
        <Route path="queue" element={<SignupModerationQueue />} />
        <Route path="create_signups" element={<CreateSignup />} />
        <Route path="" element={<Navigate to="/signup_moderation/queue" replace />} />
      </Routes>
    </>
  );
}

export default SignupModeration;
