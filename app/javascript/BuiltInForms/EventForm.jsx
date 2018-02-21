import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ConfirmModal } from 'react-bootstrap4-modal';
import CommonEventFormFields from './CommonEventFormFields';
import Form from '../Models/Form';

class EventForm extends React.Component {
  static propTypes = {
    initialEvent: PropTypes.shape({
      id: PropTypes.number,
      maximum_event_provided_tickets_overrides: PropTypes.arrayOf(PropTypes.shape({})),
    }).isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    showDropButton: PropTypes.bool,
    canOverrideMaximumEventProvidedTickets: PropTypes.bool,
    ticketTypes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      maximum_event_provided_tickets: PropTypes.number.isRequired,
    }).isRequired).isRequired,
    ticketName: PropTypes.string,
    form: Form.propType.isRequired,
    convention: PropTypes.shape({}).isRequired,

    cancelPath: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    createMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    deleteMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    updateMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
  };

  static defaultProps = {
    cancelPath: null,
    disabled: false,
    error: null,
    showDropButton: false,
    canOverrideMaximumEventProvidedTickets: false,
    ticketName: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      event: props.initialEvent,
      droppingEvent: false,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const nextOverrides = nextProps.initialEvent.maximum_event_provided_tickets_overrides;
    this.setState({
      event: {
        ...this.state.event,
        maximum_event_provided_tickets_overrides: nextOverrides,
      },
    });
  }

  beginDrop = (event) => {
    event.preventDefault();
    this.setState({ droppingEvent: true });
  }

  confirmDrop = (event) => {
    event.preventDefault();
    this.props.onDrop();
  }

  cancelDrop = (event) => {
    event.preventDefault();
    this.setState({ droppingEvent: false });
  }

  isDataComplete = () => (
    this.state.event.title != null && this.state.event.title !== '' &&
    this.state.event.length_seconds
  );

  eventFieldChanged = (eventData) => {
    this.setState({ event: { ...this.state.event, ...eventData } });
  }

  saveClicked = (event) => {
    event.preventDefault();
    this.props.onSave(this.state.event);
  }

  renderHeader = () => {
    let dropButton = null;
    if (this.props.showDropButton && this.state.event.id && this.state.event.status !== 'dropped') {
      dropButton = (
        <button className="btn btn-outline-danger float-right" onClick={this.beginDrop}>
          Drop event
        </button>
      );
    }

    return (
      <header>
        {dropButton}

        <h3 className="mb-4">
          {this.state.event.id ? 'Edit event' : 'New event'}
        </h3>
      </header>
    );
  }

  renderErrorDisplay = () => {
    if (this.props.error) {
      return <div className="alert alert-danger">{this.props.error}</div>;
    }

    return null;
  }

  render = () => {
    const saveCaption = (this.state.event.id ? 'Save event' : 'Create event');
    let cancelLink = null;
    if (this.props.cancelPath) {
      cancelLink = <Link to={this.props.cancelPath} className="btn btn-link">Cancel</Link>;
    }

    const disabled = this.props.disabled || !this.isDataComplete();

    return (
      <form className="my-4">
        {this.renderHeader()}

        <CommonEventFormFields
          event={this.state.event}
          onChange={this.eventFieldChanged}
          ticketName={this.props.ticketName}
          canOverrideMaximumEventProvidedTickets={this.props.canOverrideMaximumEventProvidedTickets}
          createMaximumEventProvidedTicketsOverride={
            this.props.createMaximumEventProvidedTicketsOverride
          }
          deleteMaximumEventProvidedTicketsOverride={
            this.props.deleteMaximumEventProvidedTicketsOverride
          }
          updateMaximumEventProvidedTicketsOverride={
            this.props.updateMaximumEventProvidedTicketsOverride
          }
          ticketTypes={this.props.ticketTypes}
          form={this.props.form}
          convention={this.props.convention}
        />

        {this.renderErrorDisplay()}

        <button className="btn btn-primary mt-4" onClick={this.saveClicked} disabled={disabled}>
          {saveCaption}
        </button>
        {cancelLink}

        <ConfirmModal
          visible={this.state.droppingEvent}
          onCancel={this.cancelDrop}
          onOK={this.confirmDrop}
        >
          Are you sure you want to drop {this.state.event.title}?  Doing so will
          also delete any runs of this event and remove any participants signed up
          for those runs.
        </ConfirmModal>
      </form>
    );
  }
}

export default EventForm;
