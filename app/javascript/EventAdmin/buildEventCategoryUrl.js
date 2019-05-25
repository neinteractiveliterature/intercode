import { parameterize } from 'inflected';

export default function buildEventCategoryUrl(eventCategory) {
  return `/admin_events/${eventCategory.id}-${parameterize(eventCategory.name)}`;
}
