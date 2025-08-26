import { Suspense, useMemo, useState } from 'react';
import { LoadingIndicator, FormGroupWithLabel } from '@neinteractiveliterature/litform';
import sortBy from 'lodash/sortBy';

import CreateSignupRunCard from './CreateSignupRunCard';
import EventSelect from '../BuiltInFormControls/EventSelect';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import { CreateSignupEventsQueryData, CreateSignupEventsQueryDocument } from './queries.generated';
import { DefaultUserConProfilesQueryData } from '../BuiltInFormControls/selectDefaultQueries.generated';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

type EventType = NonNullable<CreateSignupEventsQueryData['convention']>['events_paginated']['entries'][0];

type UserConProfileType = NonNullable<
  DefaultUserConProfilesQueryData['convention']
>['user_con_profiles_paginated']['entries'][0];

function CreateSignup(): React.JSX.Element {
  const { t } = useTranslation();
  const [event, setEvent] = useState<EventType>();
  const [userConProfile, setUserConProfile] = useState<UserConProfileType>();
  const sortedRuns = useMemo(
    () => sortBy(event?.runs ?? [], (run) => DateTime.fromISO(run.starts_at).toMillis()),
    [event?.runs],
  );

  return (
    <>
      <FormGroupWithLabel label={t('admin.signupModeration.createSignups.eventLabel')}>
        {(id) => (
          <EventSelect
            id={id}
            value={event}
            onChange={(newEvent: EventType) => setEvent(newEvent)}
            eventsQuery={CreateSignupEventsQueryDocument}
          />
        )}
      </FormGroupWithLabel>

      <FormGroupWithLabel label={t('admin.signupModeration.createSignups.attendeeLabel')}>
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
            {sortedRuns.map((run) => (
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

export const Component = CreateSignup;
