import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import ErrorDisplay from '../ErrorDisplay';
import StaffPositionForm from './StaffPositionForm';
import StaffPositionPropType from './StaffPositionPropType';
import { UpdateStaffPosition } from './mutations.gql';

@graphql(UpdateStaffPosition, {
  props: ({ mutate }) => ({
    updateStaffPosition: staffPosition => mutate({
      variables: {
        input: {
          id: staffPosition.id,
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
    }),
  }),
})
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
      await this.props.updateStaffPosition(this.state.staffPosition);
      this.props.history.push('/');
    } catch (error) {
      this.setState({ error });
    }
  }

  render = () => (
    <div>
      <h1 className="mb-4">
        Editing
        {' '}
        {this.state.staffPosition.name}
      </h1>
      <StaffPositionForm
        staffPosition={this.state.staffPosition}
        onChange={this.staffPositionChanged}
      />
      <button type="button" className="btn btn-primary" onClick={this.saveClicked}>Save changes</button>
      <ErrorDisplay graphQLError={this.state.error} />
    </div>
  );
}

export default withRouter(EditStaffPosition);
