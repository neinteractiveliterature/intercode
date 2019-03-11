import React from 'react';
import PropTypes from 'prop-types';

import ChoiceSetFilter from './ChoiceSetFilter';

function getBooleanFilterValue(filter) {
  if (filter == null || filter.value == null) {
    return 'any';
  }

  if (filter.value) {
    return 'true';
  }

  return 'false';
}

function BooleanChoiceSetFilter({ filter, onChange, ...otherProps }) {
  return (
    <ChoiceSetFilter
      choices={[
        { label: 'any', value: 'any' },
        { label: 'yes', value: 'true' },
        { label: 'no', value: 'false' },
      ]}
      multiple={false}
      onChange={(value) => { onChange(value === 'any' ? null : value === 'true'); }}
      filter={{ ...filter, value: getBooleanFilterValue(filter) }}
      {...otherProps}
    />
  );
}

BooleanChoiceSetFilter.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.bool,
  }),
  onChange: PropTypes.func.isRequired,
};

BooleanChoiceSetFilter.defaultProps = {
  filter: null,
};

export default BooleanChoiceSetFilter;
