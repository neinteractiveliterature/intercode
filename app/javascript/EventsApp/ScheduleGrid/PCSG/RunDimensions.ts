import EventRun from './EventRun';

class RunDimensions {
  eventRun: EventRun;

  laneIndex: number;

  timePlacement: number;

  timeSpan: number;

  constructor(
    eventRun: EventRun,
    laneIndex: number,
    timePlacement: number,
    timeSpan: number,
  ) {
    this.eventRun = eventRun;
    this.laneIndex = laneIndex;
    this.timePlacement = timePlacement;
    this.timeSpan = timeSpan;
  }
}

export default RunDimensions;
