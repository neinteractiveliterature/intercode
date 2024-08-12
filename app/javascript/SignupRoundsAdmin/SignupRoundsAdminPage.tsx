import { SignupRoundsAdminQueryData, SignupRoundsAdminQueryDocument } from './queries.generated';
import React, { useContext } from 'react';
import AppRootContext from '../AppRootContext';
import { parseSignupRounds } from '../SignupRoundUtils';
import SignupRoundCard from './SignupRoundCard';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../usePageTitle';
import MaximumEventSignupsPreview from './MaximumEventSignupsPreview';
import SignupRoundScheduleTable from './SignupRoundScheduleTable';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { LoaderFunction, useLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<SignupRoundsAdminQueryData>({ query: SignupRoundsAdminQueryDocument });
  return data;
};

function SignupRoundsAdminPage() {
  const data = useLoaderData() as SignupRoundsAdminQueryData;
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const { convention } = data;

  const parsedSignupRounds = React.useMemo(
    () => parseSignupRounds(convention.signup_rounds, timezoneName),
    [convention.signup_rounds, timezoneName],
  );

  usePageTitle(t('navigation.admin.signupRounds'));

  const replacementContent = useAuthorizationRequired('can_update_convention');
  if (replacementContent) {
    return replacementContent;
  }

  return (
    <>
      <h1 className="mb-4">{t('navigation.admin.signupRounds')}</h1>
      <section className="shadow bg-body-tertiary rounded p-4 mb-4 border">
        <h3 className="mb-3">{t('signups.signupRounds.scheduleHeader')}</h3>
        <div className="d-flex gap-4">
          <div className="bg-white rounded">
            <MaximumEventSignupsPreview signupRounds={convention.signup_rounds} timezoneName={timezoneName} />
          </div>
          <div className="flex-grow-1">
            <SignupRoundScheduleTable parsedSignupRounds={parsedSignupRounds} />
          </div>
        </div>
      </section>
      {parsedSignupRounds.map((round, index) => (
        <SignupRoundCard rounds={parsedSignupRounds} roundIndex={index} key={round.id} />
      ))}
    </>
  );
}

export const Component = SignupRoundsAdminPage;
