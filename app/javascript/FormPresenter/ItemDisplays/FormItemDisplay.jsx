import React from 'react';
import PropTypes from 'prop-types';

import FreeTextItemDisplay from './FreeTextItemDisplay';
import StaticTextItem from '../StaticTextItem';
import TimeblockPreferenceItemDisplay from './TimeblockPreferenceItemDisplay';

class FormItemDisplay extends React.Component {
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

  shouldComponentUpdate = nextProps => (
    nextProps.value !== this.props.value
      || nextProps.convention !== this.props.convention
      || nextProps.valueInvalid !== this.props.valueInvalid
      || nextProps.formItem !== this.props.formItem
  )

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
      // case 'date':
      //   return <DateItemInput {...commonProps} />;
      case 'free_text':
        return <FreeTextItemDisplay {...commonProps} />;
      // case 'multiple_choice':
      //   return <MultipleChoiceItemInput {...commonProps} />;
      // case 'registration_policy':
      //   return <RegistrationPolicyItemInput {...commonProps} />;
      case 'static_text':
        return <StaticTextItem {...commonProps} />;
      case 'timeblock_preference':
        return <TimeblockPreferenceItemDisplay {...commonProps} convention={convention} />;
      // case 'timespan':
      //   return <TimespanItemInput {...commonProps} />;
      default:
        return <div><code>{formItem.identifier}</code></div>;
    }
  }
}

export default FormItemDisplay;
