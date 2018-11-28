import moment from 'moment-timezone';

class ScheduleBlock {
  constructor(timespan, eventRuns = []) {
    this.eventRuns = [];
    this.timespan = timespan;
    this.interval = moment.duration(1, 'hour');
    eventRuns.forEach((eventRun) => { this.addEventRun(eventRun); });
  }

  addEventRun(eventRun) {
    this.eventRuns.push(eventRun);
    this.timespan = this.timespan.expandedToFit(eventRun.timespan);
  }

  getTimeSortedEventRuns() {
    return [...this.eventRuns].sort((a, b) => {
      const timeDiff = a.timespan.start.diff(b.timespan.start);

      if (timeDiff === 0) {
        // as a tiebreaker, sort longer events first
        return b.timespan.finish.diff(a.timespan.finish);
      }

      return timeDiff;
    });
  }
}

export default ScheduleBlock;
