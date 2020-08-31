import { FiniteTimespan } from '../../../Timespan';
import EventRun from './EventRun';

class ColumnReservation {
  timespan: FiniteTimespan;

  eventRuns: EventRun[];

  constructor(eventRun: EventRun, timespan?: FiniteTimespan) {
    this.timespan = timespan ?? eventRun.timespan;
    this.eventRuns = [eventRun];
  }

  addEventRun(eventRun: EventRun, timespan?: FiniteTimespan) {
    this.eventRuns.push(eventRun);
    this.timespan = this.timespan.expandedToFit(timespan ?? eventRun.timespan);
  }
}

export default ColumnReservation;
