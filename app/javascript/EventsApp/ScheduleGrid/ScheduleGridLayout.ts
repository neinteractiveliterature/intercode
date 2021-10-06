import { FiniteTimespan } from '../../Timespan';
import type Schedule from './Schedule';

export default class ScheduleGridLayout {
  runIds: string[];

  timespan: FiniteTimespan;

  blocksWithOptions: ReturnType<Schedule['buildScheduleBlocksFromGroups']>;

  constructor(
    runIds: string[],
    timespan: FiniteTimespan,
    blocksWithOptions: ReturnType<Schedule['buildScheduleBlocksFromGroups']>,
  ) {
    this.runIds = runIds;
    this.timespan = timespan;
    this.blocksWithOptions = blocksWithOptions;
  }
}
