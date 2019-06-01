import React, {
  Suspense, useState, useEffect, useContext, useMemo,
} from 'react';

import { CreateSignupEventsQuery, CreateSignupRunCardQuery } from './queries.gql';
import EventSelect from '../BuiltInFormControls/EventSelect';
import FormGroupWithLabel from '../BuiltInFormControls/FormGroupWithLabel';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import AppRootContext from '../AppRootContext';
import RunSelect from '../BuiltInFormControls/RunSelect';
import RunCard from '../EventsApp/EventPage/RunCard';
import buildSignupOptions from '../EventsApp/EventPage/buildSignupOptions';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';

function CreateSignupRunCard({ event, run, userConProfileId }) {
  const { timezoneName } = useContext(AppRootContext);

  const { data, error } = useQuerySuspended(CreateSignupRunCardQuery, {
    variables: {
      id: userConProfileId,
      eventId: event.id,
    },
  });

  const signupOptions = useMemo(
    () => (error ? null : buildSignupOptions(event, data.myProfile)),
    [data, error, event],
  );

  const mySignup = useMemo(
    () => (error ? null : data.userConProfile.signups.find(s => s.run.id === run.id && s.state !== 'withdrawn')),
    [data, error, run],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <RunCard
      event={event}
      run={run}
      currentAbility={data.currentAbility}
      signupOptions={signupOptions}
      mySignup={mySignup}
      myProfile={data.userConProfile}
      timezoneName={timezoneName}
    />
  );
}

function CreateSignup() {
  const { timezoneName } = useContext(AppRootContext);
  const [event, setEvent] = useState(null);
  const [run, setRun] = useState(null);
  const [userConProfile, setUserConProfile] = useState(null);

  useEffect(
    () => {
      if (event && event.runs.length === 1) {
        setRun(event.runs[0]);
      } else {
        setRun(null);
      }
    },
    [event],
  );

  return (
    <>
      <FormGroupWithLabel label="Event" name="event">
        {id => (
          <EventSelect
            id={id}
            value={event}
            onChange={setEvent}
            eventsQuery={CreateSignupEventsQuery}
          />
        )}
      </FormGroupWithLabel>

      <FormGroupWithLabel label="Run" name="run">
        {id => (
          <RunSelect
            id={id}
            event={event}
            timezoneName={timezoneName}
            value={run}
            onChange={setRun}
          />
        )}
      </FormGroupWithLabel>

      <FormGroupWithLabel label="Attendee" name="userConProfile">
        {id => (
          <UserConProfileSelect
            id={id}
            value={userConProfile}
            onChange={setUserConProfile}
          />
        )}
      </FormGroupWithLabel>

      {run && userConProfile && (
        <Suspense fallback={<LoadingIndicator />}>
          <CreateSignupRunCard event={event} run={run} userConProfileId={userConProfile.id} />
        </Suspense>
      )}
    </>
  );
}

export default CreateSignup;
