import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import buildTicketTypeInput from './buildTicketTypeInput';
import ErrorDisplay from '../ErrorDisplay';
import TicketTypeForm from './TicketTypeForm';
import { fragments, ticketTypesQuery } from './queries';

const createTicketTypeMutation = gql`
mutation($input: CreateTicketTypeInput!) {
  createTicketType(input: $input) {
    ticket_type {
      ...TicketTypeAdmin_TicketTypeFields
    }
  }
}

${fragments.ticketType}
`;

@graphql(
  createTicketTypeMutation,
  {
    props: ({ mutate }) => ({
      createTicketType: ticketType => mutate({
        variables: {
          input: {
            ticket_type: buildTicketTypeInput(ticketType),
          },
        },
        update: (
          proxy,
          { data: { createTicketType: { ticket_type: newTicketType } } },
        ) => {
          const data = proxy.readQuery({ query: ticketTypesQuery });
          data.convention.ticket_types.push(newTicketType);
          proxy.writeQuery({ query: ticketTypesQuery, data });
        },
      }),
    }),
  },
)
@withRouter
class NewTicketType extends React.Component {
  static propTypes = {
    createTicketType: PropTypes.func.isRequired,
    ticketName: PropTypes.string.isRequired,
    timezoneName: PropTypes.string.isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      ticketType: {
        name: '',
        description: '',
        publicly_available: false,
        maximum_event_provided_tickets: 0,
        counts_towards_convention_maximum: true,
        pricing_schedule: {
          timespans: [],
        },
      },
    };
  }

  ticketTypeChanged = (ticketType) => {
    this.setState({ ticketType });
  }

  saveClicked = async () => {
    try {
      await this.props.createTicketType(this.state.ticketType);
      this.props.history.replace('/');
    } catch (error) {
      this.setState({ error });
    }
  }

  render = () => (
    <div>
      <h1 className="mb-4">New {this.props.ticketName} type</h1>
      <TicketTypeForm
        ticketType={this.state.ticketType}
        ticketName={this.props.ticketName}
        timezone={this.props.timezoneName}
        onChange={this.ticketTypeChanged}
      />
      <button className="btn btn-primary" onClick={this.saveClicked}>Save</button>
      <ErrorDisplay graphQLError={this.state.error} />
    </div>
  );
}

export default NewTicketType;
