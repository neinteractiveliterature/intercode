import { useMemo } from 'react';
import { sortByLocaleString } from '@neinteractiveliterature/litform';

import { Event } from '../graphqlTypes.generated';
import { EventAdminEventsQueryData } from './queries.generated';

function getNormalizedEventTitle<EventType extends Pick<Event, 'title'>>(event: EventType) {
  return (event.title ?? '')
    .replace(/^(the|a|) /i, '')
    .replace(/[^A-Za-z0-9]/g, '')
    .toLocaleLowerCase();
}

export default function useEventAdminCategory(
  data: EventAdminEventsQueryData,
  eventCategoryId: number,
): [
  EventAdminEventsQueryData['convention']['event_categories'][number] | undefined,
  EventAdminEventsQueryData['convention']['events'],
] {
  const eventCategory = useMemo(
    () => data.convention.event_categories.find((c) => c.id === eventCategoryId),
    [data, eventCategoryId],
  );
  const filteredEvents = useMemo(
    () =>
      data.convention.events.filter(
        (event) => event.event_category.id === eventCategoryId && event.status === 'active',
      ),
    [data, eventCategoryId],
  );
  const sortedEvents = useMemo(
    () => sortByLocaleString(filteredEvents, getNormalizedEventTitle),
    [filteredEvents],
  );

  return [eventCategory, sortedEvents];
}
