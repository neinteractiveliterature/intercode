import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { flowRight } from 'lodash';
import {
  Link,
  Switch,
  Route,
  withRouter,
} from 'react-router-dom';
import { ConfirmModal } from 'react-bootstrap4-modal';

import { EventAdminEventsQuery } from './queries.gql';
import FillerEventForm from '../BuiltInForms/FillerEventForm';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import GraphQLResultPropType from '../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import { timespanFromRun } from '../TimespanUtils';
import {
  CreateFillerEvent,
  CreateRun,
  DropEvent,
  UpdateEvent,
  UpdateRun,
} from './mutations.gql';
import deserializeEvent from './deserializeEvent';

const buildEventInput = (event, defaultFormResponseAttrs = {}) => ({
  event: {
    event_category_id: event.event_category.id,
    form_response_attrs_json: JSON.stringify({
      ...defaultFormResponseAttrs,
      ...event.form_response_attrs,
    }),
  },
});

const buildRunInput = (run) => {
  if (!run.starts_at) {
    return null;
  }

  return {
    run: {
      starts_at: run.starts_at,
      schedule_note: run.schedule_note,
      title_suffix: run.title_suffix,
      room_ids: run.rooms.map(room => room.id),
    },
  };
};

@flowRight([
  graphql(EventAdminEventsQuery),
  graphql(CreateFillerEvent, { name: 'createFillerEvent' }),
  graphql(CreateRun, { name: 'createRun' }),
  graphql(DropEvent, { name: 'dropEvent' }),
  graphql(UpdateEvent, { name: 'updateEvent' }),
  graphql(UpdateRun, { name: 'updateRun' }),
])
@GraphQLQueryResultWrapper
class FillerEventAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(EventAdminEventsQuery).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    createFillerEvent: PropTypes.func.isRequired,
    createRun: PropTypes.func.isRequired,
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
    const input = {
      ...buildEventInput(
        event,
        {
          can_play_concurrently: false,
          con_mail_destination: 'event_email',
          author: '{{ convention.name }} Staff',
        },
      ),
      ...buildRunInput(run),
    };

    this.setState(
      { requestInProgress: true },
      () => {
        this.props.createFillerEvent({
          variables: { input },
          update: (store, { data: { createFillerEvent: { event: newEvent } } }) => {
            const eventsData = store.readQuery({ query: EventAdminEventsQuery });
            eventsData.events.push(newEvent);
            store.writeQuery({ query: EventAdminEventsQuery, data: eventsData });
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

  updateFillerEvent = async ({ event, run }) => {
    const eventInput = {
      ...buildEventInput(event),
      id: event.id,
    };

    this.setState({ requestInProgress: true });
    try {
      await this.props.updateEvent({ variables: { input: eventInput } });
      if (run.id) {
        await this.props.updateRun({
          variables: {
            input: {
              ...buildRunInput(run),
              id: run.id,
            },
          },
        });
      } else if (run) {
        await this.props.createRun({
          variables: {
            input: {
              ...buildRunInput(run),
              event_id: event.id,
            },
          },
          update: (store, { data: { createRun: { run: newRun } } }) => {
            const eventsData = store.readQuery({ query: EventAdminEventsQuery });
            store.writeQuery({
              query: EventAdminEventsQuery,
              data: {
                ...eventsData,
                events: eventsData.events.map((existingEvent) => {
                  if (existingEvent.id === event.id) {
                    return {
                      ...existingEvent,
                      runs: [
                        ...existingEvent.runs,
                        newRun,
                      ],
                    };
                  }

                  return existingEvent;
                }),
              },
            });
          },
        });
      }
      this.props.history.push('/filler_events');
      this.setState({ requestInProgress: false });
    } catch (error) {
      this.setState({ error, requestInProgress: false });
    }
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

    const fillerEvents = data.events.filter((event) => {
      const eventCategory = data.convention.event_categories
        .find(c => c.id === event.event_category.id);
      return eventCategory.scheduling_ui === 'single_run' && event.status === 'active';
    });
    fillerEvents.sort((a, b) => {
      if (!a.runs[0]) {
        return -1;
      }

      if (!b.runs[0]) {
        return 1;
      }

      const timespanA = timespanFromRun(this.props.data.convention, a, a.runs[0]);
      const timespanB = timespanFromRun(this.props.data.convention, b, b.runs[0]);

      return timespanA.start.diff(timespanB.start);
    });
    const eventRows = fillerEvents.map((event) => {
      const run = event.runs[0];
      let timespan;
      if (run) {
        timespan = timespanFromRun(this.props.data.convention, event, run);
      }

      const eventCategory = data.convention.event_categories
        .find(c => c.id === event.event_category.id);

      return (
        <tr className={event.id}>
          <th scope="row">
            <span
              className="rounded p-1 text-dark"
              style={getEventCategoryStyles({ eventCategory, variant: 'default' })}
            >
              {event.title}
            </span>
          </th>
          <td>
            {timespan && timespan.humanizeInTimezone(this.props.data.convention.timezone_name)}
          </td>
          <td>
            <Link className="btn btn-secondary btn-sm" to={`/filler_events/${event.id}/edit`}>
              Edit
            </Link>
            {' '}
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => this.dropClicked(event.id)}>
              <i className="fa fa-trash-o" />
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <Link className="btn btn-primary my-4" to="/filler_events/new">
          Create new single-run event
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
          Are you sure you want to drop this event?
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
          event_category: { id: null },
          form_response_attrs: {
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

export default withRouter(FillerEventAdmin);
