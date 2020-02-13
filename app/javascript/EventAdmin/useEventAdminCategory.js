import { useMemo } from 'react';
import { sortByLocaleString } from '../ValueUtils';

const getNormalizedEventTitle = (event) => event.title
  .replace(/^(the|a|) /i, '')
  .replace(/[^A-Za-z0-9]/g, '')
  .toLocaleLowerCase();

export default function useEventAdminCategory(data, loading, error, eventCategoryId) {
  const eventCategory = useMemo(
    () => (loading || error ? null : data.convention.event_categories.find((c) => c.id === eventCategoryId)),
    [data, loading, error, eventCategoryId],
  );
  const filteredEvents = useMemo(
    () => (error || loading
      ? []
      : data.events.filter((event) => (
        event.event_category.id === eventCategoryId
        && event.status === 'active'
      ))),
    [data, loading, error, eventCategoryId],
  );
  const sortedEvents = useMemo(
    () => sortByLocaleString(filteredEvents, getNormalizedEventTitle),
    [filteredEvents],
  );

  return [eventCategory, sortedEvents];
}
