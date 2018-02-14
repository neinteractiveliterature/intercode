import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import buildTicketTypeInput from './buildTicketTypeInput';
import ErrorDisplay from '../ErrorDisplay';
import TicketTypeForm from './TicketTypeForm';
import TicketTypePropType from './TicketTypePropType';
import { fragments } from './queries';

const updateTicketTypeMutation = gql`
mutation($input: UpdateTicketTypeInput!) {
  updateTicketType(input: $input) {
    ticket_type {
      ...TicketTypeAdmin_TicketTypeFields
    }
  }
}

${fragments.ticketType}
`;

@graphql(updateTicketTypeMutation, {
  props: ({ mutate }) => ({
    updateTicketType: ticketType => mutate({
      variables: {
        input: {
          id: ticketType.id,
          ticket_type: buildTicketTypeInput(ticketType),
        },
      },
    }),
  }),
})
@withRouter
class EditTicketType extends React.Component {
  static propTypes = {
    initialTicketType: TicketTypePropType.isRequired,
    updateTicketType: PropTypes.func.isRequired,
    ticketName: PropTypes.string.isRequired,
    timezoneName: PropTypes.string.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      ticketType: props.initialTicketType,
    };
  }

  ticketTypeChanged = (ticketType) => {
    this.setState({ ticketType });
  }

  saveClicked = async () => {
    try {
      await this.props.updateTicketType(this.state.ticketType);
      this.props.history.push('/');
    } catch (error) {
      this.setState({ error });
    }
  }

  render = () => (
    <div>
      <h1 className="mb-4">
        Editing {this.props.ticketName} type &quot;{this.state.ticketType.name}&quot;
      </h1>
      <TicketTypeForm
        ticketType={this.state.ticketType}
        ticketName={this.props.ticketName}
        timezone={this.props.timezoneName}
        onChange={this.ticketTypeChanged}
      />
      <button className="btn btn-primary" onClick={this.saveClicked}>Save changes</button>
      <ErrorDisplay graphQLError={this.state.error} />
    </div>
  );
}

export default EditTicketType;
