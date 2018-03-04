import React from 'react';
import PropTypes from 'prop-types';
import EventForm from './EventForm';
import Form from '../Models/Form';

class EditEvent extends React.Component {
  static propTypes = {
    event: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    updateEvent: PropTypes.func.isRequired,
    dropEvent: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    createMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    deleteMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    updateMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    cancelPath: PropTypes.string,
    showDropButton: PropTypes.bool,
    canOverrideMaximumEventProvidedTickets: PropTypes.bool,
    ticketTypes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      maximum_event_provided_tickets: PropTypes.number.isRequired,
    }).isRequired).isRequired,
    ticketName: PropTypes.string,
    convention: PropTypes.shape({}).isRequired,
    form: Form.propType.isRequired,
  };

  static defaultProps = {
    cancelPath: null,
    showDropButton: false,
    canOverrideMaximumEventProvidedTickets: false,
    ticketName: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      requestInProgress: false,
    };
  }

  updateEvent = (event) => {
    const eventInput = {
      id: event.id,
      event: {
        form_response_attrs_json: JSON.stringify(event.form_response_attrs),
      },
    };

    const afterSave = async () => {
      try {
        await this.props.updateEvent({ variables: { input: eventInput } });
        this.setState({ requestInProgress: false }, this.props.onSave);
      } catch (error) {
        this.setState({ error, requestInProgress: false });
      }
    };

    this.setState({ requestInProgress: true }, afterSave);
    return afterSave;
  }

  dropEvent = () => {
    const afterDrop = async () => {
      try {
        await this.props.dropEvent({ variables: { input: { id: this.props.event.id } } });
        this.setState({ requestInProgress: false }, this.props.onDrop);
      } catch (error) {
        this.setState({ error, requestInProgress: false });
      }
    };

    this.setState({ requestInProgress: true }, afterDrop);
    return afterDrop;
  }

  render = () => (
    <EventForm
      disabled={this.state.requestInProgress}
      error={this.state.error ? this.state.error.message : null}
      initialEvent={this.props.event}
      cancelPath={this.props.cancelPath}
      onSave={this.updateEvent}
      onDrop={this.dropEvent}
      createMaximumEventProvidedTicketsOverride={
        this.props.createMaximumEventProvidedTicketsOverride
      }
      deleteMaximumEventProvidedTicketsOverride={
        this.props.deleteMaximumEventProvidedTicketsOverride
      }
      updateMaximumEventProvidedTicketsOverride={
        this.props.updateMaximumEventProvidedTicketsOverride
      }
      showDropButton={this.props.showDropButton}
      canOverrideMaximumEventProvidedTickets={this.props.canOverrideMaximumEventProvidedTickets}
      ticketTypes={this.props.ticketTypes}
      ticketName={this.props.ticketName}
      convention={this.props.convention}
      form={this.props.form}
    />
  )
}

export default EditEvent;
