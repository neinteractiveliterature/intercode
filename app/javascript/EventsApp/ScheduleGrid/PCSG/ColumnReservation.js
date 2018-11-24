class ColumnReservation {
  constructor(eventRun) {
    this.timespan = eventRun.timespan;
    this.eventRuns = [eventRun];
  }

  addEventRun(eventRun) {
    this.eventRuns.push(eventRun);
    this.timespan = this.timespan.expandedToFit(eventRun.timespan);
  }
}

export default ColumnReservation;
