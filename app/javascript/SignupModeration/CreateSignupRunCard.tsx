import { useMemo } from 'react';
import { useApolloClient } from '@apollo/client';
import {
  LoadingIndicator,
  ErrorDisplay,
  useConfirm,
  useAlert,
} from '@neinteractiveliterature/litform';

import buildSignupOptions, { SignupOption } from '../EventsApp/EventPage/buildSignupOptions';
import RunCard from '../EventsApp/EventPage/RunCard';
import { useCreateSignupRunCardQuery } from './queries.generated';
import { useCreateUserSignupMutation, useWithdrawUserSignupMutation } from './mutations.generated';

export type CreateSignupRunCardProps = {
  eventId: number;
  runId: number;
  userConProfileId: number;
};

function CreateSignupRunCard({ eventId, runId, userConProfileId }: CreateSignupRunCardProps) {
  const apolloClient = useApolloClient();
  const confirm = useConfirm();
  const alert = useAlert();

  const { data, loading, error } = useCreateSignupRunCardQuery({
    variables: { userConProfileId, eventId },
  });

  const [createSignupMutate] = useCreateUserSignupMutation();
  const createSignup = async (signupOption: SignupOption) => {
    await createSignupMutate({
      variables: {
        runId,
        userConProfileId,
        requestedBucketKey: signupOption.bucket?.key,
        noRequestedBucket: signupOption.bucket == null,
      },
    });

    await apolloClient.resetStore();
  };

  const [withdrawSignupMutate] = useWithdrawUserSignupMutation();
  const withdrawSignup = () => {
    confirm({
      prompt: `Are you sure you want to withdraw ${
        data!.userConProfile.name_without_nickname
      } from ${data!.event.title}?`,
      action: async () => {
        await withdrawSignupMutate({ variables: { runId, userConProfileId } });
        await apolloClient.resetStore();
      },
      renderError: (withdrawError) => <ErrorDisplay graphQLError={withdrawError} />,
    });
    return Promise.resolve();
  };

  const signupOptions = useMemo(
    () =>
      error || loading || !data
        ? { mainPreference: [], mainNoPreference: [], auxiliary: [] }
        : buildSignupOptions(data.event, data.userConProfile),
    [data, loading, error],
  );

  const mySignup = useMemo(
    () =>
      error || loading || !data
        ? null
        : data.userConProfile.signups.find((s) => s.run.id === runId && s.state !== 'withdrawn'),
    [data, error, loading, runId],
  );

  const myPendingSignupRequest = useMemo(
    () =>
      error || loading || !data
        ? null
        : data.userConProfile.signup_requests.find(
            (sr) => sr.target_run.id === runId && sr.state === 'pending',
          ),
    [data, error, loading, runId],
  );

  const run = useMemo(
    () => (error || loading || !data ? null : data.event.runs.find((r) => r.id === runId)),
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
      event={data!.event}
      run={run!}
      currentAbility={data!.currentAbility}
      signupOptions={signupOptions}
      mySignup={mySignup}
      myPendingSignupRequest={myPendingSignupRequest}
      myProfile={data!.userConProfile}
      createSignup={createSignup}
      withdrawSignup={withdrawSignup}
      withdrawPendingSignupRequest={async () =>
        alert(
          'Admins cannot withdraw other users’ pending signup requests.  To accept or reject this request, go to the Moderation Queue tab.',
        )
      }
    />
  );
}

export default CreateSignupRunCard;
