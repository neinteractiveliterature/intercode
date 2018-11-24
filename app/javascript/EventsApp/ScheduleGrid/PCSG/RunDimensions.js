class RunDimensions {
  constructor(
    eventRun,
    laneIndex,
    timePlacement,
    timeSpan,
    lanePlacement,
    laneSpan,
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
