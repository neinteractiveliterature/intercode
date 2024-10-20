import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';

import { BootstrapRRNavLink } from '../../UIComponents/BootstrapNavLink';

function SignupsIndex(): JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      <ul className="nav nav-tabs mb-2">
        <BootstrapRRNavLink to=".?filters.state=confirmed,waitlisted&sort.id=asc" end>
          {t('events.signupAdmin.title')}
        </BootstrapRRNavLink>
        <BootstrapRRNavLink to="signup_changes?sort.created_at=asc">
          {t('events.signupAdmin.historyTitle')}
        </BootstrapRRNavLink>
        <BootstrapRRNavLink to="emails/comma">{t('events.signupAdmin.emailsCommaTitle')}</BootstrapRRNavLink>
        <BootstrapRRNavLink to="emails/semicolon">{t('events.signupAdmin.emailsSemicolonTitle')}</BootstrapRRNavLink>
      </ul>
      <Outlet />
    </>
  );
}

export default SignupsIndex;
