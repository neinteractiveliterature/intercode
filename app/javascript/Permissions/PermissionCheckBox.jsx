import React from 'react';
import PropTypes from 'prop-types';

function PermissionCheckBox({ hasPermission }) {
  if (hasPermission) {
    return (
      <i className="fa fa-check-square-o">
        <span className="sr-only">Permitted</span>
      </i>
    );
  }

  return (
    <i className="fa fa-square-o">
      <span className="sr-only">Not permitted</span>
    </i>
  );
}

PermissionCheckBox.propTypes = {
  hasPermission: PropTypes.bool.isRequired,
};

export default PermissionCheckBox;
