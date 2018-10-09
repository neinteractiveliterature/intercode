import React from 'react';
import PropTypes from 'prop-types';

import NavigationItem from './NavigationItem';
import PopperDropdown from '../UIComponents/PopperDropdown';

class NavigationSection extends React.PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      label: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    }).isRequired,
  }

  render = () => {
    if (!this.props.item.items || this.props.item.items.length === 0) {
      return null;
    }

    return (
      <PopperDropdown
        renderReference={({ ref, toggle }) => (
          <li className="nav-item dropdown" role="presentation" ref={ref}>
            <button className="btn btn-link nav-link dropdown-toggle" onClick={toggle} type="button">{this.props.item.label}</button>
          </li>
        )}
      >
        {this.props.item.items.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <NavigationItem item={item} key={i} />
        ))}
      </PopperDropdown>
    );
  }
}

export default NavigationSection;
