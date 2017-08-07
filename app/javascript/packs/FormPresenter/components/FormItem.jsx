// @flow

import React from 'react';
import FreeTextItem from './FreeTextItem';
import MultipleChoiceItem from './MultipleChoiceItem';
import RegistrationPolicyItem from './RegistrationPolicyItem';
import StaticTextItem from './StaticTextItem';
import TimeblockPreferenceItem from './TimeblockPreferenceItem';
import TimespanItem from './TimespanItem';

type Props = {
  formItem: {
    item_type: string,
    identifier?: string,
  },
  convention: {
    starts_at: string,
    ends_at: string,
    timezone_name: string,
  },
};

const FormItem = ({ formItem, convention }: Props) => {
  switch (formItem.item_type) {
    case 'free_text':
      return <FreeTextItem formItem={formItem} />;
    case 'multiple_choice':
      return <MultipleChoiceItem formItem={formItem} />;
    case 'registration_policy':
      return <RegistrationPolicyItem formItem={formItem} />;
    case 'static_text':
      return <StaticTextItem formItem={formItem} />;
    case 'timeblock_preference':
      return <TimeblockPreferenceItem formItem={formItem} convention={convention} />;
    case 'timespan':
      return <TimespanItem formItem={formItem} />;
    default:
      return <div><code>{formItem.identifier}</code></div>;
  }
};

export default FormItem;
