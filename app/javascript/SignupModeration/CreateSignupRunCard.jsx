import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation, useQuery } from 'react-apollo-hooks';

import buildSignupOptions from '../EventsApp/EventPage/buildSignupOptions';
import { CreateSignupRunCardQuery } from './queries.gql';
import { CreateUserSignup, WithdrawUserSignup } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import RunCard from '../EventsApp/EventPage/RunCard';
import { useConfirm } from '../ModalDialogs/Confirm';
import { useAlert } from '../ModalDialogs/Alert';
import LoadingIndicator from '../LoadingIndicator';

function CreateSignupRunCard({ eventId, runId, userConProfileId }) {
  const apolloClient = useApolloClient();
  const confirm = useConfirm();
  const alert = useAlert();

  const { data, loading, error } = useQuery(CreateSignupRunCardQuery, {
    variables: { userConProfileId, eventId },
  });

  const [createSignupMutate] = useMutation(CreateUserSignup);
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

  const [withdrawSignupMutate] = useMutation(WithdrawUserSignup);
  const withdrawSignup = () => confirm({
    prompt: `Are you sure you want to withdraw ${data.userConProfile.name_without_nickname} from ${data.event.title}?`,
    action: async () => {
      await withdrawSignupMutate({ variables: { runId, userConProfileId } });
      await apolloClient.resetStore();
    },
    renderError: (withdrawError) => <ErrorDisplay graphQLError={withdrawError} />,
  });

  const signupOptions = useMemo(
    () => (error || loading ? null : buildSignupOptions(data.event, data.userConProfile)),
    [data, loading, error],
  );

  const mySignup = useMemo(
    () => (error || loading ? null : data.userConProfile.signups.find((s) => s.run.id === runId && s.state !== 'withdrawn')),
    [data, error, loading, runId],
  );

  const myPendingSignupRequest = useMemo(
    () => (error || loading ? null : data.userConProfile.signup_requests.find((sr) => sr.target_run.id === runId && sr.state === 'pending')),
    [data, error, loading, runId],
  );

  const run = useMemo(
    () => (error || loading ? null : data.event.runs.find((r) => r.id === runId)),
    [data, error, loading, runId],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

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
      myPendingSignupRequest={myPendingSignupRequest}
      myProfile={data.userConProfile}
      createSignup={createSignup}
      withdrawSignup={withdrawSignup}
      withdrawPendingSignupRequest={() => alert('Admins cannot withdraw other users’ pending signup requests.  To accept or reject this request, go to the Moderation Queue tab.')}
    />
  );
}

CreateSignupRunCard.propTypes = {
  eventId: PropTypes.number.isRequired,
  runId: PropTypes.number.isRequired,
  userConProfileId: PropTypes.number.isRequired,
};

export default CreateSignupRunCard;
