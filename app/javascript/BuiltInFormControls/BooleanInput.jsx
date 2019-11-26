import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import MultipleChoiceInput from './MultipleChoiceInput';

function BooleanInput({
  value, onChange, trueLabel, falseLabel, falseBeforeTrue, ...otherProps
}) {
  const choices = useMemo(
    () => {
      const workingChoices = [
        { label: trueLabel || 'Yes', value: 'true' },
        { label: falseLabel || 'No', value: 'false' },
      ];

      if (falseBeforeTrue) {
        workingChoices.reverse();
      }

      return workingChoices;
    },
    [falseBeforeTrue, falseLabel, trueLabel],
  );

  return (
    <MultipleChoiceInput
      {...otherProps}
      choices={choices}
      choiceClassName="form-check-inline"
      value={value != null ? value.toString() : null}
      onChange={(newValue) => onChange(newValue === 'true')}
    />
  );
}

BooleanInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
  trueLabel: PropTypes.string,
  falseLabel: PropTypes.string,
  falseBeforeTrue: PropTypes.bool,
};

BooleanInput.defaultProps = {
  value: null,
  trueLabel: null,
  falseLabel: null,
  falseBeforeTrue: false,
};

export default BooleanInput;
