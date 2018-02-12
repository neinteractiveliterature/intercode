import React from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';
import EnumFilter from './EnumFilter';
import IntegerFilter from './IntegerFilter';
import StringFilter from './StringFilter';

function isBlank(value) {
  if (value == null) {
    return true;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
}

class DatagridFilters extends React.Component {
  static propTypes = {
    filters: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      form_builder_helper_name: PropTypes.string.isRequired,
      options: PropTypes.shape({
        checkboxes: PropTypes.bool,
        multiple: PropTypes.bool,
      }).isRequired,
      header: PropTypes.string,
    })).isRequired,
    showCollapsed: PropTypes.arrayOf(PropTypes.string).isRequired,
    initialFilterValues: PropTypes.shape({}),
    initialExpanded: PropTypes.bool,
    paramKey: PropTypes.string.isRequired,
  };

  static defaultProps = {
    initialFilterValues: {},
    initialExpanded: false,
  };

  constructor(props) {
    super(props);

    const filterValues = (this.props.initialFilterValues || {});

    this.state = {
      collapsed: !this.props.initialExpanded,
      filterValues,
    };
  }

  toggleCollapsed = () => { this.setState({ collapsed: !this.state.collapsed }); }

  filterValueDidChange = (name, value) => {
    this.setState({ filterValues: { ...this.state.filterValues, [name]: value } });
  }

  searchClicked = (event) => {
    event.preventDefault();
    const searchUrl = new URL(window.location.href);

    [...searchUrl.searchParams.entries()].forEach(([key]) => {
      if (key.startsWith(`${this.props.paramKey}[`)) {
        searchUrl.searchParams.delete(key);
      }
    });

    [...Object.entries(this.state.filterValues)].forEach(([key, value]) => {
      if (isBlank(value)) {
        return;
      }

      if (Array.isArray(value)) {
        searchUrl.searchParams.append(`${this.props.paramKey}[${key}]`, value.join(','));
      } else {
        searchUrl.searchParams.append(`${this.props.paramKey}[${key}]`, value);
      }
    });

    if (!this.state.collapsed) {
      searchUrl.searchParams.set('expand_filters', 'true');
    } else {
      searchUrl.searchParams.delete('expand_filters');
    }

    window.location.href = searchUrl.toString();
  }

  renderFilterControl = (filter) => {
    const value = this.state.filterValues[filter.name];

    switch (filter.form_builder_helper_name) {
      case 'datagrid_enum_filter':
        return (
          <EnumFilter
            filter={filter}
            value={value}
            filterValueDidChange={this.filterValueDidChange}
          />
        );
      case 'datagrid_integer_filter':
        return (
          <IntegerFilter
            filter={filter}
            value={value}
            filterValueDidChange={this.filterValueDidChange}
          />
        );
      case 'datagrid_string_filter':
        return (
          <StringFilter
            filter={filter}
            value={value}
            filterValueDidChange={this.filterValueDidChange}
          />
        );
      default:
        return <span className="text-danger">Unknown filter type: #{filter.form_builder_helper_name}</span>;
    }
  }

  renderFilterRow = filter => (
    <div className="form-group row" key={filter.name}>
      <div className="col-md-2">{filter.header || humanize(filter.name)}</div>
      <div className="col-md-10">{this.renderFilterControl(filter)}</div>
    </div>
  )

  renderCollapsedFilter = (filter) => {
    if (this.state.filterValues[filter.name]) {
      return (
        <span key={filter.name} className="badge badge-secondary mr-1">
          {filter.header || humanize(filter.name)}
        </span>
      );
    }

    return null;
  }

  renderCollapseControl = () => {
    if (this.props.filters.every(filter => this.props.showCollapsed.includes(filter.name))) {
      return null;
    }

    let caret;

    if (this.state.collapsed) {
      caret = <i className="fa fa-caret-right"><span className="sr-only">Show</span></i>;
    } else {
      caret = <i className="fa fa-caret-down"><span className="sr-only">Hide</span></i>;
    }

    return (
      <button type="button" className="btn mb-2" onClick={this.toggleCollapsed}>
        {caret} Advanced search options
      </button>
    );
  }

  render = () => {
    const uncollapsibleFilters = [];
    const collapsibleFilters = [];
    this.props.filters.forEach((filter) => {
      if ((this.props.showCollapsed || []).includes(filter.name)) {
        uncollapsibleFilters.push(filter);
      } else {
        collapsibleFilters.push(filter);
      }
    });

    return (
      <form className="card" onSubmit={this.searchClicked}>
        <div className="card-header">Search</div>
        <div className="card-body">
          {uncollapsibleFilters.map(this.renderFilterRow)}
          {this.renderCollapseControl()}
          {
            this.state.collapsed ?
            collapsibleFilters.map(this.renderCollapsedFilter) :
            collapsibleFilters.map(this.renderFilterRow)
          }
          <div className="form-group mb-0">
            <input type="submit" className="btn btn-primary" value="Search" />
          </div>
        </div>
      </form>
    );
  }
}

export default DatagridFilters;
