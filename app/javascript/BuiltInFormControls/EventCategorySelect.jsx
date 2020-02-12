import React from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';

import BootstrapFormSelect from './BootstrapFormSelect';

function EventCategorySelect({
  eventCategories, label, ...props
}) {
  const categoryOptions = eventCategories
    .map((category) => (
      <option value={category.id.toString()} key={category.id}>{humanize(category.name)}</option>
    ));

  return (
    <BootstrapFormSelect
      label={label || 'Event Category'}
      {...props}
    >
      <option />
      {categoryOptions}
    </BootstrapFormSelect>
  );
}

EventCategorySelect.propTypes = {
  eventCategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  label: PropTypes.string,
};

EventCategorySelect.defaultProps = {
  label: null,
};

export default EventCategorySelect;
