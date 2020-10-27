import React from 'react';

import SignupSpyTable from './SignupSpyTable';
import usePageTitle from '../usePageTitle';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';
import { useSignupCountsByStateQueryQuery } from './queries.generated';
import { SignupState } from '../graphqlTypes.generated';

export default LoadQueryWrapper(useSignupCountsByStateQueryQuery, function SignupSpy({ data }) {
  const getSignupCount = (state: SignupState) => {
    return (
      data.convention.signup_counts_by_state.find((record) => record.state === state) || {
        count: 0,
      }
    ).count;
  };

  usePageTitle('Signup spy');

  return (
    <>
      <h1 className="mb-4">Signup spy</h1>
      <ul className="list-unstyled">
        <li>
          <strong>Total signups:</strong>{' '}
          {getSignupCount(SignupState.Confirmed) + getSignupCount(SignupState.Waitlisted)}
          {' (confirmed + waitlisted)'}
        </li>
        <li>
          <ul className="list-inline">
            <li className="list-inline-item">
              <strong>Confirmed:</strong> {getSignupCount(SignupState.Confirmed)}
            </li>
            <li className="list-inline-item">
              <strong>Waitlisted:</strong> {getSignupCount(SignupState.Waitlisted)}
            </li>
            <li className="list-inline-item">
              <strong>Withdrawn:</strong> {getSignupCount(SignupState.Withdrawn)}
            </li>
          </ul>
        </li>
      </ul>
      <SignupSpyTable />
    </>
  );
});
