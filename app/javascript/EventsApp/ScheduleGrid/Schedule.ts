import moment from 'moment-timezone';
import { flatMap } from 'lodash';

import EventRun from './PCSG/EventRun';
import ScheduleBlock from './PCSG/ScheduleBlock';
import ScheduleGridLayout from './ScheduleGridLayout';
import Timespan, { FiniteTimespan } from '../../Timespan';
import ScheduleGridConfig, { isCategoryMatchRule, isCatchAllMatchRule } from './ScheduleGridConfig';
import { ScheduleGridEventFragmentFragment } from './queries.generated';

function expandTimespanToNearestHour(timespan: FiniteTimespan) {
  const start = moment(timespan.start).set({ minute: 0, second: 0, millisecond: 0 });
  const finish = moment(timespan.finish);

  if (finish.minute() > 0 || finish.second() > 0 || finish.millisecond() > 0) {
    finish.add(1, 'hours');
  }
  finish.set({ minute: 0, second: 0, millisecond: 0 });

  return Timespan.fromMoments(start, finish) as FiniteTimespan;
}

export type ScheduleEvent = ScheduleGridEventFragmentFragment & {
  displayTitle?: string;
  fake?: boolean;
};

export type ScheduleRun = ScheduleEvent['runs'][0] & {
  event_id: number;
  disableDetailsPopup?: boolean;
};

export type ScheduleGroup = {
  id: string;
  eventRuns: EventRun[];
  flexGrow?: boolean;
  rowHeader?: string;
};

export default class Schedule {
  config: ScheduleGridConfig;

  timezoneName: string;

  eventsById: Map<number, ScheduleEvent>;

  runsById: Map<number, ScheduleRun>;

  myRatingFilter?: number[];

  nextFakeEventRunId: number;

  eventRuns: EventRun[];

  runTimespansById: Map<number, FiniteTimespan>;

  hideConflicts: boolean;

  myConflictingRuns: ScheduleRun[];

  constructor({
    config,
    events,
    myRatingFilter,
    hideConflicts,
    timezoneName,
  }: {
    config: ScheduleGridConfig;
    events: ScheduleEvent[];
    myRatingFilter?: number[];
    hideConflicts: boolean;
    timezoneName: string;
  }) {
    this.config = config;

    this.timezoneName = timezoneName;

    this.eventsById = new Map(events.map((event) => [event.id, event]));
    this.runsById = new Map(
      flatMap(events, (event) => event.runs.map((run) => [run.id, { ...run, event_id: event.id }])),
    );

    this.myRatingFilter = myRatingFilter;
    this.nextFakeEventRunId = -1;

    this.eventRuns = EventRun.buildEventRunsFromApi(events);
    this.runTimespansById = new Map(
      this.eventRuns.map((eventRun) => [eventRun.runId, eventRun.timespan]),
    );

    this.hideConflicts = hideConflicts;
    this.myConflictingRuns = [];
    events.forEach((event) => {
      if (event.can_play_concurrently) {
        return;
      }

      event.runs.forEach((run) => {
        if (
          (run.my_signups || []).some(
            (signup) => signup.state === 'confirmed' || signup.state === 'waitlisted',
          ) ||
          (run.my_signup_requests || []).some((request) => request.state === 'pending')
        ) {
          this.myConflictingRuns.push({ ...run, event_id: event.id });
        }
      });
    });
  }

  getRun = (runId: number) => this.runsById.get(runId);

  getEvent = (eventId: number) => this.eventsById.get(eventId);

  getEventRunsOverlapping = (timespan: Timespan) =>
    this.eventRuns.filter((eventRun) => timespan.overlapsTimespan(eventRun.timespan));

  getRunTimespan = (runId: number) => this.runTimespansById.get(runId);

  groupEventRunsByCategory = (eventRuns: EventRun[]) => {
    const matchRules = this.config.buildCategoryMatchRules();
    const groups: ScheduleGroup[] = [];
    this.config.categoryGroups.forEach(({ match, ...otherProps }) =>
      groups.push({
        eventRuns: [],
        ...otherProps,
      }),
    );

    eventRuns.forEach((eventRun) => {
      const { runId } = eventRun;
      const run = this.runsById.get(runId);
      if (!run) {
        return;
      }
      const event = this.eventsById.get(run.event_id);
      if (!event) {
        return;
      }
      const { event_category: eventCategory } = event;

      const applicableRule = matchRules.find(({ matchRule }) => {
        if (
          isCategoryMatchRule(matchRule) &&
          matchRule.categoryName &&
          eventCategory.name === matchRule.categoryName
        ) {
          return true;
        }

        return isCatchAllMatchRule(matchRule);
      });

      if (applicableRule) {
        groups[applicableRule.targetGroupIndex].eventRuns.push(eventRun);
      }
    });

    return groups;
  };

  groupEventRunsByRoom = (eventRuns: EventRun[]) => {
    const runsByRoomMap = eventRuns.reduce((eventRunsByRoom, eventRun) => {
      const { runId } = eventRun;
      const run = this.runsById.get(runId);
      if (!run) {
        return eventRunsByRoom;
      }
      let roomNames = run.room_names;
      if (roomNames.length === 0) {
        roomNames = ['-'];
      }

      roomNames.forEach((roomName) => {
        if (!eventRunsByRoom.has(roomName)) {
          eventRunsByRoom.set(roomName, []);
        }

        eventRunsByRoom.set(roomName, [...(eventRunsByRoom.get(roomName) ?? []), eventRun]);
      });

      return eventRunsByRoom;
    }, new Map<string, EventRun[]>());

    const roomNames = [...runsByRoomMap.keys()].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' }),
    );

    return roomNames.map(
      (roomName) =>
        ({
          id: roomName,
          rowHeader: roomName,
          eventRuns: runsByRoomMap.get(roomName) ?? [],
        } as ScheduleGroup),
    );
  };

  buildScheduleBlocksFromGroups = (groups: ScheduleGroup[], actualTimespan: FiniteTimespan) => {
    const blocks = groups.map(
      ({ eventRuns, id, ...props }) =>
        [new ScheduleBlock(id, actualTimespan, eventRuns, this), props] as const,
    );

    if (this.config.filterEmptyGroups) {
      return blocks.filter((scheduleBlock) => scheduleBlock[0].eventRuns.length > 0);
    }

    return blocks;
  };

  buildLayoutForTimespanRange = (minTimespan: FiniteTimespan, maxTimespan: FiniteTimespan) => {
    const eventRuns = this.getEventRunsOverlapping(maxTimespan);
    const actualTimespan = expandTimespanToNearestHour(
      eventRuns.reduce(
        (currentMaxTimespan, eventRun) => currentMaxTimespan.expandedToFit(eventRun.timespan),
        minTimespan,
      ),
    );

    const groups =
      this.config.groupEventsBy === 'room'
        ? this.groupEventRunsByRoom(eventRuns)
        : this.groupEventRunsByCategory(eventRuns);

    return new ScheduleGridLayout(
      eventRuns,
      actualTimespan,
      this.buildScheduleBlocksFromGroups(groups, actualTimespan),
    );
  };

  buildLayoutForConventionDayTimespan = (conventionDayTimespan: FiniteTimespan) => {
    const minTimespan = conventionDayTimespan.clone();
    minTimespan.start.add(3, 'hours'); // start grid at 9am unless something is earlier
    minTimespan.finish.subtract(6, 'hours'); // end grid at midnight unless something is earlier

    return this.buildLayoutForTimespanRange(minTimespan, conventionDayTimespan);
  };

  shouldUseRowHeaders = () => this.config.groupEventsBy === 'room';

  shouldShowRun = (runId: number) => {
    const run = this.runsById.get(runId);
    if (!run) {
      return false;
    }
    const event = this.eventsById.get(run.event_id);
    if (!event) {
      return false;
    }

    if (this.hideConflicts) {
      const runTimespan = this.getRunTimespan(runId)!;
      const hasConflict = this.myConflictingRuns
        .filter((r) => r.id !== runId)
        .some((r) => this.getRunTimespan(r.id)?.overlapsTimespan(runTimespan));

      const acceptsCountedSignups = event.registration_policy?.buckets.some(
        (bucket) =>
          (!bucket.slots_limited || (bucket.total_slots != null && bucket.total_slots > 0)) &&
          !bucket.not_counted,
      );

      if (hasConflict && acceptsCountedSignups) {
        return false;
      }
    }

    if (this.myRatingFilter == null || this.myRatingFilter.length === 0) {
      return true;
    }

    return this.myRatingFilter.includes(event.my_rating || 0);
  };

  addFakeEventRun = (timespan: FiniteTimespan, title: string, displayTitle: string) => {
    const fakeEventRunId = this.nextFakeEventRunId;
    this.nextFakeEventRunId -= 1;

    const fakeEventRun: EventRun = {
      runId: fakeEventRunId,
      timespan,
    };

    const fakeRun: ScheduleRun = {
      id: fakeEventRunId,
      disableDetailsPopup: true,
      event_id: fakeEventRunId,
      my_signups: [],
      my_signup_requests: [],
      room_names: [],
      starts_at: timespan.start.toISOString(),
      confirmed_signup_count: 0,
      not_counted_signup_count: 0,
      signup_count_by_state_and_bucket_key_and_counted: JSON.stringify({
        confirmed: {},
        waitlisted: {},
        withdrawn: {},
      }),
    };

    const fakeEvent: ScheduleEvent = {
      id: fakeEventRunId,
      title,
      displayTitle,
      length_seconds: timespan.getLength('second'),
      can_play_concurrently: false,
      fake: true,
      event_category: {
        id: 0,
        name: 'Fake events',
        default_color: 'rgba(0, 0, 0, 0.1)',
        signed_up_color: 'transparent',
      },
      registration_policy: {
        buckets: [],
        total_slots: 0,
        slots_limited: true,
      },
      runs: [fakeRun],
    };

    this.eventsById.set(fakeEventRunId, fakeEvent);
    this.runsById.set(fakeEventRunId, fakeRun);
    this.runTimespansById.set(fakeEventRunId, timespan);
    this.eventRuns.push(fakeEventRun);

    return fakeEventRun;
  };
}
