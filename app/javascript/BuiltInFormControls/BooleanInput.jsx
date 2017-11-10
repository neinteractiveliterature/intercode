import React from 'react';
import PropTypes from 'prop-types';
import MultipleChoiceInput from './MultipleChoiceInput';

class BooleanInput extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.bool,
  };

  static defaultProps = {
    value: null,
  };

  onChange = (value) => {
    this.props.onChange(value === 'true');
  }

  render = () => {
    const { value, ...otherProps } = this.props;

    return (
      <MultipleChoiceInput
        {...otherProps}
        choices={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
        choiceClassName="form-check-inline"
        value={value != null ? value.toString() : null}
        onChange={this.onChange}
      />
    );
  }
}

export default BooleanInput;
