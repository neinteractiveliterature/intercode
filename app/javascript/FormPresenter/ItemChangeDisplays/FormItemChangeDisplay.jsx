import React from 'react';
import PropTypes from 'prop-types';

import FreeTextItemChangeDisplay from './FreeTextItemChangeDisplay';
import RegistrationPolicyItemChangeDisplay from './RegistrationPolicyItemChangeDisplay';
import AgeRestrictionsItemChangeDisplay from './AgeRestrictionsItemChangeDisplay';
import EventEmailItemChangeDisplay from './EventEmailItemChangeDisplay';
import MultipleChoiceItemChangeDisplay from './MultipleChoiceItemChangeDisplay';
import TimespanItemChangeDisplay from './TimespanItemChangeDisplay';
import DateItemChangeDisplay from './DateItemChangeDisplay';
import TimeblockPreferenceItemChangeDisplay from './TimeblockPreferenceItemChangeDisplay';

function FormItemChangeDisplay({
  formItem, change, convention,
}) {
  const commonProps = {
    formItem,
    change,
  };

  switch (formItem.item_type) {
    case 'age_restrictions':
      return <AgeRestrictionsItemChangeDisplay {...commonProps} />;
    case 'date':
      return <DateItemChangeDisplay {...commonProps} convention={convention} />;
    case 'event_email':
      return <EventEmailItemChangeDisplay {...commonProps} convention={convention} />;
    case 'free_text':
      return <FreeTextItemChangeDisplay {...commonProps} />;
    case 'multiple_choice':
      return <MultipleChoiceItemChangeDisplay {...commonProps} />;
    case 'registration_policy':
      return <RegistrationPolicyItemChangeDisplay {...commonProps} />;
    case 'timeblock_preference':
      return <TimeblockPreferenceItemChangeDisplay {...commonProps} convention={convention} />;
    case 'timespan':
      return <TimespanItemChangeDisplay {...commonProps} />;
    default:
      return <div><code>{formItem.item_type}</code></div>;
  }
}

FormItemChangeDisplay.propTypes = {
  formItem: PropTypes.shape({
    item_type: PropTypes.string.isRequired,
    identifier: PropTypes.string,
  }).isRequired,
  change: PropTypes.shape({
    previous_value: PropTypes.any,
    new_value: PropTypes.any,
  }).isRequired,
  convention: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
};

export default FormItemChangeDisplay;
