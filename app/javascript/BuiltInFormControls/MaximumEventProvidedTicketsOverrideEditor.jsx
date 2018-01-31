import React from 'react';
import PropTypes from 'prop-types';
import { ConfirmModal } from 'react-bootstrap4-modal';
import ErrorDisplay from '../ErrorDisplay';
import InPlaceEditor from './InPlaceEditor';

const TicketTypePropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  maximum_event_provided_tickets: PropTypes.number.isRequired,
});

class MaximumEventProvidedTicketsOverrideEditor extends React.Component {
  static propTypes = {
    eventId: PropTypes.number.isRequired,
    overrides: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      ticket_type: TicketTypePropType.isRequired,
      override_value: PropTypes.number.isRequired,
    })).isRequired,
    ticketTypes: PropTypes.arrayOf(TicketTypePropType).isRequired,
    createOverride: PropTypes.func.isRequired,
    deleteOverride: PropTypes.func.isRequired,
    updateOverride: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      addingOverride: {
        ticket_type: {
          id: '',
          description: '',
          maximum_event_provided_tickets: '',
        },
        override_value: null,
      },
      deletingOverride: null,
    };
  }

  addingOverrideDataComplete = () => (
    this.state.addingOverride.ticket_type.id &&
    this.state.addingOverride.override_value != null
  )

  addingTicketTypeIdDidChange = (event) => {
    const newTicketTypeId = Number.parseInt(event.target.value, 10);
    const newTicketType = this.props.ticketTypes.find((
      ticketType => ticketType.id === newTicketTypeId
    ));

    if (newTicketType == null) {
      this.setState({
        addingOverride: {
          ...this.state.addingOverride,
          ticket_type: {
            id: '',
            description: '',
            maximum_event_provided_tickets: '',
          },
        },
      });
    } else {
      this.setState({
        addingOverride: {
          ...this.state.addingOverride,
          ticket_type: newTicketType,
        },
      });
    }
  }

  addingOverrideValueDidChange = (event) => {
    const newValue = Number.parseInt(event.target.value, 10);

    this.setState({
      addingOverride: {
        ...this.state.addingOverride,
        override_value: (Number.isNaN(newValue) ? null : newValue),
      },
    });
  }

  addOverride = async () => {
    try {
      await this.props.createOverride({
        eventId: this.props.eventId,
        ticketTypeId: this.state.addingOverride.ticket_type.id,
        overrideValue: this.state.addingOverride.override_value,
      });

      this.setState({
        addingOverride: {
          ticket_type: {
            id: '',
            description: '',
            maximum_event_provided_tickets: '',
          },
          override_value: null,
        },
      });
    } catch (error) {
      this.setState({ error });
    }
  }

  existingOverrideValueDidChange = async (id, overrideValue) => {
    try {
      await this.props.updateOverride({ id, overrideValue: Number.parseInt(overrideValue, 10) });
    } catch (error) {
      this.setState({ error });
    }
  }

  deleteOverrideWasClicked = (deletingOverride) => {
    this.setState({ deletingOverride });
  }

  cancelDeleteOverride = () => {
    this.setState({ deletingOverride: null });
  }

  confirmDeleteOverride = async () => {
    try {
      await this.props.deleteOverride(this.state.deletingOverride.id);
      this.setState({ deletingOverride: null });
    } catch (error) {
      this.setState({ error, deletingOverride: null });
    }
  }

  render = () => {
    const { overrides, ticketTypes } = this.props;

    const sortedOverrides = [...overrides].sort((
      (a, b) => a.ticket_type.description.localeCompare(b.ticket_type.description, { sensitivity: 'base' })
    ));

    const sortedTicketTypes = [...ticketTypes].sort((
      (a, b) => a.description.localeCompare(b.description, { sensitivity: 'base' })
    ));

    const rows = sortedOverrides.map(override => (
      <tr key={override.id}>
        <td>{override.ticket_type.description}</td>
        <td>{override.ticket_type.maximum_event_provided_tickets}</td>
        <td>
          <InPlaceEditor
            value={override.override_value.toString(10)}
            onChange={(newValue) => { this.existingOverrideValueDidChange(override.id, newValue); }}
          />
        </td>
        <td>
          <button
            className="btn btn-sm btn-secondary"
            type="button"
            onClick={() => { this.deleteOverrideWasClicked(override); }}
          >
            <i className="fa fa-trash-o" />
            <span className="sr-only">Delete override for {override.ticket_type.description}</span>
          </button>
        </td>
      </tr>
    ));

    const unoverriddenTicketTypes = sortedTicketTypes.filter(ticketType => (
      overrides.every(override => override.ticket_type.id !== ticketType.id)
    ));
    const ticketTypeOptions = unoverriddenTicketTypes.map(ticketType => (
      <option value={ticketType.id} key={ticketType.id}>{ticketType.description}</option>
    ));

    return (
      <div className="card bg-light">
        <div className="card-header">Override event-provided ticket quotas</div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Ticket type</th>
                <th>Default quota</th>
                <th>Overridden quota</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <select
                    className="form-control"
                    value={this.state.addingOverride.ticket_type.id}
                    onChange={this.addingTicketTypeIdDidChange}
                  >
                    <option />
                    {ticketTypeOptions}
                  </select>
                </td>
                <td>{this.state.addingOverride.ticket_type.maximum_event_provided_tickets}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={
                      this.state.addingOverride.override_value == null ? '' : this.state.addingOverride.override_value
                    }
                    onChange={this.addingOverrideValueDidChange}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    disabled={!this.addingOverrideDataComplete()}
                    onClick={this.addOverride}
                  >
                    Add
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
          <ErrorDisplay graphQLError={this.state.error} />
        </div>

        <ConfirmModal
          visible={this.state.deletingOverride != null}
          onOK={this.confirmDeleteOverride}
          onCancel={this.cancelDeleteOverride}
        >
          {
            (
              this.state.deletingOverride != null ?
              `Are you sure you want to remove the override for "${this.state.deletingOverride.ticket_type.description}" tickets?` :
              ''
            )
          }
        </ConfirmModal>
      </div>
    );
  }
}

export default MaximumEventProvidedTicketsOverrideEditor;
