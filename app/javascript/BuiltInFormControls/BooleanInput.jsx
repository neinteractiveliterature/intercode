import React from 'react';
import PropTypes from 'prop-types';
import MultipleChoiceInput from './MultipleChoiceInput';

function BooleanInput({ value, onChange, ...otherProps }) {
  return (
    <MultipleChoiceInput
      {...otherProps}
      choices={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
      choiceClassName="form-check-inline"
      value={value != null ? value.toString() : null}
      onChange={(newValue) => onChange(newValue === 'true')}
    />
  );
}

BooleanInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
};

BooleanInput.defaultProps = {
  value: null,
};

export default BooleanInput;
