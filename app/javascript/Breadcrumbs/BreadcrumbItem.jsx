import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class BreadcrumbItem extends React.PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
  }

  static defaultProps = {
    active: false,
  }

  render = () => {
    if (this.props.active) {
      return (
        <li className="breadcrumb-item active">
          {this.props.children}
        </li>
      );
    }

    return (
      <li className="breadcrumb-item">
        <Link to={this.props.to}>
          {this.props.children}
        </Link>
      </li>
    );
  }
}

export default BreadcrumbItem;
