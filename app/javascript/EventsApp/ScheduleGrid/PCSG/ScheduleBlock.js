import moment from 'moment-timezone';
import { normalizeTitle } from '../../../ValueUtils';

class ScheduleBlock {
  constructor(id, timespan, eventRuns, schedule) {
    this.id = id;
    this.eventRuns = [];
    this.timespan = timespan;
    this.interval = moment.duration(1, 'hour');
    this.schedule = schedule;
    eventRuns.forEach((eventRun) => { this.addEventRun(eventRun); });
  }

  addEventRun(eventRun) {
    this.eventRuns.push(eventRun);
    this.timespan = this.timespan.expandedToFit(eventRun.timespan);
  }

  getRunCountInTimespan(event, timespan) {
    return event.runs
      .filter((run) => {
        const runTimespan = this.eventRuns.find((eventRun) => eventRun.runId === run.id).timespan;
        return runTimespan.overlapsTimespan(timespan);
      })
      .length;
  }

  getTimeSortedEventRuns() {
    return [...this.eventRuns].sort((a, b) => {
      const timeDiff = a.timespan.start.diff(b.timespan.start);

      if (timeDiff === 0) {
        // use number of overlapping runs as a tiebreaker (more runs first)
        const runA = this.schedule.getRun(a.runId);
        const runB = this.schedule.getRun(b.runId);
        const eventA = this.schedule.getEvent(runA.event_id);
        const eventB = this.schedule.getEvent(runB.event_id);
        const eventAOverlappingRunCount = this.getRunCountInTimespan(eventA, b.timespan.expand(1, 'hour'));
        const eventBOverlappingRunCount = this.getRunCountInTimespan(eventB, a.timespan.expand(1, 'hour'));
        const runCountDiff = eventBOverlappingRunCount - eventAOverlappingRunCount;

        if (runCountDiff === 0) {
          // finally, use event title as a tiebreaker
          const titleDiff = normalizeTitle(eventA.title).localeCompare(normalizeTitle(eventB.title), { sensitivity: 'base' });

          if (titleDiff === 0) {
            // as a tiebreaker, sort longer events first
            const lengthDiff = b.timespan.finish.diff(a.timespan.finish);

            return lengthDiff;
          }

          return titleDiff;
        }

        return runCountDiff;
      }

      return timeDiff;
    });
  }
}

export default ScheduleBlock;
