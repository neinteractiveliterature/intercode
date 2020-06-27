import RunDimensions from './RunDimensions';

export default class ScheduleLayoutResult {
  runDimensions: RunDimensions[];

  laneCount: number;

  constructor(runDimensions: RunDimensions[], laneCount: number) {
    this.runDimensions = runDimensions;
    this.laneCount = laneCount;
  }
}
