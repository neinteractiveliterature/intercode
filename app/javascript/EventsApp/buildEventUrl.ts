import { parameterize } from 'inflected';

export default function buildEventUrl(event: { id: number | string; title?: string | null }) {
  return `/events/${event.id}-${parameterize(event.title ?? '').replace('_', '-')}`;
}
