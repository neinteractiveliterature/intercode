// @flow

import RunDimensions from './RunDimensions';

export default class ScheduleLayoutResult {
  runDimensions: Array<RunDimensions>;
  laneCount: number;

  constructor(runDimensions: Array<RunDimensions>, laneCount: number) {
    this.runDimensions = runDimensions;
    this.laneCount = laneCount;
  }
}
