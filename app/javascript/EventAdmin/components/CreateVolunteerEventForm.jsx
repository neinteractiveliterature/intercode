import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';
import { enableUniqueIds } from 'react-html-id';
import CommonEventFormFields from '../../BuiltInForms/CommonEventFormFields';
import eventsQuery from '../eventsQuery';
import { createEventMutation } from '../mutations';

@withRouter
@graphql(createEventMutation, { name: 'createEvent' })
class CreateVolunteerEventForm extends React.Component {
  static propTypes = {
    convention: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    createEvent: PropTypes.func.isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      event: {
        category: 'volunteer_event',
        can_play_concurrently: false,
        con_mail_destination: 'event_email',
        author: `${this.props.convention.name} Staff`,
        title: '',
        email: '',
        short_blurb: '',
        description: '',
        length_seconds: null,
        registration_policy: CommonEventFormFields.buildRegistrationPolicyForVolunteerEvent(null),
      },
    };
  }

  isDataComplete = () => (
    this.state.event.title &&
    this.state.event.short_blurb && this.state.event.description &&
    this.state.event.length_seconds > 0 &&
    this.state.event.registration_policy.buckets[0].total_slots > 0
  )

  eventFieldChanged = (newEventData) => {
    this.setState({ event: { ...this.state.event, ...newEventData } });
  }

  createEvent = () => this.props.createEvent({
    variables: {
      input: {
        event: this.state.event,
      },
    },
    update: (store, { data: { createEvent: { event: newEvent } } }) => {
      const eventsData = store.readQuery({ query: eventsQuery });
      eventsData.events.push(newEvent);
      store.writeQuery({ query: eventsQuery, data: eventsData });
      this.props.history.replace('/volunteer_events');
    },
  })

  renderFormBody = () => (
    <CommonEventFormFields
      event={this.state.event}
      onChange={this.eventFieldChanged}
    />
  )

  render = () => (
    <div className="my-4">
      <h2 className="mb-3">Create volunteer event</h2>
      {this.renderFormBody()}
      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={this.createEvent}
          disabled={!this.isDataComplete()}
        >
          Create event
        </button>
        <Link className="btn btn-link" to="/volunteer_events">
          Cancel
        </Link>
      </div>
    </div>
  )
}

export default CreateVolunteerEventForm;
