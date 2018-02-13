import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import ErrorDisplay from '../ErrorDisplay';
import StaffPositionForm from './StaffPositionForm';
import { fragments, staffPositionsQuery } from './queries';

const createStaffPositionMutation = gql`
mutation($input: CreateStaffPositionInput!) {
  createStaffPosition(input: $input) {
    staff_position {
      ...StaffPositionFields
    }
  }
}

${fragments.staffPosition}
`;

@graphql(
  createStaffPositionMutation,
  {
    props: ({ mutate }) => ({
      createStaffPosition: staffPosition => mutate({
        variables: {
          input: {
            staff_position: {
              name: staffPosition.name,
              email: staffPosition.email,
              user_con_profile_ids: staffPosition.user_con_profiles.map((
                userConProfile => userConProfile.id
              )),
            },
          },
        },
        update: (
          proxy,
          { data: { createStaffPosition: { staff_position: newStaffPosition } } },
        ) => {
          const data = proxy.readQuery({ query: staffPositionsQuery });
          data.convention.staff_positions.push(newStaffPosition);
          proxy.writeQuery({ query: staffPositionsQuery, data });
        },
      }),
    }),
  },
)
@withRouter
class NewStaffPosition extends React.Component {
  static propTypes = {
    createStaffPosition: PropTypes.func.isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      staffPosition: {
        name: '',
        email: '',
        user_con_profiles: [],
      },
    };
  }

  staffPositionChanged = (staffPosition) => {
    this.setState({ staffPosition });
  }

  saveClicked = async () => {
    try {
      await this.props.createStaffPosition(this.state.staffPosition);
      this.props.history.replace('/');
    } catch (error) {
      this.setState({ error });
    }
  }

  render = () => (
    <div>
      <StaffPositionForm
        staffPosition={this.state.staffPosition}
        onChange={this.staffPositionChanged}
      />
      <button className="btn btn-primary" onClick={this.saveClicked}>Save</button>
      <ErrorDisplay graphQLError={this.state.error} />
    </div>
  );
}

export default NewStaffPosition;
