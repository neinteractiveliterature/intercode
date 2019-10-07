import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export function RootNavigationGroup({ expand, children }) {
  return (
    <ul className={classNames('navbar-nav', { 'mr-auto': expand })}>
      {children}
    </ul>
  );
}

RootNavigationGroup.propTypes = {
  expand: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

function NavigationCollapse({ item, renderNavigationItems, children }) {
  return (
    <div id="navbarSupportedContent" className="collapse navbar-collapse">
      {item.groups.map((group, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <RootNavigationGroup expand={group.expand} key={i}>
          {renderNavigationItems(group.items, false)}
        </RootNavigationGroup>
      ))}
    </div>
  );
}

NavigationCollapse.propTypes = {
  children: PropTypes.node.isRequired,
  item: PropTypes.shape({
    groups: PropTypes.arrayOf(PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      expand: PropTypes.bool.isRequired,
    })).isRequired,
  }).isRequired,
  renderNavigationItems: PropTypes.func.isRequired,
};

export default NavigationCollapse;
