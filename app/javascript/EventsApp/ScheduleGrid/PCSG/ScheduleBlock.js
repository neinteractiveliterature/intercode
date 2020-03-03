import moment from 'moment-timezone';
import sortBy from 'lodash/sortBy';

import { normalizeTitle } from '../../../ValueUtils';

class ScheduleBlock {
  constructor(id, timespan, eventRuns, schedule) {
    this.id = id;
    this.eventRuns = [];
    this.timespan = timespan;
    this.hiddenEventRunsInTimespan = [];
    this.hiddenEventsFakeEventRun = null;
    this.interval = moment.duration(1, 'hour');
    this.schedule = schedule;

    const sortedEventRuns = sortBy(
      eventRuns,
      (eventRun) => eventRun.timespan.start.toDate().getTime(),
    );
    sortedEventRuns.forEach((eventRun) => { this.addEventRun(eventRun); });
  }

  addEventRun(eventRun) {
    let eventRunToAdd = eventRun;

    if (!this.schedule.shouldShowRun(eventRun.runId)) {
      if (
        this.hiddenEventsFakeEventRun
        && this.hiddenEventsFakeEventRun.timespan.overlapsTimespan(eventRun.timespan)
      ) {
        this.hiddenEventRunsInTimespan.push(eventRun);
        const run = this.schedule.getRun(this.hiddenEventsFakeEventRun.runId);
        const event = this.schedule.getEvent(run.event_id);
        event.title = `+ ${this.hiddenEventRunsInTimespan.length} not shown`;
        this.hiddenEventsFakeEventRun.timespan = this.hiddenEventsFakeEventRun.timespan
          .expandedToFit(eventRun.timespan);

        return;
      }

      const fakeEventRun = this.schedule.addFakeEventRun(
        eventRun.timespan,
        '+ 1 not shown',
      );

      this.hiddenEventsFakeEventRun = fakeEventRun;
      this.hiddenEventRunsInTimespan = [eventRun];
      eventRunToAdd = fakeEventRun;
    }

    this.eventRuns.push(eventRunToAdd);
    this.timespan = this.timespan.expandedToFit(eventRunToAdd.timespan);
  }

  getRunCountInTimespan(event, timespan) {
    return event.runs
      .filter((run) => {
        const eventRun = this.eventRuns.find((er) => er.runId === run.id);
        if (!eventRun) {
          return false;
        }

        return eventRun.timespan.overlapsTimespan(timespan);
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
        if (eventA.fake && !eventB.fake) {
          return 1;
        }

        if (eventB.fake && !eventA.fake) {
          return -1;
        }

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
