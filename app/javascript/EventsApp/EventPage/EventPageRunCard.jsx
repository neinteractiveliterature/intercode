import React, { useMemo, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';

import { CreateMySignup, WithdrawMySignup } from './mutations.gql';
import { EventPageQuery } from './queries.gql';
import RunCard from './RunCard';
import buildEventUrl from '../buildEventUrl';
import buildSignupOptions from './buildSignupOptions';
import useMutationCallback from '../../useMutationCallback';
import AppRootContext from '../../AppRootContext';
import { useConfirm } from '../../ModalDialogs/Confirm';
import ErrorDisplay from '../../ErrorDisplay';

function updateCacheAfterSignup(cache, event, run, signup) {
  const data = cache.readQuery({ query: EventPageQuery, variables: { eventId: event.id } });
  const runData = data.event.runs.find(eventRun => eventRun.id === run.id);
  runData.my_signups.push(signup);

  cache.writeQuery({
    query: EventPageQuery,
    variables: { eventId: event.id },
    data,
  });
}

function EventPageRunCard({
  event, run, myProfile, ...otherProps
}) {
  const { signupMode } = useContext(AppRootContext);
  const signupOptions = useMemo(
    () => buildSignupOptions(event, myProfile),
    [event, myProfile],
  );
  const confirm = useConfirm();
  const eventPath = buildEventUrl(event);
  const mySignup = run.my_signups.find(signup => signup.state !== 'withdrawn');
  const createMySignupMutate = useMutationCallback(CreateMySignup);
  const withdrawMySignupMutate = useMutationCallback(WithdrawMySignup);

  const selfServiceSignup = useCallback(
    signupOption => createMySignupMutate({
      variables: {
        runId: run.id,
        requestedBucketKey: (signupOption.bucket || {}).key,
        noRequestedBucket: signupOption.bucket == null,
      },
      update: (cache, { data: { createMySignup: { signup } } }) => {
        updateCacheAfterSignup(cache, event, run, signup);
      },
    }),
    [createMySignupMutate, event, run],
  );

  const selfServiceWithdraw = useCallback(
    () => confirm({
      prompt: `Are you sure you want to withdraw from ${event.title}?`,
      action: () => withdrawMySignupMutate({ variables: { runId: run.id } }),
      renderError: error => <ErrorDisplay graphQLError={error} />,
    }),
    [confirm, event.title, run.id, withdrawMySignupMutate],
  );

  const createSignup = (signupOption) => {
    if (signupMode === 'self_service') {
      return selfServiceSignup(signupOption);
    }
  };

  const withdrawSignup = () => {
    if (signupMode === 'self_service') {
      return selfServiceWithdraw();
    }
  };

  return (
    <RunCard
      run={run}
      event={event}
      eventPath={eventPath}
      mySignup={mySignup}
      myProfile={myProfile}
      signupOptions={signupOptions}
      showViewSignups
      createSignup={createSignup}
      withdrawSignup={withdrawSignup}
      {...otherProps}
    />
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
