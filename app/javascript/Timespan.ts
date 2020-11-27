import moment, { DurationInputArg1, DurationInputArg2, Moment, unitOfTime } from 'moment-timezone';
import {
  compareTimesAscending,
  compareTimesDescending,
  humanizeTime,
  timesAreSameOrBothNull,
} from './TimeUtils';
import { chooseAmong, preferNull, notEmpty } from './ValueUtils';

export type TimeHopOptions = {
  unit: unitOfTime.Base;
  offset?: moment.DurationInputArg1 | null;
  duration?: moment.DurationInputArg1 | null;
};

export interface FiniteTimespan extends Timespan {
  start: Moment;
  finish: Moment;
  clone(): FiniteTimespan;
  getLength(unit: unitOfTime.Diff): number;
  union(other: FiniteTimespan): FiniteTimespan;
  intersection(other: FiniteTimespan): FiniteTimespan;
  expandedToFit(other: FiniteTimespan): FiniteTimespan;
  expand(amount: DurationInputArg1, unit: DurationInputArg2): FiniteTimespan;
  expandStart(amount: DurationInputArg1, unit: DurationInputArg2): FiniteTimespan;
  expandFinish(amount: DurationInputArg1, unit: DurationInputArg2): FiniteTimespan;
}

export function isFinite(timespan: Timespan): timespan is FiniteTimespan {
  return timespan.start != null && timespan.finish != null;
}

class Timespan {
  start: Moment | null | undefined;

  finish: Moment | null | undefined;

  static finiteFromStrings(start: string, finish: string): FiniteTimespan {
    return new Timespan(moment(start), moment(finish)) as FiniteTimespan;
  }

  static fromStrings(start?: string | null, finish?: string | null): Timespan {
    return new Timespan(
      start != null ? moment(start) : null,
      finish != null ? moment(finish) : null,
    );
  }

  static finiteFromMoments(start: Moment, finish: Moment): FiniteTimespan {
    return new Timespan(start, finish) as FiniteTimespan;
  }

  static fromMoments(start?: Moment | null, finish?: Moment | null): Timespan {
    return new Timespan(start, finish);
  }

  constructor(start?: Moment | null, finish?: Moment | null) {
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

  includesTime(time: Moment) {
    return (
      (this.start == null || this.start.isSameOrBefore(time)) &&
      (this.finish == null || this.finish.isAfter(time))
    );
  }

  includesTimespan(other: Timespan) {
    return (
      (this.start == null || (other.start != null && this.start.isSameOrBefore(other.start))) &&
      (this.finish == null || (other.finish != null && this.finish.isSameOrAfter(other.finish)))
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

  expandStart(amount: DurationInputArg1, unit: DurationInputArg2) {
    return new Timespan(this.start?.clone().subtract(amount, unit), this.finish);
  }

  expandFinish(amount: DurationInputArg1, unit: DurationInputArg2) {
    return new Timespan(this.start, this.finish?.clone().add(amount, unit));
  }

  expand(amount: DurationInputArg1, unit: DurationInputArg2) {
    return new Timespan(
      this.start?.clone().subtract(amount, unit),
      this.finish?.clone().add(amount, unit),
    );
  }

  expandedToFit = this.union;

  getLength(unit: unitOfTime.Diff = 'millisecond') {
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

  getTimeHopsWithin(timezoneName: string, { unit, offset = 0, duration = 1 }: TimeHopOptions) {
    if (!this.isFinite()) {
      throw new Error(
        `getTimeHopsWithin called on an infinite Timespan ${this.humanizeInTimezone(timezoneName)}`,
      );
    }

    const timeBlocks: Moment[] = [];
    const now = this.start.clone().tz(timezoneName).startOf(unit);
    while (now.isBefore(this.finish)) {
      const timeHop = now.clone();
      if (offset) {
        timeHop.add(offset);
      }
      timeBlocks.push(timeHop);
      now.add(duration!, unit);
    }

    return timeBlocks;
  }

  getTimespansWithin(
    timezoneName: string,
    { unit, offset = 0, duration = 1 }: TimeHopOptions,
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
    const expandStart = timeHops.length > 0 && timeHops[0].isAfter(thisTimespan.start);
    return timeHops
      .map((timeHop, i) => {
        const effectiveStart = i === 0 && expandStart ? thisTimespan.start : timeHop;
        if (i < timeHops.length - 1) {
          return Timespan.finiteFromMoments(effectiveStart, timeHops[i + 1]).intersection(
            thisTimespan,
          );
        }

        if (offset) {
          return Timespan.finiteFromMoments(
            effectiveStart,
            timeHop.clone().subtract(offset).add(duration!, unit).add(offset),
          ).intersection(thisTimespan);
        }

        return Timespan.finiteFromMoments(
          effectiveStart,
          timeHop.clone().add(duration!, unit),
        ).intersection(thisTimespan);
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
