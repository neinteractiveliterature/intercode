import { assertNever } from 'assert-never';

import FreeTextItemFilter from './FreeTextItemFilter';
import MultipleChoiceItemFilter from './MultipleChoiceItemFilter';
import StaticTextItem from '../StaticTextItem';
import { Convention } from '../../graphqlTypes.generated';
import { FreeTextFormItem, MultipleChoiceFormItem, TypedFormItem } from '../../FormAdmin/FormItemUtils';
import React from 'react';
import { CommonFormItemFilterProps } from './CommonFormItemFilterProps';

export type ConventionForFormItemFilter = Pick<
  Convention,
  'timezone_name' | 'timezone_mode' | 'starts_at' | 'ends_at' | 'event_mailing_list_domain'
>;

export type FormItemFilterProps<FormItemType extends TypedFormItem> = {
  formItem: FormItemType;
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[] | undefined | null>>;
  convention: ConventionForFormItemFilter;
};

function FormItemFilter<FormItemType extends TypedFormItem>({
  formItem,
  value,
  convention,
  onChange,
}: FormItemFilterProps<FormItemType>): React.JSX.Element {
  const commonProps: CommonFormItemFilterProps<FormItemType> = {
    formItem,
    value,
    onChange,
    convention,
  };

  switch (formItem.item_type) {
    case 'age_restrictions':
      return <></>;
    case 'date':
      return <></>;
    case 'event_email':
      return <></>;
    case 'free_text':
      return <FreeTextItemFilter {...(commonProps as CommonFormItemFilterProps<FreeTextFormItem>)} />;
    case 'multiple_choice':
      return <MultipleChoiceItemFilter {...(commonProps as CommonFormItemFilterProps<MultipleChoiceFormItem>)} />;
    case 'registration_policy':
      return <></>;
    case 'static_text':
      return <StaticTextItem formItem={formItem} />;
    case 'timeblock_preference':
      return <></>;
    case 'timespan':
      return <></>;
    default:
      // we don't actually enforce this at the API level, so it could be an unknown type
      assertNever(formItem, true);
      return (
        <div>
          <code>{formItem.identifier}</code>
        </div>
      );
  }
}

export default FormItemFilter;
