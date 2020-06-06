import React, { useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import ReactTable from 'react-table';

import ArrayToSentenceCell from '../Tables/ArrayToSentenceCell';
import { AdminOrdersQuery } from './queries.gql';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import FreeTextFilter from '../Tables/FreeTextFilter';
import MoneyCell from '../Tables/MoneyCell';
import TableHeader from '../Tables/TableHeader';
import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import usePageTitle from '../usePageTitle';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import useModal from '../ModalDialogs/useModal';
import EditOrderModal from './EditOrderModal';
import NewOrderModal from './NewOrderModal';
import AppRootContext from '../AppRootContext';

const fieldFilterCodecs = buildFieldFilterCodecs({
  status: FilterCodecs.stringArray,
});

const StatusFilter = ({ filter, onChange }) => (
  <ChoiceSetFilter
    name="status"
    choices={[
      { label: 'Paid', value: 'paid' },
      { label: 'Unpaid', value: 'unpaid' },
      { label: 'Cancelled', value: 'cancelled' },
    ]}
    onChange={onChange}
    filter={filter}
    multiple
  />
);

StatusFilter.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
};

StatusFilter.defaultProps = {
  filter: null,
};

const SubmittedAtCell = ({ value }) => {
  const { timezoneName } = useContext(AppRootContext);

  if (!value) {
    return '';
  }

  return moment(value).tz(timezoneName).format('MMM D, YYYY h:mma');
};

SubmittedAtCell.propTypes = {
  value: PropTypes.string,
};

SubmittedAtCell.defaultProps = {
  value: null,
};

const getPossibleColumns = () => [
  {
    Header: 'ID',
    id: 'id',
    accessor: 'id',
    Filter: FreeTextFilter,
    width: 100,
  },
  {
    Header: 'User',
    id: 'user_name',
    accessor: (order) => order.user_con_profile.name_without_nickname,
    Filter: FreeTextFilter,
  },
  {
    Header: 'Status',
    id: 'status',
    accessor: 'status',
    Filter: StatusFilter,
  },
  {
    Header: 'Submitted',
    id: 'submitted_at',
    accessor: 'submitted_at',
    filterable: false,
    Cell: (props) => <SubmittedAtCell {...props} />,
  },
  {
    Header: 'Products',
    id: 'describe_products',
    filterable: false,
    sortable: false,
    accessor: (order) => order.order_entries.map((entry) => entry.describe_products),
    Cell: ArrayToSentenceCell,
  },
  {
    Header: 'Payment amount',
    id: 'payment_amount',
    accessor: 'payment_amount',
    filterable: false,
    sortable: false,
    Cell: MoneyCell,
  },
];

function OrderAdmin() {
  const newOrderModal = useModal();
  const [editingOrderId, setEditingOrderId] = useState(null);
  usePageTitle('Orders');

  const [reactTableProps, { tableHeaderProps, queryData }] = useReactTableWithTheWorks({
    getData: ({ data }) => data.convention.orders_paginated.entries,
    getPages: ({ data }) => data.convention.orders_paginated.total_pages,
    getPossibleColumns,
    storageKeyPrefix: 'orderAdmin',
    query: AdminOrdersQuery,
    decodeFilterValue: fieldFilterCodecs.decodeFilterValue,
    encodeFilterValue: fieldFilterCodecs.encodeFilterValue,
  });

  // memo to my future self if I get the bright idea to rip this out again:
  // if we don't do it this way, the order doesn't update in the EditOrderModal after it changes
  const editingOrder = useMemo(
    () => (editingOrderId
      && queryData?.convention?.orders_paginated?.entries?.
        find((order) => order.id === editingOrderId)
    ),
    [queryData, editingOrderId],
  );

  return (
    <QueryDataContext.Provider value={queryData}>
      <div className="mb-4">
        <TableHeader
          {...tableHeaderProps}
          exportUrl="/csv_exports/orders"
          renderLeftContent={() => queryData?.currentAbility?.can_create_orders && (
            <button type="button" className="btn btn-outline-primary ml-2" onClick={newOrderModal.open}>
              <i className="fa fa-plus" />
              {' '}
              New order
            </button>
          )}
        />

        <ReactTable
          {...reactTableProps}

          className="-striped -highlight"
          getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
          getTrProps={(state, rowInfo) => {
            if (queryData?.currentAbility?.can_update_orders) {
              return {
                style: { cursor: 'pointer' },
                onClick: () => { setEditingOrderId(rowInfo.original.id); },
              };
            }

            return {};
          }}
        />

        <NewOrderModal visible={newOrderModal.visible} close={newOrderModal.close} />
        <EditOrderModal order={editingOrder} closeModal={() => setEditingOrderId(null)} />
      </div>
    </QueryDataContext.Provider>
  );
}

export default OrderAdmin;
