import React, { forwardRef, useMemo } from 'react';

import FormBody, { FormBodyProps, FormBodyImperativeHandle } from './FormBody';
import { sortFormItems } from '../../Models/Form';
import { CommonFormSectionFieldsFragment } from '../../Models/commonFormFragments.generated';
import { parseFormItemObject } from '../../FormAdmin/FormItemUtils';

export type FormSectionProps = Omit<FormBodyProps, 'formItems'> & {
  section: CommonFormSectionFieldsFragment;
};

const FormSection = forwardRef<FormBodyImperativeHandle, FormSectionProps>(
  ({ section, ...props }, ref) => {
    const items = useMemo(() => sortFormItems(section.form_items).map(parseFormItemObject), [
      section,
    ]);

    return <FormBody ref={ref} formItems={items} {...props} />;
  },
);

export default FormSection;
