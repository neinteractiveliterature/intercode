import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { humanize } from 'inflected';
import PopperDropdown from './PopperDropdown';

const SORT_ORDERS = [
  { queryParam: 'title', caption: 'title' },
  { queryParam: 'accepted_asc', caption: 'order added (oldest first)' },
  { queryParam: 'accepted_desc', caption: 'order added (newest first)' },
];

const EventListSortDropdown = ({ showConventionOrder }) => {
  const mySortOrders = [...SORT_ORDERS];
  if (showConventionOrder) {
    mySortOrders.splice(1, 0, { queryParam: 'first_scheduled_run', caption: 'convention order' });
  }

  const parsedQueryString = queryString.parse(window.location.search);
  const currentSort = (
    mySortOrders.find(order => order.queryParam === parsedQueryString.sort) ||
    mySortOrders[0]
  );

  const sortOptions = mySortOrders.map(order => (
    <a
      href={`${window.location.pathname}?sort=${order.queryParam}`}
      className="dropdown-item"
      key={order.queryParam}
    >
      {humanize(order.caption)}
    </a>
  ));

  return (
    <PopperDropdown
      caption={`Sorting by ${currentSort.caption}`}
      placement="bottom-end"
    >
      {sortOptions}
    </PopperDropdown>
  );
};

EventListSortDropdown.propTypes = {
  showConventionOrder: PropTypes.bool.isRequired,
};

export default EventListSortDropdown;
