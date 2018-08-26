import React from 'react';
import PropTypes from 'prop-types';

class MultipleChoiceItemDisplay extends React.PureComponent {
  static propTypes = {
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

  isValueOther = value => !(
    this.props.formItem.properties.choices
      .some(choice => choice.value === value)
  )

  render = () => {
    if (Array.isArray(this.props.value)) {
      const selectedChoiceLabels = this.props.formItem.properties.choices.map((choice) => {
        if (this.props.value.includes(choice.value)) {
          return choice.caption;
        }

        return null;
      }).filter(selectedChoiceLabel => selectedChoiceLabel != null);

      const otherChoiceLabels = this.props.value.filter(this.isValueOther).map(choice => `Other: ${choice}`);

      return [...selectedChoiceLabels, ...otherChoiceLabels].join(', ');
    }

    const selectedChoice = this.props.formItem.properties.choices
      .find(choice => this.props.value === choice.value);

    if (selectedChoice) {
      return selectedChoice.caption;
    }

    return this.props.value;
  }
}

export default MultipleChoiceItemDisplay;
