import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';
import { enableUniqueIds } from 'react-html-id';
import CommonEventFormFields from '../../BuiltInForms/CommonEventFormFields';
import ErrorDisplay from '../../ErrorDisplay';
import eventsQuery from '../eventsQuery';
import { createEventMutation } from '../mutations';
import getFormForEventCategory from '../getFormForEventCategory';

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
        form_response_attrs: {
          can_play_concurrently: false,
          con_mail_destination: 'event_email',
          title: '',
          email: '',
          short_blurb: '',
          description: '',
          length_seconds: null,
          registration_policy: CommonEventFormFields.buildRegistrationPolicyForVolunteerEvent(null),
        },
      },
    };
  }

  isDataComplete = () => {
    const { form_response_attrs: formResponseAttrs } = this.state.event;

    return (
      formResponseAttrs.title &&
      formResponseAttrs.short_blurb && formResponseAttrs.description &&
      formResponseAttrs.length_seconds > 0 &&
      formResponseAttrs.registration_policy.buckets[0].total_slots > 0
    );
  }

  eventFieldChanged = (newEventData) => {
    this.setState({ event: { ...this.state.event, ...newEventData } });
  }

  createEvent = async () => {
    const { total_slots: totalSlots, ...formResponseAttrs } = this.state.event.form_response_attrs;

    try {
      await this.props.createEvent({
        variables: {
          input: {
            category: this.state.event.category,
            event: {
              form_response_attrs_json: JSON.stringify(formResponseAttrs),
            },
          },
        },
        update: (store, { data: { createEvent: { event: newEvent } } }) => {
          const eventsData = store.readQuery({ query: eventsQuery });
          eventsData.events.push(newEvent);
          store.writeQuery({ query: eventsQuery, data: eventsData });
          this.props.history.replace('/volunteer_events');
        },
      });
    } catch (error) {
      this.setState({ error });
    }
  }

  renderFormBody = () => (
    <CommonEventFormFields
      event={this.state.event}
      convention={this.props.convention}
      form={getFormForEventCategory(this.state.event, this.props.convention)}
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
        <ErrorDisplay graphQLError={this.state.error} />
      </div>
    </div>
  )
}

export default CreateVolunteerEventForm;
