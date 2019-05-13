import React from 'react';
import PropTypes from 'prop-types';

import PopperDropdown from '../UIComponents/PopperDropdown';
import RootNavigationGroupItem from './RootNavigationGroupItem';

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
        style={{ zIndex: 1100 }}
      >
        {this.props.item.items.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <RootNavigationGroupItem item={item} key={i} />
        ))}
      </PopperDropdown>
    );
  }
}

export default NavigationSection;
