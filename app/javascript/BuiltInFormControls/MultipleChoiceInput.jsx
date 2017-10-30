import React from 'react';
import PropTypes from 'prop-types';
import BootstrapFormCheckbox from './BootstrapFormCheckbox';

class MultipleChoiceInput extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    choices: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    ]),
    onChange: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    choiceClassName: PropTypes.string,
  };

  static defaultProps = {
    value: null,
    multiple: false,
    choiceClassName: null,
  };

  onChange = (event) => {
    if (this.props.multiple) {
      if (event.target.checked) {
        this.props.onChange([...this.props.value, event.target.value]);
      } else {
        this.props.onChange(this.props.value.filter(value => value !== event.target.value));
      }
    } else {
      this.props.onChange(event.target.value);
    }
  }

  render = () => {
    const choiceType = this.props.multiple ? 'checkbox' : 'radio';

    const options = this.props.choices.map(({ label, value }) => (
      <BootstrapFormCheckbox
        key={`${this.props.name}_${value}`}
        name={this.props.name}
        type={choiceType}
        className={this.props.choiceClassName}
        label={label}
        value={value}
        checked={this.props.value === value}
        onChange={this.onChange}
      />
    ));

    return (
      <fieldset className="form-group">
        <legend className="col-form-legend">{this.props.caption}</legend>
        {options}
      </fieldset>
    );
  }
}

export default MultipleChoiceInput;
