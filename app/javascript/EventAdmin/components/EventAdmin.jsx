import React from 'react';
import { graphql } from 'react-apollo';
import EditRunModalContainer from '../containers/EditRunModalContainer';
import EventAdminRowContainer from '../containers/EventAdminRowContainer';
import GraphQLResultPropType from '../../GraphQLResultPropType';
import LoadingIndicator from '../../LoadingIndicator';
import eventsQuery from '../eventsQuery';

@graphql(eventsQuery)
class EventAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(eventsQuery, 'events', 'convention').isRequired,
  };

  render = () => {
    const { data } = this.props;

    if (data.loading) {
      return <LoadingIndicator />;
    }
    if (data.error) {
      return <div className="alert alert-danger">{this.props.data.error.message}</div>;
    }

    const getNormalizedTitle = event => event.title.replace(/^(the|a|) /i, '').replace(/[^A-Za-z0-9]/g, '').toLocaleLowerCase();

    const sortedEvents = [...data.events].sort(
      (a, b) => getNormalizedTitle(a).localeCompare(getNormalizedTitle(b)),
    );

    const eventRows = sortedEvents.map(event => (
      <EventAdminRowContainer
        event={event}
        convention={this.props.data.convention}
        key={event.id}
      />
    ));

    return (
      <div>
        <table className="table table-striped">
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

        <EditRunModalContainer convention={this.props.data.convention} />
      </div>
    );
  }
}

export default EventAdmin;
