import { parameterize } from 'inflected';

export default function buildEventUrl(event) {
  return `/${event.id}-${parameterize(event.title)}`;
}
