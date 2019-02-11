import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';
import { groupBy, flatMap } from 'lodash';

import Confirm from '../ModalDialogs/Confirm';
import { DeleteStaffPosition } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import PermissionNames from '../../../config/permission_names.json';
import StaffPositionPropType from './StaffPositionPropType';
import { StaffPositionsQuery } from './queries.gql';
import PopperDropdown from '../UIComponents/PopperDropdown';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';

function describePermissionAbilities(modelPermissions) {
  const typename = modelPermissions[0].model.__typename;
  const permissionNameGroups = PermissionNames.filter(group => group.model_type === typename);
  const permissionNamesForType = flatMap(permissionNameGroups, group => group.permissions);
  const abilities = permissionNamesForType.reduce((acc, { permission, name }) => {
    if (modelPermissions.some(modelPermission => modelPermission.permission === permission)) {
      return [...acc, name];
    }

    return acc;
  }, []);

  if (abilities.length === permissionNamesForType.length) {
    return 'full admin';
  }

  return abilities.join(', ');
}

function describePermissionModel(model) {
  switch (model.__typename) {
    case 'EventCategory':
      return (
        <span
          className="px-1 rounded"
          style={getEventCategoryStyles({ eventCategory: model, variant: 'default' })}
        >
          {model.name}
        </span>
      );
    default:
      return `${model.__typename} ${model.id}`;
  }
}

function describePermissions(permissions) {
  const permissionsByModel = groupBy(permissions, ({ model }) => [model.__typename, model.id]);
  return Object.entries(permissionsByModel).map(([, modelPermissions]) => {
    const { model } = modelPermissions[0];
    return (
      <>
        {describePermissionModel(model)}
        {': '}
        {describePermissionAbilities(modelPermissions)}
      </>
    );
  });
}

@withRouter
@graphql(DeleteStaffPosition, {
  props: ({ mutate }) => ({
    deleteStaffPosition: id => mutate({
      variables: { input: { id } },
      update: (proxy) => {
        const data = proxy.readQuery({ query: StaffPositionsQuery });
        data.convention.staff_positions = data.convention.staff_positions.filter((
          staffPosition => staffPosition.id !== id
        ));
        proxy.writeQuery({ query: StaffPositionsQuery, data });
      },
    }),
  }),
})
class StaffPositionsTable extends React.Component {
  static propTypes = {
    staffPositions: PropTypes.arrayOf(StaffPositionPropType).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    deleteStaffPosition: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderRow = staffPosition => (
    <tr key={staffPosition.id}>
      <td>{staffPosition.name}</td>
      <td>{staffPosition.visible ? (<i className="fa fa-check" />) : null}</td>
      <td>{staffPosition.user_con_profiles.map(ucp => ucp.name_without_nickname).join(', ')}</td>
      <td>
        <ul className="list-unstyled">
          {describePermissions(staffPosition.permissions).map(description => (
            <li key={description} className="text-nowrap">
              {description}
            </li>
          ))}
        </ul>
      </td>
      <td>{staffPosition.email}</td>
      <td>
        <PopperDropdown
          renderReference={({ ref, toggle }) => (
            <button type="button" className="btn btn-sm btn-primary" ref={ref} onClick={toggle}>
              <i className="fa fa-ellipsis-h" />
              <span className="sr-only">Options</span>
            </button>
          )}
        >
          <Link to={`/${staffPosition.id}/edit`} className="dropdown-item">
            Edit settings
          </Link>
          <Link to={`/${staffPosition.id}/edit_permissions`} className="dropdown-item">
            Edit permissions
          </Link>
          <Confirm.Trigger>
            {confirm => (
              <button
                className="dropdown-item cursor-pointer text-danger"
                type="button"
                onClick={() => confirm({
                  prompt: `Are you sure you want to delete the staff position ${staffPosition.name}?`,
                  action: () => this.props.deleteStaffPosition(staffPosition.id),
                  renderError: error => <ErrorDisplay graphQLError={error} />,
                })}
              >
                Delete
              </button>
            )}
          </Confirm.Trigger>
        </PopperDropdown>
      </td>
    </tr>
  )

  render = () => {
    const sortedStaffPositions = [...this.props.staffPositions].sort((
      (a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' })
    ));
    const staffPositionRows = sortedStaffPositions.map(this.renderRow);

    return (
      <div>
        <h1 className="mb-4">Staff positions</h1>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Visible</th>
              <th>People</th>
              <th>Permissions</th>
              <th>Email</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {staffPositionRows}
          </tbody>
        </table>

        <Link to="/new" className="btn btn-primary">New Staff Position</Link>
      </div>
    );
  }
}

export default StaffPositionsTable;
