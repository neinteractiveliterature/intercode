import { parameterize } from 'inflected';
import { EventCategory } from '../graphqlTypes.generated';

export default function buildEventCategoryUrl(
  eventCategory?: Pick<EventCategory, 'id' | 'name'> | null,
): string | undefined {
  if (!eventCategory) {
    return undefined;
  }

  return `/admin_events/${eventCategory.id}-${parameterize(eventCategory.name)}`;
}
