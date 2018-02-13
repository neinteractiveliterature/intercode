import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import ErrorDisplay from '../ErrorDisplay';
import StaffPositionForm from './StaffPositionForm';
import StaffPositionPropType from './StaffPositionPropType';
import { fragments } from './queries';

const updateStaffPositionMutation = gql`
mutation($input: UpdateStaffPositionInput!) {
  updateStaffPosition(input: $input) {
    staff_position {
      ...StaffPositionFields
    }
  }
}

${fragments.staffPosition}
`;

@graphql(updateStaffPositionMutation, { name: 'updateStaffPosition' })
@withRouter
class EditStaffPosition extends React.Component {
  static propTypes = {
    initialStaffPosition: StaffPositionPropType.isRequired,
    updateStaffPosition: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      staffPosition: props.initialStaffPosition,
    };
  }

  staffPositionChanged = (staffPosition) => {
    this.setState({ staffPosition });
  }

  saveClicked = async () => {
    try {
      await this.props.updateStaffPosition({
        variables: {
          input: {
            id: this.state.staffPosition.id,
            staff_position: {
              name: this.state.staffPosition.name,
              email: this.state.staffPosition.email,
              user_con_profile_ids: this.state.staffPosition.user_con_profiles.map((
                userConProfile => userConProfile.id
              )),
            },
          },
        },
      });
      this.props.history.push('/');
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
      <button className="btn btn-primary" onClick={this.saveClicked}>Save changes</button>
      <ErrorDisplay graphQLError={this.state.error} />
    </div>
  );
}

export default EditStaffPosition;
