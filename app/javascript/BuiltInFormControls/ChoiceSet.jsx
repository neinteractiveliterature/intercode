import React from 'react';
import PropTypes from 'prop-types';
import BootstrapFormCheckbox from './BootstrapFormCheckbox';

function ChoiceSet(props) {
  const choiceType = props.multiple ? 'checkbox' : 'radio';

  const onChange = (event) => {
    if (props.multiple) {
      if (event.target.checked) {
        props.onChange([...(props.value || []), event.target.value]);
      } else {
        props.onChange((props.value || []).filter((value) => value !== event.target.value));
      }
    } else {
      props.onChange(event.target.value);
    }
  };

  const options = props.choices.map(({ label, value, disabled = false }, index) => (
    <BootstrapFormCheckbox
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      name={props.name}
      type={choiceType}
      className={props.choiceClassName}
      inputClassName={props.inputClassName}
      label={label}
      value={value}
      checked={(
        props.multiple
          ? ((props.value || []).includes(value))
          : props.value === value
      )}
      onChange={onChange}
      disabled={props.disabled || disabled}
    />
  ));

  return (
    <div className={props.containerClassName}>
      {options}
    </div>
  );
}

ChoiceSet.propTypes = {
  name: PropTypes.string,
  choices: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    value: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  }).isRequired).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  ]),
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  containerClassName: PropTypes.string,
  choiceClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
};

ChoiceSet.defaultProps = {
  name: null,
  value: null,
  multiple: false,
  containerClassName: null,
  choiceClassName: null,
  inputClassName: null,
  disabled: false,
  readOnly: false,
};

export default ChoiceSet;
