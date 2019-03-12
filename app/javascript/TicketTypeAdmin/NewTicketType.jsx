import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { AdminTicketTypesQuery } from './queries.gql';
import buildTicketTypeInput from './buildTicketTypeInput';
import { CreateTicketType } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import TicketTypeForm from './TicketTypeForm';

@graphql(
  CreateTicketType,
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
          const data = proxy.readQuery({ query: AdminTicketTypesQuery });
          data.convention.ticket_types.push(newTicketType);
          proxy.writeQuery({ query: AdminTicketTypesQuery, data });
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
      <h1 className="mb-4">
        New
        {' '}
        {this.props.ticketName}
        {' '}
        type
      </h1>
      <TicketTypeForm
        ticketType={this.state.ticketType}
        ticketName={this.props.ticketName}
        timezone={this.props.timezoneName}
        onChange={this.ticketTypeChanged}
      />
      <button type="button" className="btn btn-primary" onClick={this.saveClicked}>Save</button>
      <ErrorDisplay graphQLError={this.state.error} />
    </div>
  );
}

export default NewTicketType;
