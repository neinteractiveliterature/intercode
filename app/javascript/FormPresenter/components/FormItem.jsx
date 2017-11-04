// @flow

import React from 'react';
import FreeTextItem from './FreeTextItem';
import MultipleChoiceItem, { type MultipleChoiceFormItem } from './MultipleChoiceItem';
import RegistrationPolicyItem from './RegistrationPolicyItem';
import StaticTextItem from './StaticTextItem';
import TimeblockPreferenceItem from './TimeblockPreferenceItem';
import TimespanItem from './TimespanItem';

type Props = {
  formItem: {
    item_type: string,
    identifier?: string,
  },
  value: any,
  onChange: (string, any) => undefined,
  convention: {
    starts_at: string,
    ends_at: string,
    timezone_name: string,
  },
};

const FormItem = ({
  formItem, convention, value, onChange }: 
Props) => {
  const valueDidChange = (newValue) => {
    onChange(formItem.identifier, newValue);
  };
  const commonProps = { formItem, value, onChange: valueDidChange };

  switch (formItem.itemType) {
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

export default FormItem;
