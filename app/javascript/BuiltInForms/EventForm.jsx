import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
    };
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
        <h3 className="mb-4">
          {this.state.event.id ? 'Edit event' : 'New event'}
        </h3>

        <CommonEventFormFields
          event={this.state.event}
          onChange={this.eventFieldChanged}
        />

        {this.renderErrorDisplay()}

        <button className="btn btn-primary" onClick={this.saveClicked} disabled={disabled}>
          {saveCaption}
        </button>
        {cancelLink}
      </form>
    );
  }
}

export default EventForm;
