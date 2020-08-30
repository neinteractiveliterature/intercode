import moment from 'moment-timezone';
import { EventListEventsQueryQuery } from './queries.generated';

export default function getSortedRuns(
  event: NonNullable<EventListEventsQueryQuery['convention']>['events_paginated']['entries'][0],
) {
  return [...event.runs].sort(
    (a, b) => moment(a.starts_at).valueOf() - moment(b.starts_at).valueOf(),
  );
}
