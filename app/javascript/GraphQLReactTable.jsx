import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import ReactTable from 'react-table';

import {
  getExportUrl,
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from './TableUtils';

class GraphQLReactTable extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    exportUrl: PropTypes.string,
    filtered: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    getReactTableProps: PropTypes.func,
    onFetchData: PropTypes.func,
    query: PropTypes.shape({}).isRequired,
    renderAdditionalContent: PropTypes.func,
    sorted: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    variables: PropTypes.shape({}),
  };

  static defaultProps = {
    children: null,
    exportUrl: null,
    getReactTableProps: null,
    onFetchData: null,
    renderAdditionalContent: null,
    variables: null,
  };

  renderExportButton = () => {
    if (!this.props.exportUrl) {
      return null;
    }

    return (
      <div className="mb-2">
        <a
          className="btn btn-outline-primary"
          href={
            getExportUrl(
              this.props.exportUrl,
              {
                filtered: this.props.filtered,
                sorted: this.props.sorted,
              },
            )
          }
        >
          <i className="fa fa-file-excel-o" />
          {' '}
          Export CSV
        </a>
      </div>
    );
  }

  render = () => {
    const {
      children,
      getReactTableProps,
      onFetchData,
      query,
      renderAdditionalContent,
      variables,
      ...staticTableProps
    } = this.props;

    return (
      <div>
        {this.renderExportButton()}
        <Query query={query} variables={variables}>
          {({
            loading, data, refetch, ...otherArgs
          }) => (
            <div>
              <ReactTable
                manual
                filterable
                loading={loading}
                onFetchData={(tableState) => {
                  refetch({
                    ...variables,
                    page: tableState.page + 1,
                    perPage: tableState.pageSize,
                    filters: reactTableFiltersToTableResultsFilters(tableState.filtered),
                    sort: reactTableSortToTableResultsSort(tableState.sorted),
                  });

                  if (this.props.onFetchData) {
                    this.props.onFetchData(tableState);
                  }
                }}
                {...staticTableProps}
                {...(
                  getReactTableProps
                    ? getReactTableProps({
                      loading, data, refetch, ...otherArgs,
                    })
                    : {}
                  )
                }
              />
              {
                renderAdditionalContent
                  ? renderAdditionalContent({
                    loading, data, refetch, ...otherArgs,
                  })
                  : null
                }
            </div>
          )}
        </Query>
      </div>
    );
  }
}

export default GraphQLReactTable;
