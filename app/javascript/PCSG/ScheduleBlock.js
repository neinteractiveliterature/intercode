// @flow

import moment from 'moment';
import EventRun from './EventRun';
import Timespan from './Timespan';

class ScheduleBlock {
  timespan: Timespan;
  interval: moment.Duration;
  eventRuns: Array<EventRun>;
  maxColumns: number;

  constructor(timespan: Timespan, eventRuns: Array<EventRun> = []) {
    this.eventRuns = [];
    this.timespan = timespan;
    this.interval = moment.duration(1, 'hour');
    eventRuns.forEach((eventRun) => { this.addEventRun(eventRun); });
  }

  addEventRun(eventRun: EventRun) {
    this.eventRuns.push(eventRun);
    this.timespan = this.timespan.expandedToFit(eventRun.timespan);
  }

  getTimeSortedEventRuns(): Array<EventRun> {
    return [...this.eventRuns].sort(
      (a, b) => {
        const timeDiff = a.timespan.start.diff(b.timespan.start);

        if (timeDiff === 0) {
          // as a tiebreaker, sort longer events first
          return b.timespan.finish.diff(a.timespan.finish);
        }

        return timeDiff;
      },
    );
  }
}

export default ScheduleBlock;
