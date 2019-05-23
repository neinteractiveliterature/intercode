import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function NavigationCollapse({ item, renderNavigationItems }) {
  return (
    <div id="navbarSupportedContent" className="collapse navbar-collapse">
      {item.groups.map((group, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <ul className={classNames('navbar-nav', { 'mr-auto': group.expand })} key={i}>
          {renderNavigationItems(group.items, false)}
        </ul>
      ))}
    </div>
  );
}

NavigationCollapse.propTypes = {
  item: PropTypes.shape({
    groups: PropTypes.arrayOf(PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      expand: PropTypes.bool.isRequired,
    })).isRequired,
  }).isRequired,
  renderNavigationItems: PropTypes.func.isRequired,
};

export default NavigationCollapse;
