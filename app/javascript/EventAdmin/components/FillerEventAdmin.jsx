import React from 'react';
import { graphql } from 'react-apollo';
import { Link, Switch, Route } from 'react-router-dom';
import FillerEventForm from '../../BuiltInForms/FillerEventForm';
import EditRunModalContainer from '../containers/EditRunModalContainer';
import GraphQLResultPropType from '../../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../../GraphQLQueryResultWrapper';
import eventsQuery from '../eventsQuery';
import { timespanFromRun } from '../../TimespanUtils';

@graphql(eventsQuery)
@GraphQLQueryResultWrapper
class FillerEventAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(eventsQuery, 'events', 'convention').isRequired,
  };

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
    return (
      <FillerEventForm
        initialEvent={event}
        convention={this.props.data.convention}
        cancelPath="/filler_events"
      />
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
