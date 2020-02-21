import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';
import isEqual from 'lodash/isEqual';

import PopperDropdown from '../../UIComponents/PopperDropdown';
import AppRootContext from '../../AppRootContext';

const SORT_ORDERS = [
  { sorted: [{ id: 'title', desc: false }], caption: 'title' },
  { sorted: [{ id: 'created_at', desc: false }], caption: 'order added (oldest first)' },
  { sorted: [{ id: 'created_at', desc: true }], caption: 'order added (newest first)' },
];

const EventListSortDropdown = ({ showConventionOrder, value, onChange }) => {
  const { myProfile } = useContext(AppRootContext);

  const mySortOrders = [...SORT_ORDERS];
  if (showConventionOrder) {
    mySortOrders.splice(1, 0, { sorted: [{ id: 'first_scheduled_run_start', desc: false }], caption: 'convention order' });
  }

  if (myProfile) {
    mySortOrders.splice(0, 0, { sorted: [{ id: 'my_rating', desc: true }, { id: 'title', desc: false }], caption: 'my favorites' });
  }

  const currentSort = (
    mySortOrders.find((order) => isEqual(order.sorted, value))
    || mySortOrders[0]
  );

  const sortOptions = mySortOrders.map((order) => (
    <button
      className="dropdown-item"
      key={order.caption}
      onClick={() => { onChange(order.sorted); }}
      type="button"
    >
      {humanize(order.caption)}
    </button>
  ));

  return (
    <PopperDropdown
      renderReference={({ ref, toggle }) => (
        <button type="button" className="btn btn-link dropdown-toggle" ref={ref} onClick={toggle}>
          Sort by
          {' '}
          {currentSort.caption}
        </button>
      )}
      placement="bottom-end"
    >
      {sortOptions}
    </PopperDropdown>
  );
};

EventListSortDropdown.propTypes = {
  showConventionOrder: PropTypes.bool.isRequired,
  value: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    desc: PropTypes.bool,
  })),
  onChange: PropTypes.func.isRequired,
};

EventListSortDropdown.defaultProps = {
  value: null,
};

export default EventListSortDropdown;
