import { useContext, useCallback } from 'react';
import { startOfDay, set, parseISO, isEqual } from 'date-fns';
import { OptionsWithTZ } from 'date-fns-tz';
import flatMap from 'lodash/flatMap';
import { assertNever } from 'assert-never';

import AppRootContext from '../AppRootContext';
import Timespan, { FiniteTimespan } from '../Timespan';
import { timespanFromConvention, ConventionForTimespanUtils } from '../TimespanUtils';
import {
  timezoneNameForConvention,
  formatWithLowercaseMeridiemHack,
  manipulateInZone,
  formatInTimezone,
} from '../TimeUtils';
import { TimeblockDefinition, TimeblockPreferenceOrdinality, FuzzyTime } from './TimeblockTypes';
import { TimeblockPreferenceFormItem } from '../FormAdmin/FormItemUtils';
import { notEmpty } from '../ValueUtils';

function fuzzyTimeToSetOptions(fuzzyTime: FuzzyTime): Parameters<typeof set>[1] {
  return {
    hours: fuzzyTime.hour,
    minutes: fuzzyTime.minute,
    seconds: fuzzyTime.second,
  };
}

export function describeTimeblock(timeblock: TimeblockDefinition) {
  const start = set(startOfDay(new Date()), fuzzyTimeToSetOptions(timeblock.start));
  const finish = set(startOfDay(new Date()), fuzzyTimeToSetOptions(timeblock.finish));

  return `${formatWithLowercaseMeridiemHack(start, 'h:mmaaa')} - ${formatWithLowercaseMeridiemHack(
    finish,
    'h:mmaaa',
  )}`;
}

export function describeOrdinality(ordinality?: TimeblockPreferenceOrdinality | null) {
  if (ordinality == null) {
    return "Don't care";
  }

  switch (ordinality) {
    case '1':
      return '1st choice';
    case '2':
      return '2nd choice';
    case '3':
      return '3rd choice';
    case 'X':
      return 'Prefer not';
    default:
      return assertNever(ordinality);
  }
}

function getDayStarts(convention: ConventionForTimespanUtils) {
  return timespanFromConvention(convention).getTimeHopsWithin({ unit: 'days' });
}

export type ConcreteTimeblock = {
  dayStart: Date;
  timeblock: TimeblockDefinition;
  label: string;
  timespan: FiniteTimespan;
};

function setFuzzyTimeInZone(date: Date, fuzzyTime: FuzzyTime, timezoneName: string) {
  return manipulateInZone(date, timezoneName, (localDate) =>
    set(localDate, fuzzyTimeToSetOptions(fuzzyTime)),
  );
}

function getAllPossibleTimeblocks(
  convention: ConventionForTimespanUtils,
  formItem: TimeblockPreferenceFormItem,
) {
  const timezoneName = timezoneNameForConvention(convention);

  return flatMap(getDayStarts(convention), (dayStart) =>
    formItem.rendered_properties.timeblocks
      .map((timeblock) => {
        try {
          const timespan = Timespan.fromDates(
            setFuzzyTimeInZone(dayStart, timeblock.start, timezoneName),
            setFuzzyTimeInZone(dayStart, timeblock.finish, timezoneName),
            timezoneName,
          ) as FiniteTimespan;

          const concreteTimeblock: ConcreteTimeblock = {
            dayStart,
            timeblock,
            label: timeblock.label,
            timespan,
          };

          return concreteTimeblock;
        } catch (error) {
          return null;
        }
      })
      .filter(notEmpty),
  );
}

function isTimeblockValid(
  convention: ConventionForTimespanUtils,
  formItem: TimeblockPreferenceFormItem,
  timeblock: ConcreteTimeblock,
) {
  const conventionTimespan = timespanFromConvention(convention);
  const timezoneName = conventionTimespan.timezone;

  if (!conventionTimespan.overlapsTimespan(timeblock.timespan)) {
    return false;
  }

  const timeblockOmitted = formItem.rendered_properties.omit_timeblocks.some((omission) => {
    const omissionDate = manipulateInZone(parseISO(omission.date), timezoneName, startOfDay);
    const dayStart = manipulateInZone(timeblock.timespan.start, timezoneName, startOfDay);
    return omission.label === timeblock.label && isEqual(omissionDate, dayStart);
  });

  return !timeblockOmitted;
}

export function getValidTimeblocks(
  convention: ConventionForTimespanUtils,
  formItem: TimeblockPreferenceFormItem,
) {
  return getAllPossibleTimeblocks(convention, formItem).filter((timeblock) =>
    isTimeblockValid(convention, formItem, timeblock),
  );
}

export type TimeblockColumn = {
  dayStart: Date;
  cells: (ConcreteTimeblock | null)[];
};

export function getValidTimeblockColumns(
  convention: ConventionForTimespanUtils,
  formItem: TimeblockPreferenceFormItem,
): TimeblockColumn[] {
  const allPossibleTimeblocks = getAllPossibleTimeblocks(convention, formItem);
  return getDayStarts(convention)
    .map((dayStart) => {
      const possibleTimeblocksForDayStart = allPossibleTimeblocks.filter((timeblock) =>
        isEqual(dayStart, timeblock.dayStart),
      );

      return {
        dayStart,
        cells: possibleTimeblocksForDayStart.map((timeblock) =>
          isTimeblockValid(convention, formItem, timeblock) ? timeblock : null,
        ),
      };
    })
    .filter((column) => column.cells.some(notEmpty));
}

export type TimeblockRow = {
  timeblock: TimeblockDefinition;
  cells: (ConcreteTimeblock | null)[];
};

export function rotateTimeblockColumnsToRows(
  formItem: TimeblockPreferenceFormItem,
  columns: TimeblockColumn[],
): TimeblockRow[] {
  const columnCount = columns.length;

  return formItem.rendered_properties.timeblocks
    .map((timeblock, x) => {
      const row: (ConcreteTimeblock | null)[] = [];
      for (let y = 0; y < columnCount; y += 1) {
        const column = columns[y];
        row.push(column.cells[x]);
      }

      if (row.some((cell) => cell != null)) {
        return {
          timeblock,
          cells: row,
        };
      }

      return null;
    })
    .filter(notEmpty);
}

export function getColumnHeader(
  column: TimeblockColumn,
  timezoneName: string,
  options: Omit<OptionsWithTZ, 'timeZone'>,
) {
  return formatInTimezone(column.dayStart, 'eeee', timezoneName, options);
}

export function useGetColumnHeader() {
  const { timezoneName, dateFnsLocale } = useContext(AppRootContext);
  return useCallback(
    (column: TimeblockColumn, options?: Omit<OptionsWithTZ, 'timeZone'>) =>
      getColumnHeader(column, timezoneName, { locale: dateFnsLocale, ...options }),
    [timezoneName, dateFnsLocale],
  );
}
