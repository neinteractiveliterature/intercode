import { parameterize } from 'inflected';
import { EventCategory } from '../graphqlTypes.generated';

export default function buildEventCategoryUrl(
  eventCategory?: Pick<EventCategory, 'id' | 'name'> | null,
) {
  if (!eventCategory) {
    return undefined;
  }

  return `/admin_events/${eventCategory.id}-${parameterize(eventCategory.name)}`;
}
