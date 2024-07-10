import { useMemo } from 'react';
import { ScheduleGridConventionDataQueryData } from './ScheduleGrid/queries.generated';

type EventCategoryType = ScheduleGridConventionDataQueryData['convention']['event_categories'][number];

export default function useMergeCategoriesIntoEvents<T extends { event_category: { id: string } }>(
  eventCategories: EventCategoryType[],
  events: T[],
) {
  const eventCategoriesById = useMemo(() => {
    const eventCategoriesById = new Map<
      string,
      ScheduleGridConventionDataQueryData['convention']['event_categories'][number]
    >();
    eventCategories.forEach((category) => {
      eventCategoriesById.set(category.id, category);
    });
    return eventCategoriesById;
  }, [eventCategories]);

  const eventsWithCategories = useMemo(
    () =>
       
      events?.map((event) => ({ ...event, event_category: eventCategoriesById.get(event.event_category.id)! })) ?? [],
    [events, eventCategoriesById],
  );

  return eventsWithCategories;
}
