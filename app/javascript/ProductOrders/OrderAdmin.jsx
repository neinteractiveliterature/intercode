import React from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment-timezone';
import ReactTable from 'react-table';
import arrayToSentence from 'array-to-sentence';
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

@withApollo
class OrderAdmin extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      pages: 1,
      loading: true,
    };
  }

  fetchData = async (state) => {
    this.setState({ loading: true });

    const filters = {};
    state.filtered.forEach(({ id, value }) => {
      filters[id] = value;
    });

    const sort = state.sorted.map(({ id, desc }) => ({ field: id, desc }));

    const response = await this.props.client.query({
      query: ordersQuery,
      variables: {
        page: state.page + 1,
        perPage: state.pageSize,
        filters,
        sort,
      },
      // fetchPolicy: 'network-only',
    });

    this.setState({
      data: response.data,
      orders: response.data.convention.orders_paginated.entries,
      pages: response.data.convention.orders_paginated.total_pages,
      loading: false,
    });
  }

  render = () => {
    const { orders, pages, loading } = this.state;

    return (
      <ReactTable
        className="-striped"
        manual
        filterable
        data={orders}
        pages={pages}
        loading={loading}
        getPaginationProps={() => ({
          showPageJump: false,
        })}
        onFetchData={this.fetchData}
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
    );
  }
}

export default OrderAdmin;
