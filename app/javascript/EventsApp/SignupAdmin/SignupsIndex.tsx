import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import RunHeader from './RunHeader';
import { BootstrapNavLink } from '../../UIComponents/BootstrapNavLink';

export type SignupsIndexProps = {
  runPath: string;
};

function SignupsIndex({ runPath }: SignupsIndexProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      <RunHeader />
      <ul className="nav nav-tabs mb-2">
        <BootstrapNavLink path={`${runPath}/admin_signups/?filters.state=confirmed%2Cwaitlisted&sort.id=asc`}>
          {t('events.signupAdmin.title')}
        </BootstrapNavLink>
        <BootstrapNavLink path={`${runPath}/admin_signups/signup_changes?sort.created_at=asc`}>
          {t('events.signupAdmin.historyTitle')}
        </BootstrapNavLink>
        <BootstrapNavLink path={`${runPath}/admin_signups/emails/comma`}>
          {t('events.signupAdmin.emailsCommaTitle')}
        </BootstrapNavLink>
        <BootstrapNavLink path={`${runPath}/admin_signups/emails/semicolon`}>
          {t('events.signupAdmin.emailsSemicolonTitle')}
        </BootstrapNavLink>
      </ul>
      <Outlet />
    </>
  );
}

export default SignupsIndex;
