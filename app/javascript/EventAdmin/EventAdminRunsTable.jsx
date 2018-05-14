import React from 'react';
import { graphql } from 'react-apollo';
import { Route } from 'react-router-dom';
import EditRun from './EditRun';
import EventAdminRow from './EventAdminRow';
import GraphQLResultPropType from '../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import eventsQuery from './eventsQuery';

@graphql(eventsQuery)
@GraphQLQueryResultWrapper
class EventAdminRunsTable extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(eventsQuery).isRequired,
  };

  render = () => {
    const { data } = this.props;

    const getNormalizedTitle = event => event.title.replace(/^(the|a|) /i, '').replace(/[^A-Za-z0-9]/g, '').toLocaleLowerCase();

    const sortedEvents = [...data.events].sort((a, b) => getNormalizedTitle(a).localeCompare(getNormalizedTitle(b)));

    const eventRows = sortedEvents.filter(event => (
      event.category !== 'filler' && event.category !== 'volunteer_event' && event.status === 'active'
    )).map(event => (
      <EventAdminRow
        event={event}
        convention={data.convention}
        key={event.id}
      />
    ));

    return (
      <div>
        <table className="table table-striped no-top-border">
          <thead>
            <tr>
              <th style={{ minWidth: '200px' }}>Title</th>
              <th>Duration</th>
              <th>Runs</th>
            </tr>
          </thead>
          <tbody>
            {eventRows}
          </tbody>
        </table>

        <Route path="/:eventId/runs/:runId/edit">
          {props => (
            <EditRun {...props} events={data.events} convention={data.convention} />
          )}
        </Route>
        <Route path="/:eventId/runs/new">
          {props => (
            <EditRun {...props} events={data.events} convention={data.convention} />
          )}
        </Route>
      </div>
    );
  }
}

export default EventAdminRunsTable;
