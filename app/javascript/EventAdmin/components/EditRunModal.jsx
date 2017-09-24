import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import Modal, { ConfirmModal } from 'react-bootstrap4-modal';
import moment from 'moment';
import Select from 'react-select';
import ConventionDaySelect from './ConventionDaySelect';
import TimeSelect from './TimeSelect';
import eventsQuery, { fragments } from '../eventsQuery';
import { createRunMutation, updateRunMutation, deleteRunMutation } from '../mutations';
import Timespan from '../../PCSG/Timespan';
import { timespanFromConvention } from '../TimespanUtils';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';

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
    this.conventionTimespan = timespanFromConvention(nextProps.convention);

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

  dayInputChanged = (day) => {
    this.setState({ day }, this.recalculateStartsAt);
  }

  roomsInputChanged = (rooms) => {
    this.props.fieldChanged('rooms', rooms.map(room => ({ id: room.value, name: room.label })));
  }

  textInputChanged = (event) => {
    this.props.fieldChanged(event.target.name, event.target.value);
  }

  timeInputChanged = ({ hour, minute }) => {
    this.setState({ hour, minute }, this.recalculateStartsAt);
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

  renderFormBody = () => {
    if (!this.props.run) {
      return <div className="modal-body" />;
    }

    return (
      <div className="modal-body">
        <ConventionDaySelect
          convention={this.props.convention}
          value={this.state.day}
          onChange={this.dayInputChanged}
        />
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
