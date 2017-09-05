// @flow

import moment from 'moment';
import Timespan from './Timespan';

class EventRun {
  runId: number;
  timespan: Timespan;

  static buildEventRunsFromApi(apiResponse) {
    const runsByEvent = apiResponse.map(apiEvent => (
      apiEvent.runs.map((apiRun) => {
        const start = moment(apiRun.starts_at);
        const finish = start.clone().add(apiEvent.length_seconds, 'seconds');

        return new EventRun(apiRun.id, new Timespan(start, finish));
      })
    ));

    return runsByEvent.reduce((a, b) => [...a, ...b], []);
  }

  constructor(runId: number, timespan: Timespan) {
    this.runId = runId;
    this.timespan = timespan;
  }
}

export default EventRun;
