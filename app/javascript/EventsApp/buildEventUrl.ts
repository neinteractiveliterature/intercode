import parameterize from '../parameterize';

export default function buildEventUrl(event: { id: string; title?: string | null }): string {
  return `/events/${event.id}-${parameterize(event.title ?? '')}`;
}
