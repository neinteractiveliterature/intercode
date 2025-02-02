import { useContext } from 'react';
import * as React from 'react';
import isEqual from 'lodash/isEqual';
import { SortingState } from '@tanstack/react-table';

import AppRootContext from '../../../AppRootContext';
import { DropdownMenu } from '../../../UIComponents/DropdownMenu';
import humanize from '../../../humanize';

const SORT_ORDERS = [
  { sorted: [{ id: 'title', desc: false }], caption: 'title' },
  { sorted: [{ id: 'created_at', desc: false }], caption: 'order added (oldest first)' },
  { sorted: [{ id: 'created_at', desc: true }], caption: 'order added (newest first)' },
];

export type EventListSortDropdownProps = {
  showConventionOrder: boolean;
  value?: SortingState;
  onChange: React.Dispatch<SortingState>;
};

function EventListSortDropdown({ showConventionOrder, value, onChange }: EventListSortDropdownProps): JSX.Element {
  const { myProfile } = useContext(AppRootContext);

  const mySortOrders = [...SORT_ORDERS];
  if (showConventionOrder) {
    mySortOrders.splice(1, 0, {
      sorted: [{ id: 'first_scheduled_run_start', desc: false }],
      caption: 'convention order',
    });
  }

  if (myProfile) {
    mySortOrders.splice(0, 0, {
      sorted: [
        { id: 'my_rating', desc: true },
        { id: 'title', desc: false },
      ],
      caption: 'my favorites',
    });
  }

  const currentSort = mySortOrders.find((order) => isEqual(order.sorted, value)) || mySortOrders[0];

  const sortOptions = mySortOrders.map((order) => (
    <button
      className="dropdown-item"
      key={order.caption}
      onClick={() => {
        onChange(order.sorted);
      }}
      type="button"
    >
      {humanize(order.caption)}
    </button>
  ));

  return (
    <DropdownMenu buttonContent={`Sort by ${currentSort.caption}`} buttonClassName="btn btn-link dropdown-toggle">
      {sortOptions}
    </DropdownMenu>
  );
}

export default EventListSortDropdown;
