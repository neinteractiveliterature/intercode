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
  dropEventMutation,
  updateEventMutation,
  updateRunMutation,
} from '../mutations';
import deserializeEvent from '../deserializeEvent';

const buildEventInput = event => ({
  event: {
    form_response_attrs: event.form_response_attrs,
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
  graphql(dropEventMutation, { name: 'dropEvent' }),
  graphql(updateEventMutation, { name: 'updateEvent' }),
  graphql(updateRunMutation, { name: 'updateRun' }),
)
@GraphQLQueryResultWrapper
class FillerEventAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(eventsQuery).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    createFillerEvent: PropTypes.func.isRequired,
    dropEvent: PropTypes.func.isRequired,
    updateEvent: PropTypes.func.isRequired,
    updateRun: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmingDropEventId: null,
      error: null,
      requestInProgress: false,
    };
  }

  componentWillReceiveProps = () => {
    this.setState({ error: null, requestInProgress: null });
  }

  createFillerEvent = ({ event, run }) => {
    const eventInput = buildEventInput(event).event;
    const input = {
      event: {
        form_response_attrs_json: JSON.stringify({
          ...eventInput.form_response_attrs,
          can_play_concurrently: false,
          con_mail_destination: 'event_email',
          author: `${this.props.data.convention.name} Staff`,
        }),
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
      id: event.id,
      event: {
        form_response_attrs_json: JSON.stringify(buildEventInput(event).event.form_response_attrs),
      },
    };

    const runInput = {
      ...buildRunInput(run),
      id: run.id,
    };

    this.setState(
      { requestInProgress: true },
      () => {
        this.props.updateEvent({ variables: { input: eventInput } }).then(() => this.props.updateRun({ variables: { input: runInput } })).then(() => {
          this.props.history.push('/filler_events');
          this.setState({ requestInProgress: false });
        }).catch((error) => {
          this.setState({ error, requestInProgress: false });
        });
      },
    );
  }

  dropClicked = (eventId) => {
    this.setState({ confirmingDropEventId: eventId });
  }

  dropCanceled = () => {
    this.setState({ confirmingDropEventId: null });
  }

  dropConfirmed = () => {
    const id = this.state.confirmingDropEventId;

    this.setState(
      { requestInProgress: true },
      () => {
        this.props.dropEvent({
          variables: { input: { id } },
        }).then(() => {
          this.setState({ requestInProgress: false, confirmingDropEventId: null });
        }).catch((error) => {
          this.setState({ error, requestInProgress: false });
        });
      },
    );
  }

  renderFillerEventsList = () => {
    const { data } = this.props;

    const fillerEvents = data.events.filter(event => event.category === 'filler' && event.status === 'active');
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
            <button className="btn btn-outline-danger btn-sm" onClick={() => this.dropClicked(event.id)}>
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
          visible={this.state.confirmingDropEventId != null}
          onCancel={this.dropCanceled}
          onOK={this.dropConfirmed}
        >
          Are you sure you want to drop this filler event?
        </ConfirmModal>
      </div>
    );
  }

  renderCreateFillerEventForm = () => (
    <div>
      <FillerEventForm
        disabled={this.state.requestInProgress}
        error={this.state.error ? this.state.error.message : null}
        initialEvent={{
          form_response_attrs: {
            category: 'filler',
            email: '',
            short_blurb: '',
            description: '',
            title: '',
            registration_policy: { buckets: [] },
          },
          runs: [{ rooms: [] }],
        }}
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
          initialEvent={deserializeEvent(event)}
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
