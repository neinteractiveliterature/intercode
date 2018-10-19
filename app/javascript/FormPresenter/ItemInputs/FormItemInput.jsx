import React from 'react';
import PropTypes from 'prop-types';

import DateItemInput from './DateItemInput';
import EventEmailInput from './EventEmailInput';
import FreeTextItemInput from './FreeTextItemInput';
import MultipleChoiceItemInput from './MultipleChoiceItemInput';
import RegistrationPolicyItemInput from './RegistrationPolicyItemInput';
import StaticTextItem from '../StaticTextItem';
import TimeblockPreferenceItemInput from './TimeblockPreferenceItemInput';
import TimespanItemInput from './TimespanItemInput';

class FormItemInput extends React.Component {
  static propTypes = {
    formItem: PropTypes.shape({
      itemType: PropTypes.string.isRequired,
      identifier: PropTypes.string,
    }).isRequired,
    value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    onChange: PropTypes.func,
    onInteract: PropTypes.func,
    valueInvalid: PropTypes.bool,
    convention: PropTypes.shape({
      starts_at: PropTypes.string.isRequired,
      ends_at: PropTypes.string.isRequired,
      timezone_name: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    value: null,
    valueInvalid: false,
    onChange: null,
    onInteract: null,
  };

  shouldComponentUpdate = nextProps => (
    nextProps.value !== this.props.value
      || nextProps.convention !== this.props.convention
      || nextProps.valueInvalid !== this.props.valueInvalid
      || nextProps.formItem !== this.props.formItem
  )

  valueDidChange = (newValue) => {
    this.props.onChange(this.props.formItem.identifier, newValue);
  }

  render = () => {
    const {
      formItem,
      convention,
      value,
      valueInvalid,
      onInteract,
    } = this.props;

    const commonProps = {
      formItem,
      value,
      onInteract,
      valueInvalid,
      onChange: this.valueDidChange,
    };

    switch (formItem.itemType) {
      case 'date':
        return <DateItemInput {...commonProps} />;
      case 'event_email':
        return <EventEmailInput {...commonProps} convention={convention} />;
      case 'free_text':
        return <FreeTextItemInput {...commonProps} />;
      case 'multiple_choice':
        return <MultipleChoiceItemInput {...commonProps} />;
      case 'registration_policy':
        return <RegistrationPolicyItemInput {...commonProps} />;
      case 'static_text':
        return <StaticTextItem {...commonProps} />;
      case 'timeblock_preference':
        return <TimeblockPreferenceItemInput {...commonProps} convention={convention} />;
      case 'timespan':
        return <TimespanItemInput {...commonProps} />;
      default:
        return <div><code>{formItem.identifier}</code></div>;
    }
  }
}

export default FormItemInput;
