import EventRun from './PCSG/EventRun';
import { FiniteTimespan } from '../../Timespan';
import ScheduleBlock from './PCSG/ScheduleBlock';

export type ScheduleBlockWithOptions = [ScheduleBlock, {
  rowHeader?: string,
}];

export default class ScheduleGridLayout {
  eventRuns: EventRun[];

  timespan: FiniteTimespan;

  blocksWithOptions: ScheduleBlockWithOptions[];

  constructor(
    eventRuns: EventRun[], timespan: FiniteTimespan, blocksWithOptions: ScheduleBlockWithOptions[],
  ) {
    this.eventRuns = eventRuns;
    this.timespan = timespan;
    this.blocksWithOptions = blocksWithOptions;
  }
}
