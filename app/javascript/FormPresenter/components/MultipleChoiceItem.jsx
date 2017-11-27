import React from 'react';
import PropTypes from 'prop-types';
import CaptionLegend from './CaptionLegend';
import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';

class MultipleChoiceItem extends React.Component {
  static propTypes = {
    formItem: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      properties: PropTypes.shape({
        style: PropTypes.string,
        caption: PropTypes.string.isRequired,
        choices: PropTypes.arrayOf(PropTypes.shape({
          caption: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }).isRequired).isRequired,
      }).isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    ]),
  };

  static defaultProps = {
    value: null,
  };

  render = () => {
    const isMultiple = ['checkbox_vertical', 'checkbox_horizontal'].includes(this.props.formItem.properties.style);
    const choiceClassName = (
      ['radio_horizontal', 'checkbox_horizontal'].includes(this.props.formItem.properties.style) ?
        'form-check-inline' :
        null
    );

    const choicesForChoiceSet = this.props.formItem.properties.choices.map(choice => ({
      label: choice.caption,
      value: choice.value,
    }));

    return (
      <fieldset className="form-group">
        <CaptionLegend formItem={this.props.formItem} />
        <ChoiceSet
          name={this.props.formItem.identifier}
          choices={choicesForChoiceSet}
          value={this.props.value}
          onChange={this.props.onChange}
          multiple={isMultiple}
          choiceClassName={choiceClassName}
        />
      </fieldset>
    );
  };
}

export default MultipleChoiceItem;
