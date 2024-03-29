import { Suspense, useState } from 'react';
import { LoadingIndicator, FormGroupWithLabel } from '@neinteractiveliterature/litform';

import CreateSignupRunCard from './CreateSignupRunCard';
import EventSelect from '../BuiltInFormControls/EventSelect';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import { CreateSignupEventsQueryData, CreateSignupEventsQueryDocument } from './queries.generated';
import { DefaultUserConProfilesQueryData } from '../BuiltInFormControls/selectDefaultQueries.generated';

type EventType = NonNullable<CreateSignupEventsQueryData['convention']>['events_paginated']['entries'][0];

type UserConProfileType = NonNullable<
  DefaultUserConProfilesQueryData['convention']
>['user_con_profiles_paginated']['entries'][0];

function CreateSignup(): JSX.Element {
  const [event, setEvent] = useState<EventType>();
  const [userConProfile, setUserConProfile] = useState<UserConProfileType>();

  return (
    <>
      <FormGroupWithLabel label="Event">
        {(id) => (
          <EventSelect
            id={id}
            value={event}
            onChange={(newEvent: EventType) => setEvent(newEvent)}
            eventsQuery={CreateSignupEventsQueryDocument}
          />
        )}
      </FormGroupWithLabel>

      <FormGroupWithLabel label="Attendee">
        {(id) => (
          <UserConProfileSelect
            id={id}
            value={userConProfile}
            onChange={(newUserConProfile: UserConProfileType) => setUserConProfile(newUserConProfile)}
          />
        )}
      </FormGroupWithLabel>

      {event && userConProfile && (
        <Suspense fallback={<LoadingIndicator iconSet="bootstrap-icons" />}>
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
