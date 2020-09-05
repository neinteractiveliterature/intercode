import React from 'react';
// @ts-expect-error
import Pagination from 'react-js-pagination';
import classNames from 'classnames';

export type EventListPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: React.Dispatch<number>;
  extraClasses?: string[];
};

function EventListPagination({
  currentPage,
  totalPages,
  onPageChange,
  extraClasses,
}: EventListPaginationProps) {
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

export default EventListPagination;
