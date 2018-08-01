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
    getReactTableProps: PropTypes.func,
    query: PropTypes.shape({}).isRequired,
    renderAdditionalContent: PropTypes.func,
  };

  static defaultProps = {
    children: null,
    exportUrl: null,
    getReactTableProps: null,
    renderAdditionalContent: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      sorted: [],
      filtered: [],
    };
  }

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
                filtered: this.state.filtered,
                sorted: this.state.sorted,
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
      query,
      renderAdditionalContent,
      ...staticTableProps
    } = this.props;

    return (
      <div>
        {this.renderExportButton()}
        <Query query={query}>
          {({
            loading, data, refetch, ...otherArgs
          }) => (
            <div>
              <ReactTable
                manual
                filterable
                sorted={this.state.sorted}
                filtered={this.state.filtered}
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
