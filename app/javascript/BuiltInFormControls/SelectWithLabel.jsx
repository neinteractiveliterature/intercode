import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import FormGroupWithLabel from './FormGroupWithLabel';

function SelectWithLabel({ label, ...otherProps }) {
  return (
    <FormGroupWithLabel label={label} name={otherProps.name}>
      { /* eslint-disable-next-line react/jsx-props-no-spreading */ }
      {(id) => <Select inputId={id} {...otherProps} />}
    </FormGroupWithLabel>
  );
}

SelectWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

export default SelectWithLabel;
