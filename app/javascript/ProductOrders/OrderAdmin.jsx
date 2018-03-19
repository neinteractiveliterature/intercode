import React from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment-timezone';
import ReactTable from 'react-table';
import arrayToSentence from 'array-to-sentence';
import QueryString from 'query-string';
import GraphQLResultPropType from '../GraphQLResultPropType';
import formatMoney from '../formatMoney';

const ordersQuery = gql`
query($page: Int, $perPage: Int, $filters: OrderFiltersInput, $sort: [SortInput]) {
  convention {
    timezone_name

    orders_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
      current_page
      per_page
      total_pages

      entries {
        id
        status
        submitted_at

        user_con_profile {
          name_without_nickname
        }

        total_price {
          fractional
          currency_code
        }

        order_entries {
          describe_products
        }
      }
    }
  }
}
`;

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

@withApollo
class OrderAdmin extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    exportUrl: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      sorted: [],
      filtered: [],
      pages: 1,
      loading: true,
    };
  }

  fetchData = async (state) => {
    this.setState({ loading: true });

    const response = await this.props.client.query({
      query: ordersQuery,
      variables: {
        page: state.page + 1,
        perPage: state.pageSize,
        filters: reactTableFiltersToTableResultsFilters(state.filtered),
        sort: reactTableSortToTableResultsSort(state.sorted),
      },
    });

    this.setState({
      data: response.data,
      orders: response.data.convention.orders_paginated.entries,
      pages: response.data.convention.orders_paginated.total_pages,
      loading: false,
    });
  }

  sortedChanged = (sorted) => { this.setState({ sorted }); }
  filteredChanged = (filtered) => { this.setState({ filtered }); }

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
    )
  }

  render = () => {
    const {
      orders,
      pages,
      loading,
      sorted,
      filtered,
    } = this.state;

    return (
      <div>
        <div className="mb-2">
          {this.renderExportButton()}
        </div>
        <ReactTable
          className="-striped"
          manual
          filterable
          data={orders}
          pages={pages}
          sorted={sorted}
          filtered={filtered}
          loading={loading}
          onFetchData={this.fetchData}
          onSortedChange={this.sortedChanged}
          onFilteredChange={this.filteredChanged}
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
                moment(props.value).tz(this.state.data.convention.timezone_name)
                  .format('MMM D, YYYY h:mma')
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
        />
      </div>
    );
  }
}

export default OrderAdmin;
