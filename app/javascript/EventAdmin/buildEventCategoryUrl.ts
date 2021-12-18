import { EventCategory } from '../graphqlTypes.generated';
import parameterize from '../parameterize';

export function buildEventCategoryUrlPortion(eventCategory: Pick<EventCategory, 'name' | 'id'>): string {
  return `${eventCategory.id}-${parameterize(eventCategory.name)}`;
}

export default function buildEventCategoryUrl(eventCategory: Pick<EventCategory, 'name' | 'id'>): string;
export default function buildEventCategoryUrl(eventCategory: null | undefined): undefined;
export default function buildEventCategoryUrl(
  eventCategory?: (Pick<EventCategory, 'name'> & { id: string }) | null,
): string | undefined;
export default function buildEventCategoryUrl(
  eventCategory?: (Pick<EventCategory, 'name'> & { id: string }) | null,
): string | undefined {
  if (!eventCategory) {
    return undefined;
  }

  return `/admin_events/${buildEventCategoryUrlPortion(eventCategory)}`;
}
