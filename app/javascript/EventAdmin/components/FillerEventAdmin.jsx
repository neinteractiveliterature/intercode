import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Link, Switch, Route, withRouter } from 'react-router-dom';
import FillerEventForm from '../../BuiltInForms/FillerEventForm';
import EditRunModalContainer from '../containers/EditRunModalContainer';
import GraphQLResultPropType from '../../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../../GraphQLQueryResultWrapper';
import eventsQuery from '../eventsQuery';
import { timespanFromRun } from '../../TimespanUtils';
import {
  createRunMutation,
  updateRunMutation,
  createEventMutation,
  updateEventMutation,
} from '../mutations';

@withRouter
@compose(
  graphql(eventsQuery),
  graphql(createRunMutation, { name: 'createRun' }),
  graphql(updateRunMutation, { name: 'updateRun' }),
  graphql(createEventMutation, { name: 'createEvent' }),
  graphql(updateEventMutation, { name: 'updateEvent' }),
)
@GraphQLQueryResultWrapper
class FillerEventAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(eventsQuery, 'events', 'convention').isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    createRun: PropTypes.func.isRequired,
    updateRun: PropTypes.func.isRequired,
    createEvent: PropTypes.func.isRequired,
    updateEvent: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  updateFillerEvent = ({ event, run }) => {
    const eventInput = {
      id: event.id,
      event: {
        title: event.title,
        description: event.description,
        short_blurb: event.short_blurb,
        email: event.email,
        length_seconds: event.length_seconds,
        category: event.category,
      },
    };

    const runInput = {
      id: run.id,
      run: {
        starts_at: run.starts_at,
        schedule_note: run.schedule_note,
        title_suffix: run.title_suffix,
        room_ids: run.rooms.map(room => room.id),
      },
    };

    this.props.updateEvent({ variables: { input: eventInput } }).then(
      () => this.props.updateRun({ variables: { input: runInput } }),
    ).then(() => {
      this.props.history.push('/filler_events');
    }).catch((error) => {
      this.setState({ error });
    });
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
        <EditRunModalContainer convention={data.convention} />
      </div>
    );
  }

  renderCreateFillerEventForm = () => (
    <div>blah</div>
  )

  renderEditFillerEventForm = ({ match }) => {
    const event = this.props.data.events.find(e => e.id.toString() === match.params.id);

    let errorDisplay = null;
    if (this.state.error) {
      errorDisplay = <div className="alert alert-danger">{this.state.error.message}</div>;
    }

    return (
      <div>
        <FillerEventForm
          initialEvent={event}
          convention={this.props.data.convention}
          cancelPath="/filler_events"
          onSave={this.updateFillerEvent}
        />
        {errorDisplay}
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
