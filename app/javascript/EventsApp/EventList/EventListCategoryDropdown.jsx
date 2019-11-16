import React from 'react';
import PropTypes from 'prop-types';
import { pluralize } from 'inflected';

import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';
import PopperDropdown from '../../UIComponents/PopperDropdown';
import { Transforms } from '../../ComposableFormUtils';

const EventListCategoryDropdown = ({ eventCategories, value, onChange }) => {
  const currentCategories = eventCategories
    .filter((category) => (value || []).includes(category.id));

  let categoryDescription = 'All event types';
  if (currentCategories.length === 1) {
    categoryDescription = pluralize(currentCategories[0].name);
  } else if (currentCategories.length > 1 && currentCategories.length < eventCategories.length) {
    categoryDescription = `${currentCategories.length} event types`;
  }

  const sortedCategories = [...eventCategories].sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }));
  const choiceSetValue = (
    (value || []).length > 0
      ? value.map((id) => id.toString())
      : eventCategories.map((c) => c.id.toString())
  );

  return (
    <PopperDropdown
      renderReference={({ ref, toggle }) => (
        <button
          type="button"
          className="btn btn-link dropdown-toggle"
          ref={ref}
          onClick={toggle}
        >
          {categoryDescription}
        </button>
      )}
      placement="bottom-end"
    >
      <div className="p-2">
        <ChoiceSet
          choices={sortedCategories
            .map((category) => ({
              label: category.name,
              value: category.id.toString(),
            }))}
          value={choiceSetValue}
          onChange={(integerArray) => { onChange(integerArray.map(Transforms.integer)); }}
          multiple
        />
      </div>
    </PopperDropdown>
  );
};

EventListCategoryDropdown.propTypes = {
  eventCategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
};

EventListCategoryDropdown.defaultProps = {
  value: null,
};

export default EventListCategoryDropdown;
