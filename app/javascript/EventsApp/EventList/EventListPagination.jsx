import React from 'react';
import PropTypes from 'prop-types';
import Pagination from 'react-js-pagination';
import classNames from 'classnames';

function EventListPagination({
  currentPage, totalPages, onPageChange, extraClasses,
}) {
  return (
    <nav>
      <Pagination
        totalItemsCount={totalPages}
        activePage={currentPage}
        onChange={onPageChange}
        itemsCountPerPage={1}
        innerClass={classNames('pagination', extraClasses)}
        itemClass="page-item"
        linkClass="page-link"
        hideNavigation
        hideFirstLastPages
        ellipsis
      />
    </nav>
  );
}

EventListPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  extraClasses: PropTypes.arrayOf(PropTypes.string),
};

EventListPagination.defaultProps = {
  extraClasses: [],
};

export default EventListPagination;
