import React from 'react';
import PropTypes from 'prop-types';

function castValue(value) {
  if (value == null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((item) => castValue(item));
  }

  return value.toString();
}

function MultipleChoiceItemDisplay({ formItem, value: uncastValue }) {
  const value = castValue(uncastValue);
  const isValueOther = (v) => !(formItem.properties.choices.some((choice) => choice.value === v));

  if (Array.isArray(value)) {
    const selectedChoiceLabels = formItem.properties.choices.map((choice) => {
      if (value.includes(choice.value)) {
        return choice.caption;
      }

      return null;
    }).filter((selectedChoiceLabel) => selectedChoiceLabel != null);

    const otherChoiceLabels = value.filter(isValueOther).map((choice) => `Other: ${choice}`);

    return <>{[...selectedChoiceLabels, ...otherChoiceLabels].join(', ')}</>;
  }

  const selectedChoice = formItem.properties.choices
    .find((choice) => value === choice.value);

  if (selectedChoice) {
    return <>{selectedChoice.caption}</>;
  }

  return <>{value}</>;
}

MultipleChoiceItemDisplay.propTypes = {
  formItem: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      choices: PropTypes.arrayOf(PropTypes.shape({
        caption: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }).isRequired).isRequired,
    }).isRequired,
  }).isRequired,
  value: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default MultipleChoiceItemDisplay;
