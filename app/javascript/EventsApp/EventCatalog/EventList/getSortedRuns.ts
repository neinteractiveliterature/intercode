import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';

import { Run } from '../../../graphqlTypes.generated';

export default function getSortedRuns<EventType extends { runs: Pick<Run, 'starts_at'>[] }>(
  event: EventType,
): EventType['runs'] {
  return sortBy(event.runs, (run) => DateTime.fromISO(run.starts_at).toMillis());
}
