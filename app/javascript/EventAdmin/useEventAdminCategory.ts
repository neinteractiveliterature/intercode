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
  data: EventAdminEventsQueryData | undefined,
  loading: boolean,
  error: Error | undefined,
  eventCategoryId: number,
) {
  const eventCategory = useMemo(
    () =>
      loading || error || !data
        ? null
        : data.convention!.event_categories.find((c) => c.id === eventCategoryId),
    [data, loading, error, eventCategoryId],
  );
  const filteredEvents = useMemo(
    () =>
      error || loading || !data
        ? []
        : data.events.filter(
            (event) => event.event_category.id === eventCategoryId && event.status === 'active',
          ),
    [data, loading, error, eventCategoryId],
  );
  const sortedEvents = useMemo(() => sortByLocaleString(filteredEvents, getNormalizedEventTitle), [
    filteredEvents,
  ]);

  return [eventCategory, sortedEvents] as const;
}
