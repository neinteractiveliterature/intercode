import { LoadQueryWrapper } from '@neinteractiveliterature/litform';
import { useSignupRoundsAdminQuery } from './queries.generated';
import React, { useContext } from 'react';
import AppRootContext from '../AppRootContext';
import { parseSignupRounds } from '../SignupRoundUtils';
import SignupRoundCard from './SignupRoundCard';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../usePageTitle';
import MaximumEventSignupsPreview from './MaximumEventSignupsPreview';

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
      <MaximumEventSignupsPreview signupRounds={convention.signup_rounds} timezoneName={timezoneName} />
      {parsedSignupRounds.map((round, index) => (
        <SignupRoundCard rounds={parsedSignupRounds} roundIndex={index} key={round.id} />
      ))}
    </>
  );
});

export default SignupRoundsAdmin;
