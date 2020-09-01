import { FiniteTimespan } from '../../../Timespan';

class ColumnReservation {
  timespan: FiniteTimespan;

  runIds: number[];

  constructor(runId: number, timespan: FiniteTimespan) {
    this.timespan = timespan;
    this.runIds = [runId];
  }

  addRun(runId: number, timespan: FiniteTimespan) {
    this.runIds.push(runId);
    this.timespan = this.timespan.expandedToFit(timespan);
  }
}

export default ColumnReservation;
