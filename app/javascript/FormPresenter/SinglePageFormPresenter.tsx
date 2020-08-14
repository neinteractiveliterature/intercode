import React, { forwardRef, useMemo, ReactNode } from 'react';

import { getSortedParsedFormItems } from '../Models/Form';
import FormBody, { FormBodyImperativeHandle } from './Layouts/FormBody';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import { ConventionForFormItemDisplay } from './ItemDisplays/FormItemDisplay';

export type SinglePageFormPresenterProps = {
  form: CommonFormFieldsFragment;
  children?: ReactNode;
  convention: ConventionForFormItemDisplay;
  response: any;
  responseValuesChanged: (newValues: any) => void;
};

const SinglePageFormPresenter = forwardRef<
  FormBodyImperativeHandle | undefined,
  SinglePageFormPresenterProps
>(({ form, children, convention, response, responseValuesChanged }, ref) => {
  const formItems = useMemo(() => getSortedParsedFormItems(form), [form]);

  return (
    <>
      <FormBody
        convention={convention}
        ref={ref}
        formItems={formItems}
        errors={{}}
        response={response}
        responseValuesChanged={responseValuesChanged}
      />
      {children}
    </>
  );
});

export default SinglePageFormPresenter;
