import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { debounce } from 'lodash';

import { useApolloClient } from 'react-apollo-hooks';
import ErrorDisplay from '../ErrorDisplay';

import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from './TableUtils';
import useAsyncFunction from '../useAsyncFunction';

const GraphQLReactTableContext = React.createContext({
  getData: () => [],
  getPages: () => 0,
  getReactTableProps: () => ({}),
  queryResult: {},
  fetchFromTableState: () => {},
});

export const GraphQLReactTableConsumer = GraphQLReactTableContext.Consumer;

export function useGraphQLReactTable({
  getData, getPages, query, variables,
}) {
  const client = useApolloClient();
  const [queryResult, setQueryResult] = useState(null);
  const [pages, setPages] = useState(0);
  const [asyncQuery, error, loading] = useAsyncFunction(client.query);

  const fetchData = async (vars) => {
    const result = asyncQuery({ query, variables: vars, fetchPolicy: 'network-only' });
    setQueryResult(result);
    setPages(getPages(queryResult));
  };

  const fetchFromTableState = tableState => fetchData({
    ...variables,
    page: tableState.page + 1,
    perPage: tableState.pageSize,
    filters: reactTableFiltersToTableResultsFilters(tableState.filtered),
    sort: reactTableSortToTableResultsSort(tableState.sorted),
  });

  const dataAvailable = !(loading || error);
  const reactTableProps = {
    data: dataAvailable ? getData(queryResult) : [],
    pages, // avoid flash of 0 during page transitions
    manual: true,
    filterable: true,
    loading,
    onFetchData: (tableState) => { fetchFromTableState(tableState); },
  };

  return [reactTableProps, queryResult, fetchFromTableState];
}

// TODO I'd like to use <Query> but it has a bug where if you refetch and it returns the exact
// same data, you end up with {} in the data property.
// https://github.com/apollographql/react-apollo/issues/2114

@withApollo
class GraphQLReactTableProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    getData: PropTypes.func.isRequired,
    getPages: PropTypes.func.isRequired,
    query: PropTypes.shape({}).isRequired,
    variables: PropTypes.shape({}),
  };

  static defaultProps = {
    variables: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      queryResult: null,
      loading: true,
      pages: 0,
      error: null,
    };
  }

  componentDidMount = async () => {
    this.fetchData(this.props.variables);
  }

  fetchData = async (variables) => {
    this.setState({ loading: true });
    try {
      const queryResult = await this.props.client.query({ query: this.props.query, variables, fetchPolicy: 'network-only' });
      this.setState({ queryResult, pages: this.props.getPages(queryResult), loading: false });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  }

  // eslint-disable-next-line react/sort-comp
  fetchDataDebounced = debounce(
    this.fetchData,
    100,
    { maxWait: 1000, leading: false, trailing: true },
  )

  fetchFromTableState = tableState => this.fetchDataDebounced({
    ...this.props.variables,
    page: tableState.page + 1,
    perPage: tableState.pageSize,
    filters: reactTableFiltersToTableResultsFilters(tableState.filtered),
    sort: reactTableSortToTableResultsSort(tableState.sorted),
  })

  render = () => {
    const { queryResult, loading, error } = this.state;
    if (!queryResult) {
      return <ErrorDisplay graphQLError={error} />;
    }

    const dataAvailable = !(loading || queryResult.error);

    const reactTableProps = {
      data: dataAvailable ? this.props.getData(queryResult) : [],
      pages: this.state.pages, // avoid flash of 0 during page transitions
      manual: true,
      filterable: true,
      loading,
      onFetchData: (tableState) => { this.fetchFromTableState(tableState); },
    };

    return (
      <GraphQLReactTableContext.Provider
        value={{
          getReactTableProps: () => reactTableProps,
          queryResult,
          fetchFromTableState: this.fetchFromTableState,
        }}
      >
        <ErrorDisplay graphQLError={error} />
        {this.props.children}
      </GraphQLReactTableContext.Provider>
    );
  }
}

export { GraphQLReactTableProvider };
