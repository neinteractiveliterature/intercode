import { forwardRef, useMemo } from 'react';
import { notEmpty } from '@neinteractiveliterature/litform';

import FormBody, { FormBodyProps, FormBodyImperativeHandle } from './FormBody';
import { sortFormItems } from '../../Models/Form';
import { CommonFormSectionFieldsFragment } from '../../Models/commonFormFragments.generated';
import { parseTypedFormItemObject } from '../../FormAdmin/FormItemUtils';

export type FormSectionProps = Omit<FormBodyProps, 'formItems'> & {
  section: CommonFormSectionFieldsFragment;
};

const FormSection = forwardRef<FormBodyImperativeHandle, FormSectionProps>(
  ({ section, ...props }, ref) => {
    const items = useMemo(
      () => sortFormItems(section.form_items).map(parseTypedFormItemObject).filter(notEmpty),
      [section],
    );

    return <FormBody ref={ref} formItems={items} {...props} />;
  },
);

export default FormSection;
