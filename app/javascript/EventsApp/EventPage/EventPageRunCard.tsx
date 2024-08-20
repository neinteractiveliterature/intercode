import { useMemo, useCallback, useContext } from 'react';
import { ApolloCache } from '@apollo/client';
import { useTranslation, Trans } from 'react-i18next';
import { useModal, useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import RunCard from './RunCard';
import buildSignupOptions, { SignupOption } from './buildSignupOptions';
import AppRootContext from '../../AppRootContext';
import CreateModeratedSignupModal from './CreateModeratedSignupModal';
import { EventPageQueryData, EventPageQueryDocument, EventPageQueryVariables } from './queries.generated';
import { SignupAutomationMode, SignupMode, SignupRankedChoiceState } from '../../graphqlTypes.generated';
import SignupCountData from '../SignupCountData';
import { parseSignupRounds } from '../../SignupRoundUtils';
import { DateTime } from 'luxon';
import {
  CreateMySignupDocument,
  CreateSignupRankedChoiceDocument,
  WithdrawMySignupDocument,
  WithdrawSignupRequestDocument,
} from './mutations.generated';
import { client } from '../../useIntercodeApolloClient';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TI = any;

function updateCacheAfterSignup(
  cache: ApolloCache<unknown>,
  event: EventPageQueryData['convention']['event'],
  run: EventPageQueryData['convention']['event']['runs'][0],
  signup: EventPageQueryData['convention']['event']['runs'][0]['my_signups'][0],
) {
  const data = cache.readQuery<EventPageQueryData, EventPageQueryVariables>({
    query: EventPageQueryDocument,
    variables: { eventId: event.id },
  });
  if (!data) {
    return;
  }

  cache.writeQuery<EventPageQueryData>({
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
  mySignups: EventPageQueryData['convention']['my_signups'];
  mySignupRequests: EventPageQueryData['convention']['my_signup_requests'];
  signupRounds: EventPageQueryData['convention']['signup_rounds'];
  currentAbility: EventPageQueryData['currentAbility'];
  addToQueue: boolean;
};

function EventPageRunCard({
  event,
  run,
  myProfile,
  mySignups,
  mySignupRequests,
  currentAbility,
  signupRounds,
  addToQueue,
}: EventPageRunCardProps): JSX.Element {
  const { t } = useTranslation();
  const { signupMode, signupAutomationMode } = useContext(AppRootContext);
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
        mySignups,
        mySignupRequests,
        myPendingRankedChoices,
        signupRounds,
        myProfile ?? undefined,
      ),
    [event, run, myProfile, mySignups, mySignupRequests, signupRounds, addToQueue, myPendingRankedChoices],
  );
  const confirm = useConfirm();
  const createModeratedSignupModal = useModal<{ signupOption: SignupOption }>();
  const mySignup = run.my_signups.find((signup) => signup.state !== 'withdrawn');
  const myPendingSignupRequest = run.my_signup_requests.find((signupRequest) => signupRequest.state === 'pending');

  const currentRound = useMemo(() => {
    const parsedRounds = parseSignupRounds(signupRounds);
    const now = DateTime.local();
    return parsedRounds.find((round) => round.timespan.includesTime(now));
  }, [signupRounds]);

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

        await client.resetStore();
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

        await client.resetStore();
        return response.data?.createMySignup.signup;
      }
    },
    [event, run],
  );

  const withdrawPrompt = useMemo(() => {
    if (mySignup && !mySignup.counted) {
      return t('events.withdrawPrompt.notCounted', { eventTitle: event.title });
    } else if (
      signupAutomationMode === SignupAutomationMode.RankedChoice &&
      typeof currentRound?.maximum_event_signups === 'number'
    ) {
      return t('events.withdrawPrompt.duringLimitedRankedChoiceSignupRoundCounted', { eventTitle: event.title });
    } else if (signupMode === 'moderated') {
      return (
        <Trans i18nKey="events.withdrawPrompt.moderatedSignup" values={{ eventTitle: event.title }}>
          <p>
            <strong>
              If you’re thinking of signing up for a different event instead, please go to that event’s page and request
              to sign up for it.
            </strong>{' '}
            If the request is accepted, you’ll automatically be withdrawn from this event.
          </p>
          <p className="mb-0">Are you sure you want to withdraw from {{ eventTitle: event.title } as TI}?</p>
        </Trans>
      );
    } else {
      return t('events.withdrawPrompt.selfServiceSignup', { eventTitle: event.title });
    }
  }, [event.title, mySignup, signupMode, signupAutomationMode, t, currentRound?.maximum_event_signups]);

  const withdraw = useCallback(async () => {
    confirm({
      prompt: withdrawPrompt,
      action: async () => {
        await client.mutate({ mutation: WithdrawMySignupDocument, variables: { runId: run.id } });
        await client.resetStore();
      },
      renderError: (error) => <ErrorDisplay graphQLError={error} />,
    });
  }, [confirm, withdrawPrompt, run.id]);

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
      action: () =>
        client.mutate({ mutation: WithdrawSignupRequestDocument, variables: { id: myPendingSignupRequest.id } }),
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
        withdrawSignup={withdraw}
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
    </div>
  );
}

export default EventPageRunCard;
