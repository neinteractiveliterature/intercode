import moment from 'moment-timezone';

const timeIsOnTheHour = time => (
  time.millisecond() === 0 && time.second() === 0 && time.minute() === 0
);

const humanTimeFormat = (time) => {
  if (timeIsOnTheHour(time)) {
    if (time.hour() === 0) {
      return '[midnight]';
    }

    if (time.hour() === 12) {
      return '[noon]';
    }
  }

  return 'h:mma';
};

const humanizeTime = (time, includeDay) => {
  let timeFormat = humanTimeFormat(time);
  if (includeDay) {
    timeFormat = `ddd ${timeFormat}`;
  }

  return time.format(timeFormat);
};

const onlyOneIsNull = (a, b) => (
  (a == null && b != null) ||
  (a != null && b == null)
);

const timesAreSameOrBothNull = (a, b) => {
  if (onlyOneIsNull(a, b)) {
    return false;
  }

  return (a == null && b == null) || a.isSame(b);
};

const compareMomentsAscending = (a, b) => {
  if (a.isBefore(b)) {
    return -1;
  }

  if (b.isBefore(a)) {
    return 1;
  }

  return 0;
};

const compareMomentsDescending = (a, b) => compareMomentsAscending(b, a);

const chooseAmong = (values, sortFunction) => {
  const nonNullValues = values.filter(value => value != null);
  return nonNullValues.sort(sortFunction)[0];
};

class Timespan {
  static fromStrings(start, finish) {
    return new Timespan(
      (start != null ? moment(start) : null),
      (finish != null ? moment(finish) : null),
    );
  }

  constructor(start, finish) {
    if (start && finish && start.isAfter(finish)) {
      throw new Error('Start cannot be after finish');
    }

    this.start = start;
    this.finish = finish;
  }

  tz(timezoneName) {
    return new Timespan(
      (this.start != null ? this.start.tz(timezoneName) : null),
      (this.finish != null ? this.finish.tz(timezoneName) : null),
    );
  }

  isFinite() {
    return (this.start != null && this.finish != null);
  }

  includesTime(time) {
    return (
      (this.start == null || this.start.isSameOrBefore(time)) &&
      (this.finish == null || this.finish.isAfter(time))
    );
  }

  includesTimespan(other) {
    return (
      (this.start == null || other.start == null || this.start.isSameOrBefore(other.start)) &&
      (this.finish == null || other.finish == null || this.finish.isSameOrAfter(other.finish))
    );
  }

  overlapsTimespan(other) {
    return (
      (this.start == null || other.finish == null || this.start.isBefore(other.finish)) &&
      (this.finish == null || other.start == null || other.start.isBefore(this.finish))
    );
  }

  isSame(other) {
    return (
      timesAreSameOrBothNull(this.start, other.start) &&
      timesAreSameOrBothNull(this.finish, other.finish)
    );
  }

  intersection(other) {
    return new Timespan(
      chooseAmong([this.start, other.start], compareMomentsDescending),
      chooseAmong([this.finish, other.finish], compareMomentsAscending),
    );
  }

  union(other) {
    return new Timespan(
      chooseAmong([this.start, other.start], compareMomentsAscending),
      chooseAmong([this.finish, other.finish], compareMomentsDescending),
    );
  }

  expandedToFit(other) {
    return this.union(other);
  }

  getLength(unit = 'millisecond') {
    if (!this.isFinite()) {
      return null;
    }

    return this.finish.diff(this.start, unit);
  }

  humanizeStartInTimezone(timezoneName) {
    if (this.start == null) {
      return 'anytime';
    }

    const start = this.start.tz(timezoneName);
    return humanizeTime(start, true);
  }

  humanizeFinishInTimezone(timezoneName) {
    if (this.finish == null) {
      return 'indefinitely';
    }

    const start = this.start.tz(timezoneName);
    const finish = this.finish.tz(timezoneName);
    const includeDayInFinish = (finish.date() !== start.date());

    return humanizeTime(finish, includeDayInFinish);
  }

  humanizeInTimezone(timezoneName) {
    return `${this.humanizeStartInTimezone(timezoneName)} - ${this.humanizeFinishInTimezone(timezoneName)}`;
  }

  getTimeHopsWithin(timezoneName, unit, offset) {
    if (!this.isFinite()) {
      throw new Error(`getTimeHopsWithin called on an infinite Timespan ${this.humanizeInTimezone(timezoneName)}`);
    }

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

  getTimespansWithin(timezoneName, unit, offset) {
    if (!this.isFinite()) {
      throw new Error(`getTimespansWithin called on an infinite Timespan ${this.humanizeInTimezone(timezoneName)}`);
    }

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

  clone() {
    return new Timespan(
      (this.start != null ? this.start.clone() : null),
      (this.finish != null ? this.finish.clone() : null),
    );
  }
}

export default Timespan;
