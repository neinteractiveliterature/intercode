import moment from 'moment-timezone';
import flatMap from 'lodash/flatMap';
import { Duration } from 'luxon';

import Timespan from '../Timespan';
import { timespanFromConvention } from '../TimespanUtils';
import { timezoneNameForConvention } from '../TimeUtils';

export function describeTimeblock(timeblock) {
  const start = moment().startOf('day').set(timeblock.start);
  const finish = moment().startOf('day').set(timeblock.finish);

  return `${start.format('h:mma')} - ${finish.format('h:mma')}`;
}

export function describeOrdinality(ordinality) {
  switch ((ordinality || '').toString()) {
    case '1':
      return '1st choice';
    case '2':
      return '2nd choice';
    case '3':
      return '3rd choice';
    case 'X':
      return 'Prefer not';
    default:
      return "Don't care";
  }
}

function getDayStarts(convention) {
  return timespanFromConvention(convention)
    .getTimeHopsWithin(timezoneNameForConvention(convention), {
      unit: 'day',
      duration: Duration.fromObject({ days: 1 }),
    });
}

function getAllPossibleTimeblocks(convention, formItem) {
  return flatMap(
    getDayStarts(convention),
    (dayStart) => formItem.properties.timeblocks.map((timeblock) => {
      try {
        const timespan = new Timespan(
          moment(dayStart).set(timeblock.start),
          moment(dayStart).set(timeblock.finish),
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
    }).filter((possibleTimeblock) => possibleTimeblock != null),
  );
}

function isTimeblockValid(convention, formItem, timeblock) {
  const conventionTimespan = timespanFromConvention(convention);

  if (!conventionTimespan.overlapsTimespan(timeblock.timespan)) {
    return false;
  }

  const timeblockOmitted = formItem.properties.omit_timeblocks.some((omission) => {
    const omissionDate = moment.tz(omission.date, timezoneNameForConvention(convention)).startOf('day');
    const dayStart = moment(timeblock.timespan.start).startOf('day');
    return (omission.label === timeblock.label && omissionDate.isSame(dayStart));
  });

  return !timeblockOmitted;
}

export function getValidTimeblocks(convention, formItem) {
  return getAllPossibleTimeblocks(convention, formItem)
    .filter((timeblock) => isTimeblockValid(convention, formItem, timeblock));
}

export function getValidTimeblockColumns(convention, formItem) {
  const allPossibleTimeblocks = getAllPossibleTimeblocks(convention, formItem);
  return getDayStarts(convention)
    .map((dayStart) => {
      const possibleTimeblocksForDayStart = allPossibleTimeblocks
        .filter((timeblock) => +dayStart === timeblock.dayStart);

      return {
        dayStart,
        cells: possibleTimeblocksForDayStart
          .map((timeblock) => (isTimeblockValid(convention, formItem, timeblock)
            ? timeblock : null)),
      };
    })
    .filter((column) => column.cells.some((cell) => cell != null));
}

export function rotateTimeblockColumnsToRows(formItem, columns) {
  const columnCount = columns.length;

  return formItem.properties.timeblocks.map((timeblock, x) => {
    const row = [];
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
  }).filter((row) => row != null);
}

export function getColumnHeader(column) {
  return column.dayStart.format('dddd');
}
