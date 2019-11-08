import React, { useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import ErrorDisplay from '../../ErrorDisplay';
import RunCapacityGraph from './RunCapacityGraph';
import SignupButtons from './SignupButtons';
import { timespanFromRun } from '../../TimespanUtils';
import ViewSignupsOptions from './ViewSignupsOptions';
import AppRootContext from '../../AppRootContext';
import useAsyncFunction from '../../useAsyncFunction';
import WithdrawSignupButton from './WithdrawSignupButton';

function RunCard({
  run, event, history, signupOptions, currentAbility, myProfile, mySignup, myPendingSignupRequest,
  showViewSignups, createSignup, withdrawSignup, withdrawPendingSignupRequest,
}) {
  const { siteMode, timezoneName } = useContext(AppRootContext);
  const cardRef = useRef(null);
  useEffect(() => {
    if (history.location.hash === `#run-${run.id}`) {
      cardRef.current.scrollIntoView(false);
    }
  }, [history.location.hash, run.id]);
  const [signupButtonClicked, signupError, mutationInProgress] = useAsyncFunction(createSignup);

  const renderMainSignupSection = () => {
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
                : `You are ${mySignup.waitlist_position ? `#${mySignup.waitlist_position}` : ''} on the waitlist.`
            }
          </em>
          <p className="mb-0">
            <WithdrawSignupButton run={run} event={event} withdrawSignup={withdrawSignup} />
          </p>
        </>
      );
    }

    if (myPendingSignupRequest) {
      return (
        <>
          <em>You have requested to sign up for this event.</em>
          <p className="mb-0">
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={withdrawPendingSignupRequest}
            >
              Withdraw signup request
            </button>
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

          <div className="d-flex flex-wrap">
            <div className="flex-grow-1">
              {runTimespan.start.format('ddd h:mma')}
              {'-'}
              {runTimespan.finish.format('h:mma')}
            </div>

            <div>
              {run.rooms.map((room) => room.name).sort().join(', ')}
            </div>
          </div>
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

              {showViewSignups && (
                <ViewSignupsOptions
                  event={event}
                  run={run}
                  currentAbility={currentAbility}
                />
              )}
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
  signupOptions: PropTypes.shape({
    mainPreference: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    mainNoPreference: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    auxiliary: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  currentAbility: PropTypes.shape({}).isRequired,
  myProfile: PropTypes.shape({}),
  mySignup: PropTypes.shape({
    state: PropTypes.string.isRequired,
  }),
  myPendingSignupRequest: PropTypes.shape({
    state: PropTypes.string.isRequired,
  }),
  showViewSignups: PropTypes.bool,
  createSignup: PropTypes.func.isRequired,
  withdrawSignup: PropTypes.func.isRequired,
  withdrawPendingSignupRequest: PropTypes.func.isRequired,
};

RunCard.defaultProps = {
  myProfile: null,
  mySignup: null,
  myPendingSignupRequest: null,
  showViewSignups: false,
};

export default withRouter(RunCard);
