import { FiniteTimespan } from '../../Timespan';
import type Schedule from './Schedule';

export default class ScheduleGridLayout {
  runIds: number[];

  timespan: FiniteTimespan;

  blocksWithOptions: ReturnType<Schedule['buildScheduleBlocksFromGroups']>;

  constructor(
    runIds: number[],
    timespan: FiniteTimespan,
    blocksWithOptions: ReturnType<Schedule['buildScheduleBlocksFromGroups']>,
  ) {
    this.runIds = runIds;
    this.timespan = timespan;
    this.blocksWithOptions = blocksWithOptions;
  }
}
