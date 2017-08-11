// @flow

import React from 'react';
import moment from 'moment';
import 'moment-timezone';
import { enableUniqueIds } from 'react-html-id';

type FuzzyTime = {
  hour?: number,
  minute?: number,
  second?: number,
};

type Timeblock = {
  label: string,
  start: FuzzyTime,
  finish: FuzzyTime,
};

type TimeblockOmission = {
  label: string,
  date: string,
};

type Props = {
  formItem: {
    caption: string,
    timeblocks: Array<Timeblock>,
    omit_timeblocks: Array<TimeblockOmission>,
  },
  convention: {
    starts_at: string,
    ends_at: string,
    timezone_name: string,
  },
};

function describeTimeblock(timeblock: Timeblock) {
  const start = moment().startOf('day').set(timeblock.start);
  const finish = moment().startOf('day').set(timeblock.finish);

  return `${start.format('h:mma')} - ${finish.format('h:mma')}`;
}

class TimeblockPreferenceItem extends React.Component {
  constructor(props: Props) {
    super(props);
    enableUniqueIds(this);
  }

  props: Props

  render = () => {
    const startsAt = moment(this.props.convention.starts_at)
      .tz(this.props.convention.timezone_name);
    const endsAt = moment(this.props.convention.ends_at)
      .tz(this.props.convention.timezone_name);

    const dayStarts = [];
    const currentTime = moment(startsAt).startOf('day');
    while (endsAt.isAfter(currentTime)) {
      dayStarts.push(moment(currentTime));
      currentTime.add(1, 'days');
    }

    const columns = dayStarts.map((dayStart) => {
      const cellContents = this.props.formItem.timeblocks.map((timeblock) => {
        const timeblockStart = moment(dayStart).set(timeblock.start);
        const timeblockFinish = moment(dayStart).set(timeblock.finish);

        const timeblockOutOfBounds = (
          timeblockFinish.isSameOrBefore(startsAt) || timeblockStart.isSameOrAfter(endsAt)
        );
        const timeblockOmitted = this.props.formItem.omit_timeblocks.some((omission) => {
          const omissionDate = moment.tz(omission.date, this.props.convention.timezone_name).startOf('day');
          return (omission.label === timeblock.label && omissionDate.isSame(dayStart));
        });

        if (timeblockOutOfBounds || timeblockOmitted) {
          return { timeblock, dayStart, contents: null };
        }

        const selector = (
          <select className="form-control">
            <option value="">Don&apos;t care</option>
            <option value="1">1st choice</option>
            <option value="2">2nd choice</option>
            <option value="3">3rd choice</option>
            <option value="X">Prefer not</option>
          </select>
        );

        return { timeblock, dayStart, contents: selector };
      });

      if (cellContents.every(contents => contents.contents === null)) {
        return { dayStart, cells: cellContents.map(() => null) };
      }

      return {
        dayStart,
        cells: cellContents.map(contents => (
          <td key={contents.dayStart.format('dddd')}>{contents.contents}</td>
        )),
      };
    });

    const headers = dayStarts.map((dayStart, i) => {
      if (columns[i].cells.every(cell => !cell)) {
        return null;
      }

      return (
        <th key={dayStart.format('dddd')}>
          {dayStart.format('dddd')}
        </th>
      );
    });

    const rows = this.props.formItem.timeblocks.map((timeblock, i) => {
      const cells = columns.map(column => column.cells[i]);

      if (cells.every(cell => !cell)) {
        return null;
      }

      return (
        <tr key={timeblock.label}>
          <td>
            {timeblock.label}
            <br />
            <small>{describeTimeblock(timeblock)}</small>
          </td>
          {cells}
        </tr>
      );
    });

    return (
      <fieldset className="form-group">
        <legend
          className="col-form-legend"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: this.props.formItem.caption }}
        />
        <table className="table">
          <thead>
            <tr>
              <th />
              {headers}
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </fieldset>
    );
  };
}

export default TimeblockPreferenceItem;
