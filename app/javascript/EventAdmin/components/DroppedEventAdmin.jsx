import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { flowRight } from 'lodash';
import { ConfirmModal } from 'react-bootstrap4-modal';
import ErrorDisplay from '../../ErrorDisplay';
import eventsQuery from '../eventsQuery';
import GraphQLResultPropType from '../../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../../GraphQLQueryResultWrapper';
import { restoreDroppedEventMutation } from '../mutations';

@flowRight([
  graphql(eventsQuery),
  graphql(restoreDroppedEventMutation, { name: 'restoreDroppedEvent' }),
])
@GraphQLQueryResultWrapper
class DroppedEventAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(eventsQuery).isRequired,
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

    const droppedEvents = data.events.filter(event => event.status === 'dropped' && event.category !== 'filler');
    droppedEvents.sort((a, b) => a.title.localeCompare(b.title, { sensitivity: 'base' }));

    if (droppedEvents.length === 0) {
      return (
        <p className="mt-2">
          There are no dropped events to display.  (Filler events that are
          dropped cannot be restored.)
        </p>
      );
    }

    const rows = droppedEvents.map(droppedEvent => (
      <tr key={droppedEvent.id}>
        <td>{droppedEvent.title}</td>
        <td className="text-right">
          <button
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
