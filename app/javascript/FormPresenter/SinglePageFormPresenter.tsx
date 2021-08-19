import { forwardRef, useMemo } from 'react';

import { getSortedParsedFormItems } from '../Models/Form';
import FormBody, { FormBodyImperativeHandle, FormBodyProps } from './Layouts/FormBody';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import { ConventionForFormItemDisplay } from './ItemDisplays/FormItemDisplay';
import { FormResponse } from './useFormResponse';
import { FormItemRole } from '../graphqlTypes.generated';

export type SinglePageFormPresenterProps = {
  form: CommonFormFieldsFragment;
  convention: ConventionForFormItemDisplay;
  response: FormResponse;
  currentUserRole: FormItemRole;
  responseValuesChanged: (newValues: any) => void;
  responseErrors?: FormBodyProps['errors'];
};

const SinglePageFormPresenter = forwardRef<
  FormBodyImperativeHandle | undefined,
  SinglePageFormPresenterProps
>(({ form, currentUserRole, convention, response, responseValuesChanged, responseErrors }, ref) => {
  const formItems = useMemo(() => getSortedParsedFormItems(form), [form]);

  return (
    <>
      <FormBody
        convention={convention}
        currentUserRole={currentUserRole}
        ref={ref}
        formItems={formItems}
        formTypeIdentifier={form.form_type}
        errors={responseErrors}
        response={response}
        responseValuesChanged={responseValuesChanged}
      />
    </>
  );
});

export default SinglePageFormPresenter;
