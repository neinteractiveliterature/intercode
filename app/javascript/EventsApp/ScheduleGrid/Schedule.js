/* global Rollbar */

import EventCategory from '../../EventAdmin/EventCategory';
import EventRun from './PCSG/EventRun';
import ScheduleBlock from './PCSG/ScheduleBlock';
import ScheduleGridLayout from './ScheduleGridLayout';
import { timespanFromConvention } from '../../TimespanUtils';

export default class Schedule {
  constructor(config, convention, events) {
    this.config = config;

    this.timezoneName = convention.timezone_name;

    this.eventsById = new Map(events.map(event => [event.id, event]));
    this.runsById = new Map(events.map(event => (
      event.runs.map(run => [run.id, { ...run, event_id: event.id }])
    )).reduce((runEntries, entriesForEvent) => [...runEntries, ...entriesForEvent], []));

    this.conventionTimespan = timespanFromConvention(convention);

    this.eventRuns = EventRun.buildEventRunsFromApi(events);
    this.runTimespansById = new Map(this.eventRuns
      .map(eventRun => [eventRun.runId, eventRun.timespan]));
  }

  getRun = runId => this.runsById.get(runId)

  getEvent = eventId => this.eventsById.get(eventId)

  getEventRunsOverlapping = timespan => this.eventRuns.filter(eventRun => (
    timespan.overlapsTimespan(eventRun.timespan)
  ))

  getRunTimespan = runId => this.runTimespansById.get(runId)

  groupEventRunsByCategory = (eventRuns) => {
    const matchRules = this.config.buildCategoryMatchRules();
    const groups = [];
    this.config.categoryGroups.forEach(({ match, ...otherProps }) => groups.push({
      eventRuns: [],
      ...otherProps,
    }));

    eventRuns.forEach((eventRun) => {
      const { runId } = eventRun;
      const run = this.runsById.get(runId);
      const event = this.eventsById.get(run.event_id);
      const { category: categoryKey } = event;

      const category = EventCategory.get(categoryKey);
      if (!category && typeof Rollbar !== 'undefined') {
        Rollbar.warn(`Unknown category ${categoryKey} for event ${event.id} (${event.title})`);
      }

      const applicableRule = matchRules.find(({ matchRule }) => {
        if (matchRule.categoryKey && category.key === matchRule.categoryKey) {
          return true;
        }

        return matchRule.allRemaining;
      });

      if (applicableRule) {
        groups[applicableRule.targetGroupIndex].eventRuns.push(eventRun);
      }
    });

    return groups;
  }

  groupEventRunsByRoom = (eventRuns) => {
    const runsByRoomMap = eventRuns.reduce(
      (eventRunsByRoom, eventRun) => {
        const { runId } = eventRun;
        const run = this.runsById.get(runId);

        run.room_names.forEach((roomName) => {
          if (!eventRunsByRoom.has(roomName)) {
            eventRunsByRoom.set(roomName, []);
          }

          eventRunsByRoom.set(roomName, [...eventRunsByRoom.get(roomName), eventRun]);
        });

        return eventRunsByRoom;
      },
      new Map(),
    );

    const roomNames = [...runsByRoomMap.keys()]
      .sort((a, b) => a.localeCompare(b, { sensitivity: 'base' }));

    return roomNames.map(roomName => ({
      rowHeader: roomName,
      eventRuns: runsByRoomMap.get(roomName),
    }));
  }

  buildScheduleBlocksFromGroups = (groups, actualTimespan) => {
    const blocks = groups
      .map(({ eventRuns, ...props }) => [new ScheduleBlock(actualTimespan, eventRuns), props]);

    if (this.config.filterEmptyGroups) {
      return blocks.filter(scheduleBlock => scheduleBlock[0].eventRuns.length > 0);
    }

    return blocks;
  }

  buildLayoutForTimespanRange = (minTimespan, maxTimespan) => {
    const eventRuns = this.getEventRunsOverlapping(maxTimespan);
    const actualTimespan = eventRuns.reduce(
      (currentMaxTimespan, eventRun) => currentMaxTimespan.expandedToFit(eventRun.timespan),
      minTimespan,
    );

    const groups = (
      this.config.groupEventsBy === 'room'
        ? this.groupEventRunsByRoom(eventRuns)
        : this.groupEventRunsByCategory(eventRuns)
    );

    return new ScheduleGridLayout(
      eventRuns,
      actualTimespan,
      this.buildScheduleBlocksFromGroups(groups, actualTimespan),
    );
  }

  buildLayoutForConventionDayTimespan = (conventionDayTimespan) => {
    const minTimespan = conventionDayTimespan.clone();
    minTimespan.start.add(3, 'hours'); // start grid at 9am unless something is earlier
    minTimespan.finish.subtract(6, 'hours'); // end grid at midnight unless something is earlier

    return this.buildLayoutForTimespanRange(minTimespan, conventionDayTimespan);
  }

  shouldUseRowHeaders = () => this.config.groupEventsBy === 'room'
}
