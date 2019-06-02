import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from 'react-apollo-hooks';

import buildSignupOptions from '../EventsApp/EventPage/buildSignupOptions';
import { CreateSignupRunCardQuery } from './queries.gql';
import { CreateUserSignup, WithdrawUserSignup } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import RunCard from '../EventsApp/EventPage/RunCard';
import useQuerySuspended from '../useQuerySuspended';
import useMutationCallback from '../useMutationCallback';

function CreateSignupRunCard({ eventId, runId, userConProfileId }) {
  const apolloClient = useApolloClient();

  const { data, error } = useQuerySuspended(CreateSignupRunCardQuery, {
    variables: { userConProfileId, eventId },
  });

  const createSignupMutate = useMutationCallback(CreateUserSignup);
  const createSignup = async (signupOption) => {
    await createSignupMutate({
      variables: {
        runId,
        userConProfileId,
        requestedBucketKey: (signupOption.bucket || {}).key,
        noRequestedBucket: signupOption.bucket == null,
      },
    });

    await apolloClient.resetStore();
  };

  const withdrawSignupMutate = useMutationCallback(WithdrawUserSignup);
  const withdrawSignup = async () => {
    await withdrawSignupMutate({
      variables: {
        runId,
        userConProfileId,
      },
    });

    await apolloClient.resetStore();
  };

  const signupOptions = useMemo(
    () => (error ? null : buildSignupOptions(data.event, data.myProfile)),
    [data, error],
  );

  const mySignup = useMemo(
    () => (error ? null : data.userConProfile.signups.find(s => s.run.id === runId && s.state !== 'withdrawn')),
    [data, error, runId],
  );

  const run = useMemo(
    () => (error ? null : data.event.runs.find(r => r.id === runId)),
    [data, error, runId],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <RunCard
      event={data.event}
      run={run}
      currentAbility={data.currentAbility}
      signupOptions={signupOptions}
      mySignup={mySignup}
      myProfile={data.userConProfile}
      createSignup={createSignup}
      withdrawSignup={withdrawSignup}
    />
  );
}

CreateSignupRunCard.propTypes = {
  eventId: PropTypes.number.isRequired,
  runId: PropTypes.number.isRequired,
  userConProfileId: PropTypes.number.isRequired,
};

export default CreateSignupRunCard;
