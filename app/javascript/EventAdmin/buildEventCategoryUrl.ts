import { EventCategory } from '../graphqlTypes.generated';
import parameterize from '../parameterize';

export default function buildEventCategoryUrl(
  eventCategory?: (Pick<EventCategory, 'name'> & { id: string }) | null,
): string | undefined {
  if (!eventCategory) {
    return undefined;
  }

  return `/admin_events/${eventCategory.id}-${parameterize(eventCategory.name)}`;
}
