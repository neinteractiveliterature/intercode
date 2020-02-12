import { parameterize } from 'inflected';

export default function buildEventCategoryUrl(eventCategory) {
  if (!eventCategory) {
    return null;
  }

  return `/admin_events/${eventCategory.id}-${parameterize(eventCategory.name)}`;
}
