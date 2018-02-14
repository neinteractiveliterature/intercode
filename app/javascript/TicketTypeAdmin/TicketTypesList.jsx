import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, withRouter } from 'react-router-dom';
import { ConfirmModal } from 'react-bootstrap4-modal';
import { capitalize } from 'inflected';
import ErrorDisplay from '../ErrorDisplay';
import TicketTypePropType from './TicketTypePropType';
import Timespan from '../PCSG/Timespan';
import pluralizeWithCount from '../pluralizeWithCount';
import { ticketTypesQuery } from './queries';

function cardClassForTicketType(ticketType) {
  if (ticketType.publicly_available) {
    return '';
  }

  if (ticketType.maximum_event_provided_tickets > 0) {
    return 'bg-success text-white';
  }

  return 'bg-dark text-white';
}

function describeTicketTypeOptions(ticketType, ticketName) {
  let eventProvidedDescription;
  if (ticketType.maximum_event_provided_tickets > 0) {
    eventProvidedDescription = `events can provide up to ${pluralizeWithCount(ticketName, ticketType.maximum_event_provided_tickets)}`;
  }

  if (ticketType.publicly_available) {
    if (eventProvidedDescription != null) {
      return `Available for purchase by the general public and ${eventProvidedDescription}`;
    }

    return 'Available for purchase by the general public';
  }

  if (eventProvidedDescription != null) {
    return capitalize(eventProvidedDescription);
  }

  return 'Private ticket type (cannot be purchased through the web)';
}

function renderPricingSchedule(ticketType, timezoneName) {
  const timespanItems = ticketType.pricing_schedule.timespans.map((timespan, i) => {
    const dollarValue = (timespan.value.fractional / 100.0).toFixed(2).toString();
    const timespanDescription = Timespan.fromStrings(timespan.start, timespan.finish)
      .humanizeInTimezone(timezoneName, 'MMMM D, YYYY');

    return (
      // eslint-disable-next-line react/no-array-index-key
      <li key={i}>${dollarValue} {timespanDescription}</li>
    );
  });

  return <ul className="mb-0">{timespanItems}</ul>;
}

const deleteTicketTypeMutation = gql`
mutation($input: DeleteTicketTypeInput!) {
  deleteTicketType(input: $input) {
    ticket_type {
      id
    }
  }
}
`;

@withRouter
@graphql(deleteTicketTypeMutation, {
  props: ({ mutate }) => ({
    deleteTicketType: id => mutate({
      variables: { input: { id } },
      update: (proxy) => {
        const data = proxy.readQuery({ query: ticketTypesQuery });
        data.convention.ticket_types = data.convention.ticket_types.filter((
          ticketType => ticketType.id !== id
        ));
        proxy.writeQuery({ query: ticketTypesQuery, data });
      },
    }),
  }),
})
class TicketTypesList extends React.Component {
  static propTypes = {
    ticketTypes: PropTypes.arrayOf(TicketTypePropType).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    ticketName: PropTypes.string.isRequired,
    timezoneName: PropTypes.string.isRequired,
    deleteId: PropTypes.number,
    deleteTicketType: PropTypes.func.isRequired,
  };

  static defaultProps = {
    deleteId: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  deleteConfirmed = async () => {
    try {
      await this.props.deleteTicketType(this.props.deleteId);
      this.props.history.replace('/');
    } catch (error) {
      this.setState({ error });
    }
  }

  deleteCanceled = () => {
    this.props.history.replace('/');
  }

  renderTicketTypeDisplay = ticketType => (
    <div className={`card my-4 ${cardClassForTicketType(ticketType)}`} key={ticketType.id}>
      <div className="card-header">
        <div className="row">
          <div className="col-md-8">
            <strong>{ticketType.description}</strong>
            <tt> ({ticketType.name})</tt>
          </div>
          <div className="col-md-4 text-right">
            <Link to={`/${ticketType.id}/delete`} className="btn btn-danger btn-sm mx-1">
              <i className="fa fa-trash-o mr-1" />
              Delete
            </Link>
            <Link to={`/${ticketType.id}/edit`} className="btn btn-secondary btn-sm mx-1">
              <i className="fa fa-pencil-square-o mr-1" />
              Edit
            </Link>
          </div>
        </div>

        <p className="mb-0">
          <small>
            <em>
              {describeTicketTypeOptions(ticketType, this.props.ticketName)}
              {
                ticketType.counts_towards_convention_maximum ?
                null :
                [<br key="line-break" />, 'Does not count towards convention maximum']
              }
            </em>
          </small>
        </p>
      </div>

      <div className="card-body">
        {renderPricingSchedule(ticketType, this.props.timezoneName)}
      </div>
    </div>
  )

  renderDeleteConfirmation = () => {
    let ticketTypeDescription = null;
    if (this.props.deleteId != null) {
      const deleteTicketType = this.props.ticketTypes.find((
        tt => tt.id === this.props.deleteId
      ));
      if (deleteTicketType != null) {
        ticketTypeDescription = deleteTicketType.description;
      }
    }

    return (
      <ConfirmModal
        visible={this.props.deleteId != null}
        onOK={this.deleteConfirmed}
        onCancel={this.deleteCanceled}
      >
        Are you sure you want to delete the ticket type &quot;{ticketTypeDescription}&quot;?

        <ErrorDisplay graphQLError={this.state.error} />
      </ConfirmModal>
    );
  }

  render = () => {
    const sortedTicketTypes = [...this.props.ticketTypes].sort((
      (a, b) => {
        if (a.publicly_available !== b.publicly_available) {
          if (a.publicly_available) {
            return -1;
          }

          return 1;
        }

        if ((a.maximum_event_provided_tickets > 0) !== (b.maximum_event_provided_tickets > 0)) {
          if (a.maximum_event_provided_tickets > 0) {
            return -1;
          }

          return 1;
        }

        return a.name.localeCompare(b.name, { sensitivity: 'base' });
      }
    ));
    const ticketTypeDisplays = sortedTicketTypes.map(this.renderTicketTypeDisplay);

    return (
      <div>
        <h1 className="mb-4">{capitalize(this.props.ticketName)} types</h1>

        {ticketTypeDisplays}

        <Link to="/new" className="btn btn-primary">New {this.props.ticketName} type</Link>

        {this.renderDeleteConfirmation()}
      </div>
    );
  }
}

export default TicketTypesList;
