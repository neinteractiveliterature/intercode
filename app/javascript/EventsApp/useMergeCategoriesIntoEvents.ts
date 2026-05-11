import { useMemo } from 'react';
import { ScheduleGridEventCategory } from './ScheduleGrid/ScheduleGridTypes';

export default function useMergeCategoriesIntoEvents<
  TCategory extends ScheduleGridEventCategory,
  TEvent extends { event_category: { id: string } },
>(eventCategories: TCategory[], events: TEvent[]): (TEvent & { event_category: TCategory })[] {
  const eventCategoriesById = useMemo(() => {
    const map = new Map<string, TCategory>();
    eventCategories.forEach((category) => {
      map.set(category.id, category);
    });
    return map;
  }, [eventCategories]);

  return useMemo(
    () => events.map((event) => ({ ...event, event_category: eventCategoriesById.get(event.event_category.id)! })),
    [events, eventCategoriesById],
  );
}
