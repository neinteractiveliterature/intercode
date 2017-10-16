import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import moment from 'moment';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import TimeSelect from '../BuiltInFormControls/TimeSelect';
import Timespan from '../PCSG/Timespan';
import { timespanFromConvention } from '../TimespanUtils';

const roomPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
});

class RunFormFields extends React.Component {
  static propTypes = {
    run: PropTypes.shape({
      starts_at: PropTypes.string,
      title_suffix: PropTypes.string,
      schedule_note: PropTypes.string,
      rooms: PropTypes.arrayOf(roomPropType).isRequired,
    }).isRequired,
    event: PropTypes.shape({
      length_seconds: PropTypes.number.isRequired,
    }).isRequired,
    convention: PropTypes.shape({
      starts_at: PropTypes.string.isRequired,
      ends_at: PropTypes.string.isRequired,
      timezone_name: PropTypes.string.isRequired,
      rooms: PropTypes.arrayOf(roomPropType).isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      day: null,
      hour: null,
      minute: null,
    };
  }

  componentWillMount = () => {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.conventionTimespan = timespanFromConvention(nextProps.convention);

    if (nextProps.run && nextProps.run.starts_at) {
      const startsAt = moment(nextProps.run.starts_at).tz(nextProps.convention.timezone_name);
      this.setState({
        day: startsAt.clone().startOf('day'),
        hour: startsAt.hour(),
        minute: startsAt.minute(),
      });
    }
  }

  getStartTime = () => {
    if (this.state.day == null || this.state.hour == null || this.state.minute == null) {
      return null;
    }

    return this.state.day.clone().set({
      hour: this.state.hour,
      minute: this.state.minute,
    });
  }

  recalculateStartsAt = () => {
    const startTime = this.getStartTime();
    const startsAtString = (startTime ? startTime.toISOString() : null);

    this.props.onChange({
      ...this.props.run,
      starts_at: startsAtString,
    });
  }

  dayInputChanged = (day) => {
    this.setState({ day }, this.recalculateStartsAt);
  }

  roomsInputChanged = (rooms) => {
    this.props.onChange({
      ...this.props.run,
      rooms: rooms.map(room => ({ id: room.value, name: room.label })),
    });
  }

  textInputChanged = (event) => {
    this.props.onChange({
      ...this.props.run,
      [event.target.name]: event.target.value,
    });
  }

  timeInputChanged = ({ hour, minute }) => {
    this.setState({ hour, minute }, this.recalculateStartsAt);
  }

  renderTimeSelect = () => {
    const { day, hour, minute } = this.state;

    if (!day) {
      return null;
    }

    const timespan = new Timespan(
      this.state.day.clone(),
      this.state.day.clone().add(1, 'day'),
    ).intersection(this.conventionTimespan);

    const startTime = this.getStartTime();

    return (
      <fieldset className="form-group">
        <legend className="col-form-legend">Time</legend>
        <TimeSelect
          value={{ hour, minute }}
          onChange={this.timeInputChanged}
          timespan={timespan}
        >
          {
            startTime &&
            `- ${startTime.clone().add(this.props.event.length_seconds, 'seconds').format('H:mm')}`
          }
        </TimeSelect>
      </fieldset>
    );
  }

  render = () => (
    <div>
      <ConventionDaySelect
        convention={this.props.convention}
        value={this.state.day}
        onChange={this.dayInputChanged}
      />
      {this.renderTimeSelect()}

      <BootstrapFormInput
        name="title_suffix"
        label="Title suffix"
        value={this.props.run.title_suffix || ''}
        onChange={this.textInputChanged}
      />
      <BootstrapFormInput
        name="schedule_note"
        label="Schedule note"
        value={this.props.run.schedule_note || ''}
        onChange={this.textInputChanged}
      />

      <div className="form-group">
        <label>Room(s)</label>
        <Select
          name="room_ids"
          options={
            this.props.convention.rooms.map(room => ({ label: room.name, value: room.id }))
          }
          multi
          value={this.props.run.rooms.map(room => room.id)}
          onChange={this.roomsInputChanged}
        />
      </div>
    </div>
  );
}

export default RunFormFields;
