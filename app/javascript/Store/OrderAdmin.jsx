import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import arrayToSentence from 'array-to-sentence';

import AdminOrderModal from './AdminOrderModal';
import { adminOrdersQuery } from './queries';
import formatMoney from '../formatMoney';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';

class OrderAdmin extends React.Component {
  static propTypes = {
    exportUrl: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      editingOrderId: null,
    };
  }

  closeOrderModal = () => { this.setState({ editingOrderId: null }); }

  renderEditModal = (data) => {
    if (!data.convention) {
      return null;
    }

    const editingOrder = data.convention.orders_paginated.entries
      .find(order => order.id === this.state.editingOrderId);

    return (
      <AdminOrderModal
        order={editingOrder}
        closeModal={this.closeOrderModal}
        timezoneName={data.convention.timezone_name}
      />
    );
  }

  getPossibleColumns = data => [
    {
      Header: 'User',
      id: 'user_name',
      accessor: order => order.user_con_profile.name_without_nickname,
    },
    { Header: 'Status', id: 'status', accessor: 'status' },
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
      <ReactTableWithTheWorks
        exportUrl={this.props.exportUrl}
        getData={({ data }) => data.convention.orders_paginated.entries}
        getPages={({ data }) => data.convention.orders_paginated.total_pages}
        getPossibleColumns={this.getPossibleColumns}
        query={adminOrdersQuery}
      />
    </div>
  )
}

export default OrderAdmin;
