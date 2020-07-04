import flatMap from 'lodash/flatMap';
import { DateTime, Duration } from 'luxon';
import { assertNever } from 'assert-never';

import Timespan from '../Timespan';
import { timespanFromConvention, ConventionForTimespanUtils } from '../TimespanUtils';
import { timezoneNameForConvention, lowercaseMeridiem } from '../TimeUtils';
import {
  TimeblockDefinition, TimeblockPreferenceOrdinality, ConcreteTimeblock, TimeblockOmission,
} from './TimeblockTypes';
import { notEmpty } from '../ValueUtils';

export type FormItemWithTimeblockData = {
  properties: {
    timeblocks: TimeblockDefinition[],
    omit_timeblocks?: TimeblockOmission[],
  },
};

export function describeTimeblock(timeblock: TimeblockDefinition) {
  const start = DateTime.local().startOf('day').set(timeblock.start);
  const finish = DateTime.local().startOf('day').set(timeblock.finish);

  return `${lowercaseMeridiem(start.toFormat('h:mma'))} - ${lowercaseMeridiem(finish.toFormat('h:mma'))}`;
}

export function describeOrdinality(ordinality?: TimeblockPreferenceOrdinality) {
  switch (ordinality) {
    case '1':
      return '1st choice';
    case '2':
      return '2nd choice';
    case '3':
      return '3rd choice';
    case 'X':
      return 'Prefer not';
    case undefined:
      return "Don't care";
    default:
      return assertNever(ordinality);
  }
}

function getDayStarts(convention: ConventionForTimespanUtils) {
  return timespanFromConvention(convention)
    .getTimeHopsWithin(timezoneNameForConvention(convention), {
      unit: 'day',
      duration: Duration.fromObject({ days: 1 }),
    });
}

function getAllPossibleTimeblocks(
  convention: ConventionForTimespanUtils,
  formItem: FormItemWithTimeblockData,
): ConcreteTimeblock[] {
  return flatMap(
    getDayStarts(convention),
    (dayStart) => formItem.properties.timeblocks.map((timeblock) => {
      try {
        const timespan = Timespan.fromDateTimes(
          dayStart.set(timeblock.start),
          dayStart.set(timeblock.finish),
        );

        return {
          dayStart,
          timeblock,
          label: timeblock.label,
          timespan,
        };
      } catch (error) {
        return null;
      }
    }).filter(notEmpty),
  );
}

function isTimeblockValid(
  convention: ConventionForTimespanUtils,
  formItem: FormItemWithTimeblockData,
  timeblock: ConcreteTimeblock,
) {
  const conventionTimespan = timespanFromConvention(convention);
  const timezoneName = timezoneNameForConvention(convention);

  if (!conventionTimespan.overlapsTimespan(timeblock.timespan)) {
    return false;
  }

  const timeblockOmitted = formItem.properties.omit_timeblocks?.some((omission) => {
    const omissionDate = DateTime.fromISO(omission.date).setZone(timezoneName).startOf('day');
    const dayStart = timeblock.timespan.start.setZone(timezoneName).startOf('day');
    return (omission.label === timeblock.label && +omissionDate === +dayStart);
  });

  return !timeblockOmitted;
}

export function getValidTimeblocks(
  convention: ConventionForTimespanUtils,
  formItem: FormItemWithTimeblockData,
) {
  return getAllPossibleTimeblocks(convention, formItem)
    .filter((timeblock) => isTimeblockValid(convention, formItem, timeblock));
}

export type TimeblockColumn = {
  dayStart: DateTime,
  cells: (ConcreteTimeblock | null)[],
};

export function getValidTimeblockColumns(
  convention: ConventionForTimespanUtils,
  formItem: FormItemWithTimeblockData,
) {
  const allPossibleTimeblocks = getAllPossibleTimeblocks(convention, formItem);
  return getDayStarts(convention)
    .map((dayStart) => {
      const possibleTimeblocksForDayStart = allPossibleTimeblocks
        .filter((timeblock) => +dayStart === +timeblock.dayStart);

      return {
        dayStart,
        cells: possibleTimeblocksForDayStart
          .map((timeblock) => (isTimeblockValid(convention, formItem, timeblock)
            ? timeblock : null)),
      };
    })
    .filter((column) => column.cells.some(notEmpty));
}

export function rotateTimeblockColumnsToRows(
  formItem: FormItemWithTimeblockData,
  columns: TimeblockColumn[],
) {
  const columnCount = columns.length;

  return formItem.properties.timeblocks.map((timeblock, x) => {
    const row: (ConcreteTimeblock | null)[] = [];
    for (let y = 0; y < columnCount; y += 1) {
      const column = columns[y];
      row.push(column.cells[x]);
    }

    if (row.some(notEmpty)) {
      return {
        timeblock,
        cells: row,
      };
    }

    return null;
  }).filter(notEmpty);
}

export function getColumnHeader(column: TimeblockColumn) {
  return column.dayStart.toFormat('EEEE');
}
