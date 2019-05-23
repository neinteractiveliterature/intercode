import React, {
  useContext, useRef, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import { CreateMySignup } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { EventPageQuery } from './queries.gql';
import RunCapacityGraph from './RunCapacityGraph';
import SignupButtons from './SignupButtons';
import { timespanFromRun } from '../../TimespanUtils';
import ViewSignupsOptions from './ViewSignupsOptions';
import WithdrawMySignupButton from './WithdrawMySignupButton';
import AppRootContext from '../../AppRootContext';
import useMutationCallback from '../../useMutationCallback';
import useAsyncFunction from '../../useAsyncFunction';

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

function RunCard({
  run, event, history, eventPath, signupOptions, timezoneName, currentAbility, myProfile,
}) {
  const { siteMode } = useContext(AppRootContext);
  const cardRef = useRef(null);
  useEffect(() => {
    if (history.location.hash === `#run-${run.id}`) {
      cardRef.current.scrollIntoView(false);
    }
  }, [history.location.hash, run.id]);
  const [createMySignupMutate, signupError, mutationInProgress] = useAsyncFunction(
    useMutationCallback(CreateMySignup),
  );

  const signupButtonClicked = useCallback(
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

  const renderMainSignupSection = () => {
    const mySignup = run.my_signups.find(signup => signup.state !== 'withdrawn');

    if (!myProfile) {
      return (
        <a
          href={`/users/sign_in?user_return_to=${window.location.href}`}
          className="btn btn-outline-primary"
          style={{ whiteSpace: 'normal' }}
        >
          <strong>Log in</strong>
          {' '}
          to sign up for
          <br />
          <em>{event.title}</em>
        </a>
      );
    }

    if (mySignup) {
      return (
        <>
          <em>
            {
              mySignup.state === 'confirmed'
                ? 'You are signed up.'
                : `You are #${mySignup.waitlist_position} on the waitlist.`
            }
          </em>
          <p className="mb-0">
            <WithdrawMySignupButton run={run} event={event} />
          </p>
        </>
      );
    }

    return (
      <>
        <SignupButtons
          event={event}
          run={run}
          signupOptions={signupOptions.mainPreference}
          disabled={mutationInProgress}
          onClick={signupButtonClicked}
        />
        <SignupButtons
          event={event}
          run={run}
          signupOptions={signupOptions.mainNoPreference}
          disabled={mutationInProgress}
          onClick={signupButtonClicked}
        />
        <ErrorDisplay graphQLError={signupError} />
      </>
    );
  };

  const renderAuxiliarySignupSection = () => {
    const mySignup = run.my_signups.find(signup => signup.state !== 'withdrawn');

    if (!myProfile || mySignup || signupOptions.auxiliary.length === 0) {
      return null;
    }

    return (
      <ul className="list-group list-group-flush">
        <li className="list-group-item border-bottom-0">
          <SignupButtons
            event={event}
            run={run}
            signupOptions={signupOptions.auxiliary}
            disabled={mutationInProgress}
            onClick={signupButtonClicked}
          />
        </li>
      </ul>
    );
  };

  const runTimespan = timespanFromRun({ timezone_name: timezoneName }, event, run);
  const acceptsSignups = (
    !event.registration_policy.slots_limited
    || event.registration_policy.total_slots_including_not_counted > 0
  );

  return (
    <div
      ref={cardRef}
      className={classNames(
        'card run-card',
        { 'glow-success': history.location.hash === `#run-${run.id}` },
      )}
      id={`run-${run.id}`}
    >
      {(siteMode !== 'single_event' || event.runs.length !== 1) && (
        <div className="card-header">
          {
            run.title_suffix
              ? (
                <p>
                  <strong>{run.title_suffix}</strong>
                </p>
              )
              : null
          }

          {runTimespan.start.format('ddd h:mma')}
          {'-'}
          {runTimespan.finish.format('h:mma')}

          <br />
          {run.rooms.map(room => room.name).sort().join(', ')}
        </div>
      )}
      {
        acceptsSignups
          ? (
            <>
              <div className="card-body text-center">
                <RunCapacityGraph run={run} event={event} signupsAvailable />
                {renderMainSignupSection(signupButtonClicked)}
              </div>

              {renderAuxiliarySignupSection(signupButtonClicked)}

              <ViewSignupsOptions
                event={event}
                eventPath={eventPath}
                run={run}
                currentAbility={currentAbility}
              />
            </>
          )
          : (
            <div className="card-body">
              <small>This event does not take signups.</small>
            </div>
          )
      }
    </div>
  );
}

RunCard.propTypes = {
  run: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title_suffix: PropTypes.string,
    my_signups: PropTypes.arrayOf(PropTypes.shape({
      state: PropTypes.string.isRequired,
    })).isRequired,
    rooms: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    location: PropTypes.shape({
      hash: PropTypes.string,
    }).isRequired,
  }).isRequired,
  eventPath: PropTypes.string.isRequired,
  signupOptions: PropTypes.shape({
    mainPreference: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    mainNoPreference: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    auxiliary: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  timezoneName: PropTypes.string.isRequired,
  currentAbility: PropTypes.shape({}).isRequired,
  myProfile: PropTypes.shape({}),
};

RunCard.defaultProps = {
  myProfile: null,
};

export default withRouter(RunCard);
