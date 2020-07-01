import { parameterize } from 'inflected';

export default function buildEventUrl(event: { id: number, title?: string | null }) {
  if (!event.title) {
    return `/events/${event.id}`;
  }

  return `/events/${event.id}-${parameterize(event.title).replace('_', '-')}`;
}
