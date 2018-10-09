import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import RootNavigationGroupItem from './RootNavigationGroupItem';

class NavigationCollapse extends React.PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      groups: PropTypes.arrayOf(PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
        expand: PropTypes.bool.isRequired,
      })).isRequired,
    }).isRequired,
  }

  render = () => (
    <div id="navbarSupportedContent" className="collapse navbar-collapse">
      {this.props.item.groups.map((group, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <ul className={classNames('navbar-nav', { 'mr-auto': group.expand })} key={i}>
          {group.items.map((item, j) => (
            // eslint-disable-next-line react/no-array-index-key
            <RootNavigationGroupItem key={j} item={item} />
          ))}
        </ul>
      ))}
    </div>
  )
}

export default NavigationCollapse;
