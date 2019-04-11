import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import DateItemInput from './DateItemInput';
import EventEmailInput from './EventEmailInput';
import FreeTextItemInput from './FreeTextItemInput';
import MultipleChoiceItemInput from './MultipleChoiceItemInput';
import RegistrationPolicyItemInput from './RegistrationPolicyItemInput';
import StaticTextItem from '../StaticTextItem';
import TimeblockPreferenceItemInput from './TimeblockPreferenceItemInput';
import TimespanItemInput from './TimespanItemInput';

function FormItemInput({
  formItem, value, onChange, onInteract, valueInvalid, convention,
}) {
  const valueDidChange = useCallback(
    newValue => onChange(formItem.identifier, newValue),
    [formItem.identifier, onChange],
  );

  const commonProps = {
    formItem: { properties: {}, ...formItem }, // ensure properties object exists
    value,
    onInteract,
    valueInvalid,
    onChange: valueDidChange,
  };

  switch (formItem.item_type) {
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

FormItemInput.propTypes = {
  formItem: PropTypes.shape({
    item_type: PropTypes.string.isRequired,
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

FormItemInput.defaultProps = {
  value: null,
  valueInvalid: false,
  onChange: null,
  onInteract: null,
};

export default React.memo(
  FormItemInput,
  (prevProps, nextProps) => (
    nextProps.value === prevProps.value
      && nextProps.convention === prevProps.convention
      && nextProps.valueInvalid === prevProps.valueInvalid
      && nextProps.formItem === prevProps.formItem
  ),
);
