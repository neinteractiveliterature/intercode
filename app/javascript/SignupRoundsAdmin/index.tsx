import { LoadQueryWrapper } from '@neinteractiveliterature/litform';
import { useSignupRoundsAdminQuery } from './queries.generated';
import React, { useContext } from 'react';
import AppRootContext from '../AppRootContext';
import { parseSignupRounds } from '../SignupRoundUtils';
import SignupRoundCard from './SignupRoundCard';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../usePageTitle';
import MaximumEventSignupsPreview from './MaximumEventSignupsPreview';
import SignupRoundScheduleTable from './SignupRoundScheduleTable';

const SignupRoundsAdmin = LoadQueryWrapper(useSignupRoundsAdminQuery, ({ data }) => {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const { convention } = data;

  const parsedSignupRounds = React.useMemo(
    () => parseSignupRounds(convention.signup_rounds, timezoneName),
    [convention.signup_rounds, timezoneName],
  );

  usePageTitle(t('navigation.admin.signupRounds'));

  return (
    <>
      <h1 className="mb-4">{t('navigation.admin.signupRounds')}</h1>
      <section className="shadow bg-body-tertiary rounded p-4 mb-4 border">
        <h3 className="mb-3">{t('signups.signupRounds.scheduleHeader', 'Schedule')}</h3>
        <div className="d-flex gap-4">
          <div className="bg-white">
            <MaximumEventSignupsPreview signupRounds={convention.signup_rounds} timezoneName={timezoneName} />
          </div>
          <SignupRoundScheduleTable parsedSignupRounds={parsedSignupRounds} />
        </div>
      </section>
      {parsedSignupRounds.map((round, index) => (
        <SignupRoundCard rounds={parsedSignupRounds} roundIndex={index} key={round.id} />
      ))}
    </>
  );
});

export default SignupRoundsAdmin;
