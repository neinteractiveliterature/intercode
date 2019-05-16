import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function useSetPageTitleIfPresentAndActive(title, active) {
  useEffect(() => {
    if (title && active) {
      window.document.title = title;
    }
  }, [active, title]);
}

function BreadcrumbItem({
  active, children, to, pageTitleIfActive,
}) {
  useSetPageTitleIfPresentAndActive(pageTitleIfActive, active);

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
  pageTitleIfActive: PropTypes.string,
};

BreadcrumbItem.defaultProps = {
  active: false,
  pageTitleIfActive: null,
};

export default BreadcrumbItem;
