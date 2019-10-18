class ColumnReservation {
  constructor(eventRun, timespan) {
    this.timespan = timespan || eventRun.timespan;
    this.eventRuns = [eventRun];
  }

  addEventRun(eventRun, timespan) {
    this.eventRuns.push(eventRun);
    this.timespan = this.timespan.expandedToFit(timespan || eventRun.timespan);
  }
}

export default ColumnReservation;
