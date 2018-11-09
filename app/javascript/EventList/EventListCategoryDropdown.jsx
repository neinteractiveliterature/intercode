import React from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import EventCategory from '../EventAdmin/EventCategory';
import PopperDropdown from '../UIComponents/PopperDropdown';

const SORTED_CATEGORIES = [...EventCategory.allCategories]
  .sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }));

const EventListCategoryDropdown = ({ categoryKeys, value, onChange }) => {
  const currentCategories = SORTED_CATEGORIES
    .filter(category => (value || []).includes(category.key));

  let categoryDescription = 'All events';
  if (currentCategories.length === 1) {
    categoryDescription = humanize(currentCategories[0].key);
  } else if (currentCategories.length > 1) {
    categoryDescription = `${currentCategories.length} event types`;
  }

  return (
    <PopperDropdown
      renderReference={({ ref, toggle }) => (
        <button
          type="button"
          className="btn btn-link dropdown-toggle"
          ref={ref}
          onClick={toggle}
          style={{ whiteSpace: 'normal' }}
        >
          {categoryDescription}
        </button>
      )}
      placement="bottom-end"
    >
      <div className="p-2">
        <ChoiceSet
          choices={SORTED_CATEGORIES
            .filter(category => categoryKeys.includes(category.key))
            .map(category => ({
              label: category.name,
              value: category.key,
            }))
          }
          value={value}
          onChange={onChange}
          multiple
        />
      </div>
    </PopperDropdown>
  );
};

EventListCategoryDropdown.propTypes = {
  categoryKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

EventListCategoryDropdown.defaultProps = {
  value: null,
};

export default EventListCategoryDropdown;
