import { DateTime } from 'luxon';
import Timespan, { FiniteTimespan } from '../../../Timespan';

export type EventRunApiResponse = {
  runs: { id: number, starts_at: string }[],
  length_seconds: number
}[];

class EventRun {
  static buildEventRunsFromApi(apiResponse: EventRunApiResponse) {
    const runsByEvent = apiResponse.map((apiEvent) => (
      apiEvent.runs.map((apiRun) => {
        const start = DateTime.fromISO(apiRun.starts_at);
        const finish = start.plus({ seconds: apiEvent.length_seconds });

        return new EventRun(apiRun.id, Timespan.fromDateTimes(start, finish));
      })
    ));

    return runsByEvent.reduce((a, b) => [...a, ...b], []);
  }

  runId: number;

  timespan: FiniteTimespan;

  constructor(runId: number, timespan: FiniteTimespan) {
    this.runId = runId;
    this.timespan = timespan;
  }
}

export default EventRun;
