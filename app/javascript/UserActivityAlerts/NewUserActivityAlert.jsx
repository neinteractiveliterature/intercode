import React from 'react';
import PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import buildUserActivityAlertInput from './buildUserActivityAlertInput';
import ChangeSet from '../ChangeSet';
import { CreateUserActivityAlert } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { UserActivityAlertsAdminQuery } from './queries.gql';
import UserActivityAlertForm from './UserActivityAlertForm';

class NewUserActivityAlert extends React.Component {
  static propTypes = {
    convention: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      userActivityAlert: {
        email: null,
        partial_name: null,
        user: null,
        trigger_on_ticket_create: true,
        trigger_on_user_con_profile_create: true,
        alert_destinations: [],
      },
      alertDestinationChangeSet: new ChangeSet(),
      saveInProgress: false,
      error: null,
    };
  }

  userActivityAlertChanged = (userActivityAlert) => { this.setState({ userActivityAlert }); }

  addAlertDestination = (destination) => {
    this.setState(prevState => ({
      alertDestinationChangeSet: prevState.alertDestinationChangeSet.add(destination),
    }));
  }

  removeAlertDestination = (destination) => {
    this.setState(prevState => ({
      alertDestinationChangeSet: prevState.alertDestinationChangeSet.remove(destination),
    }));
  }

  save = async (client) => {
    this.setState({ saveInProgress: true });
    try {
      await client.mutate({
        mutation: CreateUserActivityAlert,
        variables: {
          userActivityAlert: buildUserActivityAlertInput(this.state.userActivityAlert),
          alertDestinations: this.state.alertDestinationChangeSet.getAddValues()
            .map((addValue) => {
              if (addValue.staff_position) {
                return { staff_position_id: addValue.staff_position.id };
              }
              return { user_con_profile_id: addValue.user_con_profile.id };
            }),
        },
        update: (
          cache,
          { data: { createUserActivityAlert: { user_activity_alert: userActivityAlert } } },
        ) => {
          const data = cache.readQuery({ query: UserActivityAlertsAdminQuery });
          cache.writeQuery({
            query: UserActivityAlertsAdminQuery,
            data: {
              ...data,
              convention: {
                ...data.convention,
                user_activity_alerts: [
                  ...data.convention.user_activity_alerts,
                  userActivityAlert,
                ],
              },
            },
          });
        },
      });

      this.props.history.push('/user_activity_alerts');
    } catch (error) {
      this.setState({ error, saveInProgress: false });
    }
  }

  render = () => (
    <React.Fragment>
      <h1>Create user activity alert</h1>

      <UserActivityAlertForm
        userActivityAlert={{
          ...this.state.userActivityAlert,
          alert_destinations: this.state.alertDestinationChangeSet
            .apply(this.state.userActivityAlert.alert_destinations),
        }}
        convention={this.props.convention}
        onChange={this.userActivityAlertChanged}
        onAddAlertDestination={this.addAlertDestination}
        onRemoveAlertDestination={this.removeAlertDestination}
        disabled={this.state.saveInProgress}
      />

      <ErrorDisplay graphQLError={this.state.error} />

      <ApolloConsumer>
        {client => (
          <button
            className="btn btn-primary mt-4"
            type="button"
            onClick={() => this.save(client)}
            disabled={this.state.saveInProgress}
          >
            Create user activity alert
          </button>
        )}
      </ApolloConsumer>
    </React.Fragment>
  )
}

export default withRouter(NewUserActivityAlert);
