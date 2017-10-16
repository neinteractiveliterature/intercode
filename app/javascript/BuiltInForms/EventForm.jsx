import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ConfirmModal } from 'react-bootstrap4-modal';
import CommonEventFormFields from './CommonEventFormFields';

class EventForm extends React.Component {
  static propTypes = {
    initialEvent: PropTypes.shape({
      id: PropTypes.number,
    }).isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.string,

    cancelPath: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
  };

  static defaultProps = {
    cancelPath: null,
    disabled: false,
    error: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      event: props.initialEvent,
      droppingEvent: false,
    };
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
    this.state.event.title != null &&
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
    if (this.state.event.status !== 'dropped') {
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
        />

        {this.renderErrorDisplay()}

        <button className="btn btn-primary" onClick={this.saveClicked} disabled={disabled}>
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
