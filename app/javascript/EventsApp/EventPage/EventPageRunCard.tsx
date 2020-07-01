import React, { useMemo, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import { DataProxy } from 'apollo-cache';

import RunCard from './RunCard';
import buildEventUrl from '../buildEventUrl';
import buildSignupOptions, { SignupOption } from './buildSignupOptions';
import AppRootContext from '../../AppRootContext';
import { useConfirm } from '../../ModalDialogs/Confirm';
import ErrorDisplay from '../../ErrorDisplay';
import useModal from '../../ModalDialogs/useModal';
import CreateModeratedSignupModal from './CreateModeratedSignupModal';
import {
  EventPageEventFieldsFragment, EventPageRunFieldsFragment, EventPageQueryDocument,
  EventPageQueryQuery,
} from './queries.generated';
import { useWithdrawMySignupMutation, useCreateMySignupMutation, useWithdrawSignupRequestMutation } from './mutations.generated';

function updateCacheAfterSignup(
  cache: DataProxy,
  event: EventPageEventFieldsFragment,
  run: EventPageRunFieldsFragment,
  signup: EventPageRunFieldsFragment['my_signups'][0],
) {
  const data = cache.readQuery<EventPageQueryQuery>({
    query: EventPageQueryDocument,
    variables: { eventId: event.id },
  });
  const runData = data?.event?.runs?.find((eventRun) => eventRun.id === run.id);
  if (!runData) {
    return;
  }

  runData.my_signups.push(signup);

  cache.writeQuery({
    query: EventPageQueryDocument,
    variables: { eventId: event.id },
    data,
  });
}

export type EventPageRunCardProps = {
  event: EventPageEventFieldsFragment,
  run: EventPageRunFieldsFragment,
  myProfile: any,
  [otherProp: string]: any,
};

function EventPageRunCard({
  event, run, myProfile, ...otherProps
}: EventPageRunCardProps) {
  const { signupMode } = useContext(AppRootContext);
  const signupOptions = useMemo(
    () => buildSignupOptions(event, myProfile),
    [event, myProfile],
  );
  const confirm = useConfirm();
  const createModeratedSignupModal = useModal<{ signupOption: SignupOption }>();
  const eventPath = buildEventUrl(event);
  const mySignup = run.my_signups.find((signup) => signup.state !== 'withdrawn');
  const myPendingSignupRequest = run.my_signup_requests
    .find((signupRequest) => signupRequest.state === 'pending');
  const [createMySignupMutate] = useCreateMySignupMutation();
  const [withdrawMySignupMutate] = useWithdrawMySignupMutation();
  const [withdrawSignupRequestMutate] = useWithdrawSignupRequestMutation();
  const apolloClient = useApolloClient();

  const selfServiceSignup = useCallback(
    async (signupOption: SignupOption) => {
      await createMySignupMutate({
        variables: {
          runId: run.id,
          requestedBucketKey: signupOption.bucket?.key,
          noRequestedBucket: signupOption.bucket == null,
        },
        update: (cache, result) => {
          const signup = result?.data?.createMySignup?.signup;
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
    () => confirm({
      prompt: `Are you sure you want to withdraw from ${event.title}?`,
      action: async () => {
        await withdrawMySignupMutate({ variables: { runId: run.id } });
        await apolloClient.resetStore();
      },
      renderError: (error) => <ErrorDisplay graphQLError={error} />,
    }),
    [apolloClient, confirm, event.title, run.id, withdrawMySignupMutate],
  );

  const moderatedWithdraw = useCallback(
    () => confirm({
      prompt: (
        <>
          <p>
            <strong>
              If you’re thinking of signing up for a different event instead, please
              go to that event’s page and request to sign up for it.
            </strong>
            {' '}
            If the request is
            accepted, you’ll automatically be withdrawn from this event.
          </p>
          <p className="mb-0">
            Are you sure you want to withdraw from
            {' '}
            {event.title}
            {'? '}
          </p>
        </>
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

    return null;
  };

  const withdrawSignup = () => {
    if (signupMode === 'self_service') {
      return selfServiceWithdraw();
    }

    if (signupMode === 'moderated') {
      return moderatedWithdraw();
    }

    return null;
  };

  const withdrawPendingSignupRequest = () => confirm({
    prompt: `Are you sure you want to withdraw your request to sign up for ${event.title}?`,
    action: () => withdrawSignupRequestMutate({ variables: { id: myPendingSignupRequest?.id! } }),
    renderError: (error) => <ErrorDisplay graphQLError={error} />,
  });

  return (
    <div>
      <RunCard
        run={run}
        event={event}
        eventPath={eventPath}
        mySignup={mySignup}
        myPendingSignupRequest={myPendingSignupRequest}
        myProfile={myProfile}
        signupOptions={signupOptions}
        showViewSignups
        createSignup={createSignup}
        withdrawSignup={withdrawSignup}
        withdrawPendingSignupRequest={withdrawPendingSignupRequest}
        {...otherProps}
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

EventPageRunCard.propTypes = {
  event: PropTypes.shape({}).isRequired,
  run: PropTypes.shape({
    my_signups: PropTypes.arrayOf(PropTypes.shape({
      state: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  myProfile: PropTypes.shape({}).isRequired,
};

export default EventPageRunCard;
