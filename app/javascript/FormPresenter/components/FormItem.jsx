import React from 'react';
import PropTypes from 'prop-types';
import DateItem from './DateItem';
import FreeTextItem from './FreeTextItem';
import MultipleChoiceItem from './MultipleChoiceItem';
import RegistrationPolicyItem from './RegistrationPolicyItem';
import StaticTextItem from './StaticTextItem';
import TimeblockPreferenceItem from './TimeblockPreferenceItem';
import TimespanItem from './TimespanItem';

const FormItem = ({
  formItem, convention, value, onChange, valueInvalid, onInteract,
}) => {
  const valueDidChange = (newValue) => {
    onChange(formItem.identifier, newValue);
  };
  const commonProps = {
    formItem,
    value,
    onInteract,
    valueInvalid,
    onChange: valueDidChange,
  };

  switch (formItem.itemType) {
    case 'date':
      return <DateItem {...commonProps} />;
    case 'free_text':
      return <FreeTextItem {...commonProps} />;
    case 'multiple_choice':
      return <MultipleChoiceItem {...commonProps} />;
    case 'registration_policy':
      return <RegistrationPolicyItem {...commonProps} />;
    case 'static_text':
      return <StaticTextItem {...commonProps} />;
    case 'timeblock_preference':
      return <TimeblockPreferenceItem {...commonProps} convention={convention} />;
    case 'timespan':
      return <TimespanItem {...commonProps} />;
    default:
      return <div><code>{formItem.identifier}</code></div>;
  }
};

FormItem.propTypes = {
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

FormItem.defaultProps = {
  value: null,
  onChange: null,
};

export default FormItem;
