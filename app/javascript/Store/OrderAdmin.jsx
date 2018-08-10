import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import arrayToSentence from 'array-to-sentence';
import ReactTable from 'react-table';

import AdminOrderModal from './AdminOrderModal';
import { adminOrdersQuery } from './queries';
import formatMoney from '../formatMoney';
import GraphQLReactTableWrapper from '../GraphQLReactTableWrapper';
import ReactRouterReactTableWrapper from '../ReactRouterReactTableWrapper';
import ReactTableExportButton from '../ReactTableExportButton';

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

  render = () => (
    <div className="mb-4">
      <ReactRouterReactTableWrapper>
        {tableStateProps => (
          <GraphQLReactTableWrapper query={adminOrdersQuery}>
            {(reactTableProps, { data }) => (
              <div>
                <ReactTableExportButton
                  exportUrl={this.props.exportUrl}
                  filtered={tableStateProps.filtered}
                  sorted={tableStateProps.sorted}
                />
                <ReactTable
                  {...tableStateProps}
                  {...reactTableProps}
                  className="-striped -highlight"
                  data={(data.convention || { orders_paginated: {} }).orders_paginated.entries}
                  pages={(data.convention || { orders_paginated: {} }).orders_paginated.total_pages}
                  columns={[
                    {
                      Header: 'User',
                      id: 'user_name',
                      accessor: order => order.user_con_profile.name_without_nickname,
                    },
                    { Header: 'Status', accessor: 'status' },
                    {
                      Header: 'Submitted',
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
                      accessor: 'total_price',
                      filterable: false,
                      sortable: false,
                      Cell: props => formatMoney(props.value),
                    },
                  ]}
                  getTrProps={(state, rowInfo) => ({
                    style: { cursor: 'pointer' },
                    onClick: (event, handleOriginal) => {
                      if (handleOriginal) {
                        handleOriginal();
                      }

                      this.setState({ editingOrderId: rowInfo.original.id });
                    },
                  })}
                />
                {this.renderEditModal(data)}
              </div>
            )}
          </GraphQLReactTableWrapper>
        )}
      </ReactRouterReactTableWrapper>
    </div>
  )
}

export default OrderAdmin;
