import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import ReactTable from 'react-table';

import ArrayToSentenceCell from '../Tables/ArrayToSentenceCell';
import AdminOrderModal from './AdminOrderModal';
import { AdminOrdersQuery } from './queries.gql';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import FreeTextFilter from '../Tables/FreeTextFilter';
import MoneyCell from '../Tables/MoneyCell';
import TableHeader from '../Tables/TableHeader';
import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import usePageTitle from '../usePageTitle';
import AppRootContext from '../AppRootContext';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';

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
  const data = useContext(QueryDataContext);

  if (!value) {
    return '';
  }

  return moment(value).tz(data.convention.timezone_name).format('MMM D, YYYY h:mma');
};

SubmittedAtCell.propTypes = {
  value: PropTypes.string,
};

SubmittedAtCell.defaultProps = {
  value: null,
};

const getPossibleColumns = () => [
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
    Header: 'Price',
    id: 'total_price',
    accessor: 'total_price',
    filterable: false,
    sortable: false,
    Cell: MoneyCell,
  },
];

function OrderAdmin() {
  const { timezoneName } = useContext(AppRootContext);
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

  const closeOrderModal = () => { setEditingOrderId(null); };

  const renderEditModal = () => (
    <AdminOrderModal
      order={queryData
        && queryData.convention.orders_paginated.entries.find((o) => o.id === editingOrderId)}
      closeModal={closeOrderModal}
      timezoneName={timezoneName}
    />
  );

  return (
    <QueryDataContext.Provider value={queryData}>
      <div className="mb-4">
        <TableHeader {...tableHeaderProps} exportUrl="/csv_exports/orders" />

        <ReactTable
          {...reactTableProps}

          className="-striped -highlight"
          getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
          getTrProps={(state, rowInfo) => {
            if (((queryData || {}).currentAbility || {}).can_update_orders) {
              return {
                style: { cursor: 'pointer' },
                onClick: () => { setEditingOrderId(rowInfo.original.id); },
              };
            }

            return {};
          }}
        />

        {renderEditModal()}
      </div>
    </QueryDataContext.Provider>
  );
}

export default OrderAdmin;
