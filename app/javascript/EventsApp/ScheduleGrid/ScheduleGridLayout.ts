import { FiniteTimespan } from '../../Timespan';
import EventRun from './PCSG/EventRun';
import type Schedule from './Schedule';

export default class ScheduleGridLayout {
  eventRuns: EventRun[];

  timespan: FiniteTimespan;

  blocksWithOptions: ReturnType<Schedule['buildScheduleBlocksFromGroups']>;

  constructor(
    eventRuns: EventRun[],
    timespan: FiniteTimespan,
    blocksWithOptions: ReturnType<Schedule['buildScheduleBlocksFromGroups']>,
  ) {
    this.eventRuns = eventRuns;
    this.timespan = timespan;
    this.blocksWithOptions = blocksWithOptions;
  }
}
