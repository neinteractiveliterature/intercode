import moment, { Moment, unitOfTime } from 'moment-timezone';
import {
  compareTimesAscending,
  compareTimesDescending,
  humanizeTime,
  timesAreSameOrBothNull,
} from './TimeUtils';
import { chooseAmong, preferNull } from './ValueUtils';

export type TimeHopOptions = {
  unit: unitOfTime.Base,
  offset?: moment.DurationInputArg1 | null,
  duration?: moment.DurationInputArg1 | null
};

export interface FiniteTimespan extends Timespan {
  start: Moment;
  finish: Moment;
  clone(): FiniteTimespan;
  getLength(unit: unitOfTime.Diff): number,
  union(other: FiniteTimespan): FiniteTimespan,
  expandedToFit(other: FiniteTimespan): FiniteTimespan,
  expand(...args: Parameters<Moment['add']> & Parameters<Moment['subtract']>): FiniteTimespan,
  expandStart(...args: Parameters<Moment['subtract']>): FiniteTimespan,
  expandFinish(...args: Parameters<Moment['add']>): FiniteTimespan,
}

export function isFinite(timespan: Timespan): timespan is FiniteTimespan {
  return timespan.start != null && timespan.finish != null;
}

class Timespan {
  start: Moment | null | undefined;

  finish: Moment | null | undefined;

  static fromStrings(start?: string | null, finish?: string | null): Timespan {
    return new Timespan(
      (start != null ? moment(start) : null),
      (finish != null ? moment(finish) : null),
    );
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
      (this.start != null ? this.start.tz(timezoneName) : null),
      (this.finish != null ? this.finish.tz(timezoneName) : null),
    );
  }

  isFinite(): this is FiniteTimespan {
    return isFinite(this);
  }

  includesTime(time: Moment) {
    return (
      (this.start == null || this.start.isSameOrBefore(time))
      && (this.finish == null || this.finish.isAfter(time))
    );
  }

  includesTimespan(other: Timespan) {
    return (
      (this.start == null || (other.start != null && this.start.isSameOrBefore(other.start)))
      && (this.finish == null || (other.finish != null && this.finish.isSameOrAfter(other.finish)))
    );
  }

  overlapsTimespan(other: Timespan) {
    return (
      (this.start == null || other.finish == null || this.start.isBefore(other.finish))
      && (this.finish == null || other.start == null || other.start.isBefore(this.finish))
    );
  }

  isSame(other: Timespan) {
    return (
      timesAreSameOrBothNull(this.start, other.start)
      && timesAreSameOrBothNull(this.finish, other.finish)
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

  expandStart(...args: Parameters<Moment['subtract']>) {
    return new Timespan(
      this.start?.clone().subtract(...args),
      this.finish,
    );
  }

  expandFinish(...args: Parameters<Moment['add']>) {
    return new Timespan(
      this.start,
      this.finish?.clone().add(...args),
    );
  }

  expand(...args: Parameters<Moment['add']> & Parameters<Moment['subtract']>) {
    return new Timespan(
      this.start?.clone().subtract(...args),
      this.finish?.clone().add(...args),
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
    const includeDayInFinish = (finish.date() !== start.date());

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
      throw new Error(`getTimeHopsWithin called on an infinite Timespan ${this.humanizeInTimezone(timezoneName)}`);
    }

    const timeBlocks: Moment[] = [];
    const now = this.start.clone().tz(timezoneName).startOf(unit);
    while (now.isBefore(this.finish)) {
      const timeHop = now.clone();
      if (offset) {
        timeHop.add(offset);
      }
      timeBlocks.push(timeHop);
      now.add(duration, unit);
    }

    return timeBlocks;
  }

  getTimespansWithin(timezoneName: string, { unit, offset = 0, duration = 1 }: TimeHopOptions) {
    if (!this.isFinite()) {
      throw new Error(`getTimespansWithin called on an infinite Timespan ${this.humanizeInTimezone(timezoneName)}`);
    }

    const timeHops = this.getTimeHopsWithin(timezoneName, { unit, offset, duration });
    return timeHops.map((timeHop, i) => {
      if (i < timeHops.length - 1) {
        return new Timespan(timeHop, timeHops[i + 1]).intersection(this);
      }

      if (offset) {
        return new Timespan(
          timeHop,
          timeHop.clone().subtract(offset).add(duration, unit).add(offset),
        ).intersection(this);
      }

      return new Timespan(timeHop, timeHop.clone().add(duration, unit)).intersection(this);
    }).filter((timespan) => timespan != null);
  }

  clone() {
    return new Timespan(
      (this.start != null ? this.start.clone() : null),
      (this.finish != null ? this.finish.clone() : null),
    );
  }
}

export default Timespan;
