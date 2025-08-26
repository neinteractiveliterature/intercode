import { useMemo, useCallback, useContext } from 'react';
import { ApolloCache } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useModal, useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import RunCard from './RunCard';
import buildSignupOptions, { SignupOption } from './buildSignupOptions';
import AppRootContext from '../../AppRootContext';
import CreateModeratedSignupModal from './CreateModeratedSignupModal';
import { EventPageQueryData, EventPageQueryDocument } from './queries.generated';
import { SignupMode, SignupRankedChoiceState } from '../../graphqlTypes.generated';
import SignupCountData from '../SignupCountData';
import {
  CreateMySignupDocument,
  CreateSignupRankedChoiceDocument,
  WithdrawSignupRequestDocument,
} from './mutations.generated';
import { client } from '../../useIntercodeApolloClient';
import { useRevalidator } from 'react-router';
import { useWithdrawMySignupModal } from './WithdrawMySignupModal';

function updateCacheAfterSignup(
  cache: ApolloCache<unknown>,
  event: EventPageQueryData['convention']['event'],
  run: EventPageQueryData['convention']['event']['runs'][0],
  signup: EventPageQueryData['convention']['event']['runs'][0]['my_signups'][0],
) {
  const data = cache.readQuery({
    query: EventPageQueryDocument,
    variables: { eventId: event.id },
  });
  if (!data) {
    return;
  }

  cache.writeQuery({
    query: EventPageQueryDocument,
    variables: { eventId: event.id },
    data: {
      ...data,
      convention: {
        ...data.convention,
        event: {
          ...data.convention.event,
          runs: data.convention.event.runs.map((eventRun) => {
            if (eventRun.id === run.id) {
              return {
                ...eventRun,
                my_signups: [...eventRun.my_signups, signup],
              };
            }

            return eventRun;
          }),
        },
      },
    },
  });
}

export type EventPageRunCardProps = {
  event: EventPageQueryData['convention']['event'];
  run: EventPageQueryData['convention']['event']['runs'][0];
  myProfile: EventPageQueryData['convention']['my_profile'];
  signupRounds: EventPageQueryData['convention']['signup_rounds'];
  currentAbility: EventPageQueryData['currentAbility'];
  addToQueue: boolean;
};

function EventPageRunCard({
  event,
  run,
  myProfile,
  currentAbility,
  signupRounds,
  addToQueue,
}: EventPageRunCardProps): React.JSX.Element {
  const { t } = useTranslation();
  const { signupMode } = useContext(AppRootContext);
  const myPendingRankedChoices = useMemo(
    () => run.my_signup_ranked_choices.filter((choice) => choice.state === SignupRankedChoiceState.Pending),
    [run.my_signup_ranked_choices],
  );
  const signupOptions = useMemo(
    () =>
      buildSignupOptions(
        event,
        SignupCountData.fromRun(run),
        addToQueue,
        myPendingRankedChoices,
        myProfile?.signup_constraints ?? { at_maximum_signups: false },
        myProfile ?? undefined,
      ),
    [event, run, myProfile, addToQueue, myPendingRankedChoices],
  );
  const confirm = useConfirm();
  const createModeratedSignupModal = useModal<{ signupOption: SignupOption }>();
  const mySignup = run.my_signups.find((signup) => signup.state !== 'withdrawn');
  const myPendingSignupRequest = run.my_signup_requests.find((signupRequest) => signupRequest.state === 'pending');
  const revalidator = useRevalidator();
  const withdrawMySignupModal = useWithdrawMySignupModal();

  const selfServiceSignup = useCallback(
    async (signupOption: SignupOption) => {
      if (signupOption.action === 'ADD_TO_QUEUE') {
        await client.mutate({
          mutation: CreateSignupRankedChoiceDocument,
          variables: {
            targetRunId: run.id,
            requestedBucketKey: signupOption.bucket?.key,
          },
        });

        revalidator.revalidate();
        window.requestAnimationFrame(async () => {
          await client.resetStore();
          revalidator.revalidate();
        });
      } else {
        const response = await client.mutate({
          mutation: CreateMySignupDocument,
          variables: {
            runId: run.id,
            requestedBucketKey: (signupOption.bucket || {}).key,
            noRequestedBucket: signupOption.bucket == null,
          },
          update: (cache, { data }) => {
            const signup = data?.createMySignup?.signup;
            if (signup) {
              updateCacheAfterSignup(cache, event, run, signup);
            }
          },
        });

        revalidator.revalidate();
        window.requestAnimationFrame(async () => {
          await client.resetStore();
          revalidator.revalidate();
        });
        return response.data?.createMySignup.signup;
      }
    },
    [event, run, revalidator],
  );

  const createSignup = (signupOption: SignupOption) => {
    if (signupMode === SignupMode.SelfService || signupOption.action === 'ADD_TO_QUEUE' || signupOption.teamMember) {
      return selfServiceSignup(signupOption);
    }

    if (signupMode === SignupMode.Moderated) {
      createModeratedSignupModal.open({ signupOption });
      return Promise.resolve(undefined);
    }

    return Promise.reject(new Error(`Invalid signup mode: ${signupMode}`));
  };

  const withdrawPendingSignupRequest = () => {
    if (!myPendingSignupRequest) {
      return Promise.reject(new Error('No pending signup request to withdraw'));
    }

    confirm({
      prompt: t('events.withdrawPrompt.signupRequest', { eventTitle: event.title }),
      action: async () => {
        await client.mutate({ mutation: WithdrawSignupRequestDocument, variables: { id: myPendingSignupRequest.id } });
        revalidator.revalidate();
      },
      renderError: (error) => <ErrorDisplay graphQLError={error} />,
    });

    return Promise.resolve();
  };

  return (
    <div>
      <RunCard
        run={run}
        event={event}
        currentAbility={currentAbility}
        mySignup={mySignup}
        myPendingSignupRequest={myPendingSignupRequest}
        myProfile={myProfile}
        signupOptions={signupOptions}
        showViewSignups
        createSignup={createSignup}
        withdrawSignup={() => {
          if (mySignup) {
            withdrawMySignupModal.openModal({ signup: mySignup, event, run, signupRounds });
          }
        }}
        withdrawPendingSignupRequest={withdrawPendingSignupRequest}
      />

      {signupMode === 'moderated' && (
        <CreateModeratedSignupModal
          close={createModeratedSignupModal.close}
          visible={createModeratedSignupModal.visible}
          signupOption={createModeratedSignupModal.state?.signupOption}
          event={event}
          run={run}
        />
      )}

      <withdrawMySignupModal.Component />
    </div>
  );
}

export default EventPageRunCard;
