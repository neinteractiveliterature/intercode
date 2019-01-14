import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { flowRight } from 'lodash';
import { ConfirmModal } from 'react-bootstrap4-modal';

import ErrorDisplay from '../ErrorDisplay';
import { EventAdminEventsQuery } from './queries.gql';
import GraphQLResultPropType from '../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import { RestoreDroppedEvent } from './mutations.gql';

@flowRight([
  graphql(EventAdminEventsQuery),
  graphql(RestoreDroppedEvent, { name: 'restoreDroppedEvent' }),
])
@GraphQLQueryResultWrapper
class DroppedEventAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(EventAdminEventsQuery).isRequired,
    restoreDroppedEvent: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      confirmingRestoreEventId: null,
    };
  }

  restoreDroppedEvent = async () => {
    try {
      await this.props.restoreDroppedEvent({
        variables: { input: { id: this.state.confirmingRestoreEventId } },
      });

      this.setState({ confirmingRestoreEventId: null });
    } catch (error) {
      this.setState({ error });
    }
  }

  startRestoringDroppedEvent = (eventId) => {
    this.setState({ confirmingRestoreEventId: eventId });
  }

  cancelRestoringDroppedEvent = () => {
    this.setState({ confirmingRestoreEventId: null });
  }

  render = () => {
    const { data } = this.props;

    const droppedEvents = data.events.filter((event) => {
      const eventCategory = data.convention.event_categories
        .find(c => c.id === event.event_category.id);
      return event.status === 'dropped' && eventCategory.scheduling_ui !== 'single_run';
    });
    droppedEvents.sort((a, b) => a.title.localeCompare(b.title, { sensitivity: 'base' }));

    if (droppedEvents.length === 0) {
      return (
        <p className="mt-2">
          There are no dropped events to display.  (Single-run events that are
          dropped cannot be restored.)
        </p>
      );
    }

    const rows = droppedEvents.map(droppedEvent => (
      <tr key={droppedEvent.id}>
        <td>{droppedEvent.title}</td>
        <td className="text-right">
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => this.startRestoringDroppedEvent(droppedEvent.id)}
          >
            Restore
          </button>
        </td>
      </tr>
    ));

    return (
      <div className="mt-2">
        <ErrorDisplay graphQLError={this.state.error} />
        <table className="table table-striped">
          <tbody>
            {rows}
          </tbody>
        </table>
        <ConfirmModal
          visible={this.state.confirmingRestoreEventId != null}
          onOK={this.restoreDroppedEvent}
          onCancel={this.cancelRestoringDroppedEvent}
        >
          Are you sure you want to restore this event?  (Scheduled runs and
          previous signups will not be restored.)
        </ConfirmModal>
      </div>
    );
  }
}

export default DroppedEventAdmin;
