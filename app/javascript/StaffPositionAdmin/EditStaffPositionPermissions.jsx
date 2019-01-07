import React from 'react';
import PropTypes from 'prop-types';
import { titleize } from 'inflected';

import ChangeSet from '../ChangeSet';
import PermissionNames from '../../../config/permission_names.json';
import { sortByLocaleString } from '../ValueUtils';

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

class EditStaffPositionPermissions extends React.Component {
  static propTypes = {
    staffPosition: PropTypes.shape({
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

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Event Category</th>
              {
                PermissionNames.EventCategory.map(({ permission, name }) => (
                  <th key={permission}>{titleize(name)}</th>
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
                <th scope="row">{eventCategory.name}</th>
                {PermissionNames.EventCategory.map(({ permission }) => (
                  <td key={permission}>
                    <input
                      type="checkbox"
                      checked={findPermission(currentPermissions, eventCategory, permission) != null}
                      onChange={(event) => {
                        this.setPermission(eventCategory, permission, event.target.checked);
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
}

export default EditStaffPositionPermissions;
