import React, { Suspense, useState } from 'react';

import { CreateSignupEventsQuery } from './queries.gql';
import CreateSignupRunCard from './CreateSignupRunCard';
import EventSelect from '../BuiltInFormControls/EventSelect';
import FormGroupWithLabel from '../BuiltInFormControls/FormGroupWithLabel';
import LoadingIndicator from '../LoadingIndicator';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';

function CreateSignup() {
  const [event, setEvent] = useState(null);
  const [userConProfile, setUserConProfile] = useState(null);

  return (
    <>
      <FormGroupWithLabel label="Event" name="event">
        {(id) => (
          <EventSelect
            id={id}
            value={event}
            onChange={(newEvent) => setEvent(newEvent)}
            eventsQuery={CreateSignupEventsQuery}
          />
        )}
      </FormGroupWithLabel>

      <FormGroupWithLabel label="Attendee" name="userConProfile">
        {(id) => (
          <UserConProfileSelect
            id={id}
            value={userConProfile}
            onChange={(newUserConProfile) => setUserConProfile(newUserConProfile)}
          />
        )}
      </FormGroupWithLabel>

      {event && userConProfile && (
        <Suspense fallback={<LoadingIndicator />}>
          <div className="run-card-deck">
            {event.runs.map((run) => (
              <CreateSignupRunCard
                key={`${run.id}-${userConProfile.id}`}
                eventId={event.id}
                runId={run.id}
                userConProfileId={userConProfile.id}
              />
            ))}
          </div>
        </Suspense>
      )}
    </>
  );
}

export default CreateSignup;
