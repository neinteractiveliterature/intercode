 
import { TFunction } from 'i18next';
import { DateTime, DateTimeUnit, Duration, DurationLike, DurationUnit } from 'luxon';
import { chooseAmong, preferNull, notEmpty } from '@neinteractiveliterature/litform';

import {
  compareTimesAscending,
  compareTimesDescending,
  humanizeTime,
  timesAreSameOrBothNull,
  formatLCM,
  getDateTimeFormat,
} from './TimeUtils';
import { DateTimeFormatKey } from './DateTimeFormats';

export type TimeHopOptions = {
  unit: DateTimeUnit;
  offset?: Duration | null;
  duration?: number | null;
};

export interface FiniteTimespan extends Timespan {
  start: DateTime;
  finish: DateTime;
  clone(): FiniteTimespan;
  tz(timezoneName: string): FiniteTimespan;
  getLength(unit: DurationUnit): Duration;
  union(other: FiniteTimespan): FiniteTimespan;
  intersection(other: FiniteTimespan): FiniteTimespan;
  expandedToFit(other: FiniteTimespan): FiniteTimespan;
  expand(amount: DurationLike): FiniteTimespan;
  expandStart(amount: DurationLike): FiniteTimespan;
  expandFinish(amount: DurationLike): FiniteTimespan;
}

export function isFinite(timespan: Timespan): timespan is FiniteTimespan {
  return timespan.start != null && timespan.finish != null;
}

export class InfiniteTimespanError extends Error {}

class Timespan {
  start: DateTime | null | undefined;

  finish: DateTime | null | undefined;

  static finiteFromStrings(start: string, finish: string): FiniteTimespan {
    return new Timespan(DateTime.fromISO(start), DateTime.fromISO(finish)) as FiniteTimespan;
  }

  static fromStrings(start?: string | null, finish?: string | null): Timespan {
    return new Timespan(
      start != null ? DateTime.fromISO(start) : null,
      finish != null ? DateTime.fromISO(finish) : null,
    );
  }

  static finiteFromDateTimes(start: DateTime, finish: DateTime): FiniteTimespan {
    return new Timespan(start, finish) as FiniteTimespan;
  }

  static fromDateTimes(start?: DateTime | null, finish?: DateTime | null): Timespan {
    return new Timespan(start, finish);
  }

  constructor(start?: DateTime | null, finish?: DateTime | null) {
    if (start && finish && start > finish) {
      throw new Error('Start cannot be after finish');
    }

    if (start && !start.isValid) {
      throw new Error('Start time is invalid');
    }

    if (finish && !finish.isValid) {
      throw new Error('Finish time is invalid');
    }

    this.start = start;
    this.finish = finish;
  }

  tz(timezoneName: string): Timespan {
    return new Timespan(
      this.start != null ? this.start.setZone(timezoneName) : null,
      this.finish != null ? this.finish.setZone(timezoneName) : null,
    );
  }

  isFinite(): this is FiniteTimespan {
    return isFinite(this);
  }

  includesTime(time: DateTime): boolean {
    return (this.start == null || this.start <= time) && (this.finish == null || this.finish > time);
  }

  includesTimespan(other: Timespan): boolean {
    return (
      (this.start == null || (other.start != null && this.start <= other.start)) &&
      (this.finish == null || (other.finish != null && this.finish >= other.finish))
    );
  }

  overlapsTimespan(other: Timespan): boolean {
    return (
      (this.start == null || other.finish == null || this.start < other.finish) &&
      (this.finish == null || other.start == null || other.start < this.finish)
    );
  }

  isSame(other: Timespan): boolean {
    return timesAreSameOrBothNull(this.start, other.start) && timesAreSameOrBothNull(this.finish, other.finish);
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
    return new Timespan(this.start?.minus(amount), this.finish);
  }

  expandFinish(amount: DurationLike): Timespan {
    return new Timespan(this.start, this.finish?.plus(amount));
  }

  expand(amount: DurationLike): Timespan {
    return new Timespan(this.start?.minus(amount), this.finish?.plus(amount));
  }

  expandedToFit = this.union;

  getLength(unit: DurationUnit = 'milliseconds'): Duration | null {
    if (!this.isFinite()) {
      return null;
    }

    return this.finish.diff(this.start, unit);
  }

  /** @deprecated */
  humanizeStartInTimezone(timezoneName: string, t: TFunction, format?: DateTimeFormatKey): string {
    if (this.start == null) {
      return formatLCM(DateTime.local(), getDateTimeFormat('anytime', t));
    }

    const start = this.start.setZone(timezoneName);
    if (format != null) {
      return formatLCM(start, getDateTimeFormat(format, t));
    }

    return humanizeTime(start, t, true);
  }

  /** @deprecated */
  humanizeFinishInTimezone(timezoneName: string, t: TFunction, format?: DateTimeFormatKey): string {
    if (this.finish == null) {
      return formatLCM(DateTime.local(), getDateTimeFormat('indefinitely', t));
    }

    const finish = this.finish.setZone(timezoneName);
    if (format != null) {
      return formatLCM(finish, getDateTimeFormat(format, t));
    }

    if (this.start == null) {
      return humanizeTime(finish, t, true);
    }

    const start = this.start.setZone(timezoneName);
    const includeDayInFinish = finish.day !== start.day;

    return humanizeTime(finish, t, includeDayInFinish);
  }

  /** @deprecated */
  humanizeInTimezone(
    timezoneName: string,
    t: TFunction,
    startFormat?: DateTimeFormatKey,
    finishFormat?: DateTimeFormatKey,
  ): string {
    if (this.start == null && this.finish == null) {
      return 'always';
    }

    const start = this.humanizeStartInTimezone(timezoneName, t, startFormat);
    const finish = this.humanizeFinishInTimezone(
      timezoneName,
      t,
      this.start == null || this.finish == null || this.finish.day !== this.start.day
        ? startFormat
        : finishFormat || startFormat,
    );

    if (this.humanizeFinishInTimezone(timezoneName, t, startFormat) === start) {
      return start;
    }

    return `${start} - ${finish}`;
  }

  getTimeHopsWithin(
    timezoneName: string,
    { unit, offset = undefined, duration = undefined }: TimeHopOptions,
  ): DateTime[] {
    if (!this.isFinite()) {
      throw new InfiniteTimespanError('getTimeHopsWithin called on an infinite timespan');
    }

    const timeBlocks: DateTime[] = [];
    const stepDuration = Duration.fromObject({ [unit]: duration ?? 1 });
    let now = this.start.setZone(timezoneName).startOf(unit);
    while (now < this.finish) {
      let timeHop = now;
      if (offset) {
        timeHop = timeHop.plus(offset);
      }
      timeBlocks.push(timeHop);
      now = now.plus(stepDuration);
    }

    return timeBlocks;
  }

  getTimespansWithin(
    timezoneName: string,
    { unit, offset = undefined, duration = undefined }: TimeHopOptions,
  ): FiniteTimespan[] {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const thisTimespan = this;
    if (!thisTimespan.isFinite()) {
      throw new InfiniteTimespanError('getTimespansWithin called on an infinite Timespan');
    }

    const stepDuration = Duration.fromObject({ [unit]: duration ?? 1 });
    const timeHops = thisTimespan.getTimeHopsWithin(timezoneName, { unit, offset, duration });
    const expandStart = timeHops.length > 0 && timeHops[0] > thisTimespan.start;
    return timeHops
      .map((timeHop, i) => {
        const effectiveStart = i === 0 && expandStart ? thisTimespan.start : timeHop;
        if (i < timeHops.length - 1) {
          return Timespan.finiteFromDateTimes(effectiveStart, timeHops[i + 1]).intersection(thisTimespan);
        }

        if (offset) {
          return Timespan.finiteFromDateTimes(
            effectiveStart,
            timeHop.minus(offset).plus(stepDuration).plus(offset),
          ).intersection(thisTimespan);
        }

        return Timespan.finiteFromDateTimes(effectiveStart, timeHop.plus(stepDuration)).intersection(thisTimespan);
      })
      .filter(notEmpty)
      .map((timespan) => timespan.tz(timezoneName));
  }

  clone(): Timespan {
    return new Timespan(this.start != null ? this.start : null, this.finish != null ? this.finish : null);
  }
}

export default Timespan;
