import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';

import ArrayToSentenceCell from '../Tables/ArrayToSentenceCell';
import AdminOrderModal from './AdminOrderModal';
import { AdminOrdersQuery } from './queries.gql';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import FreeTextFilter from '../Tables/FreeTextFilter';
import MoneyCell from '../Tables/MoneyCell';
import TableHeader from '../Tables/TableHeader';
import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';

const StatusFilter = ({ filter, onChange }) => (
  <ChoiceSetFilter
    name="status"
    choices={[
      { label: 'Paid', value: 'paid' },
      { label: 'Unpaid', value: 'unpaid' },
      { label: 'Cancelled', value: 'cancelled' },
      { label: 'Any', value: '' },
    ]}
    onChange={onChange}
    filter={filter}
    multiple={false}
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

const getPossibleColumns = (data) => {
  const SubmittedAtCell = ({ value }) => (
    value
      ? moment(value).tz(data.convention.timezone_name)
        .format('MMM D, YYYY h:mma')
      : ''
  );

  SubmittedAtCell.propTypes = {
    value: PropTypes.string,
  };

  SubmittedAtCell.defaultProps = {
    value: null,
  };

  return [
    {
      Header: 'User',
      id: 'user_name',
      accessor: order => order.user_con_profile.name_without_nickname,
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
      Cell: SubmittedAtCell,
    },
    {
      Header: 'Products',
      id: 'describe_products',
      filterable: false,
      sortable: false,
      accessor: order => order.order_entries.map(entry => entry.describe_products),
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
};

function OrderAdmin({ exportUrl, history }) {
  const [editingOrder, setEditingOrder] = useState(null);
  const [reactTableProps, { tableHeaderProps, queryResult }] = useReactTableWithTheWorks({
    getData: ({ data }) => data.convention.orders_paginated.entries,
    getPages: ({ data }) => data.convention.orders_paginated.total_pages,
    getPossibleColumns,
    history,
    storageKeyPrefix: 'orderAdmin',
    query: AdminOrdersQuery,
  });

  const { data } = queryResult || {};
  const closeOrderModal = () => { setEditingOrder(null); };

  const renderEditModal = () => (
    <AdminOrderModal
      order={editingOrder}
      closeModal={closeOrderModal}
      timezoneName={((data || {}).convention || {}).timezoneName}
    />
  );

  return (
    <div className="mb-4">
      <TableHeader {...tableHeaderProps} exportUrl={exportUrl} />

      <ReactTable
        {...reactTableProps}

        className="-striped -highlight"
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
        getTrProps={(state, rowInfo) => {
          if ((data.currentAbility || {}).can_update_orders) {
            return {
              style: { cursor: 'pointer' },
              onClick: () => { setEditingOrder(rowInfo.original); },
            };
          }

          return {};
        }}
      />

      {renderEditModal()}
    </div>
  );
}

OrderAdmin.propTypes = {
  exportUrl: PropTypes.string.isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default withRouter(OrderAdmin);
