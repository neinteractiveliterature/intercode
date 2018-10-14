import React from 'react';
import PropTypes from 'prop-types';

import UserActivityAlertForm from './UserActivityAlertForm';

class EditUserActivityAlert extends React.Component {
  static propTypes = {
    initialUserActivityAlert: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    convention: PropTypes.shape({}).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      userActivityAlert: props.initialUserActivityAlert,
    };
  }

  userActivityAlertChanged = (userActivityAlert) => { this.setState({ userActivityAlert }); }

  render = () => (
    <React.Fragment>
      <h1>Edit user activity alert</h1>

      <UserActivityAlertForm
        userActivityAlert={this.state.userActivityAlert}
        convention={this.props.convention}
        onChange={this.userActivityAlertChanged}
      />
    </React.Fragment>
  )
}

export default EditUserActivityAlert;
