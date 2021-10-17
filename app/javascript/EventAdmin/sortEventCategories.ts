import { EventCategory } from '../graphqlTypes.generated';

const schedulingUiPriority = ['regular', 'single_run', 'recurring'];

export default function sortEventCategories<
  EventCategoryType extends Pick<EventCategory, 'scheduling_ui' | 'name'>,
>(eventCategories: EventCategoryType[]): EventCategoryType[] {
  return [...eventCategories].sort((a, b) => {
    const aSchedulingUiPriority = schedulingUiPriority.indexOf(a.scheduling_ui);
    const bSchedulingUiPriority = schedulingUiPriority.indexOf(b.scheduling_ui);

    if (aSchedulingUiPriority !== bSchedulingUiPriority) {
      return aSchedulingUiPriority - bSchedulingUiPriority;
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });
}
