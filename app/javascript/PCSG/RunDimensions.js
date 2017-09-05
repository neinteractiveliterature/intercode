// @flow

import EventRun from './EventRun';

class RunDimensions {
  eventRun: EventRun;
  laneIndex: number;
  timePlacement: number;
  timeSpan: number;
  lanePlacement: ?number;
  laneSpan: ?number;

  constructor(
    eventRun: EventRun,
    laneIndex: number,
    timePlacement: number,
    timeSpan: number,
    lanePlacement: ?number,
    laneSpan: ?number,
  ) {
    this.eventRun = eventRun;
    this.lanePlacement = lanePlacement;
    this.laneSpan = laneSpan;
    this.laneIndex = laneIndex;
    this.timePlacement = timePlacement;
    this.timeSpan = timeSpan;
  }
}

export default RunDimensions;
