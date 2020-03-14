import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import FormGroupWithLabel from './FormGroupWithLabel';

function SelectWithLabel({ label, helpText, ...otherProps }) {
  return (
    <FormGroupWithLabel label={label} name={otherProps.name} helpText={helpText}>
      {(id) => <Select inputId={id} {...otherProps} />}
    </FormGroupWithLabel>
  );
}

SelectWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  helpText: PropTypes.node,
};

SelectWithLabel.defaultProps = {
  helpText: null,
};

export default SelectWithLabel;
