import React from 'react';
import PropTypes from 'prop-types';

import { sortByLocaleString } from '../ValueUtils';
import NavigationSection from './NavigationSection';
import NavigationItem from './NavigationItem';

function GeneratedNavigationSection({ label, items }) {
  const sortedItems = sortByLocaleString(items, (item) => (item || {}).label || '');

  if (items.some((item) => item)) {
    return (
      <NavigationSection label={label}>
        {sortedItems.map((item) => item && (
          <NavigationItem
            inSection
            key={`${item.label}-${item.url}`}
            label={item.label}
            url={item.url}
            icon={item.icon}
          />
        ))}
      </NavigationSection>
    );
  }

  return null;
}

GeneratedNavigationSection.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
    PropTypes.bool,
  ])).isRequired,
};

export default GeneratedNavigationSection;
