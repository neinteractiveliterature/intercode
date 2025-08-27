import { useMemo } from 'react';
import { useSuspenseQuery } from '@apollo/client';
import { ErrorDisplay, useConfirm, useAlert } from '@neinteractiveliterature/litform';

import buildSignupOptions, { SignupOption } from '../EventsApp/EventPage/buildSignupOptions';
import RunCard from '../EventsApp/EventPage/RunCard';
import SignupCountData from '../EventsApp/SignupCountData';
import { SignupRankedChoiceState } from '../graphqlTypes.generated';
import { CreateSignupRunCardQueryDocument } from './queries.generated';
import { client } from '../useIntercodeApolloClient';
import { CreateUserSignupDocument, WithdrawUserSignupDocument } from './mutations.generated';

export type CreateSignupRunCardProps = {
  eventId: string;
  runId: string;
  userConProfileId: string;
};

export default function CreateSignupRunCard({
  eventId,
  runId,
  userConProfileId,
}: CreateSignupRunCardProps): React.JSX.Element {
  const { data } = useSuspenseQuery(CreateSignupRunCardQueryDocument, { variables: { eventId, userConProfileId } });
  const confirm = useConfirm();
  const alert = useAlert();

  const createSignup = async (signupOption: SignupOption) => {
    await client.mutate({
      mutation: CreateUserSignupDocument,
      variables: {
        runId,
        userConProfileId,
        requestedBucketKey: signupOption.bucket?.key,
        noRequestedBucket: signupOption.bucket == null,
      },
    });

    await client.resetStore();

    // we never actually want to pop the ticket purchase dialog for this
    return undefined;
  };

  const withdrawSignup = () => {
    confirm({
      prompt: `Are you sure you want to withdraw ${data?.convention.user_con_profile.name_without_nickname} from ${data?.convention.event.title}?`,
      action: async () => {
        await client.mutate({ mutation: WithdrawUserSignupDocument, variables: { runId, userConProfileId } });
        await client.resetStore();
      },
      renderError: (withdrawError) => <ErrorDisplay graphQLError={withdrawError} />,
    });
    return Promise.resolve();
  };

  const run = useMemo(() => data.convention.event.runs.find((r) => r.id === runId), [data, runId]);

  const myPendingRankedChoices = useMemo(
    () => run?.my_signup_ranked_choices.filter((choice) => choice.state === SignupRankedChoiceState.Pending) ?? [],
    [run?.my_signup_ranked_choices],
  );

  const signupOptions = useMemo(
    () =>
      buildSignupOptions(
        data.convention.event,
        run ? SignupCountData.fromRun(run) : new SignupCountData([]),
        false,
        myPendingRankedChoices,
        data.convention.user_con_profile.signup_constraints,
        data.convention.user_con_profile,
      ),
    [data, run, myPendingRankedChoices],
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
}
