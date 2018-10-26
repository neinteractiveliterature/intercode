import React from 'react';
import PropTypes from 'prop-types';
import { pluralize } from 'inflected';
import arrayToSentence from 'array-to-sentence';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import EventCategory from '../EventAdmin/EventCategory';
import PopperDropdown from '../UIComponents/PopperDropdown';

const SORTED_CATEGORIES = [...EventCategory.allCategories]
  .sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }));

function downcaseFirst(string) {
  if (!string) {
    return string;
  }

  return `${string[0].toLowerCase()}${string.slice(1)}`;
}

const EventListCategoryDropdown = ({ categoryKeys, value, onChange }) => {
  const currentCategories = SORTED_CATEGORIES
    .filter(category => (value || []).includes(category.key));

  return (
    <PopperDropdown
      renderReference={({ ref, toggle }) => (
        <button
          type="button"
          className="btn btn-outline-primary dropdown-toggle"
          ref={ref}
          onClick={toggle}
          style={{ whiteSpace: 'normal' }}
        >
          Showing
          {' '}
          {currentCategories.length > 0
            ? arrayToSentence(
              currentCategories.map(category => downcaseFirst(pluralize(category.name))),
            )
            : 'all events'}
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
