import { useMemo } from 'react';
import { useApolloClient } from '@apollo/client';
import { ErrorDisplay, useConfirm, useAlert } from '@neinteractiveliterature/litform';

import buildSignupOptions, { SignupOption } from '../EventsApp/EventPage/buildSignupOptions';
import RunCard from '../EventsApp/EventPage/RunCard';
import { useCreateSignupRunCardQuery } from './queries.generated';
import { useCreateUserSignupMutation, useWithdrawUserSignupMutation } from './mutations.generated';
import { LoadQueryWithVariablesWrapper } from '../GraphqlLoadingWrappers';

export type CreateSignupRunCardProps = {
  eventId: string;
  runId: string;
  userConProfileId: string;
};

export default LoadQueryWithVariablesWrapper(
  useCreateSignupRunCardQuery,
  ({ eventId, userConProfileId }: CreateSignupRunCardProps) => ({ eventId, userConProfileId }),
  function CreateSignupRunCard({ runId, userConProfileId, data }): JSX.Element {
    const apolloClient = useApolloClient();
    const confirm = useConfirm();
    const alert = useAlert();

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

      // we never actually want to pop the ticket purchase dialog for this
      return undefined;
    };

    const [withdrawSignupMutate] = useWithdrawUserSignupMutation();
    const withdrawSignup = () => {
      confirm({
        prompt: `Are you sure you want to withdraw ${data?.convention.user_con_profile.name_without_nickname} from ${data?.convention.event.title}?`,
        action: async () => {
          await withdrawSignupMutate({ variables: { runId, userConProfileId } });
          await apolloClient.resetStore();
        },
        renderError: (withdrawError) => <ErrorDisplay graphQLError={withdrawError} />,
      });
      return Promise.resolve();
    };

    const signupOptions = useMemo(
      () => buildSignupOptions(data.convention.event, data.convention.user_con_profile),
      [data],
    );

    const mySignup = useMemo(
      () => data.convention.user_con_profile.signups.find((s) => s.run.id === runId && s.state !== 'withdrawn'),
      [data, runId],
    );

    const myPendingSignupRequest = useMemo(
      () =>
        data.convention.user_con_profile.signup_requests.find(
          (sr) => sr.target_run.id === runId && sr.state === 'pending',
        ),
      [data, runId],
    );

    const run = useMemo(() => data.convention.event.runs.find((r) => r.id === runId), [data, runId]);

    if (!run) {
      return <ErrorDisplay stringError={`Run ${runId} not found`} />;
    }

    return (
      <RunCard
        event={data.convention.event}
        run={run}
        currentAbility={data.currentAbility}
        signupOptions={signupOptions}
        mySignup={mySignup}
        myPendingSignupRequest={myPendingSignupRequest}
        myProfile={data.convention.user_con_profile}
        createSignup={createSignup}
        withdrawSignup={withdrawSignup}
        withdrawPendingSignupRequest={async () =>
          alert(
            'Admins cannot withdraw other users’ pending signup requests.  To accept or reject this request, go to the Moderation Queue tab.',
          )
        }
      />
    );
  },
);
