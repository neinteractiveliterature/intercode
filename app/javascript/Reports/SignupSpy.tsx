import SignupSpyTable from './SignupSpyTable';
import usePageTitle from '../usePageTitle';
import { SignupCountsByStateQueryData, SignupCountsByStateQueryDocument } from './queries.generated';
import { SignupState } from '../graphqlTypes.generated';
import { LoaderFunction, useLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<SignupCountsByStateQueryData>({ query: SignupCountsByStateQueryDocument });
  return data;
};

function SignupSpy() {
  const data = useLoaderData() as SignupCountsByStateQueryData;
  const getSignupCount = (state: SignupState) =>
    (
      data.convention.signup_counts_by_state.find((record) => record.state === state) || {
        count: 0,
      }
    ).count;

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
}

export default SignupSpy;
