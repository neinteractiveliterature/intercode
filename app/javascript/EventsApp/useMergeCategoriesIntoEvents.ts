import { useMemo } from 'react';
import { EventCategory } from 'graphqlTypes.generated';
import { ScheduleEvent } from './ScheduleGrid/Schedule';

export default function useMergeCategoriesIntoEvents<
  EventCategoryType extends ScheduleEvent['event_category'],
  EventType extends { event_category: Pick<EventCategory, 'id'> },
>(eventCategories: EventCategoryType[], events: EventType[]) {
  const eventCategoriesById = useMemo(() => {
    const eventCategoriesById = new Map<string, EventCategoryType>();
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
