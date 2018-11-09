import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const ReactRouterReactTableContext = React.createContext({
  getReactTableProps: () => ({}),
});

export const ReactRouterReactTableConsumer = ReactRouterReactTableContext.Consumer;

@withRouter
class ReactRouterReactTableProvider extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    decodeFilterValue: PropTypes.func,
    encodeFilterValue: PropTypes.func,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  static defaultProps = {
    decodeFilterValue: null,
    encodeFilterValue: null,
  }

  decodeSearchParams = (search) => {
    const state = {
      page: 0,
      pageSize: 20,
      filtered: [],
      sorted: [],
    };

    const params = new URLSearchParams(search);

    const decodeFilterValue = this.props.decodeFilterValue || ((field, value) => value);

    Array.from(params.entries()).forEach(([key, value]) => {
      if (key === 'page') {
        state.page = Number.parseInt(value, 10) - 1;
        return;
      }

      if (key === 'pageSize') {
        state.pageSize = Number.parseInt(value, 10);
        return;
      }

      const filterMatch = key.match(/^filters\.(.*)$/);
      if (filterMatch) {
        const filterValue = decodeFilterValue(filterMatch[1], value);
        if (filterValue != null) {
          state.filtered.push({
            id: filterMatch[1],
            value: filterValue,
          });
        }
        return;
      }

      const sortMatch = key.match(/^sort\.(.*)$/);
      if (sortMatch) {
        state.sorted.push({ id: sortMatch[1], desc: value === 'desc' });
      }
    });

    return state;
  }

  encodeSearchParams = ({
    page,
    pageSize,
    filtered,
    sorted,
  }, existingQuery) => {
    const params = new URLSearchParams(existingQuery);

    const encodeFilterValue = this.props.encodeFilterValue || ((field, value) => value);

    if (page != null) {
      params.set('page', page + 1);
    }

    if (pageSize != null) {
      if (pageSize === 20) {
        params.delete('pageSize');
      } else {
        params.set('pageSize', pageSize);
      }
    }

    // remove existing filters and sorts rather than just adding on
    [...params.keys()].forEach((key) => {
      if (key.startsWith('filters.') || key.startsWith('sort.')) {
        params.delete(key);
      }
    });

    filtered.forEach(({ id, value }) => {
      const encoded = encodeFilterValue(id, value);
      if (encoded != null) {
        params.set(`filters.${id}`, encoded);
      } else {
        params.delete(`filters.${id}`);
      }
    });

    sorted.forEach(({ id, desc }) => {
      params.set(`sort.${id}`, desc ? 'desc' : 'asc');
    });

    return params.toString();
  }

  updateSearch = (newState) => {
    const oldState = this.decodeSearchParams(this.props.history.location.search);
    const newSearch = this.encodeSearchParams(
      { ...oldState, ...newState },
      this.props.history.location.search,
    );
    this.props.history.replace(`${this.props.history.location.pathname}?${newSearch}`);
  }

  render = () => {
    const tableState = this.decodeSearchParams(this.props.history.location.search);

    return (
      <ReactRouterReactTableContext.Provider
        value={{
          getReactTableProps: () => ({
            page: tableState.page,
            pageSize: tableState.pageSize,
            filtered: tableState.filtered,
            sorted: tableState.sorted,
            onPageChange: (page) => { this.updateSearch({ page }); },
            onPageSizeChange: (pageSize) => { this.updateSearch({ pageSize }); },
            onFilteredChange: (filtered) => { this.updateSearch({ filtered, page: 0 }); },
            onSortedChange: (sorted) => { this.updateSearch({ sorted, page: 0 }); },
          }),
        }}
      >
        {this.props.children}
      </ReactRouterReactTableContext.Provider>
    );
  }
}

export { ReactRouterReactTableProvider };
