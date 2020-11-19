import {
  Duration,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfMonth,
  startOfSecond,
  startOfYear,
  startOfWeek,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
  differenceInWeeks,
  differenceInMilliseconds,
  parseISO,
  getDate,
  isBefore,
  isEqual,
  isAfter,
  sub,
  add,
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc, OptionsWithTZ } from 'date-fns-tz';
import { assertNever } from 'assert-never';
import {
  compareTimesAscending,
  compareTimesDescending,
  humanizeTime,
  timesAreSameOrBothNull,
  formatWithLowercaseMeridiemHack,
} from './TimeUtils';
import { chooseAmong, preferNull, notEmpty } from './ValueUtils';

export type TimeUnit = keyof Duration;

export type TimeHopOptions = {
  unit: TimeUnit;
  offset?: Duration | null;
  step?: number | null;
};

export interface FiniteTimespan extends Timespan {
  start: Date;
  finish: Date;
  clone(): FiniteTimespan;
  getLength(unit: TimeUnit | 'milliseconds'): number;
  getLocalStart(): Date;
  getLocalFinish(): Date;
  union(other: FiniteTimespan): FiniteTimespan;
  intersection(other: FiniteTimespan): FiniteTimespan;
  expandedToFit(other: FiniteTimespan): FiniteTimespan;
  expand(amount: Duration): FiniteTimespan;
  expandStart(amount: Duration): FiniteTimespan;
  expandFinish(amount: Duration): FiniteTimespan;
  tz(timezoneName: string): FiniteTimespan;
}

export function isFinite(timespan: Timespan): timespan is FiniteTimespan {
  return timespan.start != null && timespan.finish != null;
}

function startOfUnit(date: Date, unit: TimeUnit) {
  switch (unit) {
    case 'years':
      return startOfYear(date);
    case 'weeks':
      return startOfWeek(date);
    case 'months':
      return startOfMonth(date);
    case 'days':
      return startOfDay(date);
    case 'hours':
      return startOfHour(date);
    case 'minutes':
      return startOfMinute(date);
    case 'seconds':
      return startOfSecond(date);
    default:
      assertNever(unit);
      return date;
  }
}

function diffUnit(a: Date, b: Date, unit: TimeUnit | 'milliseconds') {
  switch (unit) {
    case 'years':
      return differenceInYears(a, b);
    case 'weeks':
      return differenceInWeeks(a, b);
    case 'months':
      return differenceInMonths(a, b);
    case 'days':
      return differenceInDays(a, b);
    case 'hours':
      return differenceInHours(a, b);
    case 'minutes':
      return differenceInMinutes(a, b);
    case 'seconds':
      return differenceInSeconds(a, b);
    case 'milliseconds':
      return differenceInMilliseconds(a, b);
    default:
      assertNever(unit);
      return 0;
  }
}

class Timespan {
  start: Date | null | undefined;

  finish: Date | null | undefined;

  timezone: string;

  static finiteFromStrings(start: string, finish: string, timezone: string): FiniteTimespan {
    return new Timespan(parseISO(start), parseISO(finish), timezone) as FiniteTimespan;
  }

  static fromStrings(
    start: string | null | undefined,
    finish: string | null | undefined,
    timezone: string,
  ): Timespan {
    return new Timespan(
      start != null ? parseISO(start) : null,
      finish != null ? parseISO(finish) : null,
      timezone,
    );
  }

  static finiteFromDates(start: Date, finish: Date, timezone: string): FiniteTimespan {
    return new Timespan(start, finish, timezone) as FiniteTimespan;
  }

  static fromDates(
    start: Date | null | undefined,
    finish: Date | null | undefined,
    timezone: string,
  ): Timespan {
    return new Timespan(start, finish, timezone);
  }

  constructor(start: Date | null | undefined, finish: Date | null | undefined, timezone: string) {
    if (start && finish && isAfter(start, finish)) {
      throw new Error('Start cannot be after finish');
    }

    this.start = start;
    this.finish = finish;
    this.timezone = timezone;
  }

  tz(timezoneName: string) {
    return new Timespan(this.start, this.finish, timezoneName);
  }

  getLocalStart() {
    if (this.start == null) {
      return undefined;
    }

    return utcToZonedTime(this.start, this.timezone);
  }

  getLocalFinish() {
    if (this.finish == null) {
      return undefined;
    }

    return utcToZonedTime(this.finish, this.timezone);
  }

  isFinite(): this is FiniteTimespan {
    return isFinite(this);
  }

  includesTime(time: Date) {
    return (
      (this.start == null || isBefore(this.start, time) || isEqual(this.start, time)) &&
      (this.finish == null || isAfter(this.finish, time))
    );
  }

  includesTimespan(other: Timespan) {
    return (
      (this.start == null ||
        (other.start != null &&
          (isBefore(this.start, other.start) || isEqual(this.start, other.start)))) &&
      (this.finish == null ||
        (other.finish != null &&
          (isAfter(this.finish, other.finish) || isEqual(this.finish, other.finish))))
    );
  }

  overlapsTimespan(other: Timespan) {
    return (
      (this.start == null || other.finish == null || isBefore(this.start, other.finish)) &&
      (this.finish == null || other.start == null || isBefore(other.start, this.finish))
    );
  }

  isSame(other: Timespan) {
    return (
      timesAreSameOrBothNull(this.start, other.start) &&
      timesAreSameOrBothNull(this.finish, other.finish)
    );
  }

  intersection(other: Timespan) {
    if (!this.overlapsTimespan(other)) {
      return null;
    }

    return new Timespan(
      chooseAmong([this.start, other.start], compareTimesDescending),
      chooseAmong([this.finish, other.finish], compareTimesAscending),
      this.timezone,
    );
  }

  union(other: Timespan) {
    return new Timespan(
      chooseAmong([this.start, other.start], preferNull(compareTimesAscending), true),
      chooseAmong([this.finish, other.finish], preferNull(compareTimesDescending), true),
      this.timezone,
    );
  }

  expandStart(amount: Duration) {
    return new Timespan(
      this.start ? sub(this.start, amount) : undefined,
      this.finish,
      this.timezone,
    );
  }

  expandFinish(amount: Duration) {
    return new Timespan(
      this.start,
      this.finish ? add(this.finish, amount) : undefined,
      this.timezone,
    );
  }

  expand(amount: Duration) {
    return new Timespan(
      this.start ? sub(this.start, amount) : undefined,
      this.finish ? add(this.finish, amount) : undefined,
      this.timezone,
    );
  }

  expandedToFit = this.union;

  getLength(unit: TimeUnit | 'milliseconds' = 'milliseconds') {
    if (!this.isFinite()) {
      return null;
    }

    return diffUnit(this.finish, this.start, unit);
  }

  humanizeStart(formatString?: string, options?: Omit<OptionsWithTZ, 'timeZone'>) {
    if (this.start == null) {
      return 'anytime';
    }

    const start = utcToZonedTime(this.start, this.timezone);
    if (formatString != null) {
      return formatWithLowercaseMeridiemHack(start, formatString, {
        ...options,
        timeZone: this.timezone,
      });
    }

    return humanizeTime(start, true, options);
  }

  humanizeFinish(formatString?: string, options?: Omit<OptionsWithTZ, 'timeZone'>) {
    if (this.finish == null) {
      return 'indefinitely';
    }

    const finish = utcToZonedTime(this.finish, this.timezone);
    if (formatString != null) {
      return formatWithLowercaseMeridiemHack(finish, formatString, {
        ...options,
        timeZone: this.timezone,
      });
    }

    if (this.start == null) {
      return humanizeTime(finish, true);
    }

    const start = utcToZonedTime(this.start, this.timezone);
    const includeDayInFinish = getDate(finish) !== getDate(start);

    return humanizeTime(finish, includeDayInFinish);
  }

  humanize(startFormat?: string, finishFormat?: string, options?: Omit<OptionsWithTZ, 'timeZone'>) {
    if (this.start == null && this.finish == null) {
      return 'always';
    }

    const start = this.humanizeStart(startFormat, options);
    const finish = this.humanizeFinish(
      this.start == null || this.finish == null || getDate(this.finish) !== getDate(this.start)
        ? startFormat
        : finishFormat || startFormat,
      options,
    );

    if (this.humanizeFinish(startFormat, options) === start) {
      return start;
    }

    return `${start} - ${finish}`;
  }

  getTimeHopsWithin({ unit, offset = undefined, step = undefined }: TimeHopOptions) {
    if (!this.isFinite()) {
      throw new Error(`getTimeHopsWithin called on an infinite Timespan ${this.humanize()}`);
    }

    const timeBlocks: Date[] = [];
    let now = startOfUnit(utcToZonedTime(this.start, this.timezone), unit);
    const zonedFinish = utcToZonedTime(this.finish, this.timezone);
    const stepDuration: Duration = { [unit]: step ?? 1 };
    while (isBefore(now, zonedFinish)) {
      let timeHop = now;
      if (offset) {
        timeHop = add(timeHop, offset);
      }
      timeBlocks.push(zonedTimeToUtc(timeHop, this.timezone));
      now = add(now, stepDuration);
    }

    return timeBlocks;
  }

  getTimespansWithin({
    unit,
    offset = undefined,
    step = undefined,
  }: TimeHopOptions): FiniteTimespan[] {
    const thisTimespan = this;
    if (!thisTimespan.isFinite()) {
      throw new Error(
        `getTimespansWithin called on an infinite Timespan ${thisTimespan.humanize()}`,
      );
    }

    const stepDuration: Duration = { [unit]: step ?? 1 };
    const timeHops = thisTimespan.getTimeHopsWithin({ unit, offset, step });
    return timeHops
      .map((timeHop, i) => {
        if (i < timeHops.length - 1) {
          return Timespan.finiteFromDates(
            timeHop,
            timeHops[i + 1],
            thisTimespan.timezone,
          ).intersection(thisTimespan);
        }

        if (offset) {
          return Timespan.finiteFromDates(
            timeHop,
            add(add(sub(timeHop, offset), stepDuration), offset),
            thisTimespan.timezone,
          ).intersection(thisTimespan);
        }

        return Timespan.finiteFromDates(
          timeHop,
          add(timeHop, stepDuration),
          thisTimespan.timezone,
        ).intersection(thisTimespan);
      })
      .filter(notEmpty);
  }

  clone() {
    return new Timespan(
      this.start != null ? this.start : null,
      this.finish != null ? this.finish : null,
      this.timezone,
    );
  }
}

export default Timespan;
