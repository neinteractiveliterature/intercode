import React, { useMemo, useCallback } from 'react';
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

function MultipleChoiceItemInput({
  formItem, onChange, value, valueInvalid, onInteract,
}) {
  const isMultiple = useMemo(
    () => ['checkbox_horizontal', 'checkbox_vertical'].includes(formItem.properties.style),
    [formItem.properties.style],
  );

  const otherIsSelected = useMemo(
    () => {
      if (!formItem.properties.other) {
        return false;
      }

      const choiceValues = formItem.properties.choices.map((choice) => choice.value);

      if (isMultiple) {
        return !castMultipleValue(value).every((
          (selectedChoiceValue) => choiceValues.includes(selectedChoiceValue)
        ));
      }

      return value != null && !choiceValues.includes(value);
    },
    [formItem.properties.choices, formItem.properties.other, isMultiple, value],
  );

  const otherValue = useMemo(
    () => {
      if (otherIsSelected) {
        if (isMultiple) {
          const choiceValues = formItem.properties.choices.map((choice) => choice.value);
          return castMultipleValue(value).find((
            (selectedChoiceValue) => !choiceValues.includes(selectedChoiceValue)
          ));
        }
        return castSingleValue(value);
      }

      return '';
    },
    [formItem.properties.choices, isMultiple, otherIsSelected, value],
  );

  const choicesForChoiceSet = useMemo(
    () => {
      const providedChoices = formItem.properties.choices.map((choice) => ({
        label: choice.caption,
        value: choice.value,
      }));

      if (formItem.properties.other) {
        const otherCaption = formItem.properties.other_caption || 'Other';
        return [...providedChoices, {
          label: otherCaption,
          value: OTHER_VALUE,
        }];
      }

      return providedChoices;
    },
    [formItem.properties.choices, formItem.properties.other, formItem.properties.other_caption],
  );

  const valueForChoiceSet = useMemo(
    () => {
      if (isMultiple) {
        const typecastValue = castMultipleValue(value);
        if (otherIsSelected) {
          typecastValue.push(OTHER_VALUE);
        }

        return typecastValue;
      }

      if (otherIsSelected) {
        return OTHER_VALUE;
      }

      return castSingleValue(value);
    },
    [isMultiple, otherIsSelected, value],
  );

  const userDidInteract = useCallback(
    () => onInteract(formItem.identifier),
    [formItem.identifier, onInteract],
  );

  const valueDidChange = (newValue) => {
    userDidInteract();

    if (isMultiple) {
      const choiceValues = formItem.properties.choices.map((choice) => choice.value);
      const providedValues = newValue
        .filter((choiceValue) => choiceValues
          .some((providedValue) => providedValue === choiceValue));
      if (newValue.includes(OTHER_VALUE)) {
        onChange([...providedValues, otherValue]);
      } else {
        onChange(providedValues);
      }
    } else if (newValue === OTHER_VALUE) {
      onChange(otherValue);
    } else {
      onChange(newValue);
    }
  };

  const otherValueDidChange = (event) => {
    userDidInteract();
    if (isMultiple) {
      onChange(valueForChoiceSet.map((singleValue) => {
        if (singleValue === OTHER_VALUE) {
          return event.target.value;
        }

        return singleValue;
      }));
    } else {
      onChange(event.target.value);
    }
  };

  const renderOtherInput = () => {
    if (!otherIsSelected) {
      return null;
    }

    return (
      <input
        aria-label={`${formItem.properties.other_caption || 'Other'}: please specify`}
        type="text"
        className="form-control"
        value={otherValue}
        onChange={otherValueDidChange}
        placeholder="Please specify"
      />
    );
  };

  return (
    <fieldset className="form-group">
      <div className={classNames({ 'border-0': !valueInvalid, 'border rounded border-danger': valueInvalid })}>
        <CaptionLegend formItem={formItem} />
        <ChoiceSet
          choices={choicesForChoiceSet}
          value={valueForChoiceSet}
          onChange={valueDidChange}
          multiple={isMultiple}
          choiceClassName={classNames({
            'form-check-inline': ['radio_horizontal', 'checkbox_horizontal'].includes(formItem.properties.style),
          })}
        />
        {renderOtherInput()}
        {
          valueInvalid
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
