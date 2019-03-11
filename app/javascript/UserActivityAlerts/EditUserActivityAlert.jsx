import React from 'react';
import PropTypes from 'prop-types';
import { ApolloConsumer, Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import buildUserActivityAlertInput from './buildUserActivityAlertInput';
import ChangeSet from '../ChangeSet';
import Confirm from '../ModalDialogs/Confirm';
import { DeleteUserActivityAlert, UpdateUserActivityAlert } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { UserActivityAlertsAdminQuery } from './queries.gql';
import UserActivityAlertForm from './UserActivityAlertForm';

@withRouter
class EditUserActivityAlert extends React.Component {
  static propTypes = {
    initialUserActivityAlert: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    convention: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      userActivityAlert: props.initialUserActivityAlert,
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
        mutation: UpdateUserActivityAlert,
        variables: {
          id: this.state.userActivityAlert.id,
          userActivityAlert: buildUserActivityAlertInput(this.state.userActivityAlert),
          addAlertDestinations: this.state.alertDestinationChangeSet.getAddValues()
            .map((addValue) => {
              if (addValue.staff_position) {
                return { staff_position_id: addValue.staff_position.id };
              }
              return { user_con_profile_id: addValue.user_con_profile.id };
            }),
          removeAlertDestinationIds: this.state.alertDestinationChangeSet.getRemoveIds(),
        },
      });

      this.props.history.push('/');
    } catch (error) {
      this.setState({ error, saveInProgress: false });
    }
  }

  render = () => (
    <React.Fragment>
      <div className="d-flex align-items-start">
        <h1 className="flex-grow-1">Edit user activity alert</h1>
        <Mutation mutation={DeleteUserActivityAlert}>
          {mutate => (
            <Confirm.Trigger>
              {confirm => (
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => {
                    confirm({
                      action: async () => {
                        await mutate({
                          variables: { id: this.state.userActivityAlert.id },
                          update: (cache) => {
                            const data = cache.readQuery({ query: UserActivityAlertsAdminQuery });
                            cache.writeQuery({
                              query: UserActivityAlertsAdminQuery,
                              data: {
                                ...data,
                                convention: {
                                  ...data.convention,
                                  user_activity_alerts: data.convention.user_activity_alerts
                                    .filter(userActivityAlert => (
                                      userActivityAlert.id !== this.state.userActivityAlert.id
                                    )),
                                },
                              },
                            });
                          },
                        });

                        this.props.history.push('/');
                      },
                      prompt: 'Are you sure you want to delete this alert?',
                    });
                  }}
                >
                  <i className="fa fa-trash-o" />
                  {' '}
                  Delete
                </button>
              )}
            </Confirm.Trigger>
          )}
        </Mutation>
      </div>

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
            Save changes
          </button>
        )}
      </ApolloConsumer>
    </React.Fragment>
  )
}

export default EditUserActivityAlert;
