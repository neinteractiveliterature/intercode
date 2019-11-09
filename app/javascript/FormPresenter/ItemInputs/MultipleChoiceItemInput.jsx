import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CaptionLegend from './CaptionLegend';
import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';

const OTHER_VALUE = '_OTHER_VALUE';

function castSingleValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0].toString() : null;
  }

  if (value == null) {
    return null;
  }

  return value.toString();
}

function castMultipleValue(value) {
  let arrayValue;

  if (Array.isArray(value)) {
    arrayValue = value;
  } else if (value == null) {
    arrayValue = [];
  } else {
    arrayValue = [value];
  }

  return arrayValue.map((item) => item.toString());
}

class MultipleChoiceItemInput extends React.Component {
  constructor(props) {
    super(props);

    let otherValue = '';
    if (this.isOtherSelected()) {
      if (this.isMultiple()) {
        const choiceValues = this.props.formItem.properties.choices.map((choice) => choice.value);
        otherValue = castMultipleValue(this.props.value).find((
          (selectedChoiceValue) => !choiceValues.includes(selectedChoiceValue)
        ));
      } else {
        otherValue = castSingleValue(this.props.value);
      }
    }

    this.state = { otherValue };
  }

  onChange = (newValue) => {
    this.userDidInteract();

    if (this.isMultiple()) {
      const choiceValues = this.props.formItem.properties.choices.map((choice) => choice.value);
      const providedValues = newValue
        .filter((choiceValue) => choiceValues
          .some((providedValue) => providedValue === choiceValue));
      if (newValue.includes(OTHER_VALUE)) {
        this.props.onChange([...providedValues, this.state.otherValue]);
      } else {
        this.props.onChange(providedValues);
      }
    } else if (newValue === OTHER_VALUE) {
      this.props.onChange(this.state.otherValue);
    } else {
      this.props.onChange(newValue);
    }
  }

  getValueForChoiceSet = () => {
    if (this.isMultiple()) {
      const typecastValue = castMultipleValue(this.props.value);
      if (this.isOtherSelected()) {
        typecastValue.push(OTHER_VALUE);
      }

      return typecastValue;
    }

    if (this.isOtherSelected()) {
      return OTHER_VALUE;
    }

    return castSingleValue(this.props.value);
  }

  isMultiple = () => ['checkbox_horizontal', 'checkbox_vertical'].includes(this.props.formItem.properties.style)

  isOtherSelected = () => {
    if (!this.props.formItem.properties.other) {
      return false;
    }

    const choiceValues = this.props.formItem.properties.choices.map((choice) => choice.value);

    if (this.isMultiple()) {
      return !castMultipleValue(this.props.value).every((
        (selectedChoiceValue) => choiceValues.includes(selectedChoiceValue)
      ));
    }

    return this.props.value != null && !choiceValues.includes(this.props.value);
  }

  userDidInteract = () => {
    this.props.onInteract(this.props.formItem.identifier);
  }

  otherValueDidChange = (event) => {
    this.userDidInteract();
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
        aria-label={`${this.props.formItem.properties.other_caption || 'Other'}: please specify`}
        type="text"
        className="form-control"
        value={this.state.otherValue}
        onChange={this.otherValueDidChange}
        placeholder="Please specify"
      />
    );
  }

  render = () => {
    const choicesForChoiceSet = this.props.formItem.properties.choices.map((choice) => ({
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
        <div className={classNames({ 'border-0': !this.props.valueInvalid, 'border rounded border-danger': this.props.valueInvalid })}>
          <CaptionLegend formItem={this.props.formItem} />
          <ChoiceSet
            choices={choicesForChoiceSet}
            value={this.getValueForChoiceSet()}
            onChange={this.onChange}
            multiple={this.isMultiple()}
            choiceClassName={classNames({
              'form-check-inline': ['radio_horizontal', 'checkbox_horizontal'].includes(this.props.formItem.properties.style),
            })}
          />
          {this.renderOtherInput()}
          {
            this.props.valueInvalid
              ? (
                <span className="text-danger">
                  This field is required.
                </span>
              )
              : null
          }
        </div>
      </fieldset>
    );
  };
}

MultipleChoiceItemInput.propTypes = {
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
  onInteract: PropTypes.func.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  valueInvalid: PropTypes.bool,
};

MultipleChoiceItemInput.defaultProps = {
  value: null,
  valueInvalid: false,
};

export default MultipleChoiceItemInput;
