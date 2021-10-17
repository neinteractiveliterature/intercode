import { FiniteTimespan } from '../../../Timespan';

class ColumnReservation {
  timespan: FiniteTimespan;

  runIds: string[];

  constructor(runId: string, timespan: FiniteTimespan) {
    this.timespan = timespan;
    this.runIds = [runId];
  }

  addRun(runId: string, timespan: FiniteTimespan): void {
    this.runIds.push(runId);
    this.timespan = this.timespan.expandedToFit(timespan);
  }
}

export default ColumnReservation;
