import React from 'react';
import PropTypes from 'prop-types';
import { titleize } from 'inflected';
import classNames from 'classnames';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { flatMap } from 'lodash';

import ChangeSet from '../ChangeSet';
import ErrorDisplay from '../ErrorDisplay';
import PermissionNames from '../../../config/permission_names.json';
import { sortByLocaleString } from '../ValueUtils';
import { UpdateStaffPositionPermissions } from './mutations.gql';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';

function modelEquals(a, b) {
  return (
    a.__typename === b.__typename
    && a.id === b.id
  );
}

function permissionEquals(a, b) {
  return modelEquals(a.model, b.model) && a.permission === b.permission;
}

function findPermission(currentPermissions, model, permission) {
  return currentPermissions.find(currentPermission => (
    permissionEquals(currentPermission, { model, permission })
  ));
}

function buildPermissionInput(permission) {
  return {
    model_type: permission.model.__typename,
    model_id: permission.model.id,
    permission: permission.permission,
  };
}

const EventCategoryPermissionNames = flatMap(
  PermissionNames.filter(
    permissionNameGroup => permissionNameGroup.model_type === 'EventCategory',
  ),
  permissionNameGroup => permissionNameGroup.permissions,
);

class EditStaffPositionPermissions extends React.Component {
  static propTypes = {
    staffPosition: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      permissions: PropTypes.arrayOf(PropTypes.shape({
        model: PropTypes.shape({
          __typename: PropTypes.string.isRequired,
          id: PropTypes.number.isRequired,
        }).isRequired,
        permission: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    eventCategories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      changeSet: new ChangeSet(),
    };
  }

  setPermission = (model, permission, newHasPermission) => {
    if (newHasPermission) {
      this.grantPermission(model, permission);
    } else {
      this.revokePermission(model, permission);
    }
  }

  grantPermission = (model, permission) => {
    this.setState(prevState => ({
      changeSet: prevState.changeSet.add(
        { model, permission },
        this.props.staffPosition.permissions,
        permissionEquals,
      ),
    }));
  }

  revokePermission = (model, permission) => {
    this.setState((prevState) => {
      const currentPermissions = prevState.changeSet.apply(this.props.staffPosition.permissions);
      const permissionId = findPermission(currentPermissions, model, permission).id;

      return {
        changeSet: prevState.changeSet.remove(permissionId),
      };
    });
  }

  render = () => {
    const currentPermissions = this.state.changeSet.apply(this.props.staffPosition.permissions);

    return (
      <>
        <h1 className="mb-4">
          {this.props.staffPosition.name}
          {' Permissions'}
        </h1>

        <table className="table table-striped table-responsive" role="grid">
          <thead>
            <tr>
              <th>Event Category</th>
              {
                EventCategoryPermissionNames.map(({ permission, name }) => (
                  <th key={permission} className="text-center">{titleize(name)}</th>
                ))
              }
            </tr>
          </thead>

          <tbody>
            {sortByLocaleString(
              this.props.eventCategories,
              category => category.name,
            ).map(eventCategory => (
              <tr key={eventCategory.id}>
                <th scope="row">
                  <span
                    className="p-1 rounded"
                    style={getEventCategoryStyles({ eventCategory, variant: 'default' })}
                  >
                    {eventCategory.name}
                  </span>
                </th>
                {EventCategoryPermissionNames.map(({ permission }) => {
                  const existingPermission = findPermission(
                    this.props.staffPosition.permissions, eventCategory, permission,
                  );
                  const hasPermission = (
                    findPermission(currentPermissions, eventCategory, permission) != null
                  );

                  return (
                    <td
                      key={permission}
                      role="gridcell"
                      tabIndex={0}
                      className={classNames('cursor-pointer text-center align-middle', {
                        'table-success': this.state.changeSet.changes.some(({ changeType, value }) => (
                          changeType === 'add'
                          && permissionEquals(value, { model: eventCategory, permission })
                        )),
                        'table-danger': (
                          existingPermission
                          && this.state.changeSet.changes.some(({ changeType, id }) => (
                            changeType === 'remove'
                            && existingPermission.id === id
                          ))
                        ),
                      })}
                      onClick={() => {
                        this.setPermission(eventCategory, permission, !hasPermission);
                      }}
                      onKeyDown={(event) => {
                        if (event.keyCode === 32 || event.keyCode === 13) {
                          this.setPermission(eventCategory, permission, !hasPermission);
                        }
                      }}
                    >
                      {
                        hasPermission
                          ? (
                            <i className="fa fa-check">
                              <span className="sr-only">✓</span>
                            </i>
                          )
                          : null
                      }
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <ErrorDisplay graphQLError={this.state.error} />

        <Mutation mutation={UpdateStaffPositionPermissions}>
          {mutate => (
            <button
              className="mt-4 btn btn-primary"
              type="button"
              onClick={async () => {
                this.setState({ mutationInProgress: true });
                try {
                  await mutate({
                    variables: {
                      staffPositionId: this.props.staffPosition.id,
                      grantPermissions: this.state.changeSet.getAddValues()
                        .map(buildPermissionInput),
                      revokePermissions: this.state.changeSet.getRemoveIds().map((removeId) => {
                        const existingPermission = this.props.staffPosition.permissions
                          .find(p => p.id === removeId);

                        return buildPermissionInput(existingPermission);
                      }),
                    },
                  });

                  this.props.history.push('/');
                } catch (error) {
                  this.setState({ mutationInProgress: false, error });
                }
              }}
              disabled={this.state.mutationInProgress}
            >
              Save changes
            </button>
          )}
        </Mutation>
      </>
    );
  }
}

export default withRouter(EditStaffPositionPermissions);
