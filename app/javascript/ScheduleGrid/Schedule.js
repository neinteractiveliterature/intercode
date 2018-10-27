/* global Rollbar */

import EventCategory from '../EventAdmin/EventCategory';
import EventRun from '../PCSG/EventRun';
import ScheduleBlock from '../PCSG/ScheduleBlock';
import ScheduleGridLayout from './ScheduleGridLayout';
import { timespanFromConvention, getConventionDayTimespans } from '../TimespanUtils';

export default class Schedule {
  constructor(config, data) {
    this.config = config;
    this.data = data;

    this.timezoneName = data.convention.timezone_name;

    this.eventsById = new Map(data.events.map(event => [event.id, event]));
    this.runsById = new Map(data.events.map(event => (
      event.runs.map(run => [run.id, { ...run, event_id: event.id }])
    )).reduce((runEntries, entriesForEvent) => [...runEntries, ...entriesForEvent], []));

    this.conventionTimespan = timespanFromConvention(data.convention);

    this.conventionDayTimespans = getConventionDayTimespans(
      this.conventionTimespan,
      data.convention.timezone_name,
    );

    this.eventRuns = EventRun.buildEventRunsFromApi(data.events);
    this.runTimespansById = new Map(this.eventRuns
      .map(eventRun => [eventRun.runId, eventRun.timespan]));
  }

  getRun = runId => this.runsById.get(runId)

  getEvent = eventId => this.eventsById.get(eventId)

  getEventRunsOverlapping = timespan => this.eventRuns.filter(eventRun => (
    timespan.overlapsTimespan(eventRun.timespan)
  ))

  getRunTimespan = runId => this.runTimespansById.get(runId)

  groupEventRunsByCategory = eventRuns => eventRuns.reduce(
    (eventRunsByCategory, eventRun) => {
      const { runId } = eventRun;
      const run = this.runsById.get(runId);
      const event = this.eventsById.get(run.event_id);
      const { category: categoryKey } = event;

      const category = EventCategory.get(categoryKey);
      let groupName = 'regular';

      if (!category && typeof Rollbar !== 'undefined') {
        Rollbar.warn(`Unknown category ${categoryKey} for event ${event.id} (${event.title})`);
      }

      if (category && category.isSingleRun()) {
        groupName = 'singleRun';
      }

      if (category && category.isRecurring()) {
        groupName = 'recurring';
      }

      if (!eventRunsByCategory.has(groupName)) {
        eventRunsByCategory.set(groupName, []);
      }

      return eventRunsByCategory.set(
        groupName,
        eventRunsByCategory.get(groupName).concat(eventRun),
      );
    },
    new Map(),
  )

  groupEventRunsByRoom = eventRuns => eventRuns.reduce(
    (eventRunsByRoom, eventRun) => {
      const { runId } = eventRun;
      const run = this.runsById.get(runId);

      run.rooms.forEach((room) => {
        if (!eventRunsByRoom.has(room.name)) {
          eventRunsByRoom.set(room.name, []);
        }

        eventRunsByRoom.set(room.name, [...eventRunsByRoom.get(room.name), eventRun]);
      });

      return eventRunsByRoom;
    },
    new Map(),
  )

  buildLayoutForTimespanRange = (minTimespan, maxTimespan) => {
    const eventRuns = this.getEventRunsOverlapping(maxTimespan);
    const actualTimespan = eventRuns.reduce(
      (currentMaxTimespan, eventRun) => currentMaxTimespan.expandedToFit(eventRun.timespan),
      minTimespan,
    );

    if (this.config.groupEventsBy === 'room') {
      const eventRunsByRoom = this.groupEventRunsByRoom(eventRuns);
      const roomNames = [...eventRunsByRoom.keys()]
        .sort((a, b) => a.localeCompare(b, { sensitivity: 'base' }));

      const scheduleBlocksWithOptions = roomNames.map(roomName => (
        [
          new ScheduleBlock(actualTimespan, eventRunsByRoom.get(roomName)),
          { rowHeader: roomName },
        ]
      ));

      return new ScheduleGridLayout(eventRuns, actualTimespan, scheduleBlocksWithOptions);
    }

    const eventRunsByCategory = this.groupEventRunsByCategory(eventRuns);

    const recurringRuns = eventRunsByCategory.get('recurring') || [];
    const singleRuns = eventRunsByCategory.get('singleRun') || [];
    const regularRuns = eventRunsByCategory.get('regular') || [];

    const scheduleBlocksWithOptions = [
      [new ScheduleBlock(actualTimespan, singleRuns)],
      [new ScheduleBlock(actualTimespan, regularRuns), { flexGrow: 1 }],
      [new ScheduleBlock(actualTimespan, recurringRuns)],
    ].filter(scheduleBlock => scheduleBlock[0].eventRuns.length > 0);

    return new ScheduleGridLayout(eventRuns, actualTimespan, scheduleBlocksWithOptions);
  }

  buildLayoutForConventionDayTimespan = (conventionDayTimespan) => {
    const minTimespan = conventionDayTimespan.clone();
    minTimespan.start.add(3, 'hours'); // start grid at 9am unless something is earlier
    minTimespan.finish.subtract(6, 'hours'); // end grid at midnight unless something is earlier

    return this.buildLayoutForTimespanRange(minTimespan, conventionDayTimespan);
  }

  shouldUseRowHeaders = () => this.config.groupEventsBy === 'room'
}
