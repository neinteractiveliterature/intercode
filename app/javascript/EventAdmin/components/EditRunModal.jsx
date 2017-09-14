import React from 'react';
import PropTypes from 'prop-types';
import { gql, graphql, compose } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import Modal, { ConfirmModal } from 'react-bootstrap4-modal';
import moment from 'moment';
import Select from 'react-select';
import eventsQuery, { fragments } from '../eventsQuery';
import Timespan from '../../PCSG/Timespan';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';

const createRunMutation = gql`
mutation($input: CreateRunInput!) {
  createRun(input: $input) {
    run {
      ...RunFields
    }
  }
}

${fragments.run}
`;

const updateRunMutation = gql`
mutation($input: UpdateRunInput!) {
  updateRun(input: $input) {
    run {
      ...RunFields
    }
  }
}

${fragments.run}
`;

const deleteRunMutation = gql`
mutation($input: DeleteRunInput!) {
  deleteRun(input: $input) {
    run {
      ...RunFields
    }
  }
}

${fragments.run}
`;

@compose(
  graphql(createRunMutation, { name: 'createRun' }),
  graphql(updateRunMutation, { name: 'updateRun' }),
  graphql(deleteRunMutation, { name: 'deleteRun' }),
)
class EditRunModal extends React.Component {
  static propTypes = {
    run: propType(fragments.runFragment),
    event: propType(fragments.eventFragment),
    convention: propType(fragments.conventionFragment).isRequired,
    fieldChanged: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSaveStart: PropTypes.func.isRequired,
    onSaveSucceeded: PropTypes.func.isRequired,
    onSaveFailed: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    createRun: PropTypes.func.isRequired,
    deleteRun: PropTypes.func.isRequired,
    updateRun: PropTypes.func.isRequired,
  }

  static defaultProps = {
    run: null,
    event: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      day: null,
      hour: null,
      minute: null,
      isConfirmingDelete: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.conventionTimespan = new Timespan(
      moment(nextProps.convention.starts_at),
      moment(nextProps.convention.ends_at),
    );

    if (this.props.run && !nextProps.run) {
      // the run just cleared out; reset the form state
      this.setState({ day: null, hour: null, minute: null, isConfirmingDelete: false });
    }

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

  dayInputChanged = (event) => {
    const newDayString = event.target.value;

    if (newDayString != null) {
      this.setState(
        { day: moment(newDayString).tz(this.props.convention.timezone_name) },
        this.recalculateStartsAt,
      );
    } else {
      this.setState(
        { day: null },
        this.recalculateStartsAt,
      );
    }
  }

  roomsInputChanged = (rooms) => {
    this.props.fieldChanged('rooms', rooms.map(room => ({ id: room.value, name: room.label })));
  }

  textInputChanged = (event) => {
    this.props.fieldChanged(event.target.name, event.target.value);
  }

  timeInputChanged = (event) => {
    const newValue = event.target.value;

    if (newValue && newValue !== '') {
      this.setState(
        { [event.target.name]: parseInt(newValue, 10) },
        this.recalculateStartsAt,
      );
    } else {
      this.setState(
        { [event.target.name]: null },
        this.recalculateStartsAt,
      );
    }
  }

  recalculateStartsAt = () => {
    const startTime = this.getStartTime();
    const startsAtString = (startTime ? startTime.toISOString() : null);

    this.props.fieldChanged('starts_at', startsAtString);
  }

  initiateSaveMutation = () => {
    const { run } = this.props;
    const commonProps = {
      starts_at: run.starts_at,
      title_suffix: run.title_suffix,
      schedule_note: run.schedule_note,
      room_ids: run.rooms.map(room => room.id),
    };

    if (run.id) {
      return this.props.updateRun({
        variables: {
          input: {
            id: run.id,
            ...commonProps,
          },
        },
      });
    }

    return this.props.createRun({
      variables: {
        input: {
          event_id: this.props.event.id,
          ...commonProps,
        },
      },
      update: (store, { data: { createRun: { run: newRun } } }) => {
        const eventsData = store.readQuery({ query: eventsQuery });
        const eventData = eventsData.events.find(event => event.id === this.props.event.id);
        eventData.runs.push(newRun);
        store.writeQuery({ query: eventsQuery, data: eventsData });
      },
    });
  }

  saveRun = () => {
    this.props.onSaveStart();

    this.initiateSaveMutation()
      .then(data => this.props.onSaveSucceeded(data.run))
      .catch(error => this.props.onSaveFailed(error));
  }

  deleteClicked = () => {
    this.setState({ isConfirmingDelete: true });
  }

  deleteCanceled = () => {
    this.setState({ isConfirmingDelete: false });
  }

  deleteConfirmed = () => {
    this.props.deleteRun({
      variables: {
        input: {
          id: this.props.run.id,
        },
      },
      update: (store) => {
        const eventsData = store.readQuery({ query: eventsQuery });
        const eventData = eventsData.events.find(event => event.id === this.props.event.id);
        const runIndex = eventData.runs.findIndex(run => run.id === this.props.run.id);
        eventData.runs.splice(runIndex, 1);
        store.writeQuery({ query: eventsQuery, data: eventsData });
      },
    }).then(() => {
      this.setState(
        { isConfirmingDelete: false },
        this.props.onDelete,
      );
    });
  }

  renderTitle = () => {
    const { run, event } = this.props;

    if (!run) {
      return null;
    }

    if (run.id != null) {
      return `Edit run of ${event.title} `;
    }

    return `Add run of ${event.title}`;
  }

  renderDaySelect = () => {
    const { convention } = this.props;
    if (!this.conventionTimespan) {
      return null;
    }

    const conventionDays = [];
    const now = this.conventionTimespan.start.clone().tz(convention.timezone_name).startOf('day');
    while (now.isBefore(this.conventionTimespan.finish)) {
      conventionDays.push(now.clone());
      now.add(1, 'day');
    }

    const options = conventionDays.map(day => (
      <div className="form-check form-check-inline" key={day.toISOString()}>
        <label className="form-check-label">
          <input
            className="form-check-input"
            type="radio"
            name="day"
            value={day.toISOString()}
            checked={day.isSame(this.state.day)}
            onChange={this.dayInputChanged}
          />
          {' '}
          {day.format('dddd')}
        </label>
      </div>
    ));

    return (
      <fieldset className="form-group">
        <legend className="col-form-legend">Day</legend>
        {options}
      </fieldset>
    );
  }

  renderTimeSelect = () => {
    if (!this.state.day) {
      return null;
    }

    const hourOptions = [];
    const now = this.state.day.clone();
    const startOfNextDay = this.state.day.clone().add(1, 'day');
    while (now.isBefore(startOfNextDay)) {
      hourOptions.push(
        <option
          key={now.toISOString()}
          value={now.hour()}
        >
          {now.hour()}
        </option>,
      );
      now.add(1, 'hour');
    }

    const minuteOptions = [0, 15, 30, 45].map(minute => (
      <option key={minute} value={minute}>{minute.toString(10).padStart(2, '0')}</option>
    ));

    const startTime = this.getStartTime();

    return (
      <fieldset className="form-group">
        <legend className="col-form-legend">Time</legend>
        <div className="form-inline">
          <label className="sr-only">Hour</label>
          <select
            className="form-control mr-1"
            name="hour"
            value={this.state.hour == null ? '' : this.state.hour}
            onChange={this.timeInputChanged}
          >
            <option />
            {hourOptions}
          </select>

          <span className="mx-1">:</span>

          <label className="sr-only">Minute</label>
          <select
            className="form-control mr-1"
            name="minute"
            value={this.state.minute == null ? '' : this.state.minute}
            onChange={this.timeInputChanged}
          >
            <option />
            {minuteOptions}
          </select>
          {
            startTime &&
            `- ${startTime.clone().add(this.props.event.length_seconds, 'seconds').format('H:mm')}`
          }
        </div>
      </fieldset>
    );
  }

  renderFormBody = () => {
    if (!this.props.run) {
      return <div className="modal-body" />;
    }

    return (
      <div className="modal-body">
        {this.renderDaySelect()}
        {this.renderTimeSelect()}

        <BootstrapFormInput
          name="title_suffix"
          label="Title suffix"
          value={this.props.run.title_suffix}
          onChange={this.textInputChanged}
        />
        <BootstrapFormInput
          name="schedule_note"
          label="Schedule note"
          value={this.props.run.schedule_note}
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

  render = () => (
    <div>
      <Modal visible={this.props.run != null && !this.state.isConfirmingDelete}>
        <div className="modal-header">
          <h5 className="modal-title">{this.renderTitle()}</h5>
        </div>
        {this.renderFormBody()}
        <div className="modal-footer">
          <div className="d-flex w-100">
            <div>
              <button type="button" className="btn btn-outline-danger" onClick={this.deleteClicked}>
                Delete
              </button>
            </div>
            <div className="col text-right pr-0">
              <button type="button" className="btn btn-secondary mr-2" onClick={this.props.onCancel}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.saveRun}
                disabled={!this.props.run || this.props.run.starts_at == null}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <ConfirmModal
        visible={this.state.isConfirmingDelete}
        onCancel={this.deleteCanceled}
        onOK={this.deleteConfirmed}
      >
        Are you sure you want to delete this run of {this.props.event && this.props.event.title}?
      </ConfirmModal>
    </div>
  )
}

export default EditRunModal;
