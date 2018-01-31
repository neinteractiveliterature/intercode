import React from 'react';
import PropTypes from 'prop-types';
import EventForm from './EventForm';
import RegistrationPolicy from '../Models/RegistrationPolicy';

class EditEvent extends React.Component {
  static propTypes = {
    event: PropTypes.shape({
      id: PropTypes.number.isRequired,
      registration_policy: RegistrationPolicy.apiRepresentationPropType.isRequired,
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
  };

  static defaultProps = {
    cancelPath: null,
    showDropButton: false,
    canOverrideMaximumEventProvidedTickets: false,
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
        category: event.category,
        title: event.title,
        author: event.author,
        email: event.email,
        organization: event.organization,
        con_mail_destination: event.con_mail_destination,
        url: event.url,
        short_blurb: event.short_blurb,
        description: event.description,
        participant_communications: event.participant_communications,
        length_seconds: event.length_seconds,
        registration_policy: {
          buckets: event.registration_policy.buckets.map(bucket => ({
            key: bucket.key,
            name: bucket.name,
            description: bucket.description,
            minimum_slots: bucket.minimum_slots,
            preferred_slots: bucket.preferred_slots,
            total_slots: bucket.total_slots,
            slots_limited: bucket.slots_limited,
            anything: bucket.anything,
          })),
        },
        can_play_concurrently: event.can_play_concurrently,
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
    />
  )
}

export default EditEvent;
