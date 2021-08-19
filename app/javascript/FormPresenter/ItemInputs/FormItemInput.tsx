import { memo, useCallback } from 'react';

import DateItemInput from './DateItemInput';
import EventEmailInput from './EventEmailInput';
import FreeTextItemInput from './FreeTextItemInput';
import MultipleChoiceItemInput from './MultipleChoiceItemInput';
import RegistrationPolicyItemInput from './RegistrationPolicyItemInput';
import StaticTextItem from '../StaticTextItem';
import TimeblockPreferenceItemInput from './TimeblockPreferenceItemInput';
import TimespanItemInput from './TimespanItemInput';
import AgeRestrictionsInput from './AgeRestrictionsInput';
import { CommonFormItemInputProps } from './CommonFormItemInputProps';
import { ConventionForFormItemDisplay } from '../ItemDisplays/FormItemDisplay';

export type FormItemInputProps = Omit<CommonFormItemInputProps<any>, 'onChange'> & {
  onChange: (identifier: string, newValue: any) => void;
  convention: ConventionForFormItemDisplay;
};

function FormItemInput({
  formItem,
  formTypeIdentifier,
  value,
  onChange,
  onInteract,
  valueInvalid,
  convention,
}: FormItemInputProps) {
  const valueDidChange = useCallback(
    (newValue) => onChange(formItem.identifier, newValue),
    [formItem.identifier, onChange],
  );

  const commonProps = {
    formItem,
    formTypeIdentifier,
    value,
    onInteract,
    valueInvalid,
    onChange: valueDidChange,
  };

  switch (formItem.item_type) {
    case 'age_restrictions':
      return <AgeRestrictionsInput {...commonProps} />;
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
      return (
        <div>
          <code>{formItem.identifier}</code>
        </div>
      );
  }
}

export default memo(
  FormItemInput,
  (prevProps, nextProps) =>
    nextProps.value === prevProps.value &&
    nextProps.convention === prevProps.convention &&
    nextProps.valueInvalid === prevProps.valueInvalid &&
    nextProps.formItem === prevProps.formItem,
);
