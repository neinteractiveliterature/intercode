import React from 'react';
import PropTypes from 'prop-types';

import SignOutButton from '../Authentication/SignOutButton';

function SignOutNavigationItem({ item }) {
  return <SignOutButton className="dropdown-item" caption={item.label} />;
}

SignOutNavigationItem.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default SignOutNavigationItem;
