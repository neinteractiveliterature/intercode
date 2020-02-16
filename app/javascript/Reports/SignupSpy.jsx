import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { SignupCountsByStateQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import SignupSpyTable from './SignupSpyTable';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function SignupSpy() {
  const { data, loading, error } = useQuery(SignupCountsByStateQuery);

  const getSignupCount = (state) => {
    if (error || loading) {
      return 0;
    }

    return (
      data.convention.signup_counts_by_state.find((record) => record.state === state)
      || { count: 0 }
    ).count;
  };

  usePageTitle('Signup spy');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4">Signup spy</h1>
      <ul className="list-unstyled">
        <li>
          <strong>Total signups:</strong>
          {' '}
          {getSignupCount('confirmed') + getSignupCount('waitlisted')}
          {' (confirmed + waitlisted)'}
        </li>
        <li>
          <ul className="list-inline">
            <li className="list-inline-item">
              <strong>Confirmed:</strong>
              {' '}
              {getSignupCount('confirmed')}
            </li>
            <li className="list-inline-item">
              <strong>Waitlisted:</strong>
              {' '}
              {getSignupCount('waitlisted')}
            </li>
            <li className="list-inline-item">
              <strong>Withdrawn:</strong>
              {' '}
              {getSignupCount('withdrawn')}
            </li>
          </ul>
        </li>
      </ul>
      <SignupSpyTable exportUrl="/reports/export_signup_spy.csv" />
    </>
  );
}

export default SignupSpy;
