import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { CreateStaffPosition } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import StaffPositionForm from './StaffPositionForm';
import { StaffPositionsQuery } from './queries.gql';

@graphql(
  CreateStaffPosition,
  {
    props: ({ mutate }) => ({
      createStaffPosition: staffPosition => mutate({
        variables: {
          input: {
            staff_position: {
              name: staffPosition.name,
              email: staffPosition.email,
              visible: staffPosition.visible,
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
          const data = proxy.readQuery({ query: StaffPositionsQuery });
          data.convention.staff_positions.push(newStaffPosition);
          proxy.writeQuery({ query: StaffPositionsQuery, data });
        },
      }),
    }),
  },
)
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
      const {
        data: { createStaffPosition: { staff_position: { id } } },
      } = await this.props.createStaffPosition(this.state.staffPosition);
      this.props.history.replace(`/${id}/edit_permissions`);
    } catch (error) {
      this.setState({ error });
    }
  }

  render = () => (
    <div>
      <h1 className="mb-4">New staff position</h1>
      <StaffPositionForm
        staffPosition={this.state.staffPosition}
        onChange={this.staffPositionChanged}
      />
      <button type="button" className="btn btn-primary" onClick={this.saveClicked}>Save</button>
      <ErrorDisplay graphQLError={this.state.error} />
    </div>
  );
}

export default withRouter(NewStaffPosition);
