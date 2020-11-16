import type { Duration } from 'dayjs/plugin/duration';
import {
  compareTimesAscending,
  compareTimesDescending,
  humanizeTime,
  timesAreSameOrBothNull,
  dayjs,
} from './TimeUtils';
import { chooseAmong, preferNull, notEmpty } from './ValueUtils';

export type TimeHopOptions = {
  unit: dayjs.OpUnitType;
  offset?: Duration | null;
  duration?: number | null;
};

export interface FiniteTimespan extends Timespan {
  start: dayjs.Dayjs;
  finish: dayjs.Dayjs;
  clone(): FiniteTimespan;
  getLength(unit: dayjs.OpUnitType | dayjs.QUnitType): number;
  union(other: FiniteTimespan): FiniteTimespan;
  intersection(other: FiniteTimespan): FiniteTimespan;
  expandedToFit(other: FiniteTimespan): FiniteTimespan;
  expand(amount: number, unit: dayjs.OpUnitType): FiniteTimespan;
  expandStart(amount: number, unit: dayjs.OpUnitType): FiniteTimespan;
  expandFinish(amount: number, unit: dayjs.OpUnitType): FiniteTimespan;
}

export function isFinite(timespan: Timespan): timespan is FiniteTimespan {
  return timespan.start != null && timespan.finish != null;
}

class Timespan {
  start: dayjs.Dayjs | null | undefined;

  finish: dayjs.Dayjs | null | undefined;

  static finiteFromStrings(start: string, finish: string): FiniteTimespan {
    return new Timespan(dayjs(start), dayjs(finish)) as FiniteTimespan;
  }

  static fromStrings(start?: string | null, finish?: string | null): Timespan {
    return new Timespan(start != null ? dayjs(start) : null, finish != null ? dayjs(finish) : null);
  }

  static finiteFromDays(start: dayjs.Dayjs, finish: dayjs.Dayjs): FiniteTimespan {
    return new Timespan(start, finish) as FiniteTimespan;
  }

  static fromDays(start?: dayjs.Dayjs | null, finish?: dayjs.Dayjs | null): Timespan {
    return new Timespan(start, finish);
  }

  constructor(start?: dayjs.Dayjs | null, finish?: dayjs.Dayjs | null) {
    if (start && finish && start.isAfter(finish)) {
      throw new Error('Start cannot be after finish');
    }

    this.start = start;
    this.finish = finish;
  }

  tz(timezoneName: string) {
    return new Timespan(
      this.start != null ? this.start.tz(timezoneName) : null,
      this.finish != null ? this.finish.tz(timezoneName) : null,
    );
  }

  isFinite(): this is FiniteTimespan {
    return isFinite(this);
  }

  includesTime(time: dayjs.Dayjs) {
    return (
      (this.start == null || this.start.isBefore(time) || this.start.isSame(time)) &&
      (this.finish == null || this.finish.isAfter(time))
    );
  }

  includesTimespan(other: Timespan) {
    return (
      (this.start == null ||
        (other.start != null &&
          (this.start.isBefore(other.start) || this.start.isSame(other.start)))) &&
      (this.finish == null ||
        (other.finish != null &&
          (this.finish.isAfter(other.finish) || this.finish.isSame(other.finish))))
    );
  }

  overlapsTimespan(other: Timespan) {
    return (
      (this.start == null || other.finish == null || this.start.isBefore(other.finish)) &&
      (this.finish == null || other.start == null || other.start.isBefore(this.finish))
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
    );
  }

  union(other: Timespan) {
    return new Timespan(
      chooseAmong([this.start, other.start], preferNull(compareTimesAscending), true),
      chooseAmong([this.finish, other.finish], preferNull(compareTimesDescending), true),
    );
  }

  expandStart(amount: number, unit: dayjs.OpUnitType) {
    return new Timespan(this.start?.clone().subtract(amount, unit), this.finish);
  }

  expandFinish(amount: number, unit: dayjs.OpUnitType) {
    return new Timespan(this.start, this.finish?.clone().add(amount, unit));
  }

  expand(amount: number, unit: dayjs.OpUnitType) {
    return new Timespan(
      this.start?.clone().subtract(amount, unit),
      this.finish?.clone().add(amount, unit),
    );
  }

  expandedToFit = this.union;

  getLength(unit: dayjs.OpUnitType | dayjs.QUnitType = 'millisecond') {
    if (!this.isFinite()) {
      return null;
    }

    return this.finish.diff(this.start, unit);
  }

  humanizeStartInTimezone(timezoneName: string, format?: string) {
    if (this.start == null) {
      return 'anytime';
    }

    const start = this.start.tz(timezoneName);
    if (format != null) {
      return start.format(format);
    }

    return humanizeTime(start, true);
  }

  humanizeFinishInTimezone(timezoneName: string, format?: string) {
    if (this.finish == null) {
      return 'indefinitely';
    }

    const finish = this.finish.tz(timezoneName);
    if (format != null) {
      return finish.format(format);
    }

    if (this.start == null) {
      return humanizeTime(finish, true);
    }

    const start = this.start.tz(timezoneName);
    const includeDayInFinish = finish.date() !== start.date();

    return humanizeTime(finish, includeDayInFinish);
  }

  humanizeInTimezone(timezoneName: string, startFormat?: string, finishFormat?: string) {
    if (this.start == null && this.finish == null) {
      return 'always';
    }

    const start = this.humanizeStartInTimezone(timezoneName, startFormat);
    const finish = this.humanizeFinishInTimezone(
      timezoneName,
      this.start == null || this.finish == null || this.finish.date() !== this.start.date()
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
    { unit, offset = undefined, duration = 1 }: TimeHopOptions,
  ) {
    if (!this.isFinite()) {
      throw new Error(
        `getTimeHopsWithin called on an infinite Timespan ${this.humanizeInTimezone(timezoneName)}`,
      );
    }

    const offsetMillis = offset?.milliseconds();
    const timeBlocks: dayjs.Dayjs[] = [];
    debugger;
    let now = this.start.tz(timezoneName).startOf(unit);
    // work around https://github.com/iamkun/dayjs/issues/1212
    // @ts-expect-error
    now.$x.$timezone = this.start.$x.$timezone;
    console.log([
      this.start.toISOString(),
      this.start.tz(timezoneName).toISOString(),
      this.start.$d,
      now.toISOString(),
      now.$d,
    ]);
    while (now.isBefore(this.finish)) {
      let timeHop = now;
      if (offsetMillis) {
        timeHop = timeHop.add(offsetMillis, 'millisecond');
      }
      timeBlocks.push(timeHop);
      now = now.add(duration!, unit);
    }

    return timeBlocks;
  }

  getTimespansWithin(
    timezoneName: string,
    { unit, offset = undefined, duration = 1 }: TimeHopOptions,
  ): FiniteTimespan[] {
    const thisTimespan = this;
    if (!thisTimespan.isFinite()) {
      throw new Error(
        `getTimespansWithin called on an infinite Timespan ${thisTimespan.humanizeInTimezone(
          timezoneName,
        )}`,
      );
    }

    const timeHops = thisTimespan.getTimeHopsWithin(timezoneName, { unit, offset, duration });
    return timeHops
      .map((timeHop, i) => {
        if (i < timeHops.length - 1) {
          return Timespan.finiteFromDays(timeHop, timeHops[i + 1]).intersection(thisTimespan);
        }

        if (offset) {
          return Timespan.finiteFromDays(
            timeHop,
            timeHop
              .clone()
              .subtract(offset.milliseconds(), 'millisecond')
              .add(duration!, unit)
              .add(offset.milliseconds(), 'millisecond'),
          ).intersection(thisTimespan);
        }

        return Timespan.finiteFromDays(timeHop, timeHop.clone().add(duration!, unit)).intersection(
          thisTimespan,
        );
      })
      .filter(notEmpty);
  }

  clone() {
    return new Timespan(
      this.start != null ? this.start.clone() : null,
      this.finish != null ? this.finish.clone() : null,
    );
  }
}

export default Timespan;
