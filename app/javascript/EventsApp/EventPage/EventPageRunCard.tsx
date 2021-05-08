import { useMemo, useCallback, useContext } from 'react';
import { ApolloCache, useApolloClient } from '@apollo/client';
import { useTranslation, Trans } from 'react-i18next';

import { EventPageQuery } from './queries';
import RunCard from './RunCard';
import buildSignupOptions, { SignupOption } from './buildSignupOptions';
import AppRootContext from '../../AppRootContext';
import { useConfirm } from '../../ModalDialogs/Confirm';
import ErrorDisplay from '../../ErrorDisplay';
import useModal from '../../ModalDialogs/useModal';
import CreateModeratedSignupModal from './CreateModeratedSignupModal';
import { EventPageQueryData, EventPageQueryVariables } from './queries.generated';
import {
  useCreateMySignupMutation,
  useWithdrawMySignupMutation,
  useWithdrawSignupRequestMutation,
} from './mutations.generated';

function updateCacheAfterSignup(
  cache: ApolloCache<any>,
  event: EventPageQueryData['event'],
  run: EventPageQueryData['event']['runs'][0],
  signup: EventPageQueryData['event']['runs'][0]['my_signups'][0],
) {
  const data = cache.readQuery<EventPageQueryData, EventPageQueryVariables>({
    query: EventPageQuery,
    variables: { eventId: event.id },
  });
  if (!data) {
    return;
  }

  cache.writeQuery({
    query: EventPageQuery,
    variables: { eventId: event.id },
    data: {
      ...data,
      event: {
        ...data.event,
        runs: data.event.runs.map((eventRun) => {
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
  });
}

export type EventPageRunCardProps = {
  event: EventPageQueryData['event'];
  run: EventPageQueryData['event']['runs'][0];
  myProfile: EventPageQueryData['myProfile'];
  currentAbility: EventPageQueryData['currentAbility'];
};

function EventPageRunCard({ event, run, myProfile, currentAbility }: EventPageRunCardProps) {
  const { t } = useTranslation();
  const { signupMode } = useContext(AppRootContext);
  const signupOptions = useMemo(() => buildSignupOptions(event, myProfile ?? undefined), [
    event,
    myProfile,
  ]);
  const confirm = useConfirm();
  const createModeratedSignupModal = useModal<{ signupOption: SignupOption }>();
  const mySignup = run.my_signups.find((signup) => signup.state !== 'withdrawn');
  const myPendingSignupRequest = run.my_signup_requests.find(
    (signupRequest) => signupRequest.state === 'pending',
  );
  const [createMySignupMutate] = useCreateMySignupMutation();
  const [withdrawMySignupMutate] = useWithdrawMySignupMutation();
  const [withdrawSignupRequestMutate] = useWithdrawSignupRequestMutation();
  const apolloClient = useApolloClient();

  const selfServiceSignup = useCallback(
    async (signupOption) => {
      await createMySignupMutate({
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

      await apolloClient.resetStore();
    },
    [apolloClient, createMySignupMutate, event, run],
  );

  const selfServiceWithdraw = useCallback(
    () =>
      confirm({
        prompt: t(
          'events.withdrawPrompt.selfServiceSignup',
          'Are you sure you want to withdraw from {{ eventTitle }}?',
          { eventTitle: event.title },
        ),
        action: async () => {
          await withdrawMySignupMutate({ variables: { runId: run.id } });
          await apolloClient.resetStore();
        },
        renderError: (error) => <ErrorDisplay graphQLError={error} />,
      }),
    [apolloClient, confirm, event.title, run.id, withdrawMySignupMutate, t],
  );

  const moderatedWithdraw = useCallback(
    () =>
      confirm({
        prompt: (
          <Trans i18nKey="events.withdrawPrompt.moderatedSignup">
            <p>
              <strong>
                If you’re thinking of signing up for a different event instead, please go to that
                event’s page and request to sign up for it.
              </strong>{' '}
              If the request is accepted, you’ll automatically be withdrawn from this event.
            </p>
            <p className="mb-0">
              Are you sure you want to withdraw from {{ eventTitle: event.title }}
              {'? '}
            </p>
          </Trans>
        ),
        action: () => withdrawMySignupMutate({ variables: { runId: run.id } }),
        renderError: (error) => <ErrorDisplay graphQLError={error} />,
      }),
    [confirm, event.title, run.id, withdrawMySignupMutate],
  );

  const createSignup = (signupOption: SignupOption) => {
    if (signupMode === 'self_service' || signupOption.teamMember) {
      return selfServiceSignup(signupOption);
    }

    if (signupMode === 'moderated') {
      createModeratedSignupModal.open({ signupOption });
    }

    return Promise.reject(new Error(`Invalid signup mode: ${signupMode}`));
  };

  const withdrawSignup = () => {
    if (signupMode === 'self_service') {
      selfServiceWithdraw();
      return Promise.resolve();
    }

    if (signupMode === 'moderated') {
      moderatedWithdraw();
      return Promise.resolve();
    }

    return Promise.reject(new Error(`Invalid signup mode: ${signupMode}`));
  };

  const withdrawPendingSignupRequest = () => {
    confirm({
      prompt: t(
        'events.withdrawPrompt.signupRequest',
        'Are you sure you want to withdraw your request to sign up for {{ eventTitle }}?',
        { eventTitle: event.title },
      ),
      action: () => withdrawSignupRequestMutate({ variables: { id: myPendingSignupRequest!.id } }),
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
        withdrawSignup={withdrawSignup}
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
