import React from 'react';
import PropTypes from 'prop-types';
import CaptionLegend from './CaptionLegend';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';

const OTHER_VALUE = '_OTHER_VALUE';

class MultipleChoiceItem extends React.Component {
  static propTypes = {
    formItem: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      properties: PropTypes.shape({
        style: PropTypes.string,
        caption: PropTypes.string.isRequired,
        multiple: PropTypes.bool,
        choices: PropTypes.arrayOf(PropTypes.shape({
          caption: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }).isRequired).isRequired,
        other: PropTypes.bool,
        other_caption: PropTypes.string,
      }).isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    value: null,
  };

  constructor(props) {
    super(props);

    let otherValue = '';
    if (this.isOtherSelected()) {
      if (this.isMultiple()) {
        const choiceValues = this.props.formItem.properties.choices.map(choice => choice.value);
        otherValue = this.props.value.find((
          selectedChoiceValue => !choiceValues.includes(selectedChoiceValue)
        ));
      } else {
        otherValue = this.props.value;
      }
    }

    this.state = { otherValue };
  }

  onChange = (newValue) => {
    if (this.props.formItem.properties.multiple) {
      const actualValue = newValue.filter(choiceValue => choiceValue !== OTHER_VALUE);
      if (newValue.includes(OTHER_VALUE)) {
        actualValue.push(this.state.otherValue);
      }
      this.props.onChange(actualValue);
    } else if (newValue === OTHER_VALUE) {
      this.props.onChange(this.state.otherValue);
    } else {
      this.props.onChange(newValue);
    }
  }

  getValueForChoiceSet = () => {
    if (this.isMultiple()) {
      const typecastValue = (this.props.value || []).map(singleValue => singleValue.toString());
      if (this.isOtherSelected()) {
        typecastValue.push(OTHER_VALUE);
      }

      return typecastValue;
    } else if (this.isOtherSelected()) {
      return OTHER_VALUE;
    } else if (this.props.value != null) {
      return this.props.value.toString();
    }

    return null;
  }

  isMultiple = () => ['checkbox_horizontal', 'checkbox_vertical'].includes(this.props.formItem.properties.style)

  isOtherSelected = () => {
    if (!this.props.formItem.properties.other) {
      return false;
    }

    const choiceValues = this.props.formItem.properties.choices.map(choice => choice.value);

    if (this.props.formItem.properties.multiple) {
      return !this.props.value.every((
        selectedChoiceValue => choiceValues.includes(selectedChoiceValue)
      ));
    }

    return this.props.value != null && !choiceValues.includes(this.props.value);
  }

  otherValueDidChange = (event) => {
    this.setState(
      { otherValue: event.target.value },
      () => this.onChange(this.getValueForChoiceSet()), // recalculate value
    );
  }

  renderOtherInput = () => {
    if (!this.isOtherSelected()) {
      return null;
    }

    return (
      <input
        type="text"
        className="form-control"
        value={this.state.otherValue}
        onChange={this.otherValueDidChange}
        placeholder="Please specify"
      />
    );
  }

  render = () => {
    const choiceClassName = (
      ['radio_horizontal', 'checkbox_horizontal'].includes(this.props.formItem.properties.style) ?
        'form-check-inline' :
        null
    );

    const choicesForChoiceSet = this.props.formItem.properties.choices.map(choice => ({
      label: choice.caption,
      value: choice.value,
    }));

    if (this.props.formItem.properties.other) {
      const otherCaption = this.props.formItem.properties.other_caption || 'Other';
      choicesForChoiceSet.push({
        label: otherCaption,
        value: OTHER_VALUE,
      });
    }

    return (
      <fieldset className="form-group">
        <CaptionLegend formItem={this.props.formItem} />
        <ChoiceSet
          name={this.props.formItem.identifier}
          choices={choicesForChoiceSet}
          value={this.getValueForChoiceSet()}
          onChange={this.onChange}
          multiple={this.isMultiple()}
          choiceClassName={choiceClassName}
        />
        {this.renderOtherInput()}
      </fieldset>
    );
  };
}

export default MultipleChoiceItem;
