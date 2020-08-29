import { parameterize } from 'inflected';

export default function buildEventUrl(event: { id: number; title: string }) {
  return `/events/${event.id}-${parameterize(event.title).replace('_', '-')}`;
}
