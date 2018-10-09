import React from 'react';
import PropTypes from 'prop-types';

import htmlFetch from './htmlFetch';

class NavigationItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string.isRequired,
      http_method: PropTypes.string,
    }).isRequired,
  }

  handleNonGetClick = async () => {
    const response = await htmlFetch(this.props.item.url, {
      method: this.props.item.http_method,
    });

    window.location.href = response.url;
  }

  render = () => {
    const { item } = this.props;

    if (!item.http_method || item.http_method.toLowerCase() === 'get') {
      return <a href={item.url} className="dropdown-item">{item.label}</a>;
    }

    return (
      <button type="button" className="btn-link dropdown-item" onClick={this.handleNonGetClick}>
        {item.label}
      </button>
    );
  }
}

export default NavigationItem;
