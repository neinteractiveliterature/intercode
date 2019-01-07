import React from 'react';
import PropTypes from 'prop-types';
import { titleize } from 'inflected';

import PermissionNames from '../../../config/permission_names.json';
import { sortByLocaleString } from '../ValueUtils.js';

class EditStaffPositionPermissions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      staffPosition: props.initialStaffPosition,
    };
  }

  render = () => (
    <>
      <h1 className="mb-4">
        {this.state.staffPosition.name}
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
          {sortByLocaleString(this.props.eventCategories, category => category.name).map((eventCategory) => {
            const eventCategoryPermission = this.state.staffPosition.event_category_permissions
              .find(permission => permission.event_category.id === eventCategory.id)
              || {};

            return (
              <tr key={eventCategory.id}>
                <th scope="row">{eventCategory.name}</th>
                {PermissionNames.EventCategory.map(({ permission }) => {
                  const hasPermission = eventCategoryPermission[permission];

                  return (
                    <td key={permission}>
                      <input type="checkbox" checked={hasPermission} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  )
}

export default EditStaffPositionPermissions;
