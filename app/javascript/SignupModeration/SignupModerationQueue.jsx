import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';
import moment from 'moment-timezone';

import AppRootContext from '../AppRootContext';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import { SignupModerationQueueQuery } from './queries.gql';
import { timespanFromRun } from '../TimespanUtils';

function signupRequestStateBadgeClass(state) {
  switch (state) {
    case 'accepted': return 'badge-success';
    case 'rejected': return 'badge-danger';
    case 'pending': return 'badge-info';
    case 'withdrawn': return 'badge-dark';
    default: return 'badge-light';
  }
}

function SignupModerationRunDetails({ run, showRequestedBucket, requestedBucketKey }) {
  const { timezoneName } = useContext(AppRootContext);
  const runTimespan = timespanFromRun({ timezone_name: timezoneName }, run.event, run);

  return (
    <>
      {run.event.title}
      {run.title_suffix && `(${run.title_suffix})`}
      <br />
      {showRequestedBucket && (
        <>
          <small>
            <strong>Bucket:</strong>
            {' '}
            {(
              run.event.registration_policy.buckets
                .find(bucket => bucket.key === requestedBucketKey)
              || {}
            ).name || 'No preference'}
          </small>
        </>
      )}
      <small>
        {runTimespan.humanizeInTimezone(timezoneName)}
      </small>
    </>
  );
}

SignupModerationRunDetails.propTypes = {
  run: PropTypes.shape({
    event: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    title_suffix: PropTypes.string,
  }).isRequired,
  showRequestedBucket: PropTypes.bool,
  requestedBucketKey: PropTypes.string,
};

SignupModerationRunDetails.defaultProps = {
  showRequestedBucket: false,
  requestedBucketKey: null,
};

function SignupModerationQueue() {
  const { timezoneName } = useContext(AppRootContext);
  const { data, loading, error } = useQuery(SignupModerationQueueQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <table className="table table-striped mt-4">
      <thead>
        <tr>
          <th>Attendee</th>
          <th>Request</th>
          <th>Status</th>
          <th>Submitted at</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {data.convention.signup_requests_paginated.entries.map(signupRequest => (
          <tr key={signupRequest.id}>
            <td>{signupRequest.user_con_profile.name}</td>
            <td>
              {signupRequest.replace_signup && (
                <p>
                  <strong className="text-danger">Withdraw from</strong>
                  {' '}
                  <SignupModerationRunDetails run={signupRequest.replace_signup.run} />
                </p>
              )}
              <strong className="text-success">
                {signupRequest.replace_signup ? 'And sign up for' : 'Sign up for'}
              </strong>
              {' '}
              <SignupModerationRunDetails run={signupRequest.target_run} />
              <br />
              <small>
                <strong>Requested bucket:</strong>
                {' '}
                {signupRequest.requested_bucket_key
                  ? (
                    signupRequest.target_run.event.registration_policy.buckets
                      .find(bucket => bucket.key === signupRequest.requested_bucket_key)
                    || {}).name
                  : 'No preference'
                }
              </small>
            </td>
            <td>
              <div className={`badge ${signupRequestStateBadgeClass(signupRequest.state)}`}>
                {signupRequest.state}
              </div>
            </td>
            <td>
              <small>
                {moment.tz(signupRequest.created_at, timezoneName).format('ddd, MMM D, YYYY [at] h:mma')}
              </small>
            </td>
            <td className="text-right">
              {signupRequest.state === 'pending' && (
                <>
                  <button className="btn btn-sm btn-danger mr-2" type="button">
                    Reject
                  </button>

                  <button className="btn btn-sm btn-success" type="button">
                    Accept
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SignupModerationQueue;
