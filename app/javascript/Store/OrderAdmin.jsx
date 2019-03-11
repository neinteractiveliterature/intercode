import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import arrayToSentence from 'array-to-sentence';

import AdminOrderModal from './AdminOrderModal';
import { AdminOrdersQuery, AdminStoreAbilityQuery } from './queries.gql';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import formatMoney from '../formatMoney';
import FreeTextFilter from '../Tables/FreeTextFilter';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';

class OrderAdmin extends React.Component {
  static propTypes = {
    exportUrl: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      editingOrder: null,
      timezoneName: null,
    };
  }

  closeOrderModal = () => { this.setState({ editingOrder: null }); }

  renderEditModal = () => (
    <AdminOrderModal
      order={this.state.editingOrder}
      closeModal={this.closeOrderModal}
      timezoneName={this.state.timezoneName}
    />
  )

  getPossibleColumns = data => [
    {
      Header: 'User',
      id: 'user_name',
      accessor: order => order.user_con_profile.name_without_nickname,
      Filter: ({ filter, onChange }) => (
        <FreeTextFilter filter={filter} onChange={onChange} />
      ),
    },
    {
      Header: 'Status',
      id: 'status',
      accessor: 'status',
      Filter: ({ filter, onChange }) => (
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
      ),
    },
    {
      Header: 'Submitted',
      id: 'submitted_at',
      accessor: 'submitted_at',
      filterable: false,
      Cell: props => (
        props.value
          ? moment(props.value).tz(data.convention.timezone_name)
            .format('MMM D, YYYY h:mma')
          : ''
      ),
    },
    {
      Header: 'Products',
      id: 'describe_products',
      filterable: false,
      sortable: false,
      accessor: order => order.order_entries.map(entry => entry.describe_products),
      Cell: props => arrayToSentence(props.value),
    },
    {
      Header: 'Price',
      id: 'total_price',
      accessor: 'total_price',
      filterable: false,
      sortable: false,
      Cell: props => formatMoney(props.value),
    },
  ]

  render = () => (
    <div className="mb-4">
      <QueryWithStateDisplay query={AdminStoreAbilityQuery}>
        {({ data: { currentAbility, convention } }) => (
          <ReactTableWithTheWorks
            exportUrl={this.props.exportUrl}
            getData={({ data }) => data.convention.orders_paginated.entries}
            getPages={({ data }) => data.convention.orders_paginated.total_pages}
            getPossibleColumns={this.getPossibleColumns}
            storageKeyPrefix="orderAdmin"
            query={AdminOrdersQuery}
            getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
            getTrProps={(state, rowInfo) => {
              if (currentAbility.can_update_orders) {
                return {
                  style: { cursor: 'pointer' },
                  onClick: () => {
                    this.setState({
                      editingOrder: rowInfo.original,
                      timezoneName: convention.timezone_name,
                    });
                  },
                };
              }

              return {};
            }}
          />
        )}
      </QueryWithStateDisplay>

      {this.renderEditModal()}
    </div>
  )
}

export default OrderAdmin;
