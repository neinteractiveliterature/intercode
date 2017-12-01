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
    value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
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

    let typecastValue;
    if (isMultiple) {
      typecastValue = (this.props.value || []).map(singleValue => singleValue.toString());
    } else if (this.props.value != null) {
      typecastValue = this.props.value.toString();
    } else {
      typecastValue = null;
    }

    return (
      <fieldset className="form-group">
        <CaptionLegend formItem={this.props.formItem} />
        <ChoiceSet
          name={this.props.formItem.identifier}
          choices={choicesForChoiceSet}
          value={typecastValue}
          onChange={this.props.onChange}
          multiple={isMultiple}
          choiceClassName={choiceClassName}
        />
      </fieldset>
    );
  };
}

export default MultipleChoiceItem;
