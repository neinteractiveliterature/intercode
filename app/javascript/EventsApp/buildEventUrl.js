import { parameterize } from 'inflected';

export default function buildEventUrl(event) {
  return `/events/${event.id}-${parameterize(event.title).replace('_', '-')}`;
}
