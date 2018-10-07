import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { uniq } from 'lodash';

const ColumnSelectionContext = React.createContext({
  getPossibleColumns: () => [],
  getReactTableProps: () => ({}),
  getVisibleColumnIds: () => [],
  getVisibleColumns: () => [],
  setVisibleColumnIds: () => {},
});

export const ColumnSelectionConsumer = ColumnSelectionContext.Consumer;

@withRouter
export class ColumnSelectionProvider extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    alwaysVisibleColumns: PropTypes.arrayOf(PropTypes.string),
    defaultVisibleColumns: PropTypes.arrayOf(PropTypes.string),
    getPossibleColumns: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  static defaultProps = {
    alwaysVisibleColumns: null,
    defaultVisibleColumns: null,
  }

  getVisibleColumnIds = () => {
    const alwaysVisibleColumns = this.props.alwaysVisibleColumns || [];

    const params = new URLSearchParams(this.props.history.location.search);
    if (params.get('columns')) {
      return uniq([...alwaysVisibleColumns, ...params.get('columns').split(',')]);
    }

    if (this.props.defaultVisibleColumns != null) {
      return uniq([...alwaysVisibleColumns, ...this.props.defaultVisibleColumns]);
    }

    return this.props.getPossibleColumns().map(column => column.id);
  }

  getVisibleColumns = () => {
    const visibleColumnIds = this.getVisibleColumnIds();
    return this.props.getPossibleColumns()
      .filter(column => visibleColumnIds.includes(column.id));
  }

  getReactTableProps = () => ({
    columns: this.getVisibleColumns(),
  })

  setVisibleColumnIds = (columnIds) => {
    const params = new URLSearchParams(this.props.history.location.search);
    params.set('columns', columnIds.join(','));
    this.props.history.replace(`${this.props.history.location.pathname}?${params.toString()}`);
  }

  render = () => (
    <ColumnSelectionContext.Provider
      value={{
        alwaysVisibleColumns: this.props.alwaysVisibleColumns || [],
        getPossibleColumns: this.props.getPossibleColumns,
        getReactTableProps: this.getReactTableProps,
        getVisibleColumnIds: this.getVisibleColumnIds,
        getVisibleColumns: this.getVisibleColumns,
        setVisibleColumnIds: this.setVisibleColumnIds,
      }}
    >
      {this.props.children}
    </ColumnSelectionContext.Provider>
  )
}
