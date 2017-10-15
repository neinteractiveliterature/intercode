import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import eventsQuery from '../eventsQuery';
import { updateEventMutation } from '../mutations';
import GraphQLResultPropType from '../../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../../GraphQLQueryResultWrapper';
import EventForm from '../../BuiltInForms/EventForm';

@withRouter
@compose(
  graphql(eventsQuery),
  graphql(updateEventMutation, { name: 'updateEvent' }),
)
@GraphQLQueryResultWrapper
class EditEvent extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(eventsQuery, 'events', 'convention').isRequired,
    updateEvent: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
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

    this.setState(
      { requestInProgress: true },
      () => {
        this.props.updateEvent({ variables: { input: eventInput } }).then(() => {
          this.props.history.push('/runs');
          this.setState({ requestInProgress: false });
        }).catch((error) => {
          this.setState({ error, requestInProgress: false });
        });
      },
    );
  }

  render = () => {
    const event = this.props.data.events.find(e => e.id.toString() === this.props.match.params.id);

    return (
      <EventForm
        disabled={this.state.requestInProgress}
        error={this.state.error ? this.state.error.message : null}
        initialEvent={event}
        cancelPath="/runs"
        onSave={this.updateEvent}
      />
    );
  }
}

export default EditEvent;
