import React from 'react';
import PropTypes from 'prop-types';

function UserAdminDisplay({ userId }) {
  return <span>{userId}</span>;
}

UserAdminDisplay.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default UserAdminDisplay;
