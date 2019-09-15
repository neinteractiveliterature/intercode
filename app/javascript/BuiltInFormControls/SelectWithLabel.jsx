import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import FormGroupWithLabel from './FormGroupWithLabel';

function SelectWithLabel({ label, ...otherProps }) {
  return (
    <FormGroupWithLabel label={label} name={otherProps.name}>
      {(id) => <Select inputId={id} {...otherProps} />}
    </FormGroupWithLabel>
  );
}

SelectWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

export default SelectWithLabel;
