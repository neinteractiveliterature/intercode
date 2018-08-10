import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from './TableUtils';

class GraphQLReactTableWrapper extends React.PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    query: PropTypes.shape({}).isRequired,
    variables: PropTypes.shape({}),
  };

  static defaultProps = {
    variables: null,
  };

  render = () => {
    const {
      children,
      query,
      variables,
    } = this.props;

    return (
      <Query query={query} variables={variables}>
        {(queryResult) => {
          const refetchFromTableState = tableState => queryResult.refetch({
            ...variables,
            page: tableState.page + 1,
            perPage: tableState.pageSize,
            filters: reactTableFiltersToTableResultsFilters(tableState.filtered),
            sort: reactTableSortToTableResultsSort(tableState.sorted),
          });

          const reactTableProps = {
            manual: true,
            filterable: true,
            loading: queryResult.loading,
            onFetchData: (tableState) => { refetchFromTableState(tableState); },
          };

          return children(reactTableProps, queryResult, refetchFromTableState);
        }}
      </Query>
    );
  }
}

export default GraphQLReactTableWrapper;
