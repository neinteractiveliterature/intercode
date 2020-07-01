import { DateTime, Duration } from 'luxon';
import type { DurationObject, DurationUnit } from 'luxon';
import {
  compareTimesAscending,
  compareTimesDescending,
  humanizeTime,
  timesAreSameOrBothNull,
  lowercaseMeridiem,
} from './TimeUtils';
import { chooseAmong, preferNull, notEmpty } from './ValueUtils';

type DurationLike = Duration | number | DurationObject;

export type TimeHopOptions = {
  unit: DurationUnit,
  offset?: DurationLike | null,
  duration?: DurationLike | null
};

export interface FiniteTimespan extends Timespan {
  start: DateTime;
  finish: DateTime;
  clone(): FiniteTimespan;
  getLength(unit: DurationUnit): number,
  union(other: FiniteTimespan): FiniteTimespan,
  expandedToFit(other: FiniteTimespan): FiniteTimespan,
  expand(amount: DurationLike): FiniteTimespan,
  expandStart(amount: DurationLike): FiniteTimespan,
  expandFinish(amount: DurationLike): FiniteTimespan,
}

class Timespan {
  start?: DateTime | null;

  finish?: DateTime | null;

  static fromDateTimes(start: DateTime, finish: DateTime): FiniteTimespan;
  static fromDateTimes(start?: DateTime | null, finish?: DateTime | null): Timespan;
  static fromDateTimes(start?: DateTime | null, finish?: DateTime | null): Timespan {
    return new Timespan(start, finish);
  }

  static fromStrings(start: string, finish: string): FiniteTimespan;
  static fromStrings(start?: string | null, finish?: string | null): Timespan;
  static fromStrings(start?: string | null, finish?: string | null): Timespan {
    return new Timespan(
      (start != null ? DateTime.fromISO(start) : null),
      (finish != null ? DateTime.fromISO(finish) : null),
    );
  }

  constructor(start?: DateTime | null, finish?: DateTime | null) {
    if (start && finish && start > finish) {
      throw new Error('Start cannot be after finish');
    }

    this.start = start ?? null;
    this.finish = finish ?? null;
  }

  setZone(timezoneName: string): Timespan {
    return new Timespan(
      (this.start != null ? this.start.setZone(timezoneName) : null),
      (this.finish != null ? this.finish.setZone(timezoneName) : null),
    );
  }

  tz(timezoneName: string): Timespan {
    return this.setZone(timezoneName);
  }

  isFinite(): this is FiniteTimespan {
    return (this.start != null && this.finish != null);
  }

  includesTime(time: DateTime): boolean {
    return (
      (this.start == null || this.start <= time)
      && (this.finish == null || this.finish > time)
    );
  }

  includesTimespan(other: Timespan): boolean {
    return (
      (this.start == null || (other.start != null && this.start <= other.start))
      && (this.finish == null || (other.finish != null && this.finish >= other.finish))
    );
  }

  overlapsTimespan(other: Timespan): boolean {
    return (
      (this.start == null || other.finish == null || this.start < other.finish)
      && (this.finish == null || other.start == null || other.start < this.finish)
    );
  }

  isSame(other: Timespan): boolean {
    return (
      timesAreSameOrBothNull(this.start, other.start)
      && timesAreSameOrBothNull(this.finish, other.finish)
    );
  }

  intersection(other: Timespan): Timespan | null {
    if (!this.overlapsTimespan(other)) {
      return null;
    }

    return new Timespan(
      chooseAmong([this.start, other.start], compareTimesDescending),
      chooseAmong([this.finish, other.finish], compareTimesAscending),
    );
  }

  union(other: Timespan): Timespan {
    return new Timespan(
      chooseAmong([this.start, other.start], preferNull(compareTimesAscending), true),
      chooseAmong([this.finish, other.finish], preferNull(compareTimesDescending), true),
    );
  }

  expandStart(amount: DurationLike): Timespan {
    return new Timespan(
      this.start?.minus(amount),
      this.finish,
    );
  }

  expandFinish(amount: DurationLike): Timespan {
    return new Timespan(
      this.start,
      this.finish?.plus(amount),
    );
  }

  expand(amount: DurationLike): Timespan {
    return new Timespan(
      this.start?.minus(amount),
      this.finish?.plus(amount),
    );
  }

  expandedToFit = this.union;

  getLength(unit: DurationUnit): number | null {
    if (this.finish == null || this.start == null) {
      return null;
    }

    return this.finish.diff(this.start, unit).as(unit);
  }

  humanizeStartInTimezone(timezoneName: string, format?: string): string {
    if (this.start == null) {
      return 'anytime';
    }

    const start = this.start.setZone(timezoneName);
    if (format != null) {
      return lowercaseMeridiem(start.toFormat(format));
    }

    return humanizeTime(start, true);
  }

  humanizeFinishInTimezone(timezoneName: string, format?: string): string {
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

  humanizeInTimezone(timezoneName: string, startFormat?: string, finishFormat?: string): string {
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

  getTimeHopsWithin(
    timezoneName: string,
    { unit, offset = null, duration = null }: TimeHopOptions,
  ): DateTime[] {
    if (this.start == null || this.finish == null) {
      throw new Error(`getTimeHopsWithin called on an infinite Timespan ${this.humanizeInTimezone(timezoneName)}`);
    }

    // Luxon currently allows singular or plural object keys, even though it's not documented
    // This might change in the future so if this breaks let's revisit this
    const effectiveDuration = duration ?? Duration.fromObject({ [unit]: 1 });
    const timeHops: DateTime[] = [];
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

  getTimespansWithin(
    timezoneName: string,
    { unit, offset = 0, duration = null }: TimeHopOptions,
  ): FiniteTimespan[] {
    if (!this.isFinite()) {
      throw new Error(`getTimespansWithin called on an infinite Timespan ${this.humanizeInTimezone(timezoneName)}`);
    }

    // Luxon currently allows singular or plural object keys, even though it's not documented
    // This might change in the future so if this breaks let's revisit this
    const effectiveDuration = duration ?? Duration.fromObject({ [unit]: 1 });
    const timeHops = this.getTimeHopsWithin(timezoneName,
      { unit, offset, duration: effectiveDuration });
    const timespansOrNull = timeHops.map((timeHop, i) => {
      if (i < timeHops.length - 1) {
        return (<FiniteTimespan>
          new Timespan(timeHop, timeHops[i + 1]).intersection(this.setZone(timezoneName)));
      }

      if (offset) {
        return (<FiniteTimespan> new Timespan(
          timeHop,
          timeHop.minus(offset).plus(effectiveDuration).plus(offset),
        ).intersection(this));
      }

      return (<FiniteTimespan> new Timespan(timeHop, timeHop.plus(effectiveDuration))
        .intersection(this.setZone(timezoneName)));
    });

    return timespansOrNull.filter(notEmpty);
  }

  clone(): Timespan {
    return new Timespan(
      (this.start != null ? this.start : null),
      (this.finish != null ? this.finish : null),
    );
  }
}

export default Timespan;
