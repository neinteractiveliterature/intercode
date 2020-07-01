import React, { useContext, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';

import ErrorDisplay from '../../ErrorDisplay';
import RunCapacityGraph from './RunCapacityGraph';
import SignupButtons from './SignupButtons';
import { timespanFromRun } from '../../TimespanUtils';
import ViewSignupsOptions from './ViewSignupsOptions';
import AppRootContext from '../../AppRootContext';
import useAsyncFunction from '../../useAsyncFunction';
import WithdrawSignupButton from './WithdrawSignupButton';
import LoadingIndicator from '../../LoadingIndicator';
import AuthenticationModalContext from '../../Authentication/AuthenticationModalContext';
import { PartitionedSignupOptions } from './buildSignupOptions';
import { lowercaseMeridiem } from '../../TimeUtils';

export type RunCardProps = {
  run: {
    id: number,
    title_suffix?: string,
    rooms: { name: string }[],
  },
  event: { id: number },
  signupOptions: PartitionedSignupOptions,
};

function RunCard({
  run, event, signupOptions, currentAbility, myProfile, mySignup, myPendingSignupRequest,
  showViewSignups, createSignup, withdrawSignup, withdrawPendingSignupRequest,
}) {
  const history = useHistory();
  const location = useLocation();
  const { siteMode, timezoneName } = useContext(AppRootContext);
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (history.location.hash === `#run-${run.id}`) {
      cardRef.current?.scrollIntoView(false);
    }
  }, [history.location.hash, run.id]);
  const [signupButtonClicked, signupError, mutationInProgress] = useAsyncFunction(createSignup);
  const { setAfterSignInPath, open: openAuthenticationModal } = useContext(
    AuthenticationModalContext,
  );

  const renderMainSignupSection = () => {
    if (!myProfile) {
      return (
        <button
          type="button"
          onClick={() => {
            setAfterSignInPath(location.pathname);
            openAuthenticationModal({ currentView: 'signIn' });
          }}
          className="btn btn-outline-primary"
          style={{ whiteSpace: 'normal' }}
        >
          <strong>Log in</strong>
          {' '}
          to sign up for
          <br />
          <em>{event.title}</em>
        </button>
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
            <WithdrawSignupButton withdrawSignup={withdrawSignup} />
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
          signupOptions={signupOptions.mainPreference}
          disabled={mutationInProgress}
          onClick={signupButtonClicked}
        />
        <SignupButtons
          signupOptions={signupOptions.mainNoPreference}
          disabled={mutationInProgress}
          onClick={signupButtonClicked}
        />
        {mutationInProgress && <LoadingIndicator />}
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
            signupOptions={signupOptions.auxiliary}
            disabled={mutationInProgress}
            onClick={signupButtonClicked}
          />
        </li>
      </ul>
    );
  };

  const runTimespan = timespanFromRun(timezoneName, event, run);
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
              {lowercaseMeridiem(runTimespan.start.toFormat('EEE h:mma'))}
              -
              {lowercaseMeridiem(runTimespan.finish.toFormat('h:mma'))}
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
                {renderMainSignupSection()}
              </div>

              {renderAuxiliarySignupSection()}

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

export default RunCard;
