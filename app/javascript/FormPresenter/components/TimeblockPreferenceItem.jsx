import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { enableUniqueIds } from 'react-html-id';
import RequiredIndicator from './RequiredIndicator';
import TimeblockTypes, {
  TimeblockPropType,
  TimeblockOmissionPropType,
  TimeblockPreferenceAPIRepresentationPropType,
} from '../TimeblockTypes';
import TimeblockPreferenceCell from './TimeblockPreferenceCell';

const { preferencesMatch } = TimeblockTypes;

function describeTimeblock(timeblock) {
  const start = moment().startOf('day').set(timeblock.start);
  const finish = moment().startOf('day').set(timeblock.finish);

  return `${start.format('h:mma')} - ${finish.format('h:mma')}`;
}

class TimeblockPreferenceItem extends React.Component {
  static propTypes = {
    formItem: PropTypes.shape({
      caption: PropTypes.string.isRequired,
      properties: PropTypes.shape({
        caption: PropTypes.string.isRequired,
        timeblocks: PropTypes.arrayOf(TimeblockPropType.isRequired).isRequired,
        omit_timeblocks: PropTypes.arrayOf(TimeblockOmissionPropType.isRequired).isRequired,
      }).isRequired,
    }).isRequired,
    convention: PropTypes.shape({
      starts_at: PropTypes.string.isRequired,
      ends_at: PropTypes.string.isRequired,
      timezone_name: PropTypes.string.isRequired,
    }).isRequired,
    value: PropTypes.arrayOf(TimeblockPreferenceAPIRepresentationPropType.isRequired),
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: [],
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      preferences: (this.props.value || []).map(apiRepresentation => ({
        start: moment(apiRepresentation.start),
        finish: moment(apiRepresentation.finish),
        label: apiRepresentation.label,
        ordinality: apiRepresentation.ordinality,
      })),
    };
  }

  preferenceDidChange = (newOrdinality, hypotheticalPreference) => {
    const existingPreference = this.state.preferences.find(p =>
      preferencesMatch(p, hypotheticalPreference));

    if (newOrdinality === '') {
      this.setState({
        preferences: this.state.preferences.filter(p =>
          (!(preferencesMatch(p, hypotheticalPreference)))),
      }, this.preferencesDidChange);
    } else if (existingPreference) {
      this.setState({
        preferences: this.state.preferences.map((p) => {
          if (preferencesMatch(p, hypotheticalPreference)) {
            return { ...p, ordinality: newOrdinality };
          }

          return p;
        }),
      }, this.preferencesDidChange);
    } else {
      this.setState({
        preferences: [
          ...this.state.preferences,
          {
            ...hypotheticalPreference,
            ordinality: newOrdinality,
          },
        ],
      }, this.preferencesDidChange);
    }
  }

  preferencesDidChange = () => {
    this.props.onChange(this.state.preferences.map(preference => ({
      start: preference.start.toISOString(),
      finish: preference.finish.toISOString(),
      label: preference.label,
      ordinality: preference.ordinality,
    })));
  }

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
      const cellContents = this.props.formItem.properties.timeblocks.map((timeblock) => {
        const timeblockStart = moment(dayStart).set(timeblock.start);
        const timeblockFinish = moment(dayStart).set(timeblock.finish);

        const timeblockOutOfBounds = (
          timeblockFinish.isSameOrBefore(startsAt) || timeblockStart.isSameOrAfter(endsAt)
        );
        const timeblockOmitted = this.props.formItem.properties.omit_timeblocks.some((omission) => {
          const omissionDate = moment.tz(omission.date, this.props.convention.timezone_name).startOf('day');
          return (omission.label === timeblock.label && omissionDate.isSame(dayStart));
        });

        return {
          timeblock,
          dayStart,
          start: timeblockStart,
          finish: timeblockFinish,
          render: !(timeblockOutOfBounds || timeblockOmitted),
        };
      });

      return {
        dayStart,
        cells: cellContents,
        render: cellContents.some(contents => contents.render),
      };
    });

    const headers = dayStarts.map((dayStart, i) => {
      if (!columns[i].render) {
        return null;
      }

      return (
        <th key={dayStart.format('dddd')}>
          {dayStart.format('dddd')}
        </th>
      );
    });

    const rows = this.props.formItem.properties.timeblocks.map((timeblock, i) => {
      const cellContents = dayStarts.map((dayStart, j) => {
        if (!columns[j].render) {
          return null;
        }

        return columns[j].cells[i];
      }).filter(cellContent => cellContent);

      if (cellContents.every(cellContent => !cellContent.render)) {
        return null;
      }

      const cells = cellContents.map(({
        dayStart, render, start, finish,
      }) => (
        <TimeblockPreferenceCell
          key={dayStart.format('dddd')}
          render={render}
          timeblock={timeblock}
          existingPreferences={this.state.preferences}
          dayStart={dayStart}
          start={start}
          finish={finish}
          onChange={this.preferenceDidChange}
        />
      ));

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
        <legend className="col-form-legend">
          <span
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: this.props.formItem.properties.caption }}
          />
          <RequiredIndicator formItem={this.props.formItem} />
        </legend>
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
