import moment from 'moment-timezone';
import Timespan, { FiniteTimespan } from '../../../Timespan';
import { ScheduleGridEventFragmentFragment } from '../queries.generated';

class EventRun {
  static buildEventRunsFromApi(apiResponse: ScheduleGridEventFragmentFragment[]) {
    const runsByEvent = apiResponse.map((apiEvent) =>
      apiEvent.runs.map((apiRun) => {
        const start = moment(apiRun.starts_at);
        const finish = start.clone().add(apiEvent.length_seconds, 'seconds');

        return new EventRun(apiRun.id, Timespan.fromMoments(start, finish) as FiniteTimespan);
      }),
    );

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
