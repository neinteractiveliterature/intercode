import EventRun from './EventRun';
import { FiniteTimespan } from '../../../Timespan';

class ColumnReservation {
  timespan: FiniteTimespan;

  eventRuns: EventRun[];

  constructor(eventRun: EventRun, timespan: FiniteTimespan) {
    this.timespan = timespan || eventRun.timespan;
    this.eventRuns = [eventRun];
  }

  addEventRun(eventRun, timespan) {
    this.eventRuns.push(eventRun);
    this.timespan = this.timespan.expandedToFit(timespan || eventRun.timespan);
  }
}

export default ColumnReservation;
