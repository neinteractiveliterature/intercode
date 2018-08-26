import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { humanize } from 'inflected';
import moment from 'moment-timezone';

import Confirm from '../ModalDialogs/Confirm';
import formatMoney from '../formatMoney';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import { userConProfileAdminQuery } from './queries';

const noTicketAbilityQuery = gql`
query {
  myProfile {
    ability {
      can_create_tickets
    }
  }
}
`;

const ticketAbilityQuery = gql`
query($ticketId: Int!) {
  myProfile {
    ability {
      can_create_tickets
      can_update_ticket(ticket_id: $ticketId)
      can_delete_ticket(ticket_id: $ticketId)
    }
  }
}
`;

const deleteTicketMutation = gql`
mutation($ticketId: Int!) {
  deleteTicket(input: { id: $ticketId }) {
    ticket {
      id
    }
  }
}
`;

class TicketAdminSection extends React.Component {
  static propTypes = {
    convention: PropTypes.shape({
      ticket_name: PropTypes.string.isRequired,
      timezone_name: PropTypes.string.isRequired,
    }).isRequired,
    userConProfile: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      ticket: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }),
    }).isRequired,
    editTicketUrl: PropTypes.string.isRequired,
    newTicketUrl: PropTypes.string.isRequired,
  }

  renderTicketControls = (ticketAbilityData) => {
    const buttons = [];
    const { ability } = ticketAbilityData.myProfile;

    if (this.props.userConProfile.ticket && ability.can_update_ticket) {
      buttons.push(
        <a href={this.props.editTicketUrl} className="btn btn-secondary">
          Edit
          {' '}
          {this.props.convention.ticket_name}
        </a>,
      );

      if (ability.can_delete_ticket) {
        buttons.push(
          <Confirm.Trigger>
            {confirm => (
              <Mutation
                mutation={deleteTicketMutation}
                update={(cache) => {
                  const variables = { id: this.props.userConProfile.id };
                  const query = cache.readQuery({ query: userConProfileAdminQuery, variables });
                  const { ticket, ...remainingProps } = query.userConProfile;
                  cache.writeQuery({
                    query: userConProfileAdminQuery,
                    variables,
                    data: {
                      ...query,
                      userConProfile: {
                        ticket: null,
                        ...remainingProps,
                      },
                    },
                  });
                }}
              >
                {deleteTicket => (
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => confirm({
                      action: () => deleteTicket({ variables: { ticketId: this.props.userConProfile.ticket.id } }),
                      prompt: `Are you sure you want to delete ${this.props.userConProfile.name}'s ${this.props.convention.ticket_name}?`,
                    })}
                  >
                    Delete
                  </button>
                )}
              </Mutation>
            )}
          </Confirm.Trigger>,
        );
      }
    } else if (ability.can_create_tickets) {
      buttons.push(
        <a href={this.props.newTicketUrl} className="btn btn-secondary">
          Create
          {' '}
          {this.props.convention.ticket_name}
        </a>,
      );
    }

    if (buttons.length > 0) {
      return (
        <ul className="list-inline">
          {buttons.map((button, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={i} className="list-inline-item">{button}</li>
          ))}
        </ul>
      );
    }

    return null;
  }

  renderTicketData = (ticket) => {
    if (!ticket) {
      return (
        <p>
          No
          {' '}
          {this.props.convention.ticket_name}
        </p>
      );
    }

    return (
      <dl className="row">
        <dt className="col-md-3">Type</dt>
        <dd className="col-md-9">{ticket.ticket_type.description}</dd>

        {
          ticket.provided_by_event
            ? (
              <React.Fragment>
                <dt className="col-md-3">Provided by event</dt>
                <dd className="col-md-9">{ticket.provided_by_event.title}</dd>
              </React.Fragment>
            )
            : null
        }

        <dt className="col-md-3">Paid</dt>
        <dd className="col-md-9">{formatMoney(ticket.payment_amount) || '0'}</dd>

        <dt className="col-md-3">Transaction ID</dt>
        <dd className="col-md-9">{ticket.charge_id}</dd>

        <dt className="col-md-3">Payment note</dt>
        <dd className="col-md-9">{ticket.payment_note}</dd>

        <dt className="col-md-3">Created</dt>
        <dd className="col-md-9">
          {moment.tz(ticket.created_at, this.props.convention.timezone_name).format('MMMM D, YYYY h:mma z')}
        </dd>

        <dt className="col-md-3">Last updated</dt>
        <dd className="col-md-9">
          {moment.tz(ticket.updated_at, this.props.convention.timezone_name).format('MMMM D, YYYY h:mma z')}
        </dd>
      </dl>
    );
  }

  render = () => (
    <section className="card">
      <div className="card-header">{humanize(this.props.convention.ticket_name)}</div>
      <div className="card-body pb-0">
        {this.renderTicketData(this.props.userConProfile.ticket)}
        <QueryWithStateDisplay
          query={this.props.userConProfile.ticket ? ticketAbilityQuery : noTicketAbilityQuery}
          variables={{ ticketId: (this.props.userConProfile.ticket || {}).id }}
        >
          {({ data: ticketAbilityData }) => this.renderTicketControls(ticketAbilityData)}
        </QueryWithStateDisplay>
      </div>
    </section>
  )
}

export default TicketAdminSection;
