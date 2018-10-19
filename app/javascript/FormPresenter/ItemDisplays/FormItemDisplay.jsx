import React from 'react';
import PropTypes from 'prop-types';

import DateItemDisplay from './DateItemDisplay';
import EventEmailDisplay from './EventEmailDisplay';
import FreeTextItemDisplay from './FreeTextItemDisplay';
import MultipleChoiceItemDisplay from './MultipleChoiceItemDisplay';
import RegistrationPolicyItemDisplay from './RegistrationPolicyItemDisplay';
import StaticTextItem from '../StaticTextItem';
import TimeblockPreferenceItemDisplay from './TimeblockPreferenceItemDisplay';
import TimespanItemDisplay from './TimespanItemDisplay';

class FormItemDisplay extends React.PureComponent {
  static propTypes = {
    formItem: PropTypes.shape({
      itemType: PropTypes.string.isRequired,
      identifier: PropTypes.string,
    }).isRequired,
    value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    convention: PropTypes.shape({
      starts_at: PropTypes.string.isRequired,
      ends_at: PropTypes.string.isRequired,
      timezone_name: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    value: null,
  };

  render = () => {
    const {
      formItem,
      convention,
      value,
    } = this.props;

    const commonProps = {
      formItem,
      value,
    };

    if (value == null) {
      return null;
    }

    switch (formItem.itemType) {
      case 'date':
        return <DateItemDisplay {...commonProps} convention={convention} />;
      case 'event_email':
        return <EventEmailDisplay {...commonProps} convention={convention} />;
      case 'free_text':
        return <FreeTextItemDisplay {...commonProps} />;
      case 'multiple_choice':
        return <MultipleChoiceItemDisplay {...commonProps} />;
      case 'registration_policy':
        return <RegistrationPolicyItemDisplay {...commonProps} />;
      case 'static_text':
        return <StaticTextItem {...commonProps} />;
      case 'timeblock_preference':
        return <TimeblockPreferenceItemDisplay {...commonProps} convention={convention} />;
      case 'timespan':
        return <TimespanItemDisplay {...commonProps} />;
      default:
        return <div><code>{formItem.identifier}</code></div>;
    }
  }
}

export default FormItemDisplay;
