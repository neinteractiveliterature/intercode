import { useMemo } from 'react';

import buildSignupOptions from '../EventsApp/EventPage/buildSignupOptions';
import RunCapacityGraph from '../EventsApp/EventPage/RunCapacityGraph';
import SignupButtons from '../EventsApp/EventPage/SignupButtons';
import { RegistrationPolicyForRegistrationPolicyUtils } from './RegistrationPolicy';

export type RegistrationPolicyPreviewProps = {
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils;
};

function RegistrationPolicyPreview({ registrationPolicy }: RegistrationPolicyPreviewProps): JSX.Element {
  const registrationPolicyForDisplay = useMemo(() => {
    const { buckets, ...otherProps } = registrationPolicy;
    return {
      __typename: 'RegistrationPolicy' as const,
      buckets: buckets.map((bucket) => ({
        __typename: 'RegistrationPolicyBucket' as const,
        ...bucket,
      })),
      ...otherProps,
    };
  }, [registrationPolicy]);
  const signupOptions = useMemo(
    () =>
      buildSignupOptions(
        {
          registration_policy: registrationPolicyForDisplay,
          team_members: [],
          event_category: {
            team_member_name: 'team member',
          },
        },
        undefined,
      ),
    [registrationPolicyForDisplay],
  );

  return (
    <div className="col-lg-4 col-12 bg-secondary d-flex justify-content-center">
      <div className="col-lg-12 col-md-6 col-sm-12">
        <div className="card my-3">
          <div className="card-header">
            <p>
              <strong>Preview</strong>
            </p>
            Start time-end time
            <br />
            Room A, Room B
          </div>

          <div className="card-body text-center">
            <RunCapacityGraph
              event={{
                registration_policy: registrationPolicyForDisplay,
              }}
              run={{ grouped_signup_counts: [] }}
              signupsAvailable
            />
            <SignupButtons signupOptions={signupOptions.mainPreference} />
            <SignupButtons signupOptions={signupOptions.mainNoPreference} />
          </div>

          {signupOptions.auxiliary.length > 0 ? (
            <ul className="list-group list-group-flush">
              <li className="list-group-item border-bottom-0">
                <SignupButtons signupOptions={signupOptions.auxiliary} />
              </li>
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default RegistrationPolicyPreview;
