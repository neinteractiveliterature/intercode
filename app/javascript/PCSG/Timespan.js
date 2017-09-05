// @flow

import moment from 'moment';

class Timespan {
  start: moment;
  finish: moment;

  constructor(start: moment, finish: moment) {
    if (start.isAfter(finish)) {
      throw new Error('Start cannot be after finish');
    }

    this.start = start;
    this.finish = finish;
  }

  includesTime(time: moment) {
    return (this.start.isSameOrBefore(time) && this.finish.isAfter(time));
  }

  includesTimespan(other: Timespan) {
    return this.start.isSameOrBefore(other.start) && this.finish.isSameOrAfter(other.finish);
  }

  overlapsTimespan(other: Timespan) {
    return this.start.isBefore(other.finish) && other.start.isBefore(this.finish);
  }

  expandedToFit(other: Timespan): Timespan {
    let newStart = this.start;
    let newFinish = this.finish;

    if (newStart.isAfter(other.start)) {
      newStart = other.start;
    }

    if (newFinish.isBefore(other.finish)) {
      newFinish = other.finish;
    }

    return new Timespan(newStart, newFinish);
  }

  getLength(unit: string = 'millisecond'): number {
    return this.finish.diff(this.start, unit);
  }

  clone(): Timespan {
    return new Timespan(this.start.clone(), this.finish.clone());
  }
}

export default Timespan;
