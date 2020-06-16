import { DateTime, Duration } from 'luxon';
import {
  compareTimesAscending,
  compareTimesDescending,
  humanizeTime,
  timesAreSameOrBothNull,
  lowercaseMeridiem,
} from './TimeUtils';
import { chooseAmong, preferNull } from './ValueUtils';

class Timespan {
  static fromStrings(start, finish) {
    return new Timespan(
      (start != null ? DateTime.fromISO(start) : null),
      (finish != null ? DateTime.fromISO(finish) : null),
    );
  }

  constructor(start, finish) {
    if (start && finish && start > finish) {
      throw new Error('Start cannot be after finish');
    }

    this.start = start;
    this.finish = finish;
  }

  setZone(timezoneName) {
    return new Timespan(
      (this.start != null ? this.start.setZone(timezoneName) : null),
      (this.finish != null ? this.finish.setZone(timezoneName) : null),
    );
  }

  tz(timezoneName) {
    return this.setZone(timezoneName);
  }

  isFinite() {
    return (this.start != null && this.finish != null);
  }

  includesTime(time) {
    return (
      (this.start == null || this.start <= time)
      && (this.finish == null || this.finish > time)
    );
  }

  includesTimespan(other) {
    return (
      (this.start == null || (other.start != null && this.start <= other.start))
      && (this.finish == null || (other.finish != null && this.finish >= other.finish))
    );
  }

  overlapsTimespan(other) {
    return (
      (this.start == null || other.finish == null || this.start < other.finish)
      && (this.finish == null || other.start == null || other.start < this.finish)
    );
  }

  isSame(other) {
    return (
      timesAreSameOrBothNull(this.start, other.start)
      && timesAreSameOrBothNull(this.finish, other.finish)
    );
  }

  intersection(other) {
    if (!this.overlapsTimespan(other)) {
      return null;
    }

    return new Timespan(
      chooseAmong([this.start, other.start], compareTimesDescending),
      chooseAmong([this.finish, other.finish], compareTimesAscending),
    );
  }

  union(other) {
    return new Timespan(
      chooseAmong([this.start, other.start], preferNull(compareTimesAscending), true),
      chooseAmong([this.finish, other.finish], preferNull(compareTimesDescending), true),
    );
  }

  expandStart(...args) {
    return new Timespan(
      this.start.minus(...args),
      this.finish,
    );
  }

  expandFinish(...args) {
    return new Timespan(
      this.start,
      this.finish.plus(...args),
    );
  }

  expand(...args) {
    return new Timespan(
      this.start.minus(...args),
      this.finish.plus(...args),
    );
  }

  expandedToFit = this.union

  getLength(unit = 'millisecond') {
    if (!this.isFinite()) {
      return null;
    }

    return this.finish.diff(this.start, unit)[unit];
  }

  humanizeStartInTimezone(timezoneName, format) {
    if (this.start == null) {
      return 'anytime';
    }

    const start = this.start.setZone(timezoneName);
    if (format != null) {
      return lowercaseMeridiem(start.toFormat(format));
    }

    return humanizeTime(start, true);
  }

  humanizeFinishInTimezone(timezoneName, format) {
    if (this.finish == null) {
      return 'indefinitely';
    }

    const finish = this.finish.setZone(timezoneName);
    if (format != null) {
      return lowercaseMeridiem(finish.toFormat(format));
    }

    if (this.start == null) {
      return humanizeTime(finish, true);
    }

    const start = this.start.setZone(timezoneName);
    const includeDayInFinish = (finish.day !== start.day);

    return humanizeTime(finish, includeDayInFinish);
  }

  humanizeInTimezone(timezoneName, startFormat, finishFormat) {
    if (this.start == null && this.finish == null) {
      return 'always';
    }

    const start = this.humanizeStartInTimezone(timezoneName, startFormat);
    const finish = this.humanizeFinishInTimezone(
      timezoneName,
      this.start == null || this.finish == null || this.finish.day !== this.start.day
        ? startFormat
        : finishFormat || startFormat,
    );

    if (this.humanizeFinishInTimezone(timezoneName, startFormat) === start) {
      return start;
    }

    return `${start} - ${finish}`;
  }

  getTimeHopsWithin(timezoneName, { unit, offset = null, duration = null }) {
    if (!this.isFinite()) {
      throw new Error(`getTimeHopsWithin called on an infinite Timespan ${this.humanizeInTimezone(timezoneName)}`);
    }

    // Luxon currently allows singular or plural object keys, even though it's not documented
    // This might change in the future so if this breaks let's revisit this
    const effectiveDuration = duration ?? Duration.fromObject({ [unit]: 1 });
    const timeHops = [];
    let now = this.start.setZone(timezoneName).startOf(unit);
    while (now < this.finish) {
      let timeHop = now;
      if (offset) {
        timeHop = timeHop.plus(offset);
      }
      timeHops.push(timeHop);
      now = now.plus(effectiveDuration);
    }

    return timeHops;
  }

  getTimespansWithin(timezoneName, { unit, offset = 0, duration = null }) {
    if (!this.isFinite()) {
      throw new Error(`getTimespansWithin called on an infinite Timespan ${this.humanizeInTimezone(timezoneName)}`);
    }

    // Luxon currently allows singular or plural object keys, even though it's not documented
    // This might change in the future so if this breaks let's revisit this
    const effectiveDuration = duration ?? Duration.fromObject({ [unit]: 1 });
    const timeHops = this.getTimeHopsWithin(timezoneName,
      { unit, offset, duration: effectiveDuration });
    return timeHops.map((timeHop, i) => {
      if (i < timeHops.length - 1) {
        return new Timespan(timeHop, timeHops[i + 1]).intersection(this.setZone(timezoneName));
      }

      if (offset) {
        return new Timespan(
          timeHop,
          timeHop.minus(offset).plus(effectiveDuration).plus(offset),
        ).intersection(this);
      }

      return new Timespan(timeHop, timeHop.plus(effectiveDuration))
        .intersection(this.setZone(timezoneName));
    }).filter((timespan) => timespan != null);
  }

  clone() {
    return new Timespan(
      (this.start != null ? this.start : null),
      (this.finish != null ? this.finish : null),
    );
  }
}

export default Timespan;
