import { useMemo } from 'react';
import { sortByLocaleString } from '../ValueUtils';

const getNormalizedEventTitle = (event) => event.title
  .replace(/^(the|a|) /i, '')
  .replace(/[^A-Za-z0-9]/g, '')
  .toLocaleLowerCase();

export default function useEventAdminCategory(data, error, eventCategoryId) {
  const eventCategory = useMemo(
    () => (error ? null : data.convention.event_categories.find((c) => c.id === eventCategoryId)),
    [data, error, eventCategoryId],
  );
  const filteredEvents = useMemo(
    () => (error ? [] : data.events.filter((event) => event.event_category.id === eventCategoryId)),
    [data, error, eventCategoryId],
  );
  const sortedEvents = useMemo(
    () => sortByLocaleString(filteredEvents, getNormalizedEventTitle),
    [filteredEvents],
  );

  return [eventCategory, sortedEvents];
}
