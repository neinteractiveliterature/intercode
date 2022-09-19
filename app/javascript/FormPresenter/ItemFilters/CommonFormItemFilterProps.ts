import React from 'react';
import { TypedFormItem } from '../../FormAdmin/FormItemUtils';
import { ConventionForFormItemFilter } from './FormItemFilter';

export type CommonFormItemFilterProps<FormItemType extends TypedFormItem> = {
  formItem: FormItemType;
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[] | null | undefined>>;
  convention: ConventionForFormItemFilter;
};
