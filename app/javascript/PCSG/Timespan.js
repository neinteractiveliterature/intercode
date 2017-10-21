// @flow

import moment from 'moment-timezone';

const humanizeTime = (time, includeDay) => {
  if (time.millisecond() === 0 && time.second() === 0 && time.minute() === 0) {
    if (time.hour() === 0) {
      if (includeDay) {
        return `${time.format('ddd')} midnight`;
      }

      return 'midnight';
    }

    if (time.hour() === 12) {
      if (includeDay) {
        return `${time.format('ddd')} noon`;
      }

      return 'noon';
    }
  }

  if (includeDay) {
    return time.format('ddd h:mma');
  }

  return time.format('h:mma');
};

class Timespan {
  start: moment;
  finish: moment;

  static fromStrings(start: string, finish: string): Timespan {
    return new Timespan(moment(start), moment(finish));
  }

  constructor(start: moment, finish: moment) {
    if (start.isAfter(finish)) {
      throw new Error('Start cannot be after finish');
    }

    this.start = start;
    this.finish = finish;
  }

  tz(timezoneName: string) {
    return new Timespan(this.start.tz(timezoneName), this.finish.tz(timezoneName));
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

  isSame(other: Timespan) {
    return this.start.isSame(other.start) && this.finish.isSame(other.finish);
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

  union(other: Timespan): Timespan {
    return this.expandedToFit(other);
  }

  intersection(other: Timespan): Timespan {
    let newStart = this.start;
    let newFinish = this.finish;

    if (newStart.isBefore(other.start)) {
      newStart = other.start;
    }

    if (newFinish.isAfter(other.finish)) {
      newFinish = other.finish;
    }

    return new Timespan(newStart, newFinish);
  }

  getLength(unit: string = 'millisecond'): number {
    return this.finish.diff(this.start, unit);
  }

  humanizeInTimezone(timezoneName: string): string {
    const start = this.start.tz(timezoneName);
    const finish = this.finish.tz(timezoneName);

    const includeDayInFinish = (finish.date() !== start.date());

    return `${humanizeTime(start, true)} - ${humanizeTime(finish, includeDayInFinish)}`;
  }

  getTimeHopsWithin(
    timezoneName: string,
    unit: string,
    offset: ?moment.duration,
  ): Array<moment> {
    const timeBlocks = [];
    const now = this.start.clone().tz(timezoneName).startOf(unit);
    while (now.isBefore(this.finish)) {
      const timeHop = now.clone();
      if (offset) {
        timeHop.add(offset);
      }
      timeBlocks.push(timeHop);
      now.add(1, unit);
    }

    return timeBlocks;
  }

  getTimespansWithin(
    timezoneName: string,
    unit: string,
    offset: ?moment.duration,
  ): Array<Timespan> {
    const timeHops = this.getTimeHopsWithin(timezoneName, unit, offset);
    return timeHops.map((timeHop, i) => {
      if (i < timeHops.length - 1) {
        return new Timespan(timeHop, timeHops[i + 1]);
      }

      if (offset) {
        return new Timespan(timeHop, timeHop.clone().subtract(offset).add(1, unit).add(offset));
      }

      return new Timespan(timeHop, timeHop.clone().add(1, unit));
    });
  }

  clone(): Timespan {
    return new Timespan(this.start.clone(), this.finish.clone());
  }
}

export default Timespan;
