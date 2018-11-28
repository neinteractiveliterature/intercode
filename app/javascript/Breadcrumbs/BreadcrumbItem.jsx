import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class BreadcrumbItem extends React.PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
    pageTitleIfActive: PropTypes.string,
  }

  static defaultProps = {
    active: false,
    pageTitleIfActive: null,
  }

  componentDidMount = () => {
    if (this.props.active && this.props.pageTitleIfActive) {
      window.document.title = this.props.pageTitleIfActive;
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.active && this.props.pageTitleIfActive) {
      window.document.title = this.props.pageTitleIfActive;
    }
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
