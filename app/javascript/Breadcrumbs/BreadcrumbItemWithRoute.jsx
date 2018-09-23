import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import BreadcrumbItem from './BreadcrumbItem';

class BreadcrumbItemWithRoute extends React.Component {
  static propTypes = {
    active: PropTypes.func,
    children: PropTypes.node.isRequired,
    exact: PropTypes.bool,
    path: PropTypes.string.isRequired,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  }

  static defaultProps = {
    active: null,
    exact: false,
  }

  buildActive = (routeProps) => {
    if (this.props.active) {
      return this.props.active(routeProps);
    }

    return routeProps.match != null;
  }

  buildToString = (routeProps) => {
    if (typeof this.props.to === 'string') {
      return this.props.to;
    }

    return this.props.to(routeProps);
  }

  render = () => (
    <Route path={this.props.path} exact={this.props.exact}>
      {routeProps => (
        <BreadcrumbItem to={this.buildToString(routeProps)} active={this.buildActive(routeProps)}>
          {this.props.children}
        </BreadcrumbItem>
      )}
    </Route>
  )
}

export default BreadcrumbItemWithRoute;
