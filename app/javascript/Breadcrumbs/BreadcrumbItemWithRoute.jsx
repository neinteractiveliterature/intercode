import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import BreadcrumbItem from './BreadcrumbItem';

class BreadcrumbItemWithRoute extends React.Component {
  static propTypes = {
    active: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    exact: PropTypes.bool,
    path: PropTypes.string.isRequired,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    hideUnlessMatch: PropTypes.bool,
  }

  static defaultProps = {
    active: null,
    exact: false,
    hideUnlessMatch: false,
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

  renderBreadcrumbItem = routeProps => (
    <BreadcrumbItem
      to={this.buildToString(routeProps)}
      active={this.buildActive(routeProps)}
    >
      {
        typeof this.props.children === 'function'
          ? this.props.children(routeProps)
          : this.props.children
      }
    </BreadcrumbItem>
  )

  render = () => {
    const routeRenderingProps = {};
    if (this.props.hideUnlessMatch) {
      routeRenderingProps.render = this.renderBreadcrumbItem;
    } else {
      routeRenderingProps.children = this.renderBreadcrumbItem;
    }

    return <Route path={this.props.path} exact={this.props.exact} {...routeRenderingProps} />;
  }
}

export default BreadcrumbItemWithRoute;
