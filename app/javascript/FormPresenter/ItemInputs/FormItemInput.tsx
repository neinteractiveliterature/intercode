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
import {
  AgeRestrictionsFormItem,
  DateFormItem,
  EventEmailFormItem,
  FormItemValueType,
  FreeTextFormItem,
  MultipleChoiceFormItem,
  RegistrationPolicyFormItem,
  StaticTextFormItem,
  TimeblockPreferenceFormItem,
  TimespanFormItem,
  TypedFormItem,
  valueIsValidForFormItemType,
} from '../../FormAdmin/FormItemUtils';
import assertNever from 'assert-never';

export type FormItemInputProps<FormItemType extends TypedFormItem> = Omit<
  CommonFormItemInputProps<FormItemType>,
  'onChange' | 'value'
> & {
  onChange: (
    identifier: string,
    newValue: FormItemValueType<FormItemType> | null | undefined,
  ) => void;
  value: unknown;
  convention: ConventionForFormItemDisplay;
};

function FormItemInput<FormItemType extends TypedFormItem>({
  formItem,
  formTypeIdentifier,
  value: uncheckedValue,
  onChange,
  onInteract,
  valueInvalid,
  convention,
}: FormItemInputProps<FormItemType>) {
  const valueDidChange = useCallback(
    (newValue) => {
      if (formItem.identifier != null) {
        onChange(formItem.identifier, newValue);
      }
    },
    [formItem.identifier, onChange],
  );

  const value = valueIsValidForFormItemType(formItem, uncheckedValue) ? uncheckedValue : undefined;

  const commonProps: CommonFormItemInputProps<FormItemType> = {
    formItem,
    formTypeIdentifier,
    value,
    onInteract,
    valueInvalid,
    onChange: valueDidChange,
  };

  switch (formItem.item_type) {
    case 'age_restrictions':
      return (
        <AgeRestrictionsInput
          {...(commonProps as CommonFormItemInputProps<AgeRestrictionsFormItem>)}
        />
      );
    case 'date':
      return <DateItemInput {...(commonProps as CommonFormItemInputProps<DateFormItem>)} />;
    case 'event_email':
      return (
        <EventEmailInput
          {...(commonProps as CommonFormItemInputProps<EventEmailFormItem>)}
          convention={convention}
        />
      );
    case 'free_text':
      return <FreeTextItemInput {...(commonProps as CommonFormItemInputProps<FreeTextFormItem>)} />;
    case 'multiple_choice':
      return (
        <MultipleChoiceItemInput
          {...(commonProps as CommonFormItemInputProps<MultipleChoiceFormItem>)}
        />
      );
    case 'registration_policy':
      return (
        <RegistrationPolicyItemInput
          {...(commonProps as CommonFormItemInputProps<RegistrationPolicyFormItem>)}
        />
      );
    case 'static_text':
      return <StaticTextItem {...(commonProps as CommonFormItemInputProps<StaticTextFormItem>)} />;
    case 'timeblock_preference':
      return (
        <TimeblockPreferenceItemInput
          {...(commonProps as CommonFormItemInputProps<TimeblockPreferenceFormItem>)}
          convention={convention}
        />
      );
    case 'timespan':
      return <TimespanItemInput {...(commonProps as CommonFormItemInputProps<TimespanFormItem>)} />;
    default:
      assertNever(formItem, true);
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
