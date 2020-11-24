import flatMap from 'lodash/flatMap';
import { assertNever } from 'assert-never';
import { DateTime } from 'luxon';

import Timespan, { FiniteTimespan } from '../Timespan';
import { timespanFromConvention, ConventionForTimespanUtils } from '../TimespanUtils';
import { formatLCM, timezoneNameForConvention } from '../TimeUtils';
import { TimeblockDefinition, TimeblockPreferenceOrdinality } from './TimeblockTypes';
import { TimeblockPreferenceFormItem } from '../FormAdmin/FormItemUtils';
import { notEmpty } from '../ValueUtils';

export function describeTimeblock(timeblock: TimeblockDefinition) {
  const start = DateTime.fromObject(timeblock.start);
  const finish = DateTime.fromObject(timeblock.finish);

  return `${formatLCM(start, 'h:mmaaa')} - ${formatLCM(finish, 'h:mmaaa')}`;
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
  return timespanFromConvention(convention).getTimeHopsWithin(
    timezoneNameForConvention(convention),
    { unit: 'day' },
  );
}

export type ConcreteTimeblock = {
  dayStart: DateTime;
  timeblock: TimeblockDefinition;
  label: string;
  timespan: FiniteTimespan;
};

function getAllPossibleTimeblocks(
  convention: ConventionForTimespanUtils,
  formItem: TimeblockPreferenceFormItem,
) {
  return flatMap(getDayStarts(convention), (dayStart) =>
    formItem.rendered_properties.timeblocks
      .map((timeblock) => {
        try {
          const timespan = Timespan.fromDateTimes(
            dayStart.set(timeblock.start),
            dayStart.set(timeblock.finish),
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

  if (!conventionTimespan.overlapsTimespan(timeblock.timespan)) {
    return false;
  }

  const timeblockOmitted = formItem.rendered_properties.omit_timeblocks.some((omission) => {
    const omissionDate = DateTime.fromISO(omission.date, {
      zone: timezoneNameForConvention(convention),
    }).startOf('day');
    const dayStart = timeblock.timespan.start.startOf('day');
    return omission.label === timeblock.label && omissionDate.toMillis() === dayStart.toMillis();
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
  dayStart: DateTime;
  cells: (ConcreteTimeblock | null)[];
};

export function getValidTimeblockColumns(
  convention: ConventionForTimespanUtils,
  formItem: TimeblockPreferenceFormItem,
): TimeblockColumn[] {
  const allPossibleTimeblocks = getAllPossibleTimeblocks(convention, formItem);
  return getDayStarts(convention)
    .map((dayStart) => {
      const possibleTimeblocksForDayStart = allPossibleTimeblocks.filter(
        (timeblock) => dayStart.toMillis() === timeblock.dayStart.toMillis(),
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

export function getColumnHeader(column: TimeblockColumn) {
  return column.dayStart.toFormat('cccc');
}
