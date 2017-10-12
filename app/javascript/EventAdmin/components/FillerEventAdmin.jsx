import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Link, Switch, Route, withRouter } from 'react-router-dom';
import { ConfirmModal } from 'react-bootstrap4-modal';
import FillerEventForm from '../../BuiltInForms/FillerEventForm';
import GraphQLResultPropType from '../../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../../GraphQLQueryResultWrapper';
import eventsQuery from '../eventsQuery';
import { timespanFromRun } from '../../TimespanUtils';
import {
  createFillerEventMutation,
  deleteEventMutation,
  updateEventMutation,
  updateRunMutation,
} from '../mutations';

const buildEventInput = event => ({
  event: {
    title: event.title,
    description: event.description,
    short_blurb: event.short_blurb,
    email: event.email,
    length_seconds: event.length_seconds,
    category: event.category,
  },
});

const buildRunInput = run => ({
  run: {
    starts_at: run.starts_at,
    schedule_note: run.schedule_note,
    title_suffix: run.title_suffix,
    room_ids: run.rooms.map(room => room.id),
  },
});

@withRouter
@compose(
  graphql(eventsQuery),
  graphql(createFillerEventMutation, { name: 'createFillerEvent' }),
  graphql(deleteEventMutation, { name: 'deleteEvent' }),
  graphql(updateEventMutation, { name: 'updateEvent' }),
  graphql(updateRunMutation, { name: 'updateRun' }),
)
@GraphQLQueryResultWrapper
class FillerEventAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(eventsQuery, 'events', 'convention').isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    createFillerEvent: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    updateEvent: PropTypes.func.isRequired,
    updateRun: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmingDeleteEventId: null,
      error: null,
      requestInProgress: false,
    };
  }

  componentWillReceiveProps = () => {
    this.setState({ error: null, requestInProgress: null });
  }

  createFillerEvent = ({ event, run }) => {
    const input = {
      event: {
        ...buildEventInput(event).event,
        status: 'active',
        can_play_concurrently: false,
        con_mail_destination: 'event_email',
        author: `${this.props.data.convention.name} Staff`,
      },
      ...buildRunInput(run),
    };

    this.setState(
      { requestInProgress: true },
      () => {
        this.props.createFillerEvent({
          variables: { input },
          update: (store, { data: { createFillerEvent: { event: newEvent } } }) => {
            const eventsData = store.readQuery({ query: eventsQuery });
            eventsData.events.push(newEvent);
            store.writeQuery({ query: eventsQuery, data: eventsData });
          },
        }).then(() => {
          this.props.history.push('/filler_events');
          this.setState({ requestInProgress: false });
        }).catch((error) => {
          this.setState({ error, requestInProgress: false });
        });
      },
    );
  }

  updateFillerEvent = ({ event, run }) => {
    const eventInput = {
      ...buildEventInput(event),
      id: event.id,
    };

    const runInput = {
      ...buildRunInput(run),
      id: run.id,
    };

    this.setState(
      { requestInProgress: true },
      () => {
        this.props.updateEvent({ variables: { input: eventInput } }).then(
          () => this.props.updateRun({ variables: { input: runInput } }),
        ).then(() => {
          this.props.history.push('/filler_events');
          this.setState({ requestInProgress: false });
        }).catch((error) => {
          this.setState({ error, requestInProgress: false });
        });
      },
    );
  }

  deleteClicked = (eventId) => {
    this.setState({ confirmingDeleteEventId: eventId });
  }

  deleteCanceled = () => {
    this.setState({ confirmingDeleteEventId: null });
  }

  deleteConfirmed = () => {
    const id = this.state.confirmingDeleteEventId;

    this.setState(
      { requestInProgress: true },
      () => {
        this.props.deleteEvent({
          variables: { input: { id } },
          update: (store) => {
            const eventsData = store.readQuery({ query: eventsQuery });
            const eventIndex = eventsData.events.findIndex(event => event.id === id);
            eventsData.events.splice(eventIndex, 1);
            store.writeQuery({ query: eventsQuery, data: eventsData });
          },
        }).then(() => {
          this.setState({ requestInProgress: false, confirmingDeleteEventId: null });
        }).catch((error) => {
          this.setState({ error, requestInProgress: false });
        });
      },
    );
  }

  renderFillerEventsList = () => {
    const { data } = this.props;

    const fillerEvents = data.events.filter(event => event.category === 'filler');
    fillerEvents.sort((a, b) => {
      const timespanA = timespanFromRun(this.props.data.convention, a, a.runs[0]);
      const timespanB = timespanFromRun(this.props.data.convention, b, b.runs[0]);

      return timespanA.start.diff(timespanB.start);
    });
    const eventRows = fillerEvents.map((event) => {
      const run = event.runs[0];
      const timespan = timespanFromRun(this.props.data.convention, event, run);

      return (
        <tr className={event.id}>
          <th scope="row">{event.title}</th>
          <td>
            {timespan.humanizeInTimezone(this.props.data.convention.timezone_name)}
          </td>
          <td>
            <Link className="btn btn-secondary btn-sm" to={`/filler_events/${event.id}/edit`}>
              Edit
            </Link>
            {' '}
            <button className="btn btn-outline-danger btn-sm" onClick={() => this.deleteClicked(event.id)}>
              <i className="fa fa-trash-o" />
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <Link className="btn btn-primary my-4" to="/filler_events/new">
          Create new filler event
        </Link>
        <table className="table table-striped">
          <tbody>
            {eventRows}
          </tbody>
        </table>
        <ConfirmModal
          visible={this.state.confirmingDeleteEventId != null}
          onCancel={this.deleteCanceled}
          onOK={this.deleteConfirmed}
        >
          Are you sure you want to delete this filler event?
        </ConfirmModal>
      </div>
    );
  }

  renderCreateFillerEventForm = () => (
    <div>
      <FillerEventForm
        disabled={this.state.requestInProgress}
        error={this.state.error ? this.state.error.message : null}
        initialEvent={{ category: 'filler', email: '', short_blurb: '', description: '', title: '', runs: [{ rooms: [] }] }}
        convention={this.props.data.convention}
        cancelPath="/filler_events"
        onSave={this.createFillerEvent}
      />
    </div>
  )

  renderEditFillerEventForm = ({ match }) => {
    const event = this.props.data.events.find(e => e.id.toString() === match.params.id);

    return (
      <div>
        <FillerEventForm
          disabled={this.state.requestInProgress}
          error={this.state.error ? this.state.error.message : null}
          initialEvent={event}
          convention={this.props.data.convention}
          cancelPath="/filler_events"
          onSave={this.updateFillerEvent}
        />
      </div>
    );
  }

  render = () => (
    <Switch>
      <Route path="/filler_events/new" render={this.renderCreateFillerEventForm} />
      <Route path="/filler_events/:id/edit" render={this.renderEditFillerEventForm} />
      <Route render={this.renderFillerEventsList} />
    </Switch>
  )
}

export default FillerEventAdmin;
