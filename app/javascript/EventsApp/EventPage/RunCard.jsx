import React, { useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

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

function describeSignupState(mySignup, t) {
  if (mySignup.state === 'confirmed') {
    return t('signups.runCardText.confirmed', 'You are signed up.');
  }

  if (mySignup.waitlist_position) {
    return t(
      'signups.runCardText.waitlisted',
      'You are #{{ waitlistNumber }} on the waitlist.',
      { waitlistPosition: mySignup.waitlist_position },
    );
  }

  return t('signups.runCardText.waitlistedUnknownPosition', 'You are on the waitlist.');
}

function RunCard({
  run, event, signupOptions, currentAbility, myProfile, mySignup, myPendingSignupRequest,
  showViewSignups, createSignup, withdrawSignup, withdrawPendingSignupRequest,
}) {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const { siteMode, timezoneName } = useContext(AppRootContext);
  const cardRef = useRef(null);
  useEffect(() => {
    if (history.location.hash === `#run-${run.id}`) {
      cardRef.current.scrollIntoView(false);
    }
  }, [history.location.hash, run.id]);
  const [signupButtonClicked, signupError, mutationInProgress] = useAsyncFunction(createSignup);
  const {
    setAfterSignInPath, open: openAuthenticationModal,
  } = useContext(AuthenticationModalContext);

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
          <Trans i18nKey="signups.signedOutSignupButton">
            <strong>Log in</strong>
            {' '}
            to sign up for
            <br />
            <em>{{ eventTitle: event.title }}</em>
          </Trans>
        </button>
      );
    }

    if (mySignup) {
      return (
        <>
          <em>
            {describeSignupState(mySignup, t)}
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
          <em>
            {t('signups.runCardText.requestPending', 'You have requested to sign up for this event.')}
          </em>
          <p className="mb-0">
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={withdrawPendingSignupRequest}
            >
              {t('signups.withdrawSignupRequestButton', 'Withdraw signup request')}
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
              -
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
              <small>{t('signups.noSignupsAvailable', 'This event does not take signups.')}</small>
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

export default RunCard;
