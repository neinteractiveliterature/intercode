import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { humanize } from 'inflected';
import moment from 'moment-timezone';

import Confirm from '../ModalDialogs/Confirm';
import ErrorDisplay from '../ErrorDisplay';
import formatMoney from '../formatMoney';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import { userConProfileAdminQuery } from './queries';

const noTicketAbilityQuery = gql`
query {
  myProfile {
    id
    ability {
      can_create_tickets
    }
  }
}
`;

const ticketAbilityQuery = gql`
query($ticketId: Int!) {
  currentAbility {
    can_create_tickets
    can_update_ticket(ticket_id: $ticketId)
    can_delete_ticket(ticket_id: $ticketId)
  }
}
`;

const deleteTicketMutation = gql`
mutation($ticketId: Int!, $refund: Boolean!) {
  deleteTicket(input: { id: $ticketId, refund: $refund }) {
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
        charge_id: PropTypes.string,
      }),
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  renderTicketControls = (ticketAbilityData) => {
    const buttons = [];
    const { currentAbility } = ticketAbilityData;

    if (this.props.userConProfile.ticket && currentAbility.can_update_ticket) {
      buttons.push(
        <a href={`/user_con_profiles/${this.props.userConProfile.id}/admin_ticket/edit`} className="btn btn-secondary">
          Edit
          {' '}
          {this.props.convention.ticket_name}
        </a>,
      );

      if (currentAbility.can_delete_ticket) {
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
                  <React.Fragment>
                    {
                      this.props.userConProfile.ticket.charge_id
                        ? (
                          <button
                            className="btn btn-warning mr-2"
                            type="button"
                            onClick={() => confirm({
                              action: () => deleteTicket({ variables: { ticketId: this.props.userConProfile.ticket.id, refund: true } }),
                              prompt: (
                                <React.Fragment>
                                  <p>
                                    Are you sure you want to delete
                                    {' '}
                                    {this.props.userConProfile.name}
                                    &apos;s
                                    {' '}
                                    {this.props.convention.ticket_name}
                                    {' '}
                                    and refund their money?
                                  </p>
                                </React.Fragment>
                              ),
                              displayError: (error) => <ErrorDisplay graphQLError={error} />,
                            })}
                          >
                          Delete with refund
                          </button>
                        )
                        : null
                    }
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => confirm({
                        action: () => deleteTicket({ variables: { ticketId: this.props.userConProfile.ticket.id, refund: false } }),
                        prompt: (
                          <React.Fragment>
                            <p>
                              Are you sure you want to delete
                              {' '}
                              {this.props.userConProfile.name}
                              &apos;s
                              {' '}
                              {this.props.convention.ticket_name}
                              {' '}
                              without a refund?
                            </p>
                          </React.Fragment>
                        ),
                        displayError: (error) => <ErrorDisplay graphQLError={error} />,
                      })}
                    >
                      Delete without refund
                    </button>
                  </React.Fragment>
                )}
              </Mutation>
            )}
          </Confirm.Trigger>,
        );
      }
    } else if (currentAbility.can_create_tickets) {
      buttons.push(
        <a href={`/user_con_profiles/${this.props.userConProfile.id}/admin_ticket/new`} className="btn btn-secondary">
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
