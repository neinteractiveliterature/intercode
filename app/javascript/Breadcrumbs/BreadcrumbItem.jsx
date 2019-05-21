import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function BreadcrumbItem({ active, children, to }) {
  if (active) {
    return (
      <li className="breadcrumb-item active">
        {children}
      </li>
    );
  }

  return (
    <li className="breadcrumb-item">
      <Link to={to}>
        {children}
      </Link>
    </li>
  );
}

BreadcrumbItem.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

BreadcrumbItem.defaultProps = {
  active: false,
};

export default BreadcrumbItem;
