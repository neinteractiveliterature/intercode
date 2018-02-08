import React from 'react';
import PropTypes from 'prop-types';
import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';

function stringifyOption(option) {
  if (typeof option === 'number') {
    return option.toString(10);
  }

  return option;
}

class EnumFilter extends React.Component {
  static propTypes = {
    filter: PropTypes.shape({
      name: PropTypes.string.isRequired,
      select_options: PropTypes.arrayOf((
        PropTypes.oneOfType([
          PropTypes.arrayOf((
            PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
          )),
          PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        ]).isRequired
      )).isRequired,
    }).isRequired,
    value: PropTypes.arrayOf(PropTypes.string),
    filterValueDidChange: PropTypes.func.isRequired,
  };

  onChange = (newValue) => {
    this.props.filterValueDidChange(this.props.filter.name, newValue);
  }

  render = () => {
    const {
      filter: {
        name,
        select_options: selectOptions,
      },
    } = this.props;

    const choices = selectOptions.map((option) => {
      if (Array.isArray(option)) {
        return { label: stringifyOption(option[0]), value: stringifyOption(option[1]) };
      }

      const stringOption = stringifyOption(option);
      return { label: stringOption, value: stringOption };
    });
    choices.sort((choice1, choice2) => (
      choice1.label.localeCompare(choice2.label, { sensitivity: 'base' })
    ));

    return (
      <ChoiceSet
        name={name}
        multiple
        choices={choices}
        choiceClassName="form-check-inline"
        value={this.props.value}
        onChange={this.onChange}
      />
    );
  }
}

export default EnumFilter;
