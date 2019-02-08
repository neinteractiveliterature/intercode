import React from 'react';
import { graphql } from 'react-apollo';
import { Route, Link } from 'react-router-dom';

import EditRun from './EditRun';
import EventAdminRow from './EventAdminRow';
import GraphQLResultPropType from '../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import { EventAdminEventsQuery } from './queries.gql';

@graphql(EventAdminEventsQuery)
@GraphQLQueryResultWrapper
class EventAdminRunsTable extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(EventAdminEventsQuery).isRequired,
  };

  render = () => {
    const { data } = this.props;

    const getNormalizedTitle = event => event.title.replace(/^(the|a|) /i, '').replace(/[^A-Za-z0-9]/g, '').toLocaleLowerCase();

    const sortedEvents = [...data.events].sort((a, b) => getNormalizedTitle(a)
      .localeCompare(getNormalizedTitle(b)));

    const eventRows = sortedEvents.filter((event) => {
      const eventCategory = data.convention.event_categories
        .find(c => c.id === event.event_category.id);
      return eventCategory.scheduling_ui === 'regular' && event.status === 'active';
    }).map(event => (
      <EventAdminRow
        event={event}
        convention={data.convention}
        key={event.id}
      />
    ));

    return (
      <div>
        <Link to="/new" className="btn btn-primary mt-4 mb-2">
          New event
        </Link>

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

        <Route
          path="/:eventId/runs/:runId/edit"
          render={props => (
            <EditRun {...props} events={data.events} convention={data.convention} />
          )}
        />
        <Route
          path="/:eventId/runs/new"
          render={props => (
            <EditRun {...props} events={data.events} convention={data.convention} />
          )}
        />
      </div>
    );
  }
}

export default EventAdminRunsTable;
