import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import moment from 'moment-timezone';
import ReactTable from 'react-table';
import arrayToSentence from 'array-to-sentence';
import QueryString from 'query-string';
import AdminOrderModal from './AdminOrderModal';
import { adminOrdersQuery } from './queries';
import formatMoney from '../formatMoney';

function dataToKeyPathValuePairs(data, prependKeys = []) {
  return Object.entries(data).map(([key, value]) => {
    const keyPath = [...prependKeys, key];

    if (Array.isArray(value)) {
      return value.map(item => dataToKeyPathValuePairs(item, [...keyPath, '']))
        .reduce((acc, subValue) => acc.concat(subValue), []);
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return [[keyPath, value]];
    }

    return dataToKeyPathValuePairs(value, keyPath);
  }).reduce((acc, value) => acc.concat(value), []);
}

function dataToQueryString(data) {
  const keyPathValuePairs = dataToKeyPathValuePairs(data);
  const queryStringItems = keyPathValuePairs.map(([keyPath, value]) => {
    const [first, ...rest] = keyPath;
    const key = `${first}${rest.map(part => `[${part}]`).join('')}`;
    return QueryString.stringify({ [key]: value });
  });

  return queryStringItems.join('&');
}

function reactTableFiltersToTableResultsFilters(filters) {
  const tableResultsFilters = {};
  filters.forEach(({ id, value }) => {
    tableResultsFilters[id] = value;
  });
  return tableResultsFilters;
}

function reactTableSortToTableResultsSort(sort) {
  return sort.map(({ id, desc }) => ({ field: id, desc }));
}

class OrderAdmin extends React.Component {
  static propTypes = {
    exportUrl: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      sorted: [],
      filtered: [],
      editingOrderId: null,
    };
  }

  closeOrderModal = () => { this.setState({ editingOrderId: null }); }

  renderExportButton = () => {
    const queryParams = {
      filters: reactTableFiltersToTableResultsFilters(this.state.filtered),
      sort: reactTableSortToTableResultsSort(this.state.sorted),
    };

    const queryString = dataToQueryString(queryParams);

    return (
      <a
        className="btn btn-outline-primary"
        href={`${this.props.exportUrl}?${queryString}`}
      >
        <i className="fa fa-file-excel-o" />
        {' '}
        Export CSV
      </a>
    );
  }

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

  render = () => {
    const { sorted, filtered } = this.state;

    return (
      <div>
        <div className="mb-2">
          {this.renderExportButton()}
        </div>
        <Query query={adminOrdersQuery}>
          {({ loading, data, refetch }) => (
            <div>
              <ReactTable
                className="-striped -highlight"
                manual
                filterable
                data={(data.convention || { orders_paginated: {} }).orders_paginated.entries}
                pages={(data.convention || { orders_paginated: {} }).orders_paginated.total_pages}
                sorted={sorted}
                filtered={filtered}
                loading={loading}
                onFetchData={(tableState) => {
                  refetch({
                    page: tableState.page + 1,
                    perPage: tableState.pageSize,
                    filters: reactTableFiltersToTableResultsFilters(tableState.filtered),
                    sort: reactTableSortToTableResultsSort(tableState.sorted),
                  });
                }}
                onSortedChange={(newSorted) => {
                  this.setState({ sorted: newSorted });
                }}
                onFilteredChange={(newFiltered) => {
                  this.setState({ filtered: newFiltered });
                }}
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
                      props.value ?
                      moment(props.value).tz(data.convention.timezone_name)
                        .format('MMM D, YYYY h:mma') :
                      ''
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
        </Query>
      </div>
    );
  }
}

export default OrderAdmin;
