import React from 'react';

import buildBlankSignupCountsFromRegistrationPolicy from '../EventsApp/EventPage/buildBlankSignupCountsFromRegistrationPolicy';
import buildSignupOptions from '../EventsApp/EventPage/buildSignupOptions';
import RunCapacityGraph from '../EventsApp/EventPage/RunCapacityGraph';
import SignupButtons from '../EventsApp/EventPage/SignupButtons';

function RegistrationPolicyPreview({ registrationPolicy }) {
  const blankSignupCounts = buildBlankSignupCountsFromRegistrationPolicy(registrationPolicy);
  const signupOptions = buildSignupOptions({ registration_policy: registrationPolicy }, null);

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
              event={{ registration_policy: registrationPolicy }}
              run={{
                signup_count_by_state_and_bucket_key_and_counted: JSON.stringify({
                  confirmed: blankSignupCounts,
                  waitlisted: blankSignupCounts,
                }),
              }}
              signupsAvailable
            />
            <SignupButtons signupOptions={signupOptions.mainPreference} />
            <SignupButtons signupOptions={signupOptions.mainNoPreference} />
          </div>

          {
            signupOptions.auxiliary.length > 0
              ? (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item border-bottom-0">
                    <SignupButtons signupOptions={signupOptions.auxiliary} />
                  </li>
                </ul>
              )
              : null
          }
        </div>
      </div>
    </div>
  );
}

export default RegistrationPolicyPreview;
