// @flow

import Timespan from './Timespan';
import EventRun from './EventRun';

class ColumnReservation {
  timespan: Timespan;
  eventRuns: Array<EventRun>;

  constructor(eventRun: EventRun) {
    this.timespan = eventRun.timespan;
    this.eventRuns = [eventRun];
  }

  addEventRun(eventRun: EventRun) {
    this.eventRuns.push(eventRun);
    this.timespan = this.timespan.expandedToFit(eventRun.timespan);
  }
}

export default ColumnReservation;
